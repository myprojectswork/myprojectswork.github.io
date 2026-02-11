window.game = {
    canvas: null, ctx: null, board: Array(9).fill(null), currentPlayer: 'X', gameActive: false, score: 0,
    winningConditions: [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', e => this.handleClick(e));
        this.drawBoard();
        this.updateScore();
    },
    
    resize() {
        const size = Math.min(window.innerWidth*0.9, 500);
        this.canvas.width = size; this.canvas.height = size;
    },
    
    drawBoard() {
        const {width, height} = this.canvas;
        this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(width/3, 0); this.ctx.lineTo(width/3, height);
        this.ctx.moveTo(2*width/3, 0); this.ctx.lineTo(2*width/3, height);
        this.ctx.moveTo(0, height/3); this.ctx.lineTo(width, height/3);
        this.ctx.moveTo(0, 2*height/3); this.ctx.lineTo(width, 2*height/3);
        this.ctx.stroke();
        this.drawSymbols();
    },
    
    drawSymbols() {
        const size = this.canvas.width/3 * 0.8;
        this.board.forEach((cell, i) => {
            if(!cell) return;
            const x = (i%3)*this.canvas.width/3 + this.canvas.width/6;
            const y = Math.floor(i/3)*this.canvas.height/3 + this.canvas.height/6;
            this.ctx.font = `${size}px Arial`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = cell === 'X' ? '#ff4444' : '#4CAF50';
            this.ctx.fillText(cell, x, y);
        });
    },
    
    handleClick(e) {
        if(!this.gameActive) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / (this.canvas.width/3));
        const row = Math.floor(y / (this.canvas.height/3));
        const index = row*3 + col;
        
        if(this.board[index] || this.result()) return;
        this.board[index] = this.currentPlayer;
        this.drawSymbols();
        
        const result = this.result();
        if(result) {
            this.score += result === 'X' ? 10 : 5;
            this.updateScore();
            this.endGame(result);
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if(this.currentPlayer === 'O') setTimeout(() => this.aiMove(), 500);
    },
    
    aiMove() {
        let bestScore = -Infinity, move;
        for(let i=0; i<9; i++) {
            if(this.board[i]) continue;
            this.board[i] = 'O';
            let score = this.minimax(this.board, 0, false);
            this.board[i] = null;
            if(score > bestScore) {
                bestScore = score; move = i;
            }
        }
        this.board[move] = 'O';
        this.drawSymbols();
        
        const result = this.result();
        if(result) {
            this.score += result === 'X' ? 10 : 5;
            this.updateScore();
            this.endGame(result);
        } else {
            this.currentPlayer = 'X';
        }
    },
    
    minimax(board, depth, isMax) {
        const result = this.checkWinner(board);
        if(result === 'O') return 10 - depth;
        if(result === 'X') return depth - 10;
        if(!board.includes(null)) return 0;
        
        if(isMax) {
            let best = -Infinity;
            for(let i=0; i<9; i++) {
                if(board[i]) continue;
                board[i] = 'O';
                best = Math.max(best, this.minimax(board, depth+1, false));
                board[i] = null;
            }
            return best;
        } else {
            let best = Infinity;
            for(let i=0; i<9; i++) {
                if(board[i]) continue;
                board[i] = 'X';
                best = Math.min(best, this.minimax(board, depth+1, true));
                board[i] = null;
            }
            return best;
        }
    },
    
    result() { return this.checkWinner(this.board); },
    checkWinner(board) {
        for(let pattern of this.winningConditions) {
            const [a,b,c] = pattern;
            if(board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return board.includes(null) ? null : 'draw';
    },
    
    endGame(result) {
        this.gameActive = false;
        document.getElementById('gameOverScreen').style.display = 'flex';
        document.getElementById('finalScore').textContent = `You ${result === 'X' ? 'WIN!' : result === 'draw' ? 'DREW' : 'LOSE'}! Score: ${this.score}`;
    },
    
    start() { 
        this.gameActive = true; 
        this.board = Array(9).fill(null); 
        this.currentPlayer = 'X';
        this.drawBoard();
        document.getElementById('gameOverScreen').style.display = 'none';
    },
    restart() { 
        this.gameActive = false; 
        this.board = Array(9).fill(null); 
        this.score = 0;
        this.updateScore();
        this.drawBoard();
        document.getElementById('gameOverScreen').style.display = 'none';
    },
    updateScore() { this.scoreEl.textContent = `Score: ${this.score}`; }
};

document.addEventListener('DOMContentLoaded', () => window.game.init());
