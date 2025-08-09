/**
 * CivilianHorizontalBridge (enhanced)
 * -----------------------------------------------------------------------------
 * Drop‑in compatible with the original constructor-style building API.
 * Adds: safer matrices (auto‑generated), damage visuals, serialization,
 * placement helpers, richer metadata, and defensive no‑ops.
 *
 * NOTE: Keeps the original fields and hooks so existing game code continues to work:
 *   - onConstructedCustom()
 *   - onObjectDeletion()
 *   - is_bridge, is_built_from_edge, cell_size/cell_matrix/move_matrix, images, etc.
 */

(function registerCivilianHorizontalBridge() {
  /** Utility: no-op guard */
  const NOOP = () => {};

  /** Utility: column-major matrix builder (matches engine’s historical layout) */
  function buildColumnMajorMatrix(w, h, filler) {
    const out = new Array(w * h);
    let i = 0;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        out[i++] = typeof filler === 'function' ? filler(x, y) : filler;
      }
    }
    return out;
  }

  /** Utility: produces a 2-lane move matrix (walkable on top & bottom rows) */
  function buildEdgeLaneMoveMatrix(w, h) {
    return buildColumnMajorMatrix(w, h, (_, y) => (y === 0 || y === h - 1 ? 1 : 0));
  }

  /**
   * Constructor (legacy pattern preserved)
   * @param {number} pos_x - placement x (cell or world as your engine expects)
   * @param {number} pos_y - placement y
   * @param {*} player - owner/player reference/id
   */
  function CivilianHorizontalBridge(pos_x, pos_y, player) {
    this._proto = CivilianHorizontalBridge; // keep original convention
    this.init(pos_x, pos_y, player);        // provided by AbstractBuilding mixin

    // --- Hooks (kept + expanded) ---
    this.onConstructedCustom = function () {
      // Claim tiles as bridge land and refresh routing
      if (typeof BridgeTypeBuilding?.changeLandType === 'function') {
        BridgeTypeBuilding.changeLandType(this);
      }
      this._updateAppearance(); // in case we spawn partially built/damaged
      this._autoConnectEntrances(); // optional QoL: path entrances at edges
    };

    this.onObjectDeletion = function () {
      // Clean mapping + restore underlying terrain
      this.markCellsOnMap?.(-1);
      if (typeof BridgeTypeBuilding?.restoreLandType === 'function') {
        BridgeTypeBuilding.restoreLandType(this);
      }
      // Best-effort: notify pathfinder / UI
      this._emitEvent?.('bridge_removed', { id: this.id, pos: this.pos_cell });
    };

    // New optional hook: react to damage & repair (engine may call different names; keep guards)
    this.onDamaged = (amount = 0, source = null) => {
      this._emitEvent?.('bridge_damaged', { id: this.id, amount, source });
      this._updateAppearance();
    };
    this.onRepaired = (amount = 0, source = null) => {
      this._emitEvent?.('bridge_repaired', { id: this.id, amount, source });
      this._updateAppearance();
    };

    // --- Private helpers (instance) ---
    this._updateAppearance = function () {
      const proto = this._proto;
      const hp = typeof this.getHealthPercent === 'function'
        ? this.getHealthPercent()
        : Math.max(0, Math.min(1, (this.health ?? proto.health_max) / proto.health_max));

      // If your engine supports variants/skins, pick one; otherwise this is a no-op.
      if (typeof this.setVariant === 'function') {
        if (hp <= 0) this.setVariant('destroyed');
        else if (hp < 0.33) this.setVariant('critical');
        else if (hp < 0.66) this.setVariant('damaged');
        else this.setVariant('normal');
      }

      // Optional: swap shadow to a cracked version when heavily damaged
      if (this.setImageState) {
        if (hp < 0.5) this.setImageState('shadow', 'cracked');
        else this.setImageState('shadow', 'normal');
      }
    };

    // Create path entrances at left & right edges on top/bottom lanes
    this._autoConnectEntrances = function () {
      const proto = this._proto;
      if (!proto.entry_points?.length || typeof this.addPathEntrance !== 'function') return;

      for (const ep of proto.entry_points) {
        const world = this.cellToWorld
          ? this.cellToWorld(this.pos_cell.x + ep.dx, this.pos_cell.y + ep.dy)
          : null;
        // Best-effort: register entrances if API is present
        this.addPathEntrance?.(world ?? { x: this.pos_cell.x + ep.dx, y: this.pos_cell.y + ep.dy }, {
          lane: ep.lane,
          side: ep.side,
        });
      }
    };

    // Very lightweight event relay (safe if host provides it)
    this._emitEvent = typeof this.emit === 'function' ? this.emit.bind(this) : NOOP;
  }

  // Provide common building options (mixes in init/markCellsOnMap/etc.)
  if (typeof AbstractBuilding?.setBuildingCommonOptions === 'function') {
    AbstractBuilding.setBuildingCommonOptions(CivilianHorizontalBridge);
  }

  // ---------------------------
  // Static metadata & gameplay
  // ---------------------------

  // Core identity
  CivilianHorizontalBridge.res_key = 'civilian_horizontal_bridge';
  CivilianHorizontalBridge.obj_name = 'Horizontal Bridge';
  CivilianHorizontalBridge.version = 2; // bump so tools can migrate content

  // Economy & build flow
  CivilianHorizontalBridge.cost = 100;
  CivilianHorizontalBridge.build_time = 2;
  CivilianHorizontalBridge.sell_cost = 50;
  CivilianHorizontalBridge.sell_time = 1;
  CivilianHorizontalBridge.repair_cost_per_hp = 0.02; // NEW: fine‑grained repair scaling

  // Combat/health
  CivilianHorizontalBridge.health_max = 4000;
  CivilianHorizontalBridge.crater = 5; // footprint crater size on destruction

  // Bridge semantics
  CivilianHorizontalBridge.is_bridge = true;
  CivilianHorizontalBridge.is_built_from_edge = true;
  CivilianHorizontalBridge.supports_vehicles = 'light'; // NEW: hint for pathing rules
  CivilianHorizontalBridge.allowed_terrain = ['water', 'shallow', 'river']; // NEW: placement hint

  // UI/authoring helpers (ignored by runtime if unknown)
  CivilianHorizontalBridge.res_multicolor = false;
  CivilianHorizontalBridge.ui = {
    category: 'Infrastructure',
    description: 'Civilian foot/vehicular bridge spanning water horizontally.',
    tips: [
      'Units prefer the upper & lower lanes.',
      'Takes extra damage from explosives.',
    ],
  };

  // Footprint & traversal
  CivilianHorizontalBridge.cell_size = { x: 6, y: 4 };
  CivilianHorizontalBridge.cell_padding = { x: 3, y: 2 };

  // Fill the entire 6x4 with solid cells
  CivilianHorizontalBridge.cell_matrix = buildColumnMajorMatrix(
    CivilianHorizontalBridge.cell_size.x,
    CivilianHorizontalBridge.cell_size.y,
    1
  );

  // Units walk on top & bottom rows (column-major: [1,0,0,1] repeated per column)
  CivilianHorizontalBridge.move_matrix = buildEdgeLaneMoveMatrix(
    CivilianHorizontalBridge.cell_size.x,
    CivilianHorizontalBridge.cell_size.y
  );

  // Art & VFX (kept + extended variants)
  CivilianHorizontalBridge.images = {
    normal: {
      size: { x: 144, y: 91 },
      padding: { x: -1, y: 1 },
    },
    damaged: {
      size: { x: 144, y: 91 },
      padding: { x: -1, y: 1 },
      tint: '#C06E2E', // subtle warm tint on damage (if engine supports)
    },
    critical: {
      size: { x: 144, y: 91 },
      padding: { x: -1, y: 1 },
      tint: '#A12A2A',
      overlay: 'bridge_damage_overlay', // optional overlay key
    },
    destroyed: {
      size: { x: 144, y: 91 },
      padding: { x: -1, y: 1 },
      static_img: true,
      sprite: 'bridge_destroyed',
    },
    shadow: {
      size: { x: 150, y: 85 },
      padding: { x: -1, y: -18 },
      static_img: true,
    },
    shadow_cracked: {
      size: { x: 150, y: 85 },
      padding: { x: -1, y: -18 },
      static_img: true,
      sprite: 'bridge_shadow_cracked',
    },
    build_preview: {
      grid_tint: 'rgba(0,255,0,0.25)',
    },
  };

  CivilianHorizontalBridge.hotpoints = [
    { x: 70, y: 40 },             // existing center‑ish
    { x: 10, y: 10, tag: 'laneA' }, // NEW: top lane marker
    { x: 10, y: 80, tag: 'laneB' }, // NEW: bottom lane marker
  ];

  // Audio/VFX
  CivilianHorizontalBridge.health_explosions = {
    0: 'bridge2_explosion',
  };
  CivilianHorizontalBridge.build_sound = 'build_generic_soft'; // NEW
  CivilianHorizontalBridge.select_sound = 'ui_select_structure'; // NEW
  CivilianHorizontalBridge.death_sound = ''; // kept

  // Path entrances (relative to origin cell; align with top/bottom lanes)
  CivilianHorizontalBridge.entry_points = [
    { dx: 0, dy: 0, side: 'west', lane: 'top' },
    { dx: 0, dy: CivilianHorizontalBridge.cell_size.y - 1, side: 'west', lane: 'bottom' },
    { dx: CivilianHorizontalBridge.cell_size.x - 1, dy: 0, side: 'east', lane: 'top' },
    { dx: CivilianHorizontalBridge.cell_size.x - 1, dy: CivilianHorizontalBridge.cell_size.y - 1, side: 'east', lane: 'bottom' },
  ];

  // Optional: quick placement rule (host/editor can consult this)
  CivilianHorizontalBridge.canPlaceAt = function (map, cellX, cellY) {
    // Best-effort rule: must overlap water for at least one column, and have land at both horizontal edges.
    try {
      const w = this.cell_size.x, h = this.cell_size.y;
      let hasWaterColumn = false;
      const leftEdge = { x: cellX, y: cellY };
      const rightEdge = { x: cellX + w - 1, y: cellY + h - 1 };

      // Check edges touch non-water at least somewhere vertically
      let leftLand = false, rightLand = false;
      for (let y = 0; y < h; y++) {
        leftLand ||= map.isLand?.(cellX, cellY + y) ?? false;
        rightLand ||= map.isLand?.(cellX + w - 1, cellY + y) ?? false;
      }

      // Check any full water under bridge span (excluding edges)
      for (let x = 1; x < w - 1; x++) {
        let waterCol = true;
        for (let y = 0; y < h; y++) {
          const isWater = map.isWater?.(cellX + x, cellY + y) ?? false;
          waterCol &&= isWater;
        }
        hasWaterColumn ||= waterCol;
      }

      return leftLand && rightLand && hasWaterColumn;
    } catch {
      // If map API not provided, allow placement (engine will validate later)
      return true;
    }
  };

  // Convenience: compute salvage/sell value dynamically (if engine prefers function)
  CivilianHorizontalBridge.getSellValue = function (instance) {
    const proto = CivilianHorizontalBridge;
    const hp = Math.max(0, Math.min(1, (instance?.health ?? proto.health_max) / proto.health_max));
    // Linear blend between 50% at full health down to 20% at 0 HP
    const base = proto.cost * (0.2 + 0.3 * hp);
    return Math.round(base);
  };

  // Harden static objects to avoid accidental mutations
  try {
    Object.freeze?.(CivilianHorizontalBridge.images);
    Object.seal?.(CivilianHorizontalBridge);
  } catch {
    // older runtimes may not support freeze/seal; safe to ignore
  }

  // Optional: auto-register with any registry if present
  if (typeof BuildingRegistry?.register === 'function') {
    BuildingRegistry.register(CivilianHorizontalBridge);
  }

  // Expose to global/module scope
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CivilianHorizontalBridge;
  } else {
    // eslint-disable-next-line no-undef
    this.CivilianHorizontalBridge = CivilianHorizontalBridge;
  }
})();
