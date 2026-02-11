<?php $pageTitle = "All Games"; ?>
<!DOCTYPE html>
<html lang="en">
<?php include 'includes/header.php'; ?>
<body>
    <div class="container">
        <h1>🎮 Choose Your Game</h1>
        <div class="games-grid">
            <a href="play.php?game=snake" class="game-card snake">
                <h3>🐍 Snake</h3><p>Eat food, grow longer</p>
            </a>
            <a href="play.php?game=tictactoe" class="game-card tictactoe">
                <h3>❌ Tic Tac Toe</h3><p>Beat AI opponent</p>
            </a>
            <a href="play.php?game=flappy" class="game-card flappy">
                <h3>🐦 Flappy Bird</h3><p>Tap to fly</p>
            </a>
            <a href="play.php?game=pong" class="game-card pong">
                <h3>🏓 Pong</h3><p>WASD vs Arrows</p>
            </a>
            <a href="play.php?game=memory" class="game-card memory">
                <h3>🧠 Memory Match</h3><p>Find card pairs</p>
            </a>
            <a href="play.php?game=rps" class="game-card rps">
                <h3>✂️ Rock Paper Scissors</h3><p>Beat computer</p>
            </a>
        </div>
    </div>
</body>
<?php include 'includes/footer.php'; ?>
</html>
