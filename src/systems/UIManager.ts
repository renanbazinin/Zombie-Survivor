import type { Game } from '../core/Game.js';
import { SMG } from '../weapons/SMG.js';
import { Shotgun } from '../weapons/Shotgun.js';

interface UpgradeOption {
    name: string;
    description: string;
    apply: (game: Game) => void;
}

/**
 * Manages UI elements and level-up screen
 */
export class UIManager {
    private levelUpModalVisible: boolean = false;
    private gameOverVisible: boolean = false;

    update(game: Game): void {
        this.updateHUD(game);
    }

    private updateHUD(game: Game): void {
        // Update HP bar
        const hpText = document.getElementById('hpText');
        const hpBar = document.getElementById('hpBar');
        if (hpText && hpBar) {
            hpText.textContent = Math.ceil(game.player.stats.hp).toString();
            hpBar.style.width = `${game.player.getHpPercent() * 100}%`;
        }

        // Update XP bar
        const levelText = document.getElementById('levelText');
        const xpBar = document.getElementById('xpBar');
        if (levelText && xpBar) {
            levelText.textContent = game.player.level.toString();
            xpBar.style.width = `${game.player.getXpPercent() * 100}%`;
        }

        // Update kills
        const killsText = document.getElementById('killsText');
        if (killsText) {
            killsText.textContent = game.player.kills.toString();
        }

        // Update timer
        const timer = document.getElementById('timer');
        if (timer) {
            timer.textContent = game.waveManager.getFormattedTime();
        }
    }

    showLevelUpModal(game: Game): void {
        if (this.levelUpModalVisible) return;
        
        this.levelUpModalVisible = true;
        game.paused = true;

        const options = this.generateUpgradeOptions(game);
        
        const modal = this.createLevelUpModal(options, game);
        const ui = document.getElementById('ui');
        if (ui) {
            ui.appendChild(modal);
        }
    }

    private createLevelUpModal(options: UpgradeOption[], game: Game): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'levelup-modal';
        
        const title = document.createElement('div');
        title.className = 'levelup-title';
        title.textContent = 'LEVEL UP!';
        modal.appendChild(title);

        for (const option of options) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'upgrade-option';
            
            const name = document.createElement('div');
            name.className = 'upgrade-name';
            name.textContent = option.name;
            optionDiv.appendChild(name);
            
            const desc = document.createElement('div');
            desc.className = 'upgrade-desc';
            desc.textContent = option.description;
            optionDiv.appendChild(desc);
            
            optionDiv.addEventListener('click', () => {
                option.apply(game);
                this.closeLevelUpModal(game);
            });
            
            modal.appendChild(optionDiv);
        }

        return modal;
    }

    private closeLevelUpModal(game: Game): void {
        const modal = document.querySelector('.levelup-modal');
        if (modal) {
            modal.remove();
        }
        
        this.levelUpModalVisible = false;
        game.paused = false;
    }

    private generateUpgradeOptions(game: Game): UpgradeOption[] {
        const options: UpgradeOption[] = [];
        
        // Upgrade existing weapons
        for (const weapon of game.player.weapons) {
            if (weapon.level < 5) {
                options.push({
                    name: `${weapon.name} Level ${weapon.level + 1}`,
                    description: weapon.getUpgradeDescription(),
                    apply: () => weapon.upgrade()
                });
            }
        }

        // Add new weapons if player doesn't have them
        const hasSmg = game.player.weapons.some(w => w.name === 'SMG');
        const hasShotgun = game.player.weapons.some(w => w.name === 'Shotgun');

        if (!hasSmg) {
            options.push({
                name: 'SMG',
                description: 'High fire rate, moderate damage',
                apply: (g) => {
                    const smg = new SMG(g.player);
                    g.player.addWeapon(smg);
                }
            });
        }

        if (!hasShotgun) {
            options.push({
                name: 'Shotgun',
                description: 'Cone burst, high damage',
                apply: (g) => {
                    const shotgun = new Shotgun(g.player);
                    g.player.addWeapon(shotgun);
                }
            });
        }

        // Add stat upgrades
        options.push({
            name: '+10% Move Speed',
            description: 'Move faster',
            apply: (g) => {
                g.player.stats.moveSpeed *= 1.1;
            }
        });

        options.push({
            name: '+20 Max HP',
            description: 'Increase maximum health',
            apply: (g) => {
                g.player.stats.maxHp += 20;
                g.player.stats.hp += 20;
            }
        });

        options.push({
            name: '+1 Armor',
            description: 'Reduce damage taken',
            apply: (g) => {
                g.player.stats.armor += 1;
            }
        });

        // Shuffle and return 3 options
        const shuffled = options.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    showGameOver(game: Game, victory: boolean): void {
        if (this.gameOverVisible) return;
        
        this.gameOverVisible = true;
        game.paused = true;

        const modal = document.createElement('div');
        modal.className = victory ? 'game-over victory' : 'game-over';
        
        const title = document.createElement('div');
        title.className = 'game-over-title';
        title.textContent = victory ? 'VICTORY!' : 'GAME OVER';
        modal.appendChild(title);

        const stats = document.createElement('div');
        stats.style.color = victory ? '#00ff00' : '#ff0000';
        stats.style.fontSize = '20px';
        stats.style.marginTop = '20px';
        stats.innerHTML = `
            Time Survived: ${game.waveManager.getFormattedTime()}<br>
            Kills: ${game.player.kills}<br>
            Level Reached: ${game.player.level}
        `;
        modal.appendChild(stats);

        const restartBtn = document.createElement('button');
        restartBtn.className = 'restart-btn';
        restartBtn.textContent = 'Restart';
        restartBtn.addEventListener('click', () => {
            window.location.reload();
        });
        modal.appendChild(restartBtn);

        const ui = document.getElementById('ui');
        if (ui) {
            ui.appendChild(modal);
        }
    }
}


