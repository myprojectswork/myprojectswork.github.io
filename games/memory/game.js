window.game = {
    canvas: null, ctx: null, cards: [], score: 0, flipped: [], matched: 0, totalPairs: 8, gameActive: false,
    symbols: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'],
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', e => this.handleClick(e));
        this.newGame();
        this.updateScore();
    },
    
    resize() {
        const size = Math.min(window.innerWidth*0.9, 600);
        this.canvas.width = size; this.canvas.height = size;
        this.cardSize = size / 4;
        this.spacing = size / 20;
    },
    
    newGame() {
        this.shuffle(this.symbols.slice(0, this.totalPairs));
        this.cards = this.symbols.slice(0, this.totalPairs).concat(this.symbols.slice(0, this.totalPairs));
        this.shuffle(this.cards);
        this.matched = 0; this.flipped = []; this.gameActive = true;
        this.draw();
    },
    
    shuffle(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    
    handleClick(e) {
        if(!this.gameActive || this.flipped.length === 2) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / (this.cardSize + this.spacing));
        const row = Math.floor(y / (this.cardSize + this.spacing));
        
        if(col >= 0 && col < 4 && row >= 0 && row < 4) {
            const index = row * 4 + col;
            if(this.flipped.includes(index)) return;
            
            this.flipped.push(index);
            if(this.flipped.length === 2) {
                setTimeout(() => this.checkMatch(), 1000);
            }
            this.draw();
        }
    },
    
    checkMatch() {
        if(this.cards[this.flipped[0]] === this.cards[this.flipped[1]]) {
            this.matched++;
            this.score += 10;
            this.updateScore();
            if(this.matched === this.totalPairs) {
                this.gameActive = false;
                document.getElementById('gameOverScreen').style.display = 'flex';
                document.getElementById('finalScore').textContent = `You Win! Score: ${this.score}`;
            }
        } else {
            this.flipped = [];
        }
        this.draw();
    },
    
    draw() {
        this.ctx.fillStyle = '#222'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for(let i = 0; i < 16; i++) {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = col * (this.cardSize + this.spacing) + this.spacing/2;
            const y = row * (this.cardSize + this.spacing) + this.spacing/2;
            
            this.ctx.save();
            this.ctx.translate(x + this.cardSize/2, y + this.cardSize/2);
            
            if(this.flipped.includes(i) || this.matched === this.totalPairs) {
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.shadowColor = '#4CAF50';
                this.ctx.shadowBlur = 10;
            } else {
                this.ctx.fillStyle = '#444';
                this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
                this.ctx.shadowBlur = 5;
            }
            
            this.ctx.fillRect(-this.cardSize/2, -this.cardSize/2, this.cardSize, this.cardSize);
            
            if(this.flipped.includes(i)) {
                this.ctx.fillStyle = '#fff';
                this.ctx.font = `${this.cardSize*0.6}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(this.cards[i], 0, 0);
            }
            
            this.ctx.restore();
        }
    },
    
    start() { this.newGame(); document.getElementById('gameOverScreen').style.display = 'none'; },
    restart() { 
        this.gameActive = false; 
        this.score = 0;
        this.updateScore();
        this.newGame();
        document.getElementById('gameOverScreen').style.display = 'none';
    },
    updateScore() { this.scoreEl.textContent = `Score: ${this.score}`; }
};

document.addEventListener('DOMContentLoaded', () => window.game.init());
