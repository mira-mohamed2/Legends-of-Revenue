import { EnemyStats, EnemyStatRanges } from '../types/combat';

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random stats for an enemy based on stat ranges
 */
export function generateEnemyStats(statRanges: EnemyStatRanges): EnemyStats {
  return {
    hp: randomInRange(statRanges.hp.min, statRanges.hp.max),
    maxHp: randomInRange(statRanges.hp.min, statRanges.hp.max),
    attack: randomInRange(statRanges.attack.min, statRanges.attack.max),
    defense: randomInRange(statRanges.defense.min, statRanges.defense.max),
  };
}

/**
 * Calculate reward multiplier based on how strong the generated enemy is
 * compared to the base stat ranges (1.0 = average, up to 1.3 for max stats)
 */
export function calculateRewardMultiplier(
  stats: EnemyStats,
  ranges: EnemyStatRanges
): number {
  // Calculate percentage of max possible stats
  const hpPercent = (stats.maxHp - ranges.hp.min) / (ranges.hp.max - ranges.hp.min);
  const attackPercent = (stats.attack - ranges.attack.min) / (ranges.attack.max - ranges.attack.min);
  const defensePercent = ranges.defense.max > ranges.defense.min 
    ? (stats.defense - ranges.defense.min) / (ranges.defense.max - ranges.defense.min)
    : 0.5; // If defense range is 0, use neutral value

  // Average the percentages (weighted more towards HP and attack)
  const avgPercent = (hpPercent * 0.4 + attackPercent * 0.4 + defensePercent * 0.2);

  // Return multiplier between 0.8 and 1.3
  return 0.8 + (avgPercent * 0.5);
}
