window.game = {
    canvas: null, ctx: null, bird: {x:100, y:200, vy:0, r:20}, 
    pipes: [], pipeWidth: 60, pipeGap: 200, score: 0, gravity: 0.5, jump: -10, running: false,
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupControls();
        this.updateScore();
        requestAnimationFrame(() => this.loop());
    },
    
    resize() {
        this.canvas.width = Math.min(window.innerWidth*0.9, 600);
        this.canvas.height = Math.min(window.innerHeight*0.7, 800);
    },
    
    setupControls() {
        document.addEventListener('keydown', e => {
            if(e.code === 'Space') { e.preventDefault(); if(this.running) this.bird.vy = this.jump; }
        });
        
        this.canvas.addEventListener('click', () => { if(this.running) this.bird.vy = this.jump; });
        this.canvas.addEventListener('touchstart', e => {
            e.preventDefault(); if(this.running) this.bird.vy = this.jump;
        }, {passive: false});
    },
    
    update() {
        if(!this.running) return;
        
        // Bird physics
        this.bird.vy += this.gravity;
        this.bird.y += this.bird.vy;
        
        // Ground/ceiling collision
        if(this.bird.y + this.bird.r > this.canvas.height || this.bird.y < 0) return this.end();
        
        // Pipes
        if(this.pipes.length === 0 || this.pipes[this.pipes.length-1].x < this.canvas.width - 300) {
            const gapY = 100 + Math.random() * (this.canvas.height - 300 - this.pipeGap);
            this.pipes.push({x: this.canvas.width, top: gapY, bottom: gapY + this.pipeGap});
        }
        
        for(let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= 3;
            if(this.pipes[i].x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                this.score += 10;
                this.updateScore();
                continue;
            }
            
            // Pipe collision
            const pipe = this.pipes[i];
            if(this.bird.x + this.bird.r > pipe.x && this.bird.x - this.bird.r < pipe.x + this.pipeWidth) {
                if(this.bird.y - this.bird.r < pipe.top || this.bird.y + this.bird.r > pipe.bottom) {
                    return this.end();
                }
            }
        }
    },
    
    draw() {
        // Background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); gradient.addColorStop(1, '#98D8C8');
        this.ctx.fillStyle = gradient; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        
        // Pipes
        this.ctx.fillStyle = '#4CAF50';
        for(let pipe of this.pipes) {
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.top);
            this.ctx.fillRect(pipe.x, pipe.bottom, this.pipeWidth, this.canvas.height - pipe.bottom);
        }
        
        // Bird
        this.ctx.save();
        this.ctx.translate(this.bird.x, this.bird.y);
        this.ctx.rotate(this.bird.vy * 0.05);
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.bird.r, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-8, -5, 4, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.restore();
    },
    
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    },
    
    start() { 
        this.running = true; 
        this.bird.y = this.canvas.height/3; 
        this.bird.vy = 0;
        this.pipes = [];
        this.score = 0;
        this.updateScore();
    },
    restart() {
        this.running = false;
        this.bird.y = this.canvas.height/3;
        this.bird.vy = 0;
        this.pipes = [];
        this.score = 0;
        this.updateScore();
        document.getElementById('gameOverScreen').style.display = 'none';
        this.draw();
    },
    end() {
        this.running = false;
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOverScreen').style.display = 'flex';
    },
    updateScore() { this.scoreEl.textContent = `Score: ${this.score}`; }
};

document.addEventListener('DOMContentLoaded', () => window.game.init());
