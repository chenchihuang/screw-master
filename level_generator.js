function generateLevel(levelIndex) {
    // Determine level difficulty parameters
    let difficulty = Math.min(levelIndex / 20, 1.0); // 0 to 1 scaling
    let numPlates = 2 + Math.floor(difficulty * 5); // 2 to 7 plates
    let numScrews = numPlates * 2 + Math.floor(difficulty * 3);
    let slots = Math.max(3, 6 - Math.floor(difficulty * 3)); // 6 down to 3

    let w = window.innerWidth || 500;
    let h = window.innerHeight || 800;
    let cx = w / 2;

    let plates = [];
    let screws = [];

    // Colors available based on difficulty
    const palette = ['red', 'blue', 'green', 'yellow', 'purple'];
    let numColors = 2 + Math.floor(difficulty * 3);
    numColors = Math.min(numColors, palette.length);
    let activeColors = palette.slice(0, numColors);

    // Procedural generation logic is tricky for constraints, 
    // a simple tower logic
    for (let i = 0; i < numPlates; i++) {
        let width = 100 + Math.random() * 100;
        let height = 30 + Math.random() * 20;
        let pId = 'p' + i;
        
        plates.push({
            id: pId,
            type: 'rect',
            x: cx + (Math.random() - 0.5) * 100, // Small jiggle around center
            y: 200 + i * 60, // Stack them up
            w: width,
            h: height,
            color: '#fcd34d' // Wood-like color
        });

        // Add 2 screws per plate basically
        let color = activeColors[Math.floor(Math.random() * activeColors.length)];
        
        screws.push({
            id: 's' + i + 'a',
            type: (Math.random() < 0.2 && difficulty > 0.5) ? 'frozen' : 'normal',
            colorId: color,
            x: cx - width/2 + 10 + Math.random()*20,
            y: 200 + i * 60,
            plates: [pId] // PIN to background
        });

        color = activeColors[Math.floor(Math.random() * activeColors.length)];
        screws.push({
            id: 's' + i + 'b',
            type: 'normal',
            colorId: color,
            x: cx + width/2 - 10 - Math.random()*20,
            y: 200 + i * 60,
            plates: [pId] // PIN to background
        });

        // Random overlap screw if not first plate
        if (i > 0 && Math.random() > 0.5) {
            let prevP = 'p' + (i - 1);
            color = activeColors[Math.floor(Math.random() * activeColors.length)];
            screws.push({
                id: 's' + i + 'c',
                type: 'normal',
                colorId: color,
                x: cx + (Math.random() - 0.5) * 40,
                y: 200 + i * 60 - 30, // between two plates roughly
                plates: [prevP, pId]
            });
        }
    }

    // Ensure screws is a multiple of 3 per color to be solvable
    let colorCounts = {};
    screws.forEach(s => {
        colorCounts[s.colorId] = (colorCounts[s.colorId] || 0) + 1;
    });

    // Make up the differences
    for (let c in colorCounts) {
        let remainder = colorCounts[c] % 3;
        if (remainder !== 0) {
            let needed = 3 - remainder;
            for (let k = 0; k < needed; k++) {
                // Just add it to a random plate to be safe
                let randomPlate = plates[Math.floor(Math.random() * plates.length)];
                screws.push({
                    id: 's_pad_' + c + '_' + k,
                    type: 'normal',
                    colorId: c,
                    x: randomPlate.x + (Math.random() - 0.5) * randomPlate.w,
                    y: randomPlate.y,
                    plates: [randomPlate.id]
                });
            }
        }
    }

    return {
        slots: slots + 1, // Reduced from +2 to +1 for higher difficulty
        plates: plates,
        screws: screws
    };
}
