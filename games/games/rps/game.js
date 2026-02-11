window.game = {
    canvas: null, ctx: null, playerChoice: null, computerChoice: null, score: 0, gameActive: false,
    choices: ['rock', 'paper', 'scissors'],
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', e => this.handleClick(e));
        this.drawMenu();
        this.updateScore();
    },
    
    resize() {
        const size = Math.min(window.innerWidth*0.9, 600);
        this.canvas.width = size; this.canvas.height = size * 0.8;
    },
    
    drawMenu() {
        this.ctx.fillStyle = '#222'; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 36px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('Rock Paper Scissors', this.canvas.width/2, 100);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Click to choose:', this.canvas.width/2, 180);
        this.drawButtons();
    },
    
    drawButtons() {
        const btnSize = 80, spacing = 120;
        this.choices.forEach((choice, i) => {
            const x = this.canvas.width/2 + (i-1) * spacing;
            const y = this.canvas.height/2;
            
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.fillRect(x - btnSize/2, y - btnSize/2, btnSize, btnSize);
            this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - btnSize/2, y - btnSize/2, btnSize, btnSize);
            
            this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 28px Arial'; this.ctx.textBaseline = 'middle';
            this.ctx.fillText(choice[0].toUpperCase(), x, y + 5);
        });
    },
    
    handleClick(e) {
        if(!this.gameActive) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const btnSize = 80, spacing = 120;
            this.choices.forEach((choice, i) => {
                const btnX = this.canvas.width/2 + (i-1) * spacing;
                const btnY = this.canvas.height/2;
                if(x > btnX - btnSize/2 && x < btnX + btnSize/2 &&
                   y > btnY - btnSize/2 && y < btnY + btnSize/2) {
                    this.playRound(choice);
                }
            });
        }
    },
    
    playRound(playerChoice) {
        this.gameActive = true;
        this.playerChoice = playerChoice;
        this.computerChoice = this.choices[Math.floor(Math.random()*3)];
        
        const result = this.getResult();
        if(result === 'win') this.score += 10;
        else if(result === 'lose') this.score -= 5;
        
        this.updateScore();
        this.drawResult();
        
        setTimeout(() => {
            this.gameActive = false;
            this.playerChoice = this.computerChoice = null;
            this.drawMenu();
        }, 3000);
    },
    
    getResult() {
        if(this.playerChoice === this.computerChoice) return 'draw';
        if((this.playerChoice === 'rock' && this.computerChoice === 'scissors') ||
           (this.playerChoice === 'paper' && this.computerChoice === 'rock') ||
           (this.playerChoice === 'scissors' && this.computerChoice === 'paper')) return 'win';
        return 'lose';
    },
    
    drawResult() {
        this.ctx.fillStyle = '#222'; this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 32px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('Result', this.canvas.width/2, 80);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`You: ${this.playerChoice}`, this.canvas.width/2, 140);
        this.ctx.fillText(`Computer: ${this.computerChoice}`, this.canvas.width/2, 180);
        
        const result = this.getResult();
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillStyle = result === 'win' ? '#4CAF50' : result === 'draw' ? '#ff9800' : '#ff4444';
        this.ctx.fillText(result.toUpperCase(), this.canvas.width/2, 260);
        
        this.ctx.fillStyle = '#fff'; this.ctx.font = '20px Arial';
        this.ctx.fillText('Click to play again', this.canvas.width/2, this.canvas.height - 50);
    },
    
    start() { this.gameActive = false; this.drawMenu(); },
    restart() { 
        this.score = 0; 
        this.updateScore();
        this.gameActive = false;
        this.drawMenu();
        document.getElementById('gameOverScreen').style.display = 'none';
    },
    updateScore() { this.scoreEl.textContent = `Score: ${this.score}`; }
};

document.addEventListener('DOMContentLoaded', () => window.game.init());
