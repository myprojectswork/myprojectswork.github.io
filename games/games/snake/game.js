// games/snake/game.js - FIXED START SCREEN (NO PAUSE BUG)
(function() {
    'use strict';
    
    const GameSnake = {
        canvas: null,
        ctx: null,
        gridSize: 20,
        tileCountX: 0,
        tileCountY: 0,
        snake: [{x: 10, y: 10}],
        food: {x: 15, y: 15},
        dx: 0,  // NO MOVEMENT UNTIL START
        dy: 0,
        score: 0,
        highScore: 0,
        running: false,
        gameOver: false,
        started: false,  // NEW: Clear start state
        loopId: null,
        speed: 150,
        lastTime: 0,
        
        init: function() {
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
            this.resizeCanvas();
            
            window.addEventListener('resize', () => this.resizeCanvas());
            this.setupInput();
            this.spawnFood();
            this.draw();  // SHOW START SCREEN ONLY
        },
        
        resizeCanvas: function() {
            const size = Math.min(window.innerWidth * 0.9, 600);
            this.canvas.width = size;
            this.canvas.height = size;
            this.tileCountX = Math.floor(size / this.gridSize);
            this.tileCountY = Math.floor(size / this.gridSize);
        },
        
        setupInput: function() {
            let touchStart = {x: 0, y: 0};
            
            // **START GAME** - Single use listeners
            const startHandler = (e) => {
                e.preventDefault();
                if (!this.started) {
                    this.start();
                    this.started = true;
                }
            };
            
            document.addEventListener('keydown', startHandler);
            this.canvas.addEventListener('click', startHandler);
            this.canvas.addEventListener('touchstart', startHandler, {passive: false});
            
            // **MOVEMENT** - Only after game starts
            document.addEventListener('keydown', (e) => {
                if (!this.running || this.gameOver) return;
                e.preventDefault();
                switch(e.code) {
                    case 'ArrowUp': case 'KeyW': if (this.dy !== 1)  { this.dx = 0; this.dy = -1; } break;
                    case 'ArrowDown': case 'KeyS': if (this.dy !== -1) { this.dx = 0; this.dy = 1; } break;
                    case 'ArrowLeft': case 'KeyA': if (this.dx !== 1)  { this.dx = -1; this.dy = 0; } break;
                    case 'ArrowRight': case 'KeyD': if (this.dx !== -1) { this.dx = 1; this.dy = 0; } break;
                }
            });
            
            // Touch movement
            this.canvas.addEventListener('touchstart', (e) => {
                if (!this.running || this.gameOver) return;
                e.preventDefault();
                touchStart.x = e.touches[0].clientX;
                touchStart.y = e.touches[0].clientY;
            }, {passive: false});
            
            this.canvas.addEventListener('touchend', (e) => {
                if (!this.running || this.gameOver) return;
                e.preventDefault();
                const deltaX = touchStart.x - e.changedTouches[0].clientX;
                const deltaY = touchStart.y - e.changedTouches[0].clientY;
                
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
                    if (deltaX > 0 && this.dx !== 1) { this.dx = -1; this.dy = 0; }
                    else if (deltaX < 0 && this.dx !== -1) { this.dx = 1; this.dy = 0; }
                } else if (Math.abs(deltaY) > 40) {
                    if (deltaY > 0 && this.dy !== -1) { this.dx = 0; this.dy = 1; }
                    else if (deltaY < 0 && this.dy !== 1) { this.dx = 0; this.dy = -1; }
                }
            }, {passive: false});
        },
        
        spawnFood: function() {
            do {
                this.food.x = Math.floor(Math.random() * this.tileCountX);
                this.food.y = Math.floor(Math.random() * this.tileCountY);
            } while (this.snake.some(s => s.x === this.food.x && s.y === this.food.y));
        },
        
        update: function(currentTime) {
            if (!this.running || this.gameOver || currentTime - this.lastTime < this.speed) {
                return false;
            }
            
            this.lastTime = currentTime;
            const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
            
            if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY ||
                this.snake.some(s => s.x === head.x && s.y === head.y)) {
                this.gameOverFunc();
                return true;
            }
            
            this.snake.unshift(head);
            
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    localStorage.setItem('snakeHighScore', this.highScore);
                }
                this.spawnFood();
                this.speed = Math.max(80, this.speed - 2);
            } else {
                this.snake.pop();
            }
            return true;
        },
        
        draw: function() {
            // Clear canvas
            this.ctx.fillStyle = '#0a0a0a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // **START SCREEN** - Show until clicked
            if (!this.started || this.gameOver) {
                this.ctx.fillStyle = 'rgba(0,0,0,0.95)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Title
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 40;
                this.ctx.fillStyle = '#00ff88';
                this.ctx.font = `bold ${this.gridSize * 2.5}px monospace`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('🐍 SNAKE', this.canvas.width/2, this.canvas.height/2 - 60);
                
                // Start message
                this.ctx.shadowBlur = 25;
                this.ctx.font = `${this.gridSize * 1.5}px monospace`;
                this.ctx.fillStyle = '#ffaa00';
                this.ctx.fillText(
                    this.gameOver ? 'GAME OVER - CLICK TO RESTART' : 'CLICK OR TAP TO START', 
                    this.canvas.width/2, this.canvas.height/2 + 20
                );
                
                // Scores
                if (this.gameOver || this.score > 0) {
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = `${this.gridSize}px monospace`;
                    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 80);
                    this.ctx.fillText(`Best: ${this.highScore}`, this.canvas.width/2, this.canvas.height/2 + 110);
                }
                
                // Controls
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#cccccc';
                this.ctx.font = `${this.gridSize * 0.8}px monospace`;
                this.ctx.fillText('Arrow Keys / WASD / Touch Swipe', 
                                this.canvas.width/2, this.canvas.height - 50);
                return;
            }
            
            // **GAME SCREEN**
            // Grid
            this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i <= this.tileCountX; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.gridSize, 0);
                this.ctx.lineTo(i * this.gridSize, this.canvas.height);
                this.ctx.stroke();
            }
            for (let i = 0; i <= this.tileCountY; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * this.gridSize);
                this.ctx.lineTo(this.canvas.width, i * this.gridSize);
                this.ctx.stroke();
            }
            
            // Snake
            this.snake.forEach((segment, i) => {
                this.ctx.shadowBlur = i === 0 ? 20 : 5;
                this.ctx.shadowColor = '#00ff88';
                this.ctx.fillStyle = i === 0 ? '#00ff88' : '#00cc66';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            });
            this.ctx.shadowBlur = 0;
            
            // Food
            this.ctx.shadowColor = '#ffaa00';
            this.ctx.shadowBlur = 25;
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.beginPath();
            this.ctx.arc(
                this.food.x * this.gridSize + this.gridSize/2,
                this.food.y * this.gridSize + this.gridSize/2,
                this.gridSize/2 - 1, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            // UI Overlay
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
            this.ctx.fillRect(25, 25, 200, 65);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 18px monospace';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`Score: ${this.score}`, 40, 45);
            this.ctx.fillText(`Best: ${this.highScore}`, 40, 68);
        },
        
        gameLoop: function(currentTime) {
            this.update(currentTime);
            this.draw();
            
            if (this.running && !this.gameOver) {
                requestAnimationFrame((time) => this.gameLoop(time));
            }
        },
        
        start: function() {
            this.running = true;
            this.gameOver = false;
            if (this.dx === 0 && this.dy === 0) this.dx = 1; // Default right
            this.lastTime = 0;
            requestAnimationFrame((time) => this.gameLoop(time));
        },
        
        gameOverFunc: function() {
            this.running = false;
            this.gameOver = true;
        },
        
        restart: function() {
            this.snake = [{x: 10, y: 10}];
            this.dx = 0;
            this.dy = 0;
            this.score = 0;
            this.speed = 150;
            this.started = false;  // Reset start state
            this.gameOver = false;
            this.spawnFood();
            this.draw();
        }
    };
    
    window.GameSnake = GameSnake;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GameSnake.init());
    } else {
        GameSnake.init();
    }
})();
