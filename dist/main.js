import { Game } from './core/Game.js';
/**
 * Entry point for the game
 */
function main() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Could not find game canvas');
        return;
    }
    // Create and start the game
    const game = new Game(canvas);
    game.start();
    console.log('Zombie Survivor - Game Started!');
    console.log('Controls:');
    console.log('- WASD or Arrow Keys: Move');
    console.log('- Space: Dash');
}
// Start the game when the page loads
window.addEventListener('load', main);
//# sourceMappingURL=main.js.map