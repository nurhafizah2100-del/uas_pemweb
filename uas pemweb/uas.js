// ==========================================
// 1. DATABASE LOKAL (CRUD)
// ==========================================
let tasks = JSON.parse(localStorage.getItem('dhini_tasks')) || [
    { id: 1, title: "Data Cleaning Kaggle", icon: "dataset", color: "#a78bfa", status: "done" },
    { id: 2, title: "Algoritma Knapsack", icon: "code", color: "#60a5fa", status: "progress" },
    { id: 3, title: "Review Jurnal Sistem Pakar", icon: "menu_book", color: "#f472b6", status: "pending" }
];

// FUNGSI READ: Menampilkan Data ke Layar
function renderTasks() {
    const taskContainer = document.getElementById('task-list-container');
    if (!taskContainer) return;
    taskContainer.innerHTML = '';

    let countDone = 0, countProgress = 0, countPending = 0;

    tasks.forEach(task => {
        // Hitung statistik
        if (task.status === 'done') countDone++;
        else if (task.status === 'progress') countProgress++;
        else countPending++;

        // Atur Label Status
        let badgeClass = "", badgeText = "";
        if (task.status === 'done') { badgeClass = "badge-done"; badgeText = "Done"; }
        else if (task.status === 'progress') { badgeClass = "badge-progress"; badgeText = "In progress"; }
        else { badgeClass = "badge-pending"; badgeText = "Pending"; }

        // Buat Elemen Kartu Tugas
        const taskCard = document.createElement('div');
        taskCard.className = 'task-item';
        taskCard.innerHTML = `
            <div class="task-info">
                <span class="material-symbols-rounded" style="color: ${task.color};">${task.icon}</span>
                <h4>${task.title}</h4>
            </div>
            <span class="badge ${badgeClass}">${badgeText}</span>
            <div class="task-actions">
                <button class="icon-btn-small" onclick="editTask(${task.id})" title="Edit"><span class="material-symbols-rounded">edit</span></button>
                <button class="icon-btn-small btn-delete" onclick="deleteTask(${task.id})" title="Hapus"><span class="material-symbols-rounded">delete</span></button>
            </div>
        `;
        taskContainer.appendChild(taskCard);
    });

    // Update Angka Statistik di Atas
    document.getElementById('stat-done').textContent = countDone;
    document.getElementById('stat-progress').textContent = countProgress;
    document.getElementById('stat-pending').textContent = countPending;

    // Simpan ke LocalStorage
    localStorage.setItem('dhini_tasks', JSON.stringify(tasks));
}

// FUNGSI CREATE & UPDATE: Modal Form
const taskModal = document.getElementById('crud-modal');
const taskForm = document.getElementById('task-form');

function openTaskModal(id = null) {
    if (id) {
        // Mode Edit (Update)
        const task = tasks.find(t => t.id === id);
        document.getElementById('modal-title').textContent = "Edit Tugas";
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-icon').value = `${task.icon}|${task.color}`;
        document.getElementById('task-status').value = task.status;
    } else {
        // Mode Tambah (Create)
        document.getElementById('modal-title').textContent = "Tambah Tugas Baru";
        taskForm.reset();
        document.getElementById('task-id').value = '';
    }
    taskModal.classList.add('show');
}

function closeTaskModal() {
    taskModal.classList.remove('show');
}

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const status = document.getElementById('task-status').value;
    
    // Pecah value select (misal: "code|#60a5fa" jadi icon="code" dan color="#60a5fa")
    const iconData = document.getElementById('task-icon').value.split('|');
    const icon = iconData[0];
    const color = iconData[1];

    if (id) {
        // Proses Edit
        const index = tasks.findIndex(t => t.id == id);
        tasks[index] = { id: parseInt(id), title, icon, color, status };
        showToast("Tugas berhasil diperbarui!");
    } else {
        // Proses Tambah Baru
        tasks.unshift({ id: Date.now(), title, icon, color, status });
        showToast("Tugas baru berhasil ditambahkan!");
    }

    closeTaskModal();
    renderTasks();
});

// FUNGSI DELETE
window.deleteTask = function(id) {
    if(confirm("Yakin ingin menghapus tugas ini?")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        showToast("Tugas dihapus!");
    }
};


// ==========================================
// 2. NAVIGASI, TEMA & TOAST
// ==========================================
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) dateElement.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function navigateTo(pageId, clickedBtn) {
    document.querySelectorAll('.sidebar .nav-menu .nav-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    const pageTitles = { 'dashboard': 'Dashboard', 'messages': 'Messages', 'calendar': 'Calendar', 'settings': 'Settings' };
    const titleElement = document.getElementById('page-title');
    if (titleElement && pageTitles[pageId]) titleElement.textContent = pageTitles[pageId];

    showToast(`Berpindah ke halaman ${pageTitles[pageId]}`);
}

function logoutApp() {
    if(confirm("Apakah kamu yakin ingin keluar?")) showToast("Logout berhasil.");
}

function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span class="material-symbols-rounded">info</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains('light-mode')) {
        if(themeIcon) themeIcon.textContent = 'dark_mode';
        localStorage.setItem('themeStatus', 'light');
        showToast('Mode Terang ☀️');
    } else {
        if(themeIcon) themeIcon.textContent = 'light_mode';
        localStorage.setItem('themeStatus', 'dark');
        showToast('Mode Gelap 🌙');
    }
}

function checkSavedTheme() {
    if (localStorage.getItem('themeStatus') === 'light') {
        document.body.classList.add('light-mode');
        const themeIcon = document.getElementById('theme-icon');
        if(themeIcon) themeIcon.textContent = 'dark_mode';
    }
}

// ==========================================
// 3. JALANKAN SAAT HALAMAN DIBUKA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    checkSavedTheme();
    renderTasks(); // Munculkan data CRUD
});