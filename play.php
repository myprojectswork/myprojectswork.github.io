<?php 
$pageTitle = ($_GET['game'] ?? 'Game') . ' Game'; 
$game = strtolower($_GET['game'] ?? 'snake');
?>
<!DOCTYPE html>
<html lang="en">
<?php include 'includes/header.php'; ?>
<body class="game-page">
    <div class="game-container" id="gameContainer">
        <div class="game-header">
            <h1 id="gameTitle"><?php echo ucwords(str_replace(['-', '_'], ' ', $game)); ?></h1>
            <div class="score" id="scoreDisplay">Score: 0</div>
        </div>
        
        <canvas id="gameCanvas" tabindex="0"></canvas>
        
        <div class="controls">
            <button id="startButton" class="control-btn start">▶ START</button>
            <button id="restartButton" class="control-btn restart" style="display:none;">🔄 RESTART</button>
        </div>
        
        <div id="gameOverOverlay" class="overlay" style="display:none;">
            <div class="overlay-content">
                <h2 id="gameOverTitle">Game Over</h2>
                <div id="finalScoreDisplay">Final Score: 0</div>
                <button id="playAgainBtn" class="control-btn play-again">▶ Play Again</button>
            </div>
        </div>
    </div>

    <?php if (file_exists("games/$game/game.js")): ?>
        <script src="games/<?php echo htmlspecialchars($game); ?>/game.js?v=1"></script>
    <?php endif; ?>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        window.gameReady = false;
        
        // Wait for game script to load
        const checkGameReady = setInterval(() => {
            if (window.game && typeof window.game.init === 'function') {
                clearInterval(checkGameReady);
                window.gameReady = true;
                initGameControls();
            }
        }, 100);

        function initGameControls() {
            const startBtn = document.getElementById('startButton');
            const restartBtn = document.getElementById('restartButton');
            const playAgainBtn = document.getElementById('playAgainBtn');

            startBtn.onclick = () => {
                startBtn.style.display = 'none';
                window.game.start();
            };

            restartBtn.onclick = playAgainBtn.onclick = () => {
                document.getElementById('gameOverOverlay').style.display = 'none';
                restartBtn.style.display = 'none';
                startBtn.style.display = 'inline-block';
                window.game.restart();
            };
        }
    });
    </script>
</body>
</html>
