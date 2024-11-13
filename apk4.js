/* Sidebar dan Konten Utama */

.sidebar {
    width: 280px;
    background: rgba(15, 23, 42, 0.95);
    position: fixed;
    height: 100vh;
    transform: translateX(-100%); /* Menyembunyikan sidebar secara default */
    transition: transform 0.3s ease; /* Animasi untuk membuka sidebar */
}

.sidebar.active {
    transform: translateX(0); /* Menampilkan sidebar */
}

.main-content {
    margin-left: 0;
    transition: margin-left 0.3s ease; /* Animasi untuk konten utama */
}

.main-content.active {
    margin-left: 280px; /* Geser konten utama ketika sidebar terbuka */
}

/* Tombol Close Sidebar (X) */
.sidebar-close {
    font-size: 2rem;
    color: red;
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-bottom: 20px;
    transition: color 0.3s ease;
}

.sidebar-close:hover {
    color: #ff0000;
}
