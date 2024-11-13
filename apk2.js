// Ambil elemen-elemen yang diperlukan
const sidebar = document.querySelector('.sidebar');
const sidebarCloseButton = document.querySelector('.sidebar-close');
const menuToggle = document.querySelector('.menu-toggle');
const mainContent = document.querySelector('.main-content');

// Fungsi untuk menampilkan sidebar
function openSidebar() {
    sidebar.classList.add('active'); // Menambahkan kelas 'active' untuk menampilkan sidebar
    mainContent.classList.add('active'); // Menambahkan kelas untuk menggeser konten utama jika diperlukan
}

// Fungsi untuk menutup sidebar
function closeSidebar() {
    sidebar.classList.remove('active'); // Menghapus kelas 'active' untuk menyembunyikan sidebar
    mainContent.classList.remove('active'); // Mengembalikan posisi konten utama
}

// Menambahkan event listener pada tombol close di sidebar (tombol X)
sidebarCloseButton.addEventListener('click', closeSidebar);

// Menambahkan event listener pada menu toggle untuk membuka sidebar
menuToggle.addEventListener('click', openSidebar);

});
