class UIManager {
    constructor() {
        this.levelDisplay = document.getElementById('level-display');
        this.coinsDisplay = document.getElementById('coins-display');
        this.slotsWrapper = document.getElementById('slots-wrapper');
        this.victoryModal = document.getElementById('modal-victory');
        this.gameoverModal = document.getElementById('modal-gameover');
        this.levelSelectModal = document.getElementById('modal-levelselect');
        this.theEndModal = document.getElementById('modal-the-end');
        this.levelGrid = document.getElementById('level-grid');
    }

    updateHeader(level, coins) {
        this.levelDisplay.innerText = level;
        this.coinsDisplay.innerText = coins;
    }

    renderSlots(capacity, filledScrews) {
        this.slotsWrapper.innerHTML = '';
        for (let i = 0; i < capacity; i++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            if (i < filledScrews.length) {
                const screwItem = filledScrews[i];
                const screwVisual = document.createElement('div');
                screwVisual.className = 'screw-icon';
                screwVisual.style.setProperty('--screw-normal', this.getScrewColor(screwItem.type, screwItem.colorId));
                slot.appendChild(screwVisual);
            }
            this.slotsWrapper.appendChild(slot);
        }
    }

    getScrewColor(type, colorId) {
        if (colorId) return colorId;
        const colors = {
            'normal': '#cbd5e1',
            'locked': '#dc2626',
            'frozen': '#38bdf8',
            'timed': '#f59e0b'
        };
        return colors[type] || colors['normal'];
    }

    showVictory() {
        this.victoryModal.classList.remove('hidden');
    }

    showGameOver() {
        this.gameoverModal.classList.remove('hidden');
    }

    showTheEnd() {
        this.hideModals();
        this.theEndModal.classList.remove('hidden');
    }

    hideModals() {
        this.victoryModal.classList.add('hidden');
        this.gameoverModal.classList.add('hidden');
        this.levelSelectModal.classList.add('hidden');
        if (this.theEndModal) this.theEndModal.classList.add('hidden');
    }

    showLevelSelect(maxLevel, currentLevel, onSelectCallback) {
        this.levelGrid.innerHTML = '';
        const TOTAL_LEVELS = 20;
        for (let i = 0; i < TOTAL_LEVELS; i++) { // Show exactly 10 slots
            let btn = document.createElement('div');
            btn.className = 'level-btn';
            btn.innerText = i + 1;

            if (i > maxLevel) {
                btn.classList.add('locked');
            } else {
                btn.onclick = () => onSelectCallback(i);
            }

            this.levelGrid.appendChild(btn);
        }
        this.hideModals();
        this.levelSelectModal.classList.remove('hidden');
    }
}
