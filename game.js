class GameState {
    constructor(uiManager) {
        this.ui = uiManager;
        this.currentLevelIndex = 0;
        this.coins = 0;

        this.levelData = null;
        this.filledSlots = [];
        this.maxSlots = 0;

        this.state = 'idle';
        this.maxUnlockedLevel = 0;
        this.loadProgress();
    }

    loadProgress() {
        let saved = localStorage.getItem('screwMasterProgress');
        if (saved) {
            try {
                let data = JSON.parse(saved);
                this.maxUnlockedLevel = data.maxUnlockedLevel || 0;
                this.coins = data.coins || 0;
            } catch (e) { }
        }
    }

    saveProgress() {
        localStorage.setItem('screwMasterProgress', JSON.stringify({
            maxUnlockedLevel: this.maxUnlockedLevel,
            coins: this.coins
        }));
    }

    init() {
        this.physics = new PhysicsEngine('canvas-wrapper');

        let canvasWrapper = document.getElementById('canvas-wrapper');
        canvasWrapper.addEventListener('pointerdown', (e) => {
            if (this.state !== 'playing') return;
            let rect = canvasWrapper.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            this.handleInteraction(x, y);
        });

        Matter.Events.on(this.physics.engine, 'afterUpdate', () => {
            if (this.state === 'playing') {
                if (this.physics.checkWin()) {
                    this.winLevel();
                }
            }
        });

        this.loadLevel(this.currentLevelIndex);
    }

    loadLevel(index) {
        this.currentLevelIndex = index;
        this.colorOrderIndex = 0;
        if (index < Levels.length) {
            this.levelData = Levels[index];
        } else {
            // Generate dynamically if beyond predefined
            this.levelData = generateLevel(index);
        }

        this.maxSlots = this.levelData.slots;
        this.filledSlots = [];
        this.state = 'playing';

        this.ui.updateHeader(this.currentLevelIndex + 1, this.coins);
        this.ui.renderSlots(this.maxSlots, this.filledSlots);
        this.ui.hideModals();

        this.physics.loadLevel(this.levelData);
    }

    handleInteraction(x, y) {
        let screw = this.physics.getScrewAt(x, y);
        if (!screw) return;

        // Handle special screws BEFORE adding to slots
        if (screw.data.type === 'locked') {
            // Check if it can be unlocked
            let canUnlock = true;
            if (screw.data.unlockBy) {
                screw.data.unlockBy.forEach(id => {
                    if (this.physics.screws[id]) canUnlock = false; // The unlocking screw is still in the physics world
                });
            }
            if (!canUnlock) {
                // Shake effect or sound (to do)
                return; // Cannot click
            }
        }

        if (screw.data.type === 'frozen') {
            // First click thaws it
            screw.data.type = 'normal';
            screw.body.render.fillStyle = this.physics.getScrewColor('normal', screw.data.colorId);
            return; // Don't add to slots yet
        }

        if (screw.data.type === 'rusted') {
            // Needs multiple hits
            if (!screw.data.hits) screw.data.hits = 2;
            screw.data.hits--;
            if (screw.data.hits > 0) {
                // Change color slightly to show it's loosening
                screw.body.render.fillStyle = '#b45309';
                return;
            }
            // Once broken, turns to normal for slot logic
            screw.data.type = 'normal';
        }

        if (screw.data.type === 'magnetic') {
            // Cannot remove if too many screws still in world (magnetically stuck)
            let totalScrews = Object.keys(this.physics.screws).length;
            if (totalScrews > 5) { // Simple "too much magnetism" logic
                alert("磁力太強，請先拆除其他非磁性螺絲！");
                return;
            }
        }

        if (screw.data.type === 'color_lock') {
            // Must follow order defined in level
            if (this.levelData.colorOrder) {
                let targetColor = this.levelData.colorOrder[this.colorOrderIndex || 0];
                if (screw.data.colorId !== targetColor) {
                    alert(`順序錯誤！請先尋找 ${targetColor} 色螺絲。`);
                    return;
                }
                // Correct color, advance index if it was a match color
                // (Index will be handled during resolution or here)
            }
        }

        if (this.filledSlots.length < this.maxSlots) {
            // Spring effect
            if (screw.data.type === 'spring') {
                this.physics.applyImpulse(screw.body.position.x, screw.body.position.y, 15);
            }

            // Handle color lock index tracking (only if all of current color are gone)
            if (screw.data.type === 'color_lock') {
                // Remove screw from physics world manually before check
                this.physics.removeScrew(screw.data.id);

                // Check if any screws of the SAME color_lock type and SAME color are still there
                let remains = Object.values(this.physics.screws).some(s =>
                    s.data.type === 'color_lock' && s.data.colorId === screw.data.colorId
                );

                if (!remains) {
                    this.colorOrderIndex = (this.colorOrderIndex || 0) + 1;
                }
            } else {
                this.physics.removeScrew(screw.data.id);
            }

            this.filledSlots.push({
                type: screw.data.type,
                id: screw.data.id,
                colorId: screw.data.colorId || screw.data.type
            });
            this.ui.renderSlots(this.maxSlots, this.filledSlots);

            this.resolveSlots();

            if (this.filledSlots.length >= this.maxSlots) {
                setTimeout(() => {
                    if (this.state === 'playing' && this.filledSlots.length >= this.maxSlots) {
                        if (!this.physics.checkWin()) {
                            this.loseLevel();
                        }
                    }
                }, 2000); // Wait 2s to check if win condition met after falling
            }
        }
    }

    resolveSlots() {
        // Find 3 screws of the SAME color/type
        let counts = {};
        for (let i = 0; i < this.filledSlots.length; i++) {
            let s = this.filledSlots[i];
            counts[s.colorId] = (counts[s.colorId] || 0) + 1;
        }

        let toRemove = null;
        for (let type in counts) {
            if (counts[type] >= 3) {
                toRemove = type;
                break;
            }
        }

        if (toRemove) {
            // Remove exactly 3 of that type
            let removedCount = 0;
            this.filledSlots = this.filledSlots.filter(s => {
                if (s.colorId === toRemove && removedCount < 3) {
                    removedCount++;
                    return false; // drop it
                }
                return true; // keep it
            });

            // Re-render
            this.ui.renderSlots(this.maxSlots, this.filledSlots);

            // Give 10 coins for matching
            this.coins += 10;
            this.ui.updateHeader(this.currentLevelIndex + 1, this.coins);
        }
    }

    winLevel() {
        this.state = 'won';
        this.coins += 50;
        this.ui.updateHeader(this.currentLevelIndex + 1, this.coins);
        this.saveProgress();

        // Check for Final Level (Level 20 = Index 19)
        if (this.currentLevelIndex === 19) {
            const endingSound = document.getElementById('ending-sound');
            if (endingSound) {
                // Pause BGM if playing
                const bgm = document.getElementById('bgm');
                if (bgm) bgm.pause();

                endingSound.play().catch(e => console.log("Ending sound prevented:", e));
            }
            this.ui.showTheEnd();
        } else {
            this.ui.showVictory();
        }
    }

    loseLevel() {
        this.state = 'over';
        const deathSound = document.getElementById('death-sound');
        if (deathSound) {
            deathSound.play().catch(e => console.log("Death sound play prevented:", e));
        }
        this.ui.showGameOver();
    }

    restartLevel() {
        this.loadLevel(this.currentLevelIndex);
    }

    nextLevel() {
        let next = this.currentLevelIndex + 1;
        if (next > this.maxUnlockedLevel) {
            this.maxUnlockedLevel = next;
            this.saveProgress();
        }
        this.loadLevel(next);
    }

    useHint() {
        if (this.coins >= 20) {
            this.coins -= 20;
            this.ui.updateHeader(this.currentLevelIndex + 1, this.coins);
            alert("已使用提示！請尋找最容易脫落（連接螺絲最少）的板子。");
        }
    }
}
