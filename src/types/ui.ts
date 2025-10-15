export type GameMode = 'explore' | 'combat' | 'market' | 'quest' | 'character';

export type ModalType = 'none' | 'levelup' | 'questComplete' | 'gameOver';

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}
