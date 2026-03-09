const Levels = [
    {
        // Level 1: 教學關 (3 顆螺絲，1 塊木板，無障礙)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 300, w: 200, h: 50, color: '#fcd34d' }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'red', x: 180, y: 300, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'red', x: 250, y: 300, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'red', x: 320, y: 300, plates: ['p1'] }
        ]
    },
    {
        // Level 2: 兩塊板 (5 顆螺絲，2 塊木板重疊，學會順序)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 300, w: 220, h: 50, color: '#fcd34d' },
            { id: 'p2', type: 'rect', x: 250, y: 300, w: 40, h: 200, color: '#f87171' }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'blue', x: 180, y: 300, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'blue', x: 320, y: 300, plates: ['p1'] },

            { id: 's3', type: 'normal', colorId: 'green', x: 250, y: 220, plates: ['p2'] },
            { id: 's4', type: 'normal', colorId: 'green', x: 250, y: 380, plates: ['p2'] },
            { id: 's_center', type: 'normal', colorId: 'blue', x: 250, y: 300, plates: ['p1', 'p2'] } // 先拆上層 p2 才能拆 p1
        ]
    },
    {
        // Level 3: 螺絲槽限制 (6 顆螺絲，只有 3 個槽位，規劃順序)
        slots: 3,
        plates: [
            { id: 'p1', type: 'rect', x: 150, y: 300, w: 100, h: 50, color: '#34d399' },
            { id: 'p2', type: 'rect', x: 350, y: 300, w: 100, h: 50, color: '#60a5fa' }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'red', x: 120, y: 300, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'blue', x: 150, y: 300, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'red', x: 180, y: 300, plates: ['p1'] },

            { id: 's4', type: 'normal', colorId: 'blue', x: 320, y: 300, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'red', x: 350, y: 300, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'blue', x: 380, y: 300, plates: ['p2'] }
        ]
    },
    {
        // Level 4: 重力掉落 (T 型支撐，拔掉會掉落)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 200, w: 200, h: 40, color: '#fcd34d' }, // 上方橫板
            { id: 'p2', type: 'rect', x: 250, y: 350, w: 40, h: 260, color: '#f87171' }  // 下方直柱
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'yellow', x: 250, y: 200, plates: ['p1', 'p2'] }, // 支撐點
            { id: 's2', type: 'normal', colorId: 'yellow', x: 180, y: 200, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'yellow', x: 320, y: 200, plates: ['p1'] },

            { id: 's4', type: 'normal', colorId: 'purple', x: 250, y: 280, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'purple', x: 250, y: 360, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'purple', x: 250, y: 440, plates: ['p2'] }
        ]
    },
    {
        // Level 5: 顏色螺絲 (紅藍螺絲)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 250, w: 200, h: 50, color: '#fcd34d' },
            { id: 'p2', type: 'rect', x: 250, y: 400, w: 200, h: 50, color: '#f87171' }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'red', x: 180, y: 250, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'blue', x: 250, y: 250, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'red', x: 320, y: 250, plates: ['p1'] },

            { id: 's4', type: 'normal', colorId: 'blue', x: 180, y: 400, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'red', x: 250, y: 400, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'blue', x: 320, y: 400, plates: ['p2'] }
        ]
    },
    {
        // Level 6: 鎖定螺絲 (locked, 需要先拔其他)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 300, w: 200, h: 50, color: '#60a5fa' },
            { id: 'p2', type: 'rect', x: 250, y: 450, w: 200, h: 50, color: '#34d399' }
        ],
        screws: [
            { id: 's1', type: 'locked', colorId: 'green', x: 180, y: 300, plates: ['p1'], unlockBy: ['s4'] },
            { id: 's2', type: 'locked', colorId: 'green', x: 320, y: 300, plates: ['p1'], unlockBy: ['s6'] },
            { id: 's3', type: 'normal', colorId: 'green', x: 250, y: 300, plates: ['p1'] },

            { id: 's4', type: 'normal', colorId: 'yellow', x: 180, y: 450, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'yellow', x: 250, y: 450, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'yellow', x: 320, y: 450, plates: ['p2'] }
        ]
    },
    {
        // Level 7: 旋轉板 (pivot 屬性)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 300, w: 260, h: 40, color: '#fcd34d', pivot: { rx: 0, ry: 0 } }, // 中心固定可旋轉
            { id: 'p2', type: 'rect', x: 150, y: 450, w: 100, h: 40, color: '#f87171' },
            { id: 'p3', type: 'rect', x: 350, y: 450, w: 100, h: 40, color: '#60a5fa' }
        ],
        screws: [
            // 旋轉板上的螺絲 (因為有 pivot, 取下這些不影響它掉落，但他會轉)
            { id: 's1', type: 'normal', colorId: 'red', x: 150, y: 300, plates: ['p1'] },   // 左側
            { id: 's2', type: 'normal', colorId: 'blue', x: 350, y: 300, plates: ['p1'] },  // 右側
            { id: 's3', type: 'normal', colorId: 'green', x: 200, y: 300, plates: ['p1'] }, // 偏左
            { id: 's4', type: 'normal', colorId: 'red', x: 300, y: 300, plates: ['p1'] },  // 偏右

            // 底下普通的板子
            { id: 's5', type: 'normal', colorId: 'blue', x: 120, y: 450, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'red', x: 180, y: 450, plates: ['p2'] },

            { id: 's7', type: 'normal', colorId: 'blue', x: 320, y: 450, plates: ['p3'] },
            { id: 's8', type: 'normal', colorId: 'green', x: 380, y: 450, plates: ['p3'] },
            { id: 's9', type: 'normal', colorId: 'green', x: 250, y: 300, plates: ['p1'] } // 轉軸處
        ]
    },
    {
        // Level 8: 隱藏螺絲 (多層結構遮擋)
        slots: 4,
        plates: [
            { id: 'p3', type: 'rect', x: 250, y: 350, w: 200, h: 200, color: '#60a5fa' }, // 底層大板
            { id: 'p2', type: 'rect', x: 250, y: 350, w: 150, h: 150, color: '#34d399' }, // 中層
            { id: 'p1', type: 'rect', x: 250, y: 350, w: 100, h: 100, color: '#fcd34d' }  // 頂層小板
        ],
        screws: [
            // 頂層螺絲
            { id: 's1', type: 'normal', colorId: 'red', x: 250, y: 350, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'blue', x: 250, y: 315, plates: ['p1', 'p2'] },
            { id: 's3', type: 'normal', colorId: 'yellow', x: 250, y: 385, plates: ['p1', 'p2'] },

            // 中層螺絲 (被頂層蓋住部分)
            { id: 's4', type: 'normal', colorId: 'red', x: 200, y: 350, plates: ['p2', 'p3'] },
            { id: 's5', type: 'normal', colorId: 'blue', x: 300, y: 350, plates: ['p2', 'p3'] },
            { id: 's6', type: 'normal', colorId: 'yellow', x: 200, y: 300, plates: ['p2', 'p3'] },

            // 底層螺絲
            { id: 's7', type: 'normal', colorId: 'red', x: 180, y: 280, plates: ['p3'] },
            { id: 's8', type: 'normal', colorId: 'blue', x: 320, y: 280, plates: ['p3'] },
            { id: 's9', type: 'normal', colorId: 'yellow', x: 180, y: 420, plates: ['p3'] }
        ]
    },
    {
        // Level 9: 機關關卡 (滑塊遮擋)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 250, w: 200, h: 40, color: '#fcd34d' },
            { id: 'p2', type: 'rect', x: 250, y: 400, w: 200, h: 40, color: '#f87171' },
            { id: 'p_slider', type: 'rect', x: 250, y: 325, w: 150, h: 30, color: '#9ca3af', isSlider: true, slideRange: 80, slideSpeed: 3 } // 滑塊
        ],
        screws: [
            // 上方板子，部分螺絲會被滑塊擋住 (滑塊在 y: 325，所以可能擋到 p1 的下面或 p2 的上面)
            { id: 's1', type: 'normal', colorId: 'green', x: 180, y: 250, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'purple', x: 250, y: 250, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'green', x: 320, y: 250, plates: ['p1'] },

            { id: 's4', type: 'normal', colorId: 'purple', x: 180, y: 400, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'green', x: 250, y: 400, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'purple', x: 320, y: 400, plates: ['p2'] },

            // 隨機補色
            { id: 's7', type: 'normal', colorId: 'yellow', x: 220, y: 250, plates: ['p1'] },
            { id: 's8', type: 'normal', colorId: 'yellow', x: 280, y: 250, plates: ['p1'] },
            { id: 's9', type: 'normal', colorId: 'yellow', x: 220, y: 400, plates: ['p2'] }
        ]
    },
    {
        // Level 10: Boss關 (15-20顆螺絲，3層，顏色＋鎖定＋旋轉)
        slots: 5,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 200, w: 260, h: 40, color: '#fcd34d', pivot: { rx: 0, ry: 0 } }, // 頂部旋轉
            { id: 'p2', type: 'rect', x: 250, y: 350, w: 300, h: 50, color: '#f87171' }, // 中層
            { id: 'p3', type: 'rect', x: 250, y: 500, w: 300, h: 50, color: '#60a5fa' }, // 底層
            { id: 'p4', type: 'rect', x: 250, y: 350, w: 60, h: 200, color: '#34d399' }  // 垂直卡榫
        ],
        screws: [
            // 第一層旋轉板
            { id: 's1', type: 'normal', colorId: 'red', x: 150, y: 200, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'blue', x: 350, y: 200, plates: ['p1'] },
            { id: 's3', type: 'locked', colorId: 'yellow', x: 250, y: 200, plates: ['p1', 'p4'], unlockBy: ['s15'] },

            // 垂直卡榫 p4
            { id: 's4', type: 'normal', colorId: 'green', x: 250, y: 300, plates: ['p4'] },
            { id: 's5', type: 'normal', colorId: 'purple', x: 250, y: 400, plates: ['p4'] },

            // 中層 p2
            { id: 's6', type: 'locked', colorId: 'red', x: 150, y: 350, plates: ['p2'], unlockBy: ['s1'] },
            { id: 's7', type: 'normal', colorId: 'blue', x: 200, y: 350, plates: ['p2'] },
            { id: 's8', type: 'frozen', colorId: 'green', x: 300, y: 350, plates: ['p2'] },
            { id: 's9', type: 'normal', colorId: 'yellow', x: 350, y: 350, plates: ['p2'] },

            // 底層 p3
            { id: 's10', type: 'locked', colorId: 'blue', x: 150, y: 500, plates: ['p3'], unlockBy: ['s2'] },
            { id: 's11', type: 'normal', colorId: 'purple', x: 200, y: 500, plates: ['p3'] },
            { id: 's12', type: 'frozen', colorId: 'yellow', x: 300, y: 500, plates: ['p3'] },
            { id: 's13', type: 'normal', colorId: 'red', x: 350, y: 500, plates: ['p3'] },

            // 混色與補足數量
            { id: 's14', type: 'normal', colorId: 'green', x: 120, y: 350, plates: ['p2'] },
            { id: 's15', type: 'normal', colorId: 'purple', x: 380, y: 350, plates: ['p2'] },
            { id: 's16', type: 'normal', colorId: 'red', x: 120, y: 500, plates: ['p3'] },
            { id: 's17', type: 'normal', colorId: 'blue', x: 380, y: 500, plates: ['p3'] },
            { id: 's18', type: 'normal', colorId: 'yellow', x: 250, y: 500, plates: ['p3', 'p4'] }
        ]
    },
    {
        // Level 11: 雙層結構 (12顆, 2層)
        slots: 4,
        plates: [
            { id: 'base', type: 'rect', x: 250, y: 350, w: 250, h: 250, color: '#92400e' },
            { id: 'top', type: 'rect', x: 250, y: 350, w: 180, h: 180, color: '#f59e0b' }
        ],
        screws: [
            // 上層：必須先拆
            { id: 's1', type: 'normal', colorId: 'red', x: 200, y: 300, plates: ['top'] },
            { id: 's2', type: 'normal', colorId: 'red', x: 300, y: 300, plates: ['top'] },
            { id: 's3', type: 'normal', colorId: 'red', x: 250, y: 250, plates: ['top'] },
            
            { id: 's4', type: 'normal', colorId: 'blue', x: 200, y: 400, plates: ['base', 'top'] },
            { id: 's5', type: 'normal', colorId: 'blue', x: 300, y: 400, plates: ['base', 'top'] },
            { id: 's6', type: 'normal', colorId: 'blue', x: 250, y: 450, plates: ['base', 'top'] },

            // 下層：被遮擋
            { id: 's7', type: 'normal', colorId: 'green', x: 180, y: 350, plates: ['base'] },
            { id: 's8', type: 'normal', colorId: 'green', x: 320, y: 350, plates: ['base'] },
            { id: 's9', type: 'normal', colorId: 'green', x: 250, y: 350, plates: ['base'] },
            
            { id: 's10', type: 'normal', colorId: 'yellow', x: 150, y: 250, plates: ['base'] },
            { id: 's11', type: 'normal', colorId: 'yellow', x: 350, y: 250, plates: ['base'] },
            { id: 's12', type: 'normal', colorId: 'yellow', x: 250, y: 550, plates: ['base'] }
        ]
    },
    {
        // Level 12: 鏽蝕螺絲 (14顆)
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 300, w: 300, h: 60, color: '#b45309' },
            { id: 'p2', type: 'rect', x: 250, y: 450, w: 300, h: 60, color: '#78350f' }
        ],
        screws: [
            { id: 's1', type: 'rusted', colorId: 'red', x: 150, y: 300, plates: ['p1'] },
            { id: 's2', type: 'rusted', colorId: 'red', x: 350, y: 300, plates: ['p1'] },
            { id: 's3', type: 'rusted', colorId: 'red', x: 250, y: 300, plates: ['p1'] },
            
            { id: 's4', type: 'normal', colorId: 'blue', x: 120, y: 450, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'blue', x: 180, y: 450, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'blue', x: 240, y: 450, plates: ['p2'] },
            
            { id: 's7', type: 'normal', colorId: 'green', x: 300, y: 450, plates: ['p2'] },
            { id: 's8', type: 'normal', colorId: 'green', x: 360, y: 450, plates: ['p2'] },
            { id: 's9', type: 'normal', colorId: 'green', x: 250, y: 375, plates: ['p1', 'p2'] },

            { id: 's10', type: 'normal', colorId: 'purple', x: 100, y: 300, plates: ['p1'] },
            { id: 's11', type: 'normal', colorId: 'purple', x: 400, y: 300, plates: ['p1'] },
            { id: 's12', type: 'normal', colorId: 'purple', x: 250, y: 500, plates: ['p2'] },
            
            { id: 's13', type: 'normal', colorId: 'yellow', x: 100, y: 450, plates: ['p2'] },
            { id: 's14', type: 'normal', colorId: 'yellow', x: 400, y: 450, plates: ['p2'] },
            { id: 's15', type: 'normal', colorId: 'yellow', x: 250, y: 250, plates: ['p1'] }
        ]
    },
    {
        // Level 13: 磁力螺絲
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 350, w: 280, h: 280, color: '#1e3a8a' }
        ],
        screws: [
            { id: 's1', type: 'magnetic', colorId: 'blue', x: 150, y: 250, plates: ['p1'] },
            { id: 's2', type: 'magnetic', colorId: 'blue', x: 250, y: 250, plates: ['p1'] },
            { id: 's3', type: 'magnetic', colorId: 'blue', x: 350, y: 250, plates: ['p1'] },
            
            { id: 's4', type: 'normal', colorId: 'red', x: 150, y: 350, plates: ['p1'] },
            { id: 's5', type: 'normal', colorId: 'red', x: 250, y: 350, plates: ['p1'] },
            { id: 's6', type: 'normal', colorId: 'red', x: 350, y: 350, plates: ['p1'] },
            
            { id: 's7', type: 'normal', colorId: 'green', x: 150, y: 450, plates: ['p1'] },
            { id: 's8', type: 'normal', colorId: 'green', x: 250, y: 450, plates: ['p1'] },
            { id: 's9', type: 'normal', colorId: 'green', x: 350, y: 450, plates: ['p1'] }
        ]
    },
    {
        // Level 14: 滑動板子
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 200, w: 200, h: 40, color: '#fcd34d' },
            { id: 'p_slide', type: 'rect', x: 250, y: 350, w: 300, h: 50, color: '#94a3b8', isSlider: true, slideRange: 120, slideSpeed: 4 },
            { id: 'p2', type: 'rect', x: 250, y: 500, w: 200, h: 40, color: '#f87171' }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'yellow', x: 180, y: 200, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'yellow', x: 250, y: 200, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'yellow', x: 320, y: 200, plates: ['p1'] },

            { id: 's4', type: 'normal', colorId: 'red', x: 150, y: 350, plates: ['p_slide'] },
            { id: 's5', type: 'normal', colorId: 'red', x: 250, y: 350, plates: ['p_slide'] },
            { id: 's6', type: 'normal', colorId: 'red', x: 350, y: 350, plates: ['p_slide'] },

            { id: 's7', type: 'normal', colorId: 'blue', x: 180, y: 500, plates: ['p2'] },
            { id: 's8', type: 'normal', colorId: 'blue', x: 250, y: 500, plates: ['p2'] },
            { id: 's9', type: 'normal', colorId: 'blue', x: 320, y: 500, plates: ['p2'] }
        ]
    },
    {
        // Level 15: 螺絲槽減少 (3個槽位，15顆)
        slots: 3,
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 350, w: 350, h: 400, color: '#d97706' }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'red', x: 150, y: 200, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'red', x: 150, y: 250, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'red', x: 150, y: 300, plates: ['p1'] },
            
            { id: 's4', type: 'normal', colorId: 'blue', x: 250, y: 200, plates: ['p1'] },
            { id: 's5', type: 'normal', colorId: 'blue', x: 250, y: 250, plates: ['p1'] },
            { id: 's6', type: 'normal', colorId: 'blue', x: 250, y: 300, plates: ['p1'] },
            
            { id: 's7', type: 'normal', colorId: 'green', x: 350, y: 200, plates: ['p1'] },
            { id: 's8', type: 'normal', colorId: 'green', x: 350, y: 250, plates: ['p1'] },
            { id: 's9', type: 'normal', colorId: 'green', x: 350, y: 300, plates: ['p1'] },
            
            { id: 's10', type: 'normal', colorId: 'yellow', x: 200, y: 400, plates: ['p1'] },
            { id: 's11', type: 'normal', colorId: 'yellow', x: 200, y: 450, plates: ['p1'] },
            { id: 's12', type: 'normal', colorId: 'yellow', x: 200, y: 500, plates: ['p1'] },
            
            { id: 's13', type: 'normal', colorId: 'purple', x: 300, y: 400, plates: ['p1'] },
            { id: 's14', type: 'normal', colorId: 'purple', x: 300, y: 450, plates: ['p1'] },
            { id: 's15', type: 'normal', colorId: 'purple', x: 300, y: 500, plates: ['p1'] }
        ]
    },
    {
        // Level 16: 彈簧螺絲
        slots: 4,
        plates: [
            { id: 'p1', type: 'rect', x: 150, y: 350, w: 40, h: 300, color: '#ef4444' },
            { id: 'p2', type: 'rect', x: 350, y: 350, w: 40, h: 300, color: '#3b82f6' },
            { id: 'p3', type: 'rect', x: 250, y: 200, w: 300, h: 40, color: '#fcd34d' }
        ],
        screws: [
            { id: 's1', type: 'spring', colorId: 'green', x: 150, y: 250, plates: ['p1', 'p3'] },
            { id: 's2', type: 'spring', colorId: 'green', x: 350, y: 250, plates: ['p2', 'p3'] },
            { id: 's3', type: 'spring', colorId: 'green', x: 250, y: 200, plates: ['p3'] },
            
            { id: 's4', type: 'normal', colorId: 'red', x: 150, y: 350, plates: ['p1'] },
            { id: 's5', type: 'normal', colorId: 'red', x: 150, y: 450, plates: ['p1'] },
            { id: 's6', type: 'normal', colorId: 'red', x: 150, y: 500, plates: ['p1'] },
            
            { id: 's7', type: 'normal', colorId: 'blue', x: 350, y: 350, plates: ['p2'] },
            { id: 's8', type: 'normal', colorId: 'blue', x: 350, y: 450, plates: ['p2'] },
            { id: 's9', type: 'normal', colorId: 'blue', x: 350, y: 500, plates: ['p2'] }
        ]
    },
    {
        // Level 17: 顏色鎖 (紅 -> 藍 -> 綠)
        slots: 4,
        colorOrder: ['red', 'blue', 'green'],
        plates: [
            { id: 'p1', type: 'rect', x: 250, y: 350, w: 300, h: 400, color: '#1e293b' }
        ],
        screws: [
            { id: 's1', type: 'color_lock', colorId: 'red', x: 150, y: 250, plates: ['p1'] },
            { id: 's2', type: 'color_lock', colorId: 'red', x: 250, y: 250, plates: ['p1'] },
            { id: 's3', type: 'color_lock', colorId: 'red', x: 350, y: 250, plates: ['p1'] },
            
            { id: 's4', type: 'color_lock', colorId: 'blue', x: 150, y: 350, plates: ['p1'] },
            { id: 's5', type: 'color_lock', colorId: 'blue', x: 250, y: 350, plates: ['p1'] },
            { id: 's6', type: 'color_lock', colorId: 'blue', x: 350, y: 350, plates: ['p1'] },
            
            { id: 's7', type: 'color_lock', colorId: 'green', x: 150, y: 450, plates: ['p1'] },
            { id: 's8', type: 'color_lock', colorId: 'green', x: 250, y: 450, plates: ['p1'] },
            { id: 's9', type: 'color_lock', colorId: 'green', x: 350, y: 450, plates: ['p1'] }
        ]
    },
    {
        // Level 18: 旋轉結構
        slots: 4,
        plates: [
            { id: 'p_rot', type: 'rect', x: 250, y: 350, w: 280, h: 280, color: '#8b5cf6', pivot: { rx: 0, ry: 0 }, continuousRotation: true, rotationSpeed: 0.03 }
        ],
        screws: [
            { id: 's1', type: 'normal', colorId: 'purple', x: 200, y: 250, plates: ['p_rot'] },
            { id: 's2', type: 'normal', colorId: 'purple', x: 300, y: 250, plates: ['p_rot'] },
            { id: 's3', type: 'normal', colorId: 'purple', x: 250, y: 200, plates: ['p_rot'] },
            
            { id: 's4', type: 'normal', colorId: 'yellow', x: 200, y: 450, plates: ['p_rot'] },
            { id: 's5', type: 'normal', colorId: 'yellow', x: 300, y: 450, plates: ['p_rot'] },
            { id: 's6', type: 'normal', colorId: 'yellow', x: 250, y: 500, plates: ['p_rot'] },

            { id: 's7', type: 'normal', colorId: 'blue', x: 150, y: 350, plates: ['p_rot'] },
            { id: 's8', type: 'normal', colorId: 'blue', x: 350, y: 350, plates: ['p_rot'] },
            { id: 's9', type: 'normal', colorId: 'blue', x: 250, y: 350, plates: ['p_rot'] }
        ]
    },
    {
        // Level 19: 三層迷宮 (20顆)
        slots: 5,
        plates: [
            { id: 'p3', type: 'rect', x: 250, y: 350, w: 320, h: 320, color: '#475569' },
            { id: 'p2', type: 'rect', x: 250, y: 350, w: 220, h: 220, color: '#64748b' },
            { id: 'p1', type: 'rect', x: 250, y: 350, w: 120, h: 120, color: '#94a3b8' }
        ],
        screws: [
            // P1 (頂層)
            { id: 's1', type: 'normal', colorId: 'red', x: 250, y: 310, plates: ['p1'] },
            { id: 's2', type: 'normal', colorId: 'red', x: 250, y: 350, plates: ['p1'] },
            { id: 's3', type: 'normal', colorId: 'red', x: 250, y: 390, plates: ['p1'] },

            // P2 (中層)
            { id: 's4', type: 'normal', colorId: 'blue', x: 180, y: 350, plates: ['p2'] },
            { id: 's5', type: 'normal', colorId: 'blue', x: 320, y: 350, plates: ['p2'] },
            { id: 's6', type: 'normal', colorId: 'blue', x: 250, y: 280, plates: ['p2', 'p1'] },
            { id: 's7', type: 'normal', colorId: 'yellow', x: 200, y: 280, plates: ['p2'] },
            { id: 's8', type: 'normal', colorId: 'yellow', x: 300, y: 280, plates: ['p2'] },
            { id: 's9', type: 'normal', colorId: 'yellow', x: 250, y: 420, plates: ['p2', 'p1'] },

            // P3 (底層)
            { id: 's10', type: 'normal', colorId: 'green', x: 120, y: 350, plates: ['p3'] },
            { id: 's11', type: 'normal', colorId: 'green', x: 380, y: 350, plates: ['p3'] },
            { id: 's12', type: 'normal', colorId: 'green', x: 250, y: 200, plates: ['p3'] },
            { id: 's13', type: 'normal', colorId: 'purple', x: 150, y: 200, plates: ['p3'] },
            { id: 's14', type: 'normal', colorId: 'purple', x: 350, y: 200, plates: ['p3'] },
            { id: 's15', type: 'normal', colorId: 'purple', x: 250, y: 500, plates: ['p3'] },
            
            // 隨機補足
            { id: 's16', type: 'normal', colorId: 'red', x: 100, y: 100, plates: ['p3'] },
            { id: 's17', type: 'normal', colorId: 'blue', x: 400, y: 100, plates: ['p3'] },
            { id: 's18', type: 'normal', colorId: 'yellow', x: 100, y: 600, plates: ['p3'] },
            { id: 's19', type: 'normal', colorId: 'green', x: 400, y: 600, plates: ['p3'] },
            { id: 's20', type: 'normal', colorId: 'purple', x: 250, y: 150, plates: ['p3'] }
        ]
    },
    {
        // Level 20: 大型 Boss 關 (綜合挑戰)
        slots: 5,
        plates: [
            { id: 'p_base', type: 'rect', x: 250, y: 400, w: 320, h: 450, color: '#111827' },
            { id: 'p_rot', type: 'rect', x: 250, y: 250, w: 200, h: 40, color: '#fcd34d', pivot: { rx: 0, ry: 0 }, continuousRotation: true, rotationSpeed: 0.04 },
            { id: 'p_top', type: 'rect', x: 250, y: 400, w: 200, h: 200, color: '#4b5563' }
        ],
        screws: [
            // 鏽蝕
            { id: 's1', type: 'rusted', colorId: 'red', x: 150, y: 200, plates: ['p_base'] },
            { id: 's2', type: 'rusted', colorId: 'red', x: 350, y: 200, plates: ['p_base'] },
            { id: 's3', type: 'rusted', colorId: 'red', x: 250, y: 550, plates: ['p_base'] },

            // 旋轉 + 鎖定
            { id: 's4', type: 'locked', colorId: 'yellow', x: 180, y: 250, plates: ['p_rot'], unlockBy: ['s7'] },
            { id: 's5', type: 'locked', colorId: 'yellow', x: 320, y: 250, plates: ['p_rot'], unlockBy: ['s8'] },
            { id: 's6', type: 'normal', colorId: 'yellow', x: 250, y: 250, plates: ['p_rot'] },

            // 頂層
            { id: 's7', type: 'normal', colorId: 'blue', x: 200, y: 350, plates: ['p_top'] },
            { id: 's8', type: 'normal', colorId: 'blue', x: 300, y: 350, plates: ['p_top'] },
            { id: 's9', type: 'normal', colorId: 'blue', x: 250, y: 450, plates: ['p_top'] },

            // 其他色
            { id: 's10', type: 'normal', colorId: 'green', x: 120, y: 300, plates: ['p_base'] },
            { id: 's11', type: 'normal', colorId: 'green', x: 380, y: 300, plates: ['p_base'] },
            { id: 's12', type: 'normal', colorId: 'green', x: 250, y: 600, plates: ['p_base'] }
        ]
    }
];
