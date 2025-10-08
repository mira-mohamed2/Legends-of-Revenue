export interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  gold: number;
}

export interface PlayerEquipment {
  weapon: string | null;
  armor: string | null;
  accessory: string | null;
}
