import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { MusicPage } from './components/MusicPage';
import { FriendsPage } from './components/FriendsPage';
import { TaskDetailModal } from './components/TaskDetailModal';
import { AddTaskModal } from './components/AddTaskModal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { EditProfileModal } from './components/EditProfileModal';
import { type Task, type Page } from './types';
import { ProfilePage } from './components/ProfilePage';
import { ChatWidget } from './components/ChatWidget';

type AuthView = 'login' | 'register';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userPhoto?: string; // Dipertahankan dari kode pertama
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, userName: '', userEmail: '' });
  const [authView, setAuthView] = useState<AuthView>('login');

  const [activePage, setActivePage] = useState<Page>('Tugas');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // --- 1. AMBIL DATA DARI BACKEND ---
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const realTasks = response.data.data.map((t: any) => ({
        id: t.id_task.toString(),
        title: t.judul,
        description: t.deskripsi || '',
        deadline: t.due_date.split('T')[0], // Potong format YYYY-MM-DD
        status: t.status,
        members: ['ME'], 
        file: t.file_lampiran
      }));

      setTasks(realTasks);
    } catch (error) {
      console.error('Gagal memuat tugas dari server:', error);
    }
  };

  // Otomatis tarik data setelah berhasil login
  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchTasks();
    }
  }, [auth.isLoggedIn]);

  // --- 2. AUTHENTICATION LOGIC ---
  const handleLogin = (email: string, name: string, photo?: string) => {
    setAuth({ isLoggedIn: true, userName: name, userEmail: email, userPhoto: photo });
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari browser
    setAuth({ isLoggedIn: false, userName: '', userEmail: '' });
    setAuthView('login');
    setActivePage('Tugas');
    setSelectedTask(null);
    setShowAddModal(false);
    setTasks([]); // Bersihkan board saat logout
  };

  // --- 3. CRUD KANBAN KE DATABASE MYSQL ---
  const moveTask = async (id: string, direction: 'forward' | 'backward') => {
    const order: Task['status'][] = ['Belum', 'Proses', 'Selesai'];
    const taskToMove = tasks.find(t => t.id === id);
    if (!taskToMove) return;

    const idx = order.indexOf(taskToMove.status);
    const newIdx = direction === 'forward' ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= order.length) return;

    const newStatus = order[newIdx];

    // Ubah UI seketika biar terkesan cepat
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Gagal memindah tugas:', error);
      fetchTasks(); // Kalau error, kembalikan ke posisi awal dari database
    }
  };

  const updateStatus = async (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Gagal update status:', error);
      fetchTasks();
    }
  };

  const addTask = async (data: Omit<Task, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', {
        judul: data.title,
        deskripsi: data.description,
        mata_kuliah: 'Umum', 
        due_date: data.deadline
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchTasks(); // Tarik data baru dari DB setelah insert sukses
      setShowAddModal(false);
    } catch (error) {
      console.error('Gagal menambah tugas:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
    } catch (error) {
      console.error('Gagal menghapus tugas:', error);
    }
  };

  // --- RENDERING TAMPILAN ---
  if (!auth.isLoggedIn) {
    if (authView === 'register') {
      return (
        <RegisterPage
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onRegister={handleLogin}
          onGoLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onLogin={handleLogin}
        onGoRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#09090B' : '#F8FAFC', fontFamily: 'Outfit, sans-serif' }}>
      <Navbar
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        activePage={activePage}
        onNavigate={setActivePage}
        userName={auth.userName}
        userEmail={auth.userEmail}
        userPhoto={auth.userPhoto} // Dipertahankan dari kode pertama
        onLogout={handleLogout}
        onEditProfile={() => setShowEditProfile(true)}
      />

      <main style={{ paddingTop: '56px', minHeight: '100vh' }}>
        {activePage === 'Dashboard' && <Dashboard tasks={tasks} isDark={isDark} />}
        {activePage === 'Tugas' && (
          <KanbanBoard
            tasks={tasks}
            isDark={isDark}
            onMoveTask={moveTask}
            onSelectTask={task => setSelectedTask(task)}
            onAddTask={() => setShowAddModal(true)}
          />
        )}
        {activePage === 'Teman' && <FriendsPage isDark={isDark} />}
        {activePage === 'Musik' && <MusicPage isDark={isDark} />}
        {activePage === 'Profil' && <ProfilePage isDark={isDark} />}
      </main>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isDark={isDark}
          onClose={() => setSelectedTask(null)}
          onDelete={deleteTask}
          onMarkDone={() => updateStatus(selectedTask.id, 'Selesai')}
        />
      )}

      {showAddModal && (
        <AddTaskModal
          isDark={isDark}
          onClose={() => setShowAddModal(false)}
          onAdd={addTask}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          isDark={isDark}
          currentName={auth.userName}
          currentEmail={auth.userEmail}
          currentPhoto={auth.userPhoto} // Dipertahankan dari kode pertama
          onClose={() => setShowEditProfile(false)}
          onSuccess={(data) => setAuth(prev => ({ 
            ...prev, 
            userName: data.name, 
            userPhoto: data.photo ?? prev.userPhoto 
          }))} 
        />
      )}

      {/* Komponen ChatWidget dari kode kedua dipasang di sini */}
      <ChatWidget isDark={isDark} />
    </div>
  );
}