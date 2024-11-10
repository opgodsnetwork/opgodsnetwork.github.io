<?php
// Database connection (adjust these values according to your database)
$host = 'localhost';
$dbname = 'jedag_jedug_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

// Function to get presets from database
function getPresets($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM presets ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return array();
    }
}

// Function to get latest updates
function getLatestUpdates($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM updates ORDER BY update_date DESC LIMIT 5");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return array();
    }
}

// Get the current page
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

// Get presets
$presets = getPresets($pdo);

// Get updates
$updates = getLatestUpdates($pdo);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Jedag Jedug</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        /* Your existing CSS styles here */
        /* Add new styles for PHP-specific elements */
        .update-panel {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
        }
        
        .update-item {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 0;
            color: #fff;
        }
        
        .update-date {
            color: #94a3b8;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.php" class="nav-logo">🔥 Jedag Jedug</a>
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰</button>
            <div class="nav-links" id="navLinks">
                <a href="?page=about" class="nav-link">About</a>
                <a href="?page=contact" class="nav-link">Contact</a>
                <a href="?page=updates" class="nav-link new">New Update</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <?php if($page == 'home'): ?>
            <!-- Header -->
            <div class="header">
                <h1>🔥 Template Jedag Jedug</h1>
                <p>Template Keren Bikin Kamu Makin Gacor!</p>
            </div>
            
            <!-- Grid of presets -->
            <div class="grid">
                <?php foreach($presets as $preset): ?>
                <div class="card" onclick="showModal('<?php echo htmlspecialchars($preset['title']); ?>', '<?php echo htmlspecialchars($preset['creator']); ?>', '<?php echo htmlspecialchars($preset['image']); ?>', '<?php echo htmlspecialchars($preset['link']); ?>')">
                    <div class="card-image">
                        <img src="<?php echo htmlspecialchars($preset['image']); ?>" alt="Template Preview">
                        <span class="badge"><?php echo htmlspecialchars($preset['badge']); ?></span>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title"><?php echo htmlspecialchars($preset['title']); ?></h3>
                        <a href="#" class="card-button">Klick Cuy 🚀</a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

        <?php elseif($page == 'about'): ?>
            <div class="header">
                <h1>About Us</h1>
                <p>Tentang Template Jedag Jedug</p>
            </div>
            <div class="update-panel">
                <p>Kami adalah platform template editing video terbaik untuk content creator! Dengan berbagai macam template keren yang siap pakai, kami membantu content creator untuk membuat konten yang lebih menarik dan profesional.</p>
            </div>

        <?php elseif($page == 'contact'): ?>
            <div class="header">
                <h1>Contact Us</h1>
                <p>Hubungi Kami</p>
            </div>
            <div class="update-panel">
                <p>Email: support@jedagjedug.com</p>
                <p>Instagram: @jedagjedug</p>
                <p>Discord: discord.gg/jedagjedug</p>
            </div>

        <?php elseif($page == 'updates'): ?>
            <div class="header">
                <h1>Latest Updates</h1>
                <p>Update Terbaru Template Jedag Jedug</p>
            </div>
            <div class="update-panel">
                <?php foreach($updates as $update): ?>
                <div class="update-item">
                    <h3><?php echo htmlspecialchars($update['title']); ?></h3>
                    <p><?php echo htmlspecialchars($update['description']); ?></p>
                    <span class="update-date"><?php echo date('d M Y', strtotime($update['update_date'])); ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Modal -->
    <div class="modal" id="templateModal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">×</span>
            <img class="modal-image" id="modalImage" src="" alt="Template Image">
            <h2 id="modalTitle"></h2>
            <p id="modalCreator"></p>
            <button class="modal-button" onclick="redirectToTemplate()">Import And Use</button>
            <button class="modal-button" onclick="copyTemplateLink()">Share Template</button>
        </div>
    </div>

    <div id="toastNotification">Link berhasil disalin!</div>

    <?php include 'footer.php'; ?>

    <script>
        // Your existing JavaScript code here
    </script>
</body>
</html>
