import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useWorldStore } from '../../state/worldStore';
import { BattleRewardsModal } from '../../components/BattleRewardsModal';
import { BattleDefeatModal } from '../../components/BattleDefeatModal';
import { BossVictoryModal } from '../../components/BossVictoryModal';
import itemsData from '../../data/items.json';
import quizData from '../../data/quiz-questions.json';
import { specialAttacks } from '../../data/specialAttacks';
import type { QuizQuestion, SpecialAttack, CategoryName } from '../../types/quiz';
import { recordSession, updateQuestionHistory, updatePlayer } from '../../utils/database';

export const CombatView: React.FC = () => {
  const { stats, equipment, inventory, gainXP, takeDamage, addGold, addItem, heal, handleDeath, incrementEnemiesKilled, recordEnemyDefeated, useItem } = usePlayerStore();
  const { encounterState, combatLog, addCombatLog, endEncounter } = useWorldStore();
  
  // Quiz combat state
  const [combatPhase, setCombatPhase] = useState<'select-attack' | 'answer-question' | 'execute-attack' | 'defend-question'>('select-attack');
  const [selectedAttack, setSelectedAttack] = useState<SpecialAttack | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<Array<{ text: string; correct: boolean; originalIndex: number }>>([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set()); // Questions answered by this character
  const [questionPoints, setQuestionPoints] = useState(0); // Points earned from questions
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [questionsWrong, setQuestionsWrong] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [attackDebuff, setAttackDebuff] = useState(0); // For Asset Seizure special attack
  const [manualDefenseEnabled, setManualDefenseEnabled] = useState(false); // Manual defense toggle
  const [isDefending, setIsDefending] = useState(false); // Currently in defense phase
  
  // Load answered questions from localStorage on mount
  useEffect(() => {
    console.log(`\n🔄 LOADING QUESTION HISTORY ON COMPONENT MOUNT...`);
    const userData = localStorage.getItem('current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const questionHistoryKey = `questionHistory:${user.username}`;
        const historyData = localStorage.getItem(questionHistoryKey);
        
        console.log(`👤 Current user: ${user.username}`);
        console.log(`🔑 Looking for key: ${questionHistoryKey}`);
        
        if (historyData) {
          const history = JSON.parse(historyData);
          const answeredIds = history.answeredQuestions || [];
          console.log(`📥 Loaded from localStorage:`, answeredIds);
          console.log(`📊 Total questions marked as answered: ${answeredIds.length}`);
          setAnsweredQuestionIds(new Set(answeredIds));
          setQuestionPoints(history.totalPoints || 0);
          setQuestionsCorrect(history.correctAnswers || 0);
          setQuestionsWrong(history.wrongAnswers || 0);
          console.log(`✅ State updated with loaded history`);
        } else {
          console.log(`⚠️ No question history found for ${user.username} - starting fresh`);
          setAnsweredQuestionIds(new Set());
        }
      } catch (error) {
        console.error('❌ Error loading question history:', error);
      }
    } else {
      console.log(`⚠️ No current_user in localStorage - cannot load history`);
    }
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  }, []);
  
  // Animation states
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);
  const [showSwordClash, setShowSwordClash] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<Array<{
    id: number;
    damage: number;
    isCrit: boolean;
    isPlayer: boolean;
    x: number;
    y: number;
  }>>([]);
  
  // Track active enemy abilities/buffs
  const [enemyBuffs, setEnemyBuffs] = useState<{
    damageBoost: number;
    defenseBoost: number;
    triggeredAbilities: Set<string>;
  }>({
    damageBoost: 0,
    defenseBoost: 0,
    triggeredAbilities: new Set(),
  });
  
  // Battle rewards modal state
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [battleRewards, setBattleRewards] = useState<{
    xp: number;
    gold: number;
    items: Array<{ itemId: string; quantity: number }>;
    enemyName: string;
  }>({
    xp: 0,
    gold: 0,
    items: [],
    enemyName: '',
  });
  
  // Battle defeat modal state
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [defeatPenalty, setDefeatPenalty] = useState<{
    xpLost: number;
    enemyName: string;
  }>({
    xpLost: 0,
    enemyName: '',
  });
  
  // Boss victory modal state (for ARIM)
  const [showBossVictoryModal, setShowBossVictoryModal] = useState(false);
  const [bossVictoryData, setBossVictoryData] = useState<{
    bossName: string;
    xp: number;
    gold: number;
    items: Array<{ itemId: string; quantity: number }>;
  }>({
    bossName: '',
    xp: 0,
    gold: 0,
    items: [],
  });
  
  if (!encounterState) return null;
  
  const { enemy } = encounterState;
  
  // Calculate total stats with equipment bonuses
  const weaponBonus = equipment.weapon 
    ? itemsData.find(i => i.id === equipment.weapon)?.stats?.attack || 0 
    : 0;
  const armorBonus = equipment.armor 
    ? itemsData.find(i => i.id === equipment.armor)?.stats?.defense || 0 
    : 0;
  const critChance = equipment.weapon
    ? itemsData.find(i => i.id === equipment.weapon)?.stats?.critChance || 0
    : 0;
  
  const totalAttack = stats.attack + weaponBonus;
  const totalDefense = stats.defense + armorBonus;
  
  // Check and trigger enemy abilities based on HP thresholds or triggers
  const checkEnemyAbilities = (trigger: string) => {
    if (!(enemy as any).abilities) return;
    
    const abilities = (enemy as any).abilities as Array<{
      id: string;
      name: string;
      trigger: string;
      effect: { type: string; value: number };
    }>;
    
    abilities.forEach(ability => {
      // Skip if already triggered
      if (enemyBuffs.triggeredAbilities.has(ability.id)) return;
      
      let shouldTrigger = false;
      
      // Check trigger conditions
      if (trigger === ability.trigger) {
        shouldTrigger = true;
      } else if (ability.trigger === 'hp-below-75' && enemy.stats.hp / enemy.stats.maxHp <= 0.75) {
        shouldTrigger = true;
      } else if (ability.trigger === 'hp-below-50' && enemy.stats.hp / enemy.stats.maxHp <= 0.50) {
        shouldTrigger = true;
      } else if (ability.trigger === 'hp-below-30' && enemy.stats.hp / enemy.stats.maxHp <= 0.30) {
        shouldTrigger = true;
      }
      
      if (shouldTrigger) {
        // Apply ability effect
        if (ability.effect.type === 'damage-boost') {
          setEnemyBuffs(prev => ({
            ...prev,
            damageBoost: prev.damageBoost + ability.effect.value,
            triggeredAbilities: new Set([...prev.triggeredAbilities, ability.id]),
          }));
          addCombatLog(`🔥 ${enemy.name} activates ${ability.name}! (+${ability.effect.value} Attack)`);
        } else if (ability.effect.type === 'defense-boost') {
          setEnemyBuffs(prev => ({
            ...prev,
            defenseBoost: prev.defenseBoost + ability.effect.value,
            triggeredAbilities: new Set([...prev.triggeredAbilities, ability.id]),
          }));
          addCombatLog(`🛡️ ${enemy.name} activates ${ability.name}! (+${ability.effect.value} Defense)`);
        }
      }
    });
  };
  
  // Check abilities at combat start
  React.useEffect(() => {
    checkEnemyAbilities('combat-start');
  }, []);
  
  // Check available attack categories when entering combat
  React.useEffect(() => {
    console.log('🎮 ENTERING NEW FIGHT - Checking available attack categories...');
    console.log(`📋 Total questions in game: 15`);
    console.log(`✅ Questions answered correctly by this character: ${answeredQuestionIds.size}`);
    console.log(`📝 Answered question IDs: [${Array.from(answeredQuestionIds).join(', ')}]`);
    
    const userData = localStorage.getItem('current_user');
    if (!userData) return;
    
    try {
      const user = JSON.parse(userData);
      const questionHistoryKey = `questionHistory:${user.username}`;
      const historyData = localStorage.getItem(questionHistoryKey);
      
      if (historyData) {
        const history = JSON.parse(historyData);
        console.log(`� Loaded from storage: ${history.answeredQuestions?.length || 0} questions logged`);
        console.log(`💯 Total points earned: ${history.totalPoints || 0}`);
        console.log(`✅ Correct: ${history.correctAnswers || 0}, ❌ Wrong: ${history.wrongAnswers || 0}`);
      }
      
      // Check each attack category
      console.log('\n📊 ATTACK AVAILABILITY CHECK:');
      specialAttacks.forEach((attack) => {
        const categoryData = (quizData.categories as any)[attack.category];
        const totalQuestions = categoryData?.questions?.length || 0;
        const availableQuestions = categoryData?.questions?.filter(
          (q: QuizQuestion) => !answeredQuestionIds.has(q.id)
        ) || [];
        
        if (availableQuestions.length === 0) {
          console.log(`  ❌ ${attack.name} (${attack.category}): BLOCKED - All ${totalQuestions} questions answered`);
        } else {
          console.log(`  ✅ ${attack.name} (${attack.category}): AVAILABLE - ${availableQuestions.length}/${totalQuestions} questions remaining`);
        }
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
      console.error('Error checking available categories:', error);
    }
  }, [answeredQuestionIds, enemy.id]); // Re-check when answered questions change or new enemy
  
  // Quiz helper functions
  const getRandomQuestion = (category: CategoryName): QuizQuestion | null => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🎯 SELECTING QUESTION FOR CATEGORY: ${category}`);
    
    const categoryData = (quizData.categories as any)[category];
    if (!categoryData || !categoryData.questions) {
      console.log(`❌ Category ${category} not found!`);
      return null;
    }
    
    const totalInCategory = categoryData.questions.length;
    console.log(`📚 Total questions in ${category}: ${totalInCategory}`);
    console.log(`✅ Already answered correctly: ${answeredQuestionIds.size} total`);
    
    // Filter out questions that have already been answered CORRECTLY by this character
    // CRITICAL: Double-check to prevent any duplicates
    const availableQuestions = categoryData.questions.filter(
      (q: QuizQuestion) => !answeredQuestionIds.has(q.id)
    );
    
    console.log(`🔍 Filtering out answered questions from ${category}...`);
    console.log(`   All questions in category: [${categoryData.questions.map((q: QuizQuestion) => q.id).join(', ')}]`);
    console.log(`   Already answered: [${Array.from(answeredQuestionIds).join(', ')}]`);
    console.log(`   ✅ Available after filter: ${availableQuestions.length}/${totalInCategory}`);
    console.log(`   Available IDs: [${availableQuestions.map((q: QuizQuestion) => q.id).join(', ')}]`);
    
    if (availableQuestions.length === 0) {
      console.log(`⚠️ NO MORE QUESTIONS IN ${category}! All answered correctly.`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      return null;
    }
    
    // Select random question from available pool
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // EXTRA VALIDATION: Double-check this question hasn't been answered
    if (answeredQuestionIds.has(selectedQuestion.id)) {
      console.error(`🚨 CRITICAL ERROR: Selected already-answered question ${selectedQuestion.id}! This should never happen!`);
      console.error(`🔍 answeredQuestionIds:`, Array.from(answeredQuestionIds));
      console.error(`🔍 availableQuestions:`, availableQuestions.map((q: QuizQuestion) => q.id));
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      return null; // Prevent showing duplicate question
    }
    
    console.log(`✅ SELECTED: ${selectedQuestion.id} (Random index ${randomIndex} from ${availableQuestions.length} available)`);
    console.log(`📋 Question: "${selectedQuestion.question.substring(0, 50)}..."`);
    console.log(`💰 Points: ${selectedQuestion.points}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    return selectedQuestion;
  };
  
  const handleAttackSelection = (attack: SpecialAttack) => {
    // Get a question from the attack's category
    const question = getRandomQuestion(attack.category);
    
    if (!question) {
      addCombatLog('No more questions available in this category!');
      return;
    }
    
    // Shuffle the answers
    const answersWithIndex = question.answers.map((answer, index) => ({
      ...answer,
      originalIndex: index
    }));
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...answersWithIndex];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setSelectedAttack(attack);
    setCurrentQuestion(question);
    setShuffledAnswers(shuffled);
    setCombatPhase('answer-question');
    setShowExplanation(false);
    setLastAnswer(null);
  };
  
  const handleAnswerSelection = async (answerIndex: number) => {
    if (!currentQuestion || shuffledAnswers.length === 0) return;
    
    // Check if this is a defense question
    if (isDefending) {
      handleDefenseAnswer(answerIndex);
      return;
    }
    
    // Regular attack question
    if (!selectedAttack) return;
    
    // ⚠️ CRITICAL CHECK: Verify this question hasn't already been answered
    if (answeredQuestionIds.has(currentQuestion.id)) {
      console.error(`🚨 CRITICAL ERROR: Attempting to answer already-answered question ${currentQuestion.id}!`);
      console.error(`This question should have been filtered out during selection!`);
      console.error(`Current answeredQuestionIds:`, Array.from(answeredQuestionIds));
      addCombatLog(`⚠️ Error: This question was already answered. Please select a different attack.`);
      setCombatPhase('select-attack');
      setCurrentQuestion(null);
      setShuffledAnswers([]);
      setSelectedAttack(null);
      return;
    }
    
    // Check if the selected shuffled answer is correct
    const isCorrect = shuffledAnswers[answerIndex].correct;
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 ANSWER SUBMITTED FOR QUESTION: ${currentQuestion.id}`);
    console.log(`❓ Question: "${currentQuestion.question}"`);
    console.log(`💡 Answer given: "${shuffledAnswers[answerIndex].text}"`);
    console.log(`${isCorrect ? '✅ CORRECT!' : '❌ WRONG!'}`);
    
    // Calculate points
    const basePoints = currentQuestion.points || 50;
    const pointsChange = isCorrect ? basePoints : -Math.floor(basePoints * 0.25); // 25% penalty for wrong answer
    
    console.log(`💰 Points: ${pointsChange > 0 ? '+' : ''}${pointsChange}`);
    
    // CRITICAL: Only log correctly answered questions!
    let newAnsweredQuestions: string[];
    if (isCorrect) {
      // Double-check this question isn't already in the set (should never happen, but be safe)
      if (answeredQuestionIds.has(currentQuestion.id)) {
        console.warn(`⚠️ WARNING: Question ${currentQuestion.id} was already answered! Skipping duplicate.`);
        newAnsweredQuestions = Array.from(answeredQuestionIds);
      } else {
        newAnsweredQuestions = [...answeredQuestionIds, currentQuestion.id];
        console.log(`✅ LOGGING QUESTION ${currentQuestion.id} AS ANSWERED`);
        console.log(`   Before: ${answeredQuestionIds.size} questions answered`);
        console.log(`   After: ${newAnsweredQuestions.length} questions answered`);
        console.log(`   New list: [${newAnsweredQuestions.join(', ')}]`);
      }
    } else {
      // Wrong answer - don't add to answered list so it can be tried again
      newAnsweredQuestions = Array.from(answeredQuestionIds);
      console.log(`❌ NOT LOGGING - Question ${currentQuestion.id} can be retried later`);
      console.log(`   Answered questions remain: ${answeredQuestionIds.size}`);
    }
    
    const newTotalPoints = questionPoints + pointsChange;
    const newCorrectAnswers = questionsCorrect + (isCorrect ? 1 : 0);
    const newWrongAnswers = questionsWrong + (isCorrect ? 0 : 1);
    
    // Update local state with new values
    setAnsweredQuestionIds(new Set(newAnsweredQuestions));
    setQuestionPoints(newTotalPoints);
    setQuestionsCorrect(newCorrectAnswers);
    setQuestionsWrong(newWrongAnswers);
    
    console.log(`📊 UPDATED STATS:`);
    console.log(`   Total answered correctly: ${newAnsweredQuestions.length}/15`);
    console.log(`   Total points: ${newTotalPoints}`);
    console.log(`   Correct answers: ${newCorrectAnswers}`);
    console.log(`   Wrong answers: ${newWrongAnswers}`);
    
    // Update database and localStorage
    const userData = localStorage.getItem('current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        // Prepare full question history object
        const updatedQuestionHistory = {
          answeredQuestions: newAnsweredQuestions,
          totalPoints: newTotalPoints,
          correctAnswers: newCorrectAnswers,
          wrongAnswers: newWrongAnswers,
        };
        
        console.log(`\n💾 SAVING TO DATABASE...`);
        console.log(`   Character: ${user.username}`);
        console.log(`   Questions to save: [${newAnsweredQuestions.join(', ')}]`);
        console.log(`   Points to save: ${newTotalPoints}`);
        
        // CRITICAL: Await database save to ensure it completes BEFORE attack executes
        console.log(`💾 Step 1/3: Updating question history in Dexie...`);
        await updateQuestionHistory(user.username, updatedQuestionHistory);
        console.log(`   ✅ Question ${currentQuestion.id} saved to Dexie`);
        
        // Update player's score in database
        console.log(`💾 Step 2/3: Updating player scores in Dexie...`);
        await updatePlayer(user.username, {
          totalScore: newTotalPoints,
          highestScore: Math.max(newTotalPoints, user.highestScore || 0)
        });
        console.log(`   ✅ Player scores updated in Dexie database (Total: ${newTotalPoints})`);
        console.log(`   📊 Dexie now has: totalScore=${newTotalPoints}, highestScore=${Math.max(newTotalPoints, user.highestScore || 0)}`);
        
        // Update current_user in localStorage with new scores (for leaderboard)
        const updatedUser = {
          ...user,
          totalScore: newTotalPoints,
          highestScore: Math.max(newTotalPoints, user.highestScore || 0)
        };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        console.log(`   ✅ current_user updated with new scores`);
        
        // Dispatch custom event to notify leaderboard to refresh
        window.dispatchEvent(new Event('scoreUpdated'));
        
        // Update localStorage (synchronous backup)
        console.log(`💾 Step 3/3: Saving to localStorage backup...`);
        localStorage.setItem(
          `questionHistory:${user.username}`,
          JSON.stringify(updatedQuestionHistory)
        );
        console.log(`   ✅ localStorage backup saved`);
        
        console.log(`✅ DATABASE SAVE COMPLETE!`);
        console.log(`   All storage layers updated before attack executes`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      } catch (error) {
        console.error('Failed to update question history:', error);
        alert('⚠️ Warning: Failed to save question progress. Your answer may not be recorded.');
      }
    }
    
    // Show explanation
    setLastAnswer({
      correct: isCorrect,
      explanation: currentQuestion.explanation,
    });
    setShowExplanation(true);
    
    // Auto-proceed to attack after 3 seconds
    setTimeout(() => {
      if (isCorrect) {
        addCombatLog(`✅ Correct! +${pointsChange} points`);
        console.log(`🎯 Executing attack - question ${currentQuestion.id} already saved to database`);
        executeSpecialAttack(selectedAttack);
      } else {
        // Wrong answer - player misses completely
        addCombatLog(`❌ Wrong answer! ${pointsChange} points`);
        setShowExplanation(false);
        setCurrentQuestion(null);
        setShuffledAnswers([]);
        setSelectedAttack(null);
        setCombatPhase('select-attack');
        
        // Enemy still gets to attack after player's miss
        setTimeout(() => {
          enemyAttack();
        }, 500);
      }
    }, 3000);
  };
  
  const handleDefenseAnswer = async (answerIndex: number) => {
    if (!currentQuestion) return;
    
    const isCorrect = shuffledAnswers[answerIndex].correct;
    
    // Calculate points
    const basePoints = currentQuestion.points || 50;
    const pointsChange = isCorrect ? basePoints : -Math.floor(basePoints * 0.25); // 25% penalty for wrong answer
    
    // CRITICAL: Only log correctly answered questions!
    let newAnsweredQuestions: string[];
    if (isCorrect) {
      // Double-check this question isn't already in the set (should never happen, but be safe)
      if (answeredQuestionIds.has(currentQuestion.id)) {
        console.warn(`⚠️ WARNING: DEFENSE Question ${currentQuestion.id} was already answered! Skipping duplicate.`);
        newAnsweredQuestions = Array.from(answeredQuestionIds);
      } else {
        newAnsweredQuestions = [...answeredQuestionIds, currentQuestion.id];
        console.log(`✅ DEFENSE CORRECT - Logging question ${currentQuestion.id} as answered`);
      }
    } else {
      // Wrong answer - don't add to answered list so it can be tried again
      newAnsweredQuestions = Array.from(answeredQuestionIds);
      console.log(`❌ DEFENSE WRONG - Question ${currentQuestion.id} NOT logged (can retry later)`);
    }
    
    const newTotalPoints = questionPoints + pointsChange;
    const newCorrectAnswers = questionsCorrect + (isCorrect ? 1 : 0);
    const newWrongAnswers = questionsWrong + (isCorrect ? 0 : 1);
    
    // Update local state with new values
    setAnsweredQuestionIds(new Set(newAnsweredQuestions));
    setQuestionPoints(newTotalPoints);
    setQuestionsCorrect(newCorrectAnswers);
    setQuestionsWrong(newWrongAnswers);
    
    // Update database and localStorage
    const userData = localStorage.getItem('current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        // Prepare full question history object
        const updatedQuestionHistory = {
          answeredQuestions: newAnsweredQuestions,
          totalPoints: newTotalPoints,
          correctAnswers: newCorrectAnswers,
          wrongAnswers: newWrongAnswers,
        };
        
        // CRITICAL: Await database save to ensure it completes BEFORE continuing
        await updateQuestionHistory(user.username, updatedQuestionHistory);
        console.log(`✅ DEFENSE Question ${currentQuestion.id} saved to database`);
        
        // Update player's score in database
        await updatePlayer(user.username, {
          totalScore: newTotalPoints,
          highestScore: Math.max(newTotalPoints, user.highestScore || 0)
        });
        console.log(`✅ DEFENSE Score updated in Dexie database: ${newTotalPoints} points`);
        console.log(`   📊 Dexie now has: totalScore=${newTotalPoints}, highestScore=${Math.max(newTotalPoints, user.highestScore || 0)}`);
        
        // Update current_user in localStorage with new scores (for leaderboard)
        const updatedUser = {
          ...user,
          totalScore: newTotalPoints,
          highestScore: Math.max(newTotalPoints, user.highestScore || 0)
        };
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        console.log(`✅ DEFENSE current_user updated with new scores`);
        
        // Dispatch custom event to notify leaderboard to refresh
        window.dispatchEvent(new Event('scoreUpdated'));
        
        // Update localStorage (synchronous backup)
        localStorage.setItem(
          `questionHistory:${user.username}`,
          JSON.stringify(updatedQuestionHistory)
        );
        console.log(`💾 DEFENSE Question history saved to all storage layers`);
      } catch (error) {
        console.error('Failed to update question history:', error);
        alert('⚠️ Warning: Failed to save question progress. Your answer may not be recorded.');
      }
    }
    
    // Show explanation
    setLastAnswer({
      correct: isCorrect,
      explanation: currentQuestion.explanation,
    });
    setShowExplanation(true);
    
    // Auto-proceed after 3 seconds
    setTimeout(() => {
      if (isCorrect) {
        // Successful dodge!
        addCombatLog(`✅ Correct! You dodge the attack completely! +${pointsChange} points`);
      } else {
        // Failed dodge - take damage
        addCombatLog(`❌ Wrong answer! You fail to dodge!`);
        executeEnemyAttack();
      }
      
      // Reset defense state completely
      setShowExplanation(false);
      setCurrentQuestion(null);
      setShuffledAnswers([]);
      setIsDefending(false);
      setCombatPhase('select-attack');
    }, 3000);
  };
  
  const executeSpecialAttack = (attack: SpecialAttack) => {
    addCombatLog(`✨ You use ${attack.name}!`);
    
    // Trigger player attack animation
    setPlayerAttacking(true);
    setTimeout(() => setPlayerAttacking(false), 600);
    
    // Show sword clash
    setTimeout(() => {
      setShowSwordClash(true);
      setTimeout(() => setShowSwordClash(false), 400);
    }, 250);
    
    setTimeout(() => {
      // Calculate damage: Base Attack + Special Attack Damage
      const weaponBonus = equipment.weapon 
        ? itemsData.find(i => i.id === equipment.weapon)?.stats?.attack || 0 
        : 0;
      const baseAttack = stats.attack + weaponBonus;
      const specialDamage = attack.damage;
      const totalDamage = baseAttack + specialDamage;
      
      // Apply variance (90-110%)
      const variance = 0.9 + Math.random() * 0.2;
      const actualDamage = Math.floor(totalDamage * variance);
      
      enemy.stats.hp -= actualDamage;
      
      // Trigger enemy hit animation
      setEnemyHit(true);
      showDamageNumber(actualDamage, false, false);
      setTimeout(() => setEnemyHit(false), 500);
      
      addCombatLog(`${attack.description}`);
      addCombatLog(`You deal ${actualDamage} damage to ${enemy.name}! (${baseAttack} base + ${specialDamage} special)`);
      
      // Apply special effects
      if (attack.effect) {
        if (attack.effect.type === 'heal') {
          const healAmount = Math.min(attack.effect.value, stats.maxHp - stats.hp);
          if (healAmount > 0) {
            heal(healAmount);
            addCombatLog(`💚 ${attack.effect.description}! Restored ${healAmount} HP!`);
          }
        } else if (attack.effect.type === 'debuff') {
          setAttackDebuff(attack.effect.value);
          addCombatLog(`💰 ${attack.effect.description}!`);
        }
      }
      
      // Check if new abilities should trigger
      checkEnemyAbilities('hp-threshold');
      
      // Reset attack phase UI
      setShowExplanation(false);
      setCurrentQuestion(null);
      setShuffledAnswers([]);
      setSelectedAttack(null);
      
      // Check if enemy defeated
      if (enemy.stats.hp <= 0) {
        handleVictory();
        return;
      }
      
      // Enemy's turn
      enemyAttack();
    }, 300);
  };
  
  const executeBasicAttack = () => {
    addCombatLog('⚔️ You perform a basic attack!');
    
    // Trigger player attack animation
    setPlayerAttacking(true);
    setTimeout(() => setPlayerAttacking(false), 600);
    
    // Show sword clash
    setTimeout(() => {
      setShowSwordClash(true);
      setTimeout(() => setShowSwordClash(false), 400);
    }, 250);
    
    setTimeout(() => {
      // Basic attack: 10-20 damage
      const baseDamage = 10 + Math.floor(Math.random() * 11); // 10-20
      const actualDamage = baseDamage;
      
      enemy.stats.hp -= actualDamage;
      
      // Trigger enemy hit animation
      setEnemyHit(true);
      showDamageNumber(actualDamage, false, false);
      setTimeout(() => setEnemyHit(false), 500);
      
      addCombatLog(`You deal ${actualDamage} damage to ${enemy.name}!`);
      
      // Check if new abilities should trigger
      checkEnemyAbilities('hp-threshold');
      
      // Check if enemy defeated
      if (enemy.stats.hp <= 0) {
        handleVictory();
        return;
      }
      
      // Enemy's turn
      enemyAttack();
    }, 300);
  };
  
  const enemyAttack = () => {
    // Check if manual defense is enabled
    if (manualDefenseEnabled) {
      // Get a random defense question
      const categories: CategoryName[] = ['gst_basics', 'filing_deadline', 'input_tax', 'compliance', 'mira_services'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const defenseQuestion = getRandomQuestion(randomCategory);
      
      if (defenseQuestion) {
        // Shuffle answers for defense question
        const answersWithIndex = defenseQuestion.answers.map((answer, index) => ({
          ...answer,
          originalIndex: index
        }));
        
        const shuffled = [...answersWithIndex];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        setCurrentQuestion(defenseQuestion);
        setShuffledAnswers(shuffled);
        setIsDefending(true);
        setCombatPhase('defend-question');
        addCombatLog(`🛡️ ${enemy.name} attacks! Answer correctly to dodge!`);
        return;
      }
    }
    
    // Normal enemy attack (no manual defense or no questions available)
    executeEnemyAttack();
  };
  
  const executeEnemyAttack = () => {
    setTimeout(() => {
      setEnemyAttacking(true);
      setTimeout(() => setEnemyAttacking(false), 600);
      
      setTimeout(() => {
        setShowSwordClash(true);
        setTimeout(() => setShowSwordClash(false), 400);
      }, 250);
      
      setTimeout(() => {
        let enemyDamage = Math.max(1, (enemy.stats.attack + enemyBuffs.damageBoost - attackDebuff) - totalDefense);
        const actualEnemyDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
        
        // Reset debuff after use
        setAttackDebuff(0);
        
        takeDamage(actualEnemyDamage);
        
        setPlayerHit(true);
        showDamageNumber(actualEnemyDamage, false, true);
        setTimeout(() => setPlayerHit(false), 500);
        
        addCombatLog(`${enemy.name} deals ${actualEnemyDamage} damage to you!`);
        
        if (stats.hp - actualEnemyDamage <= 0) {
          handleDefeat();
          return;
        }
        
        // Reset to attack selection for next turn
        setCombatPhase('select-attack');
        setSelectedAttack(null);
        setCurrentQuestion(null);
        setShuffledAnswers([]);
        setShowExplanation(false);
        setIsDefending(false);
      }, 300);
    }, 800);
  };
  
  const handleVictory = () => {
    addCombatLog(`${enemy.name} defeated!`);
    
    incrementEnemiesKilled();
    recordEnemyDefeated(enemy.id);
    
    const rewardMultiplier = encounterState.rewardMultiplier || 1.0;
    const baseXp = enemy.rewards.xp;
    const baseGold = enemy.rewards.gold;
    const xpReward = stats.level >= 10 ? 0 : Math.floor(baseXp * rewardMultiplier);
    const goldReward = Math.floor(baseGold * rewardMultiplier);
    
    if (stats.level >= 10) {
      addCombatLog(`You are at MAX LEVEL (10)! No more XP can be gained.`);
      addCombatLog(`You gained ${goldReward} gold!`);
    } else {
      addCombatLog(`You gained ${xpReward} XP and ${goldReward} gold!`);
    }
    
    gainXP(xpReward);
    addGold(goldReward);
    
    const healAmount = stats.maxHp - stats.hp;
    if (healAmount > 0) {
      heal(healAmount);
      addCombatLog(`You recovered ${healAmount} HP!`);
    }
    
    const lootedItems: Array<{ itemId: string; quantity: number }> = [];
    
    enemy.rewards.items.forEach((loot: any) => {
      if (Math.random() < (loot.chance || 1)) {
        const itemData = itemsData.find(i => i.id === loot.id);
        const itemName = itemData?.name || loot.id;
        const rarity = itemData?.rarity;
        
        addItem(loot.id, 1);
        lootedItems.push({ itemId: loot.id, quantity: 1 });
        
        if (rarity === 'legendary') {
          addCombatLog(`⭐ LEGENDARY! You received ${itemName}! ⭐`);
        } else if (rarity === 'epic') {
          addCombatLog(`💜 EPIC! You received ${itemName}!`);
        } else if (rarity === 'rare') {
          addCombatLog(`💎 RARE! You received ${itemName}!`);
        } else {
          addCombatLog(`You received ${itemName}!`);
        }
      }
    });
    
    const isBossFight = enemy.id === 'arim-dragon';
    
    if (isBossFight) {
      // Calculate final score for ARIM victory
      const finalScore = stats.gold + (stats.level * 1000) + (stats.xp);
      
      // Record game session with score and prize eligibility
      const userData = localStorage.getItem('current_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          recordSession(user.username, finalScore, true);
          console.log(`🏆 ARIM DEFEATED! Score: ${finalScore}, Username: ${user.username}`);
        } catch (error) {
          console.error('Failed to record ARIM victory:', error);
        }
      }
      
      setBossVictoryData({
        bossName: enemy.name,
        xp: xpReward,
        gold: goldReward,
        items: lootedItems,
      });
      setShowBossVictoryModal(true);
    } else {
      // Record regular combat session
      const regularScore = stats.gold + (stats.level * 100) + (stats.xp / 10);
      const userData = localStorage.getItem('current_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          recordSession(user.username, Math.floor(regularScore), false);
        } catch (error) {
          console.error('Failed to record combat session:', error);
        }
      }
      
      setBattleRewards({
        xp: xpReward,
        gold: goldReward,
        items: lootedItems,
        enemyName: enemy.name,
      });
      setShowRewardsModal(true);
    }
  };
  
  const handleDefeat = () => {
    addCombatLog('💀 You have been defeated!');
    
    const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
    addCombatLog(`You lost ${xpLoss} XP and were returned to try again.`);
    
    setDefeatPenalty({
      xpLost: xpLoss,
      enemyName: enemy.name,
    });
    setShowDefeatModal(true);
  };
  
  
  // Helper function to show damage numbers
  const showDamageNumber = (damage: number, isCrit: boolean, isPlayer: boolean) => {
    const id = Date.now() + Math.random();
    const newDamage = {
      id,
      damage,
      isCrit,
      isPlayer,
      x: Math.random() * 60 - 30, // Random horizontal offset
      y: 0,
    };
    
    setDamageNumbers(prev => [...prev, newDamage]);
    
    // Remove after animation completes
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1000);
  };
  
  // @ts-ignore - Legacy function kept for reference
  const handleAttack = () => {
    // Trigger player attack animation
    setPlayerAttacking(true);
    setTimeout(() => setPlayerAttacking(false), 600);
    
    // Show sword clash in the middle
    setTimeout(() => {
      setShowSwordClash(true);
      setTimeout(() => setShowSwordClash(false), 400);
    }, 250);
    
    // Slight delay before damage
    setTimeout(() => {
      // Check for critical hit
      const isCritical = Math.random() < critChance;
      const critMultiplier = isCritical ? 2.0 : 1.0;
      
      // Player attacks with equipment bonuses
      const playerDamage = Math.max(1, totalAttack - enemy.stats.defense);
      const variance = 0.9 + Math.random() * 0.2;
      const actualDamage = Math.floor(playerDamage * variance * critMultiplier);
      
      enemy.stats.hp -= actualDamage;
      
      // Trigger enemy hit animation and damage number
      setEnemyHit(true);
      showDamageNumber(actualDamage, isCritical, false);
      setTimeout(() => setEnemyHit(false), 500);
      
      if (isCritical) {
        addCombatLog(`🎯 CRITICAL HIT! You deal ${actualDamage} damage to ${enemy.name}!`);
      } else {
        addCombatLog(`You deal ${actualDamage} damage to ${enemy.name}!`);
      }
      
      // Check if new abilities should trigger based on HP threshold
      checkEnemyAbilities('hp-threshold');
    }, 300);
    
    // Check if enemy defeated
    setTimeout(() => {
      if (enemy.stats.hp <= 0) {
        addCombatLog(`${enemy.name} defeated!`);
      
        // Increment enemies killed for achievements
        incrementEnemiesKilled();
        
        // Record this enemy type as defeated (for lore codex)
        recordEnemyDefeated(enemy.id);
        
        // Apply reward multiplier based on enemy's randomized strength
        const rewardMultiplier = encounterState.rewardMultiplier || 1.0;
        
        // Collect XP and Gold rewards with multiplier
        const baseXp = enemy.rewards.xp;
        const baseGold = enemy.rewards.gold;
        const xpReward = stats.level >= 10 ? 0 : Math.floor(baseXp * rewardMultiplier);
        const goldReward = Math.floor(baseGold * rewardMultiplier);
        
        // Check if at max level before gaining XP
        if (stats.level >= 10) {
          addCombatLog(`You are at MAX LEVEL (10)! No more XP can be gained.`);
          addCombatLog(`You gained ${goldReward} gold!`);
        } else {
          addCombatLog(`You gained ${xpReward} XP and ${goldReward} gold!`);
        }
        
        // Show bonus message if multiplier is significant
        if (rewardMultiplier > 1.15) {
          addCombatLog(`💰 This was a tough one! (+${Math.round((rewardMultiplier - 1) * 100)}% bonus rewards)`);
        }
        
        gainXP(xpReward);
        addGold(goldReward);
      
      // Full heal after victory
      const healAmount = stats.maxHp - stats.hp;
      if (healAmount > 0) {
        heal(healAmount);
        addCombatLog(`You recovered ${healAmount} HP!`);
      }
      
      // Collect looted items
      const lootedItems: Array<{ itemId: string; quantity: number }> = [];
      
      // Loot items
      enemy.rewards.items.forEach((loot: any) => {
        if (Math.random() < (loot.chance || 1)) {
          const itemData = itemsData.find(i => i.id === loot.id);
          const itemName = itemData?.name || loot.id;
          const rarity = itemData?.rarity;
          
          addItem(loot.id, 1);
          lootedItems.push({ itemId: loot.id, quantity: 1 });
          
          // Special messages for rare items
          if (rarity === 'legendary') {
            addCombatLog(`⭐ LEGENDARY! You received ${itemName}! ⭐`);
          } else if (rarity === 'epic') {
            addCombatLog(`💜 EPIC! You received ${itemName}!`);
          } else if (rarity === 'rare') {
            addCombatLog(`💎 RARE! You received ${itemName}!`);
          } else {
            addCombatLog(`You received ${itemName}!`);
          }
        }
      });
      
      // Check if this was ARIM (the final boss)
      const isBossFight = enemy.id === 'arim-dragon';
      
      if (isBossFight) {
        // Show special boss victory modal for ARIM
        setBossVictoryData({
          bossName: enemy.name,
          xp: xpReward,
          gold: goldReward,
          items: lootedItems,
        });
        setShowBossVictoryModal(true);
      } else {
        // Show regular rewards modal for normal enemies
        setBattleRewards({
          xp: xpReward,
          gold: goldReward,
          items: lootedItems,
          enemyName: enemy.name,
        });
        setShowRewardsModal(true);
      }
      
      // Don't call endEncounter here - let the modal's "Continue" button handle it
        return;
      }
    
      // Enemy attacks
      setTimeout(() => {
        // Trigger enemy attack animation
        setEnemyAttacking(true);
        setTimeout(() => setEnemyAttacking(false), 600);
        
        // Show sword clash in the middle
        setTimeout(() => {
          setShowSwordClash(true);
          setTimeout(() => setShowSwordClash(false), 400);
        }, 250);
        
        setTimeout(() => {
          const enemyDamage = Math.max(1, (enemy.stats.attack + enemyBuffs.damageBoost) - totalDefense);
          const actualEnemyDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
          
          takeDamage(actualEnemyDamage);
          
          // Trigger player hit animation and damage number
          setPlayerHit(true);
          showDamageNumber(actualEnemyDamage, false, true);
          setTimeout(() => setPlayerHit(false), 500);
          
          addCombatLog(`${enemy.name} deals ${actualEnemyDamage} damage to you!`);
          
          // Check if player defeated
          if (stats.hp - actualEnemyDamage <= 0) {
            addCombatLog('💀 You have been defeated!');
            
            const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
            addCombatLog(`You lost ${xpLoss} XP and were returned to the Guild Hall.`);
            
            // Show defeat modal immediately
            setDefeatPenalty({
              xpLost: xpLoss,
              enemyName: enemy.name,
            });
            setShowDefeatModal(true);
          }
        }, 300);
      }, 800);
    }, 500);
  };
  
  const handleFlee = () => {
    if (Math.random() < 0.6) {
      addCombatLog('You successfully fled!');
      endEncounter(false);
    } else {
      addCombatLog('Failed to flee!');
      
      // Enemy gets a free attack
      setTimeout(() => {
        const enemyDamage = Math.max(1, (enemy.stats.attack + enemyBuffs.damageBoost) - totalDefense);
        const actualDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
        
        takeDamage(actualDamage);
        addCombatLog(`${enemy.name} deals ${actualDamage} damage while you flee!`);
        
        // Check if player defeated
        if (stats.hp - actualDamage <= 0) {
          addCombatLog('💀 You have been defeated!');
          
          const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
          addCombatLog(`You lost ${xpLoss} XP and were returned to the Guild Hall.`);
          
          // Show defeat modal immediately
          setDefeatPenalty({
            xpLost: xpLoss,
            enemyName: enemy.name,
          });
          setShowDefeatModal(true);
        }
      }, 500);
    }
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-1 sm:p-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-600 rounded-lg shadow-xl p-1.5 sm:p-2 md:p-3 flex flex-col">
            <h2 className="font-medieval text-base sm:text-xl md:text-2xl text-center bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent mb-1 sm:mb-2">
              ⚔️ Combat!
            </h2>
            
            {/* Quiz Score and Flee Button */}
            <div className="flex justify-between items-center mb-2 bg-white/50 rounded-lg p-2 border border-teal-400 flex-wrap gap-2">
              <div className="flex gap-4 text-sm flex-wrap">
                <span className="font-bold text-green-700">✅ Correct: {questionsCorrect}</span>
                <span className="font-bold text-red-700">❌ Wrong: {questionsWrong}</span>
                <span className="font-bold text-blue-700">💎 Points: {questionPoints}</span>
                <span className="font-bold text-purple-700">📊 Score: {questionsCorrect + questionsWrong > 0 ? Math.round((questionsCorrect / (questionsCorrect + questionsWrong)) * 100) : 0}%</span>
              </div>
              <div className="flex gap-2 items-center">
                <label className="flex items-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 border-2 border-blue-500 rounded-lg px-3 py-1 transition-all">
                  <input
                    type="checkbox"
                    checked={manualDefenseEnabled}
                    onChange={(e) => setManualDefenseEnabled(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-blue-700">🛡️ Manual Defense</span>
                </label>
                <button
                  onClick={handleFlee}
                  className="btn-secondary text-xs sm:text-sm py-1 px-3"
                  disabled={stats.hp <= 0 || combatPhase === 'answer-question' || combatPhase === 'defend-question'}
                >
                  🏃 Flee
                </button>
              </div>
            </div>
            
            {/* Manual Defense Explanation */}
            {manualDefenseEnabled && (
              <div className="mb-2 bg-blue-50 border-2 border-blue-500 rounded-lg p-2 text-xs text-blue-800">
                <span className="font-bold">🛡️ Manual Defense Active:</span> When the enemy attacks, you'll get a question. Answer correctly to dodge and take no damage!
              </div>
            )}
            
            {/* Main Combat Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 relative mb-1">
        {/* SWORD CLASH IN CENTER */}
        {showSwordClash && (
          <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="relative animate-sword-clash">
              {/* Left Sword (Player's) */}
              <div className="absolute left-0 transform -rotate-45 animate-sword-left">
                <div className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow-lg">⚔️</div>
              </div>
              
              {/* Right Sword (Enemy's) */}
              <div className="absolute right-0 transform rotate-45 animate-sword-right">
                <div className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow-lg">⚔️</div>
              </div>
              
              {/* Clash Spark Effect */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-clash-spark">
                <div className="text-3xl sm:text-4xl">💥</div>
              </div>
            </div>
          </div>
        )}
        
        {/* LEFT COLUMN - Enemy */}
        <div className="space-y-1 flex flex-col">
          {/* Enemy Avatar */}
          <div className="flex flex-col items-center relative flex-shrink-0">
            <div 
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-600 rounded-lg overflow-hidden shadow-xl mb-0.5 transition-all duration-300 ${
                enemyAttacking ? 'animate-attack-enemy' : ''
              } ${
                enemyHit ? 'animate-hit-shake' : ''
              }`}
            >
              <img 
                src={(enemy as any).image || '/images/enemies/tax-collector.svg'} 
                alt={enemy.name}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            
            {/* Damage Numbers for Enemy */}
            {[...damageNumbers].reverse().filter(d => !d.isPlayer).map(dmg => (
              <div
                key={dmg.id}
                className={`absolute pointer-events-none font-medieval text-xl sm:text-2xl font-bold animate-damage-float ${
                  dmg.isCrit ? 'text-yellow-400' : 'text-red-600'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(${dmg.x}px, ${dmg.y}px)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {dmg.isCrit ? '💥 ' : ''}{dmg.damage}{dmg.isCrit ? ' 💥' : ''}
              </div>
            ))}
            
            <h3 className="font-medieval text-xs sm:text-sm md:text-base text-orange-800 text-center">
              {enemy.name}
            </h3>
          </div>
          
          {/* Enemy Stats */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-1.5 sm:p-2 rounded-lg border-2 border-orange-600 shadow-lg flex-shrink-0">
            <h3 className="font-medieval text-xs sm:text-sm text-center text-orange-800 mb-0.5">
              Enemy Stats
              {enemy.statRanges && (
                <span className="text-xs text-orange-600 block font-body italic hidden sm:block">
                  (Randomized)
                </span>
              )}
            </h3>
            <div className="space-y-1 font-body text-brown-800 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>HP:</span>
                <span className="font-bold">
                  {enemy.stats.hp} / {enemy.stats.maxHp}
                  {enemy.statRanges && (
                    <span className="text-xs text-gray-600 ml-1 hidden sm:inline">
                      ({enemy.statRanges.hp.min}-{enemy.statRanges.hp.max})
                    </span>
                  )}
                </span>
              </div>
              {/* Enemy HP Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden border-2 border-orange-500 mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 shadow-lg"
                  style={{ width: `${(enemy.stats.hp / enemy.stats.maxHp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Attack:</span>
                <span>
                  {enemy.stats.attack}
                  {enemyBuffs.damageBoost > 0 && (
                    <span className="font-bold text-red-600"> +{enemyBuffs.damageBoost}</span>
                  )}
                  {enemy.statRanges && (
                    <span className="text-xs text-gray-600 ml-1 hidden sm:inline">
                      ({enemy.statRanges.attack.min}-{enemy.statRanges.attack.max})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span>
                  {enemy.stats.defense}
                  {enemyBuffs.defenseBoost > 0 && (
                    <span className="font-bold text-blue-600"> +{enemyBuffs.defenseBoost}</span>
                  )}
                  {enemy.statRanges && (
                    <span className="text-xs text-gray-600 ml-1 hidden sm:inline">
                      ({enemy.statRanges.defense.min}-{enemy.statRanges.defense.max})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* Enemy Lore - Hidden on small screens to save space */}
          {(enemy as any).lore && (
            <div className="hidden md:block bg-gradient-to-br from-amber-50 to-yellow-50 p-2 rounded-lg border-2 border-amber-600 shadow-lg flex-shrink-0 overflow-y-auto max-h-20">
              <h3 className="font-medieval text-xs text-center text-amber-900 mb-1 flex items-center justify-center gap-1">
                📜 Lore
              </h3>
              <p className="font-body text-xs text-brown-800 leading-tight italic text-center">
                {(enemy as any).lore}
              </p>
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN - Player */}
        <div className="space-y-1 flex flex-col">
          {/* Player Avatar */}
          <div className="flex flex-col items-center relative flex-shrink-0">
            <div 
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-600 rounded-lg overflow-hidden shadow-xl mb-0.5 transition-all duration-300 ${
                playerAttacking ? 'animate-attack-player' : ''
              } ${
                playerHit ? 'animate-hit-shake' : ''
              }`}
            >
              <img 
                src={(usePlayerStore.getState().customAvatar || usePlayerStore.getState().avatar)}
                alt="Your Character"
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            
            {/* Damage Numbers for Player */}
            {[...damageNumbers].reverse().filter(d => d.isPlayer).map(dmg => (
              <div
                key={dmg.id}
                className="absolute pointer-events-none font-medieval text-xl sm:text-2xl font-bold animate-damage-float text-red-600"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(${dmg.x}px, ${dmg.y}px)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {dmg.damage}
              </div>
            ))}
            
            <h3 className="font-medieval text-xs sm:text-sm md:text-base text-teal-800 text-center">
              You
            </h3>
          </div>
          
          {/* Player Stats */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-1.5 sm:p-2 rounded-lg border-2 border-teal-600 shadow-lg flex-shrink-0">
            <h3 className="font-medieval text-xs sm:text-sm text-center text-teal-800 mb-0.5">
              Your Stats
            </h3>
            <div className="space-y-1 font-body text-brown-800 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>HP:</span>
                <span className="font-bold">{stats.hp} / {stats.maxHp}</span>
              </div>
              {/* Player HP Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden border-2 border-teal-500 mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-500 shadow-lg"
                  style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Attack:</span>
                <span className={weaponBonus > 0 ? 'font-bold text-teal-700' : ''}>
                  {stats.attack}{weaponBonus > 0 && ` +${weaponBonus}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span className={armorBonus > 0 ? 'font-bold text-teal-700' : ''}>
                  {stats.defense}{armorBonus > 0 && ` +${armorBonus}`}
                </span>
              </div>
              {critChance > 0 && (
                <div className="flex justify-between border-t border-brown-400 pt-1 mt-1">
                  <span>💥 Crit:</span>
                  <span className="font-bold text-orange-600">
                    {Math.round(critChance * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Section - Changes based on combat phase */}
      {combatPhase === 'select-attack' && (
        <div className="mt-2 flex-shrink-0">
          <h3 className="font-medieval text-sm sm:text-base text-center text-teal-900 mb-2">
            📚 Choose Your Attack Strategy
          </h3>
          <p className="text-xs text-center text-brown-700 mb-2">
            Use a basic attack, or select a special attack and answer correctly!
          </p>
          
          {/* Basic Attack Button - First Option */}
          <div className="mb-3">
            <button
              onClick={() => executeBasicAttack()}
              className="w-full bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-2 border-teal-700 hover:border-teal-800 rounded-lg p-3 text-white font-semibold transition-all hover:shadow-xl shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={stats.hp <= 0}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">⚔️</span>
                <div>
                  <div className="font-medieval text-sm">Basic Attack</div>
                  <div className="text-xs text-teal-100">No question required • 10-20 damage</div>
                </div>
              </div>
            </button>
          </div>
          
          {/* Special Attacks - Require Questions */}
          <div className="border-t border-teal-300 pt-3">
            <p className="text-xs text-center text-purple-700 mb-2 font-bold">
              ✨ Special Attacks (Answer question correctly to use)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {specialAttacks.map((attack) => {
                // Check if questions are available for this category
                const categoryData = (quizData.categories as any)[attack.category];
                const availableQuestions = categoryData?.questions?.filter(
                  (q: QuizQuestion) => !answeredQuestionIds.has(q.id)
                ) || [];
                const hasQuestions = availableQuestions.length > 0;
                
                // Calculate total damage preview
                const weaponBonus = equipment.weapon 
                  ? itemsData.find(i => i.id === equipment.weapon)?.stats?.attack || 0 
                  : 0;
                const baseAttack = stats.attack + weaponBonus;
                const totalDamage = baseAttack + attack.damage;
                
                return (
                <button
                  key={attack.id}
                  onClick={() => handleAttackSelection(attack)}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-2 border-purple-700 hover:border-purple-800 rounded-lg p-3 text-left transition-all hover:shadow-xl shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={stats.hp <= 0 || !hasQuestions}
                  title={!hasQuestions ? 'No more questions available in this category!' : ''}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{attack.icon}</span>
                    <div className="flex-1">
                      <div className="font-medieval text-sm font-bold text-white">
                        {attack.name}
                      </div>
                      <div className="text-xs text-purple-100 mt-1">
                        💥 ~{Math.floor(totalDamage * 0.9)}-{Math.floor(totalDamage * 1.1)} damage ({baseAttack} + {attack.damage})
                      </div>
                      {attack.effect && (
                        <div className="text-xs text-pink-100 mt-1">
                          ✨ {attack.effect.description}
                        </div>
                      )}
                      {!hasQuestions && (
                        <div className="text-xs text-red-200 mt-1 font-bold">
                          ⚠️ No questions left!
                        </div>
                      )}
                      {hasQuestions && (
                        <div className="text-xs text-green-200 mt-1">
                          📝 {availableQuestions.length} questions left
                        </div>
                      )}
                      <div className="text-xs text-purple-200 mt-1 italic">
                        Category: {attack.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          </div>
          
          <p className="text-xs text-center text-red-700 mt-2 font-bold">
            ⚠️ Wrong answer = You miss your attack completely!
          </p>
        </div>
      )}
      
      {combatPhase === 'answer-question' && currentQuestion && (
        <div className="mt-2 flex-shrink-0">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-3 border-yellow-600 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medieval text-base sm:text-lg text-yellow-900">
                📚 Tax Knowledge Challenge
              </h3>
              <span className="text-sm bg-yellow-200 px-3 py-1 rounded-full font-bold text-yellow-900">
                {currentQuestion.category}
              </span>
            </div>
            
            {!showExplanation ? (
              <>
                <p className="font-body text-sm sm:text-base text-brown-900 mb-4 font-bold">
                  {currentQuestion.question}
                </p>
                
                <div className="space-y-2">
                  {shuffledAnswers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(index)}
                      className="w-full bg-white hover:bg-teal-50 border-2 border-yellow-500 hover:border-teal-600 rounded-lg p-3 text-left transition-all"
                    >
                      <span className="font-body text-sm text-brown-900">
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
                        {answer.text}
                      </span>
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-center text-gray-600 mt-3 italic">
                  💡 Tip: Take your time and think carefully!
                </p>
              </>
            ) : (
              <div className={`p-4 rounded-lg border-2 ${lastAnswer?.correct ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}>
                <div className="text-center mb-3">
                  {lastAnswer?.correct ? (
                    <div>
                      <div className="text-4xl mb-2">✅</div>
                      <div className="font-medieval text-xl text-green-900 font-bold">
                        CORRECT!
                      </div>
                      <div className="text-sm text-green-800 mt-1">
                        Special attack unlocked! 🎯
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">❌</div>
                      <div className="font-medieval text-xl text-red-900 font-bold">
                        WRONG ANSWER
                      </div>
                      <div className="text-sm text-red-800 mt-1">
                        You miss your attack completely! 💨
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white p-3 rounded-lg border-2 border-gray-300 mt-3">
                  <div className="font-bold text-sm text-brown-900 mb-2">📖 Explanation:</div>
                  <p className="text-xs text-brown-800">
                    {lastAnswer?.explanation}
                  </p>
                </div>
                
                <div className="text-center mt-3 text-sm text-gray-700">
                  {lastAnswer?.correct ? 'Executing attack in 3 seconds...' : 'Enemy\'s turn in 3 seconds...'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Defense Question Phase */}
      {combatPhase === 'defend-question' && currentQuestion && (
        <div className="mt-2 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-3 border-blue-600 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medieval text-base sm:text-lg text-blue-900">
                🛡️ Defensive Challenge
              </h3>
              <span className="text-sm bg-blue-200 px-3 py-1 rounded-full font-bold text-blue-900">
                {currentQuestion.category}
              </span>
            </div>
            
            {!showExplanation ? (
              <>
                <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-3 mb-3">
                  <p className="text-sm font-bold text-orange-800 text-center">
                    ⚠️ Enemy is attacking! Answer correctly to dodge!
                  </p>
                </div>
                
                <p className="font-body text-sm sm:text-base text-brown-900 mb-4 font-bold">
                  {currentQuestion.question}
                </p>
                
                <div className="space-y-2">
                  {shuffledAnswers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(index)}
                      className="w-full bg-white hover:bg-blue-50 border-2 border-blue-500 hover:border-blue-600 rounded-lg p-3 text-left transition-all"
                    >
                      <span className="font-body text-sm text-brown-900">
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
                        {answer.text}
                      </span>
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-center text-gray-600 mt-3 italic">
                  💡 Tip: Correct answer = No damage taken!
                </p>
              </>
            ) : (
              <div className={`p-4 rounded-lg border-2 ${lastAnswer?.correct ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}>
                <div className="text-center mb-3">
                  {lastAnswer?.correct ? (
                    <div>
                      <div className="text-4xl mb-2">🛡️</div>
                      <div className="font-medieval text-xl text-green-900 font-bold">
                        DODGE SUCCESS!
                      </div>
                      <div className="text-sm text-green-800 mt-1">
                        You evade the attack completely! 💨
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">💥</div>
                      <div className="font-medieval text-xl text-red-900 font-bold">
                        DODGE FAILED
                      </div>
                      <div className="text-sm text-red-800 mt-1">
                        You get hit by the attack!
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white p-3 rounded-lg border-2 border-gray-300 mt-3">
                  <div className="font-bold text-sm text-brown-900 mb-2">📖 Explanation:</div>
                  <p className="text-xs text-brown-800">
                    {lastAnswer?.explanation}
                  </p>
                </div>
                
                <div className="text-center mt-3 text-sm text-gray-700">
                  {lastAnswer?.correct ? 'Continuing combat in 3 seconds...' : 'Taking damage in 3 seconds...'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Old Action Buttons - Removed as attacks are now quiz-based */}
      
      {/* Consumables Section - Compact */}
      {(() => {
        const consumables = inventory.filter(slot => {
          const item = itemsData.find(i => i.id === slot.itemId);
          return item?.category === 'consumable';
        });
        
        if (consumables.length === 0) return null;
        
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-1.5 sm:p-2 rounded-lg border-2 border-purple-600 mb-1 shadow-lg flex-shrink-0">
            <h3 className="font-medieval text-xs text-purple-800 mb-0.5">
              🧪 Consumables
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {consumables.map(slot => {
                const item = itemsData.find(i => i.id === slot.itemId);
                if (!item) return null;
                
                const isAtFullHP = stats.hp >= stats.maxHp;
                const isHealPotion = item.effect?.type === 'heal';
                const canUse = !isAtFullHP || !isHealPotion;
                
                return (
                  <button
                    key={slot.itemId}
                    onClick={() => {
                      const success = useItem(slot.itemId);
                      if (success) {
                        const healValue = item.effect?.value || 0;
                        addCombatLog(`You used ${item.name} and restored ${healValue} HP!`);
                        
                        // Using a consumable takes a turn - enemy attacks back!
                        setTimeout(() => {
                          // Trigger enemy attack animation
                          setEnemyAttacking(true);
                          setTimeout(() => setEnemyAttacking(false), 600);
                          
                          // Show sword clash
                          setTimeout(() => {
                            setShowSwordClash(true);
                            setTimeout(() => setShowSwordClash(false), 400);
                          }, 250);
                          
                          setTimeout(() => {
                            const enemyDamage = Math.max(1, (enemy.stats.attack + enemyBuffs.damageBoost) - totalDefense);
                            const actualEnemyDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
                            
                            takeDamage(actualEnemyDamage);
                            
                            // Trigger player hit animation and damage number
                            setPlayerHit(true);
                            showDamageNumber(actualEnemyDamage, false, true);
                            setTimeout(() => setPlayerHit(false), 500);
                            
                            addCombatLog(`${enemy.name} attacks while you used the item!`);
                            addCombatLog(`${enemy.name} deals ${actualEnemyDamage} damage to you!`);
                            
                            // Check if player defeated after using consumable
                            if (stats.hp - actualEnemyDamage <= 0) {
                              addCombatLog('💀 You have been defeated!');
                              
                              const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
                              addCombatLog(`You lost ${xpLoss} XP and were returned to the Guild Hall.`);
                              
                              // Show defeat modal
                              setDefeatPenalty({
                                xpLost: xpLoss,
                                enemyName: enemy.name,
                              });
                              setShowDefeatModal(true);
                            }
                          }, 300);
                        }, 500);
                      } else if (isAtFullHP && isHealPotion) {
                        addCombatLog(`Already at full HP!`);
                      }
                    }}
                    disabled={!canUse || stats.hp <= 0}
                    className={`p-1.5 rounded-lg border-2 text-left transition-all ${
                      canUse && stats.hp > 0
                        ? 'bg-white border-purple-600 hover:bg-purple-50 hover:border-teal-600 cursor-pointer shadow-md hover:shadow-lg'
                        : 'bg-gray-200 border-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="font-body">
                      <div className="font-bold text-xs text-brown-900">{item.name}</div>
                      <div className="text-xs text-brown-700">
                        {item.effect?.type === 'heal' && `+${item.effect.value} HP`}
                        {item.effect?.type === 'damage' && `${item.effect.value} DMG`}
                      </div>
                      <div className="text-xs text-purple-700 font-bold">
                        x{slot.quantity}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}
      
      {/* Combat Log - Compact */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-1.5 sm:p-2 rounded-lg h-12 sm:h-16 overflow-y-auto border-2 border-teal-600 shadow-inner flex-shrink-0">
        <div className="text-teal-50 font-body text-xs leading-tight">
          {[...combatLog].reverse().map((log, idx) => (
            <div key={idx}>
              {log}
            </div>
          ))}
        </div>
      </div>
      
      {/* Battle Rewards Modal */}
      <BattleRewardsModal
        isOpen={showRewardsModal}
        onClose={() => {
          setShowRewardsModal(false);
          endEncounter(true); // Exit combat after viewing rewards
        }}
        xpGained={battleRewards.xp}
        goldGained={battleRewards.gold}
        itemsGained={battleRewards.items}
        enemyName={battleRewards.enemyName}
      />
      
      {/* Battle Defeat Modal */}
      <BattleDefeatModal
        isOpen={showDefeatModal}
        onClose={() => {
          setShowDefeatModal(false);
          handleDeath(); // Apply death penalties
          endEncounter(false); // Exit combat, return to Guild Hall
        }}
        xpLost={defeatPenalty.xpLost}
        enemyName={defeatPenalty.enemyName}
      />
      
      {/* Boss Victory Modal (for ARIM) */}
      <BossVictoryModal
        isOpen={showBossVictoryModal}
        onClose={() => {
          setShowBossVictoryModal(false);
          endEncounter(true); // Exit combat after viewing boss victory
        }}
        bossName={bossVictoryData.bossName}
        xpGained={bossVictoryData.xp}
        goldGained={bossVictoryData.gold}
        itemsGained={bossVictoryData.items}
      />
          </div>
        </div>
      </div>
    </div>
  );
};
