window.game = {
    canvas: null, ctx: null, 
    paddle1: {x:20, y:150, w:15, h:80, dy:0},
    paddle2: {x:550, y:150, w:15, h:80, dy:0},
    ball: {x:300, y:200, dx:4, dy:3, r:10},
    score1: 0, score2: 0, maxScore: 5, running: false,
    
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
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.paddle1.y = this.paddle2.y = (this.canvas.height - this.paddle1.h)/2;
        this.ball.x = this.canvas.width/2;
        this.ball.y = this.canvas.height/2;
    },
    
    setupControls() {
        document.addEventListener('keydown', e => {
            if(!this.running) return;
            if(e.key=='ArrowUp') this.paddle2.dy = -6;
            if(e.key=='ArrowDown') this.paddle2.dy = 6;
            if(e.key=='w' || e.key=='W') this.paddle1.dy = -6;
            if(e.key=='s' || e.key=='S') this.paddle1.dy = 6;
        });
        
        document.addEventListener('keyup', e => {
            if(e.key=='ArrowUp' || e.key=='ArrowDown') this.paddle2.dy = 0;
            if(e.key=='w' || e.key=='W' || e.key=='s' || e.key=='S') this.paddle1.dy = 0;
        });
    },
    
    update() {
        if(!this.running) return;
        
        // Move paddles
        this.paddle1.y = Math.max(0, Math.min(this.canvas.height - this.paddle1.h, this.paddle1.y + this.paddle1.dy));
        this.paddle2.y = Math.max(0, Math.min(this.canvas.height - this.paddle2.h, this.paddle2.y + this.paddle2.dy));
        
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball wall collision
        if(this.ball.y - this.ball.r < 0 || this.ball.y + this.ball.r > this.canvas.height) {
            this.ball.dy *= -1;
        }
        
        // Ball paddle collision
        if(this.collides(this.ball, this.paddle1) || this.collides(this.ball, this.paddle2)) {
            this.ball.dx *= -1;
            this.ball.dy += (Math.random() - 0.5) * 4;
        }
        
        // Scoring
        if(this.ball.x < 0) {
            this.score2++; this.updateScore();
            if(this.score2 >= this.maxScore) return this.end();
            this.resetBall();
        }
        if(this.ball.x > this.canvas.width) {
            this.score1++; this.updateScore();
            if(this.score1 >= this.maxScore) return this.end();
            this.resetBall();
        }
    },
    
    collides(a, b) {
        return a.x - a.r < b.x + b.w && a.x + a.r > b.x && a.y - a.r < b.y + b.h && a.y + a.r > b.y;
    },
    
    resetBall() {
        this.ball.x = this.canvas.width/2;
        this.ball.y = this.canvas.height/2;
        this.ball.dx = this.score1 > this.score2 ? -4 : 4;
        this.ball.dy = 0;
    },
    
    draw() {
        // Background
        this.ctx.fillStyle = '#000'; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        
        // Center line
        this.ctx.strokeStyle = '#333'; this.ctx.lineWidth = 4; this.ctx.setLineDash([10,10]);
        this.ctx.beginPath(); this.ctx.moveTo(this.canvas.width/2, 0); this.ctx.lineTo(this.canvas.width/2, this.canvas.height); this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Paddles
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.w, this.paddle1.h);
        this.ctx.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.w, this.paddle2.h);
        
        // Ball
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI*2);
        this.ctx.fill();
        
        // Scores
        this.ctx.fillStyle = '#fff'; this.ctx.font = '48px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText(this.score1, this.canvas.width*0.25, 60);
        this.ctx.fillText(this.score2, this.canvas.width*0.75, 60);
    },
    
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    },
    
    start() {
        this.running = true;
        this.score1 = this.score2 = 0;
        this.updateScore();
    },
    restart() {
        this.running = false;
        this.score1 = this.score2 = 0;
        this.updateScore();
        this.resetBall();
        this.paddle1.y = this.paddle2.y = (this.canvas.height - this.paddle1.h)/2;
        document.getElementById('gameOverScreen').style.display = 'none';
        this.draw();
    },
    end() {
        this.running = false;
        const winner = this.score1 >= this.maxScore ? 'Player 1' : 'Player 2';
        document.getElementById('finalScore').textContent = `${winner} Wins! ${this.score1}-${this.score2}`;
        document.getElementById('gameOverScreen').style.display = 'flex';
    },
    updateScore() {
        this.scoreEl.textContent = `Score: ${this.score1}-${this.score2}`;
    }
};

document.addEventListener('DOMContentLoaded', () => window.game.init());
