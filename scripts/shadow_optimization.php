<?php
declare(strict_types=1);
error_reporting(E_ALL);

/**
 * Sprite sheet trimmer:
 * - Computes a COMMON padding for all frames (rows x cols), then rebuilds the sheet trimmed.
 * - Alpha-preserving, fast (uses imagecopy), optional black-only bounds & silhouette output.
 */
final class SpriteSheetTrimmer {
    public function __construct(
        private string $src,
        private string $dst,
        private int $rows,
        private int $cols,
        private bool $outputSilhouette = false,  // if true, output black silhouette with original alpha
        private bool $boundsFromBlack = false,   // if true, trim bounds by black pixels only (legacy shadow_mode)
        private int $alphaThreshold = 0          // 0..127 (treat alpha >= (127 - threshold) as empty)
    ) {}

    public function run(): void {
        [$w, $h, $type] = $this->safeGetImageSize($this->src);
        if ($type !== IMAGETYPE_PNG) {
            throw new RuntimeException("Input is not a PNG: {$this->src}");
        }
        if ($this->rows <= 0 || $this->cols <= 0) {
            throw new InvalidArgumentException("Rows/Cols must be > 0");
        }
        $colSize = intdiv($w, $this->cols);
        $rowSize = intdiv($h, $this->rows);
        if ($colSize * $this->cols !== $w || $rowSize * $this->rows !== $h) {
            throw new RuntimeException("Image size {$w}x{$h} not divisible by {$this->cols}x{$this->rows}");
        }

        $srcIm = $this->loadPng($this->src);

        // Compute common padding across all frames.
        $pad = $this->computeCommonPadding($srcIm, $rowSize, $colSize);

        $tileW = $colSize - $pad['left'] - $pad['right'];
        $tileH = $rowSize - $pad['top'] - $pad['bottom'];
        if ($tileW <= 0 || $tileH <= 0) {
            throw new RuntimeException("Computed tile area is empty. Padding: " . json_encode($pad));
        }

        // Prepare destination (full alpha).
        $outW = $tileW * $this->cols;
        $outH = $tileH * $this->rows;
        $dstIm = imagecreatetruecolor($outW, $outH);
        imagealphablending($dstIm, false);
        imagesavealpha($dstIm, true);
        $clear = imagecolorallocatealpha($dstIm, 0, 0, 0, 127);
        imagefill($dstIm, 0, 0, $clear);

        // Rebuild sheet
        for ($r = 0; $r < $this->rows; $r++) {
            for ($c = 0; $c < $this->cols; $c++) {
                $srcX = $c * $colSize + $pad['left'];
                $srcY = $r * $rowSize + $pad['top'];
                $dstX = $c * $tileW;
                $dstY = $r * $tileH;

                if ($this->outputSilhouette) {
                    // Copy trimmed tile to temp, convert to black, keep alpha, then blit.
                    $tmp = imagecreatetruecolor($tileW, $tileH);
                    imagealphablending($tmp, false);
                    imagesavealpha($tmp, true);
                    imagefill($tmp, 0, 0, $clear);
                    imagecopy($tmp, $srcIm, 0, 0, $srcX, $srcY, $tileW, $tileH);

                    // Make it pure black while preserving alpha.
                    imagefilter($tmp, IMG_FILTER_GRAYSCALE);
                    imagefilter($tmp, IMG_FILTER_BRIGHTNESS, -255);

                    imagecopy($dstIm, $tmp, $dstX, $dstY, 0, 0, $tileW, $tileH);
                    imagedestroy($tmp);
                } else {
                    // Fast, alpha-correct copy.
                    imagecopy($dstIm, $srcIm, $dstX, $dstY, $srcX, $srcY, $tileW, $tileH);
                }
            }
        }

        if (!imagepng($dstIm, $this->dst)) {
            throw new RuntimeException("Failed to write {$this->dst}");
        }

        imagedestroy($dstIm);
        imagedestroy($srcIm);

        // Useful for scripts
        fprintf(STDERR, "OK  Trim %s → %s | tiles %dx%d | pad L%d R%d T%d B%d | tile %dx%d\n",
            basename($this->src), basename($this->dst), $this->cols, $this->rows,
            $pad['left'], $pad['right'], $pad['top'], $pad['bottom'], $tileW, $tileH
        );
    }

