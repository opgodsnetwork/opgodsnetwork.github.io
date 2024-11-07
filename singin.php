<?php
session_start();

// Koneksi database (sesuaikan dengan konfigurasi database Anda)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = "localhost";
    $username = "root";
    $password = "";
    $database = "nama_database";

    $conn = mysqli_connect($host, $username, $password, $database);

    if (!$conn) {
        die("Koneksi gagal: " . mysqli_connect_error());
    }

    // Cek action yang dikirim dari form
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        
        // Proses Login
        if ($action === 'login') {
            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $password = $_POST['password'];
            
            // Query untuk mencari user
            $query = "SELECT * FROM users WHERE username = '$username'";
            $result = mysqli_query($conn, $query);
            
            if (mysqli_num_rows($result) === 1) {
                $user = mysqli_fetch_assoc($result);
                // Verifikasi password
                if (password_verify($password, $user['password'])) {
                    // Set session
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    
                    // Redirect ke index.php
                    header("Location: index.php");
                    exit();
                } else {
                    $_SESSION['error'] = "Password salah!";
                }
            } else {
                $_SESSION['error'] = "Username tidak ditemukan!";
            }
        }
        
        // Proses Register 
        else if ($action === 'register') {
            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $password = $_POST['password'];
            $confirm_password = $_POST['confirm_password'];
            
            // Validasi password match
            if ($password !== $confirm_password) {
                $_SESSION['error'] = "Password tidak cocok!";
            } else {
                // Cek username sudah ada atau belum
                $check_query = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
                $result = mysqli_query($conn, $check_query);
                
                if (mysqli_num_rows($result) > 0) {
                    $_SESSION['error'] = "Username atau email sudah digunakan!";
                } else {
                    // Hash password
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    
                    // Insert user baru
                    $insert_query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
                    
                    if (mysqli_query($conn, $insert_query)) {
                        // Set session untuk user baru
                        $_SESSION['user_id'] = mysqli_insert_id($conn);
                        $_SESSION['username'] = $username;
                        
                        // Redirect ke index.php
                        header("Location: index.php");
                        exit();
                    } else {
                        $_SESSION['error'] = "Terjadi kesalahan saat mendaftar!";
                    }
                }
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login dan Register</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        body {
            background-color: #141414;
            background-image: url('1080.jpeg');
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            background-color: rgba(45, 45, 45, 0.9);
            padding: 2rem;
            border-radius: 10px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .tabs {
            display: flex;
            margin-bottom: 2rem;
        }

        .tab {
            flex: 1;
            padding: 1rem;
            text-align: center;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        .tab.active {
            color: #4AAE4A;
            border-bottom: 3px solid #4AAE4A;
        }

        .forms {
            position: relative;
        }

        .form {
            display: none;
        }

        .form.active {
            display: block;
        }

        h2 {
            color: #4AAE4A;
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2rem;
        }

        .input-group {
            margin-bottom: 1.5rem;
        }

        .input-group label {
            display: block;
            color: white;
            margin-bottom: 0.5rem;
        }

        .input-group input {
            width: 100%;
            padding: 0.8rem;
            border: none;
            border-radius: 4px;
            background-color: #1a1a1a;
            color: white;
        }

        .input-group input:focus {
            outline: 2px solid #4AAE4A;
        }

        .btn {
            width: 100%;
            padding: 1rem;
            background-color: #4AAE4A;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            text-transform: uppercase;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #3d933d;
        }

        .message {
            text-align: center;
            margin-top: 1rem;
            color: white;
        }

        .message a {
            color: #4AAE4A;
            text-decoration: none;
        }

        .error {
            color: #ff4444;
            text-align: center;
            margin-top: 1rem;
            padding: 10px;
            background-color: rgba(255, 0, 0, 0.1);
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="tabs">
            <button class="tab active" onclick="showForm('login')">Masuk</button>
            <button class="tab" onclick="showForm('register')">Daftar</button>
        </div>

        <?php if(isset($_SESSION['error'])): ?>
            <div class="error">
                <?php 
                    echo $_SESSION['error'];
                    unset($_SESSION['error']);
                ?>
            </div>
        <?php endif; ?>

        <div class="forms">
            <!-- Login Form -->
            <form id="loginForm" class="form active" method="POST">
                <h2>Masuk</h2>
                <input type="hidden" name="action" value="login">
                <div class="input-group">
                    <label>Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="btn">Masuk</button>
                <p class="message">Belum punya akun? <a href="#" onclick="showForm('register')">Daftar sekarang</a></p>
            </form>

            <!-- Register Form -->
            <form id="registerForm" class="form" method="POST">
                <h2>Daftar</h2>
                <input type="hidden" name="action" value="register">
                <div class="input-group">
                    <label>Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" name="email" required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <div class="input-group">
                    <label>Konfirmasi Password</label>
                    <input type="password" name="confirm_password" required>
                </div>
                <button type="submit" class="btn">Daftar</button>
                <p class="message">Sudah punya akun? <a href="#" onclick="showForm('login')">Masuk</a></p>
            </form>
        </div>
    </div>

    <script>
        function showForm(formId) {
            // Update tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');

            // Update forms
            document.querySelectorAll('.form').forEach(form => {
                form.classList.remove('active');
            });
            if (formId === 'login') {
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.getElementById('registerForm').classList.add('active');
            }
        }
    </script>
</body>
</html>
