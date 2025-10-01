# Zombie Survivor

A top-down zombie survival game built with TypeScript. Fight off hordes of zombies, level up, and choose powerful upgrades to survive as long as possible!

## Features

- **Fast-paced Action**: Move to kite hordes while your weapons auto-fire
- **Progression System**: Collect XP, level up, and choose from 3 upgrade options
- **Multiple Weapons**: Start with SMG, unlock Shotgun and more
- **Wave-based Spawning**: Enemies intensify over time with boss encounters
- **Dash Ability**: Short invulnerable burst to escape danger
- **Clean OOP Architecture**: Modular TypeScript codebase with best practices

## Controls

- **WASD** or **Arrow Keys**: Move
- **Space**: Dash (short invulnerable burst)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start a local server:
```bash
npm run serve
```

4. Open your browser to `http://localhost:8080`

## Development

Watch mode for auto-compilation:
```bash
npm run watch
```

## Project Structure

```
src/
├── core/           # Core engine classes
│   ├── Game.ts     # Main game loop and state
│   ├── Entity.ts   # Base entity class
│   ├── Vector2D.ts # 2D vector math
│   ├── Camera.ts   # Camera system
│   └── InputManager.ts # Input handling
├── entities/       # Game entities
│   ├── Player.ts   # Player character
│   ├── Enemy.ts    # Base enemy class
│   ├── enemies/    # Enemy types
│   │   ├── Walker.ts
│   │   ├── Runner.ts
│   │   └── Boss.ts
│   ├── Projectile.ts # Projectiles
│   └── Pickup.ts   # Collectible items
├── weapons/        # Weapon system
│   ├── Weapon.ts   # Base weapon class
│   ├── SMG.ts      # SMG weapon
│   └── Shotgun.ts  # Shotgun weapon
├── systems/        # Game systems
│   ├── WaveManager.ts # Enemy spawning
│   └── UIManager.ts   # UI and level-up
└── main.ts         # Entry point
```

## Gameplay

### Objective
Survive for 7 minutes against increasingly difficult waves of zombies!

### Characters
- **Ranger**: +10% move speed, starts with SMG

### Weapons
- **SMG**: High fire rate, moderate damage, good for crowds
- **Shotgun**: Cone burst, high damage, great for close range

### Enemies
- **Walker**: Slow, durable baseline zombie
- **Runner**: Fast, low HP, spawns in bursts
- **Boss (The Butcher)**: Appears at 3:00, high HP and damage

### Progression
- Kill zombies to drop XP gems
- Level up to choose from 3 random upgrades:
  - Upgrade existing weapons
  - Unlock new weapons
  - Improve stats (move speed, max HP, armor)

## Future Enhancements (v0.2+)

- More weapons (Flamethrower, Lightning Rod, Boomerang)
- Passive abilities (Hollow Points, Fleet Feet, Vampirism)
- Weapon synergies
- More enemy types (Spitter, Brute, Boomer)
- Meta progression system
- Sound effects and music
- Particle effects
- More bosses

## License

MIT