    // ---------- internals ----------

    private function safeGetImageSize(string $path): array {
        $info = @getimagesize($path);
        if ($info === false) throw new RuntimeException("getimagesize failed: {$path}");
        return $info;
        // [0]=w, [1]=h, [2]=type
    }

    private function loadPng(string $path) {
        $im = @imagecreatefrompng($path);
        if (!$im) throw new RuntimeException("imagecreatefrompng failed: {$path}");
        imagealphablending($im, false);
        imagesavealpha($im, true);
        return $im;
    }

    private function computeCommonPadding($img, int $rowSize, int $colSize): array {
        $pad = ['top' => $rowSize, 'bottom' => 0, 'left' => $colSize, 'right' => 0];

        $isUsed = function (int $x, int $y) use ($img): bool {
            $rgba = imagecolorat($img, $x, $y);
            if ($this->boundsFromBlack) {
                // Legacy behavior: any pure black pixel counts as "used" (alpha ignored).
                return (($rgba & 0xFFFFFF) === 0);
            } else {
                // Alpha-based: treat near-transparent as empty via threshold.
                $a = ($rgba & 0x7F000000) >> 24;      // 0=opaque, 127=transparent
                return $a < max(0, 127 - $this->alphaThreshold);
            }
        };

        for ($r = 0; $r < $this->rows; $r++) {
            for ($c = 0; $c < $this->cols; $c++) {
                $x0 = $c * $colSize;  $x1 = $x0 + $colSize;
                $y0 = $r * $rowSize;  $y1 = $y0 + $rowSize;

                // Left
                for ($x = 0; $x < $pad['left']; $x++) {
                    if ($this->columnHasUsed($img, $isUsed, $x0 + $x, $y0, $y1)) { $pad['left'] = $x; break; }
                }
                // Right (scan inward)
                for ($x = $colSize - 1; $x > $pad['right']; $x--) {
                    if ($this->columnHasUsed($img, $isUsed, $x0 + $x, $y0, $y1)) { $pad['right'] = $x; break; }
                }
                // Top
                for ($y = 0; $y < $pad['top']; $y++) {
                    if ($this->rowHasUsed($img, $isUsed, $y0 + $y, $x0, $x1)) { $pad['top'] = $y; break; }
                }
                // Bottom
                for ($y = $rowSize - 1; $y > $pad['bottom']; $y--) {
                    if ($this->rowHasUsed($img, $isUsed, $y0 + $y, $x0, $x1)) { $pad['bottom'] = $y; break; }
                }
            }
        }

        // Convert right/bottom from index to padding amount.
        $pad['right']  = $colSize - $pad['right']  - 1;
        $pad['bottom'] = $rowSize - $pad['bottom'] - 1;

        return $pad;
    }

    private function columnHasUsed($img, callable $isUsed, int $x, int $yFrom, int $yTo): bool {
        for ($y = $yFrom; $y < $yTo; $y++) if ($isUsed($x, $y)) return true;
        return false;
    }
    private function rowHasUsed($img, callable $isUsed, int $y, int $xFrom, int $xTo): bool {
        for ($x = $xFrom; $x < $xTo; $x++) if ($isUsed($x, $y)) return true;
        return false;
    }
}

// ---------- Configure (CLI-friendly) ----------
$cfg = [
    'file'   => 'C:\Documents and Settings\LENOVO User\My Documents\tirep1l0_03.png',
    'output' => 'C:\Documents and Settings\LENOVO User\My Documents\opt.png',
    'rows'   => 3,
    'cols'   => 1,

    // Behavior flags:
    'silhouette'     => false, // true => output black silhouette with original alpha
    'boundsFromBlack'=> false, // true => trim bounds by pure black pixels (legacy)
    'alphaThreshold' => 0,     // 0..127; raise to ignore faint halos
];

$trimmer = new SpriteSheetTrimmer(
    $cfg['file'],
    $cfg['output'],
    $cfg['rows'],
    $cfg['cols'],
    $cfg['silhouette'],
    $cfg['boundsFromBlack'],
    $cfg['alphaThreshold']
);
$trimmer->run();
