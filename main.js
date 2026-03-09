document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIManager();
    const game = new GameState(ui);

    // Play background music on first interaction (browser policy requires interaction)
    const bgm = document.getElementById('bgm');
    const startAudio = () => {
        if (bgm && bgm.paused) {
            bgm.play().catch(e => console.log("Audio play prevented by browser:", e));
        }
        document.removeEventListener('pointerdown', startAudio);
        document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('pointerdown', startAudio);
    document.addEventListener('keydown', startAudio);

    document.getElementById('restart-btn').addEventListener('click', () => {
        game.restartLevel();
    });

    document.getElementById('retry-btn').addEventListener('click', () => {
        game.restartLevel();
    });

    document.getElementById('next-level-btn').addEventListener('click', () => {
        game.nextLevel();
    });

    document.getElementById('hint-btn').addEventListener('click', () => {
        game.useHint();
    });

    document.getElementById('level-btn').addEventListener('click', () => {
        game.ui.showLevelSelect(game.maxUnlockedLevel, game.currentLevelIndex, (levelIndex) => {
            game.loadLevel(levelIndex);
        });
    });

    document.getElementById('close-levels-btn').addEventListener('click', () => {
        game.ui.hideModals();
    });

    game.init();
});
