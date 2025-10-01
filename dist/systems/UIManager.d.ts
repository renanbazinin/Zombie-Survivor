import type { Game } from '../core/Game.js';
/**
 * Manages UI elements and level-up screen
 */
export declare class UIManager {
    private levelUpModalVisible;
    private gameOverVisible;
    update(game: Game): void;
    private updateHUD;
    showLevelUpModal(game: Game): void;
    private createLevelUpModal;
    private closeLevelUpModal;
    private generateUpgradeOptions;
    showGameOver(game: Game, victory: boolean): void;
}
//# sourceMappingURL=UIManager.d.ts.map