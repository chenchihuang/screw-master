class PhysicsEngine {
    constructor(containerId) {
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;

        let container = document.getElementById(containerId);
        this.width = container.clientWidth || window.innerWidth;
        this.height = container.clientHeight || window.innerHeight;

        this.render = Matter.Render.create({
            element: container,
            engine: this.engine,
            options: {
                width: this.width,
                height: this.height,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio
            }
        });

        this.plates = {};
        this.screws = {};

        Matter.Runner.run(Matter.Runner.create(), this.engine);
        Matter.Render.run(this.render);

        Matter.Events.on(this.engine, 'beforeUpdate', () => {
            // Sliders
            if (this.sliders && this.sliders.length > 0) {
                this.sliders.forEach(slider => {
                    let maxRight = slider.startX + slider.rangeX;
                    let maxLeft = slider.startX - slider.rangeX;

                    let nextX = slider.body.position.x + (slider.speed * slider.direction);
                    if (nextX > maxRight) {
                        slider.direction = -1;
                    } else if (nextX < maxLeft) {
                        slider.direction = 1;
                    }

                    Matter.Body.setPosition(slider.body, {
                        x: slider.body.position.x + (slider.speed * slider.direction),
                        y: slider.body.position.y
                    });
                });
            }

            // Continuous Rotation
            for (let id in this.plates) {
                let p = this.plates[id];
                if (p.plugin && p.plugin.continuousRotation) {
                    Matter.Body.setAngularVelocity(p, p.plugin.rotationSpeed || 0.05);
                }
            }
        });

        const canvas = this.render.canvas;
        canvas.style.pointerEvents = 'auto';
    }

    loadLevel(levelData) {
        Matter.World.clear(this.world);
        Matter.Engine.clear(this.engine);
        this.plates = {};
        this.screws = {};
        this.pivotConstraints = {}; // 追蹤轉軸約束

        this.sliders = [];

        levelData.plates.forEach(p => {
            let options = {
                render: {
                    fillStyle: p.color || '#fcd34d',
                    strokeStyle: '#fb923c',
                    lineWidth: 4
                },
                restitution: 0.2,
                friction: 0.5,
                density: Number(p.w * p.h) * 0.001
            };

            if (p.isSlider) {
                options.isStatic = true;
            }

            let body = Matter.Bodies.rectangle(p.x, p.y, p.w, p.h, options);
            body.plugin = { id: p.id };
            body.collisionFilter.group = Matter.Body.nextGroup(true);
            body.screwCount = 0; // 記錄板塊上的螺絲數量

            this.plates[p.id] = body;
            body.plugin.continuousRotation = p.continuousRotation;
            body.plugin.rotationSpeed = p.rotationSpeed;
            Matter.World.add(this.world, body);

            // 旋轉板：如果有 pivot 屬性，建立固定轉軸 Constraint
            if (p.pivot) {
                let pivotConstraint = Matter.Constraint.create({
                    bodyA: body,
                    pointA: { x: p.pivot.rx, y: p.pivot.ry }, // 相對板塊中心的座標
                    pointB: { x: p.x + p.pivot.rx, y: p.y + p.pivot.ry }, // 在世界中的固定座標
                    stiffness: 1,
                    length: 0,
                    render: { visible: true, type: 'pin', anchors: false }
                });
                this.pivotConstraints[p.id] = pivotConstraint; // 儲存起來以便後續移除
                Matter.World.add(this.world, pivotConstraint);
            }

            // 滑動機關：儲存起來在 update 迴圈處理
            if (p.isSlider) {
                this.sliders.push({
                    body: body,
                    startX: p.x,
                    rangeX: p.slideRange || 100,
                    speed: p.slideSpeed || 2,
                    direction: 1
                });
            }
        });

        levelData.screws.forEach(s => {
            let constraints = [];

            s.plates.forEach(pid => {
                let pBody = this.plates[pid];
                if (pBody) {
                    pBody.screwCount++; // 增加板塊的螺絲計數
                    let rx = s.x - pBody.position.x;
                    let ry = s.y - pBody.position.y;

                    let c = Matter.Constraint.create({
                        bodyA: pBody,
                        pointA: { x: rx, y: ry },
                        pointB: { x: s.x, y: s.y },
                        stiffness: 1,
                        render: { visible: false }
                    });
                    constraints.push(c);
                    Matter.World.add(this.world, c);
                }
            });

            let color = this.getScrewColor(s.type, s.colorId);
            let screwBody = Matter.Bodies.circle(s.x, s.y, 14, {
                isStatic: true,
                isSensor: true,
                render: { fillStyle: color, strokeStyle: '#000', lineWidth: 2 },
                plugin: { type: 'screw', id: s.id, data: s }
            });

            Matter.World.add(this.world, screwBody);

            this.screws[s.id] = {
                data: s,
                constraints: constraints,
                body: screwBody
            };
        });
    }

    getScrewColor(type, colorId) {
        if (colorId) return colorId;
        const colors = {
            'normal': '#cbd5e1',
            'locked': '#dc2626',
            'frozen': '#38bdf8',
            'timed': '#f59e0b',
            'rusted': '#78350f',
            'magnetic': '#1e40af',
            'spring': '#22c55e'
        };
        return colors[type] || colors['normal'];
    }

    getScrewAt(x, y) {
        let bodies = Matter.Composite.allBodies(this.world);
        let clicked = Matter.Query.point(bodies, { x, y });
        for (let b of clicked) {
            if (b.plugin && b.plugin.type === 'screw') {
                return this.screws[b.plugin.id];
            }
        }
        return null;
    }

    removeScrew(screwId) {
        let sc = this.screws[screwId];
        if (sc) {
            sc.constraints.forEach(c => {
                let pBody = c.bodyA;
                if (pBody) {
                    pBody.screwCount--;
                    // 如果板塊上沒有螺絲了，且它有轉軸約束，則釋放轉軸
                    if (pBody.screwCount <= 0 && pBody.plugin && this.pivotConstraints[pBody.plugin.id]) {
                        Matter.World.remove(this.world, this.pivotConstraints[pBody.plugin.id]);
                        delete this.pivotConstraints[pBody.plugin.id];
                    }
                }
                Matter.World.remove(this.world, c);
            });
            Matter.World.remove(this.world, sc.body);
            delete this.screws[screwId];
        }
    }

    checkWin() {
        let allFallen = true;
        for (let id in this.plates) {
            let p = this.plates[id];
            // 排除靜態板塊 (例如滑塊)，因為它們永遠不會掉落
            if (p.isStatic) continue;
            
            if (p.position.y < this.height + 200) {
                allFallen = false;
                break;
            }
        }
        return allFallen;
    }

    applyImpulse(x, y, power = 10) {
        // Find nearby plates and apply impulse
        for (let id in this.plates) {
            let p = this.plates[id];
            let dist = Math.sqrt(Math.pow(p.position.x - x, 2) + Math.pow(p.position.y - y, 2));
            if (dist < 150) {
                let force = {
                    x: (p.position.x - x) * 0.05 * power,
                    y: (p.position.y - y) * 0.05 * power
                };
                Matter.Body.applyForce(p, p.position, force);
            }
        }
    }
}
