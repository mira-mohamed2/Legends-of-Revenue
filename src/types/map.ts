export interface MapEncounterEntry {
  enemyId: string;
  weight: number;
}

export interface EncounterTable extends Array<MapEncounterEntry> {}

export interface MapTile {
  id: string;
  name: string;
  type: 'hub' | 'town' | 'dungeon' | 'wilderness';
  description: string;
  neighbors: string[];
  encounterRate: number;
  encounterTable: MapEncounterEntry[];
  questHooks?: string[];
}
