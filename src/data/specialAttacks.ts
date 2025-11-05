import { SpecialAttack } from '../types/quiz';

export const specialAttacks: SpecialAttack[] = [
  // Easy attacks (GST Basics, MIRA Services)
  {
    id: 'audit_strike',
    name: 'Audit Strike',
    description: 'Tax audit reveals hidden assets!',
    damage: 50,
    category: 'gst_basics',
    difficulty: 'easy',
    icon: '⚔️',
  },
  {
    id: 'compliance_order',
    name: 'Compliance Order',
    description: 'Filed correctly! Recovery of legitimate refunds!',
    damage: 45,
    category: 'mira_services',
    difficulty: 'easy',
    effect: {
      type: 'heal',
      value: 30,
      description: 'Heal 30 HP',
    },
    icon: '💚',
  },
  
  // Medium attacks (Filing Deadline, Input Tax)
  {
    id: 'penalty_assessment',
    name: 'Penalty Assessment',
    description: 'Late payment penalties applied!',
    damage: 70,
    category: 'filing_deadline',
    difficulty: 'easy',
    icon: '⚡',
  },
  {
    id: 'asset_seizure',
    name: 'Asset Seizure',
    description: "Froze the dragon's accounts!",
    damage: 65,
    category: 'input_tax',
    difficulty: 'medium',
    effect: {
      type: 'debuff',
      value: 15,
      description: "Reduce ARIM's next attack by 15",
    },
    icon: '💰',
  },
  
  // Hard attack (Compliance)
  {
    id: 'full_investigation',
    name: 'Full Investigation',
    description: 'Complete forensic audit! Maximum damage!',
    damage: 90,
    category: 'compliance',
    difficulty: 'medium',
    icon: '🔥',
  },
];

export function getSpecialAttacksByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): SpecialAttack[] {
  return specialAttacks.filter(attack => attack.difficulty === difficulty);
}

export function getSpecialAttackById(id: string): SpecialAttack | undefined {
  return specialAttacks.find(attack => attack.id === id);
}
