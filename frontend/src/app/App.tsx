import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { MusicPage } from './components/MusicPage';
import { FriendsPage } from './components/FriendsPage';
import { TaskDetailModal } from './components/TaskDetailModal';
import { AddTaskModal } from './components/AddTaskModal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { type Task, type Page } from './types';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Laporan Praktikum Fisika',
    description: 'Membuat laporan hasil praktikum gelombang dan optik semester ini sesuai format yang ditentukan.',
    deadline: '2026-06-20',
    status: 'Belum',
    members: ['AL', 'BI', 'CI'],
  },
  {
    id: '2',
    title: 'Presentasi Sejarah',
    description: 'Menyiapkan slide presentasi tentang peristiwa proklamasi kemerdekaan Indonesia 1945.',
    deadline: '2026-06-25',
    status: 'Belum',
    members: ['AL', 'DI'],
  },
  {
    id: '3',
    title: 'UAS Pemrograman Web',
    description: 'Mengerjakan project akhir semester membuat website e-commerce dengan React dan Tailwind CSS.',
    deadline: '2026-06-16',
    status: 'Proses',
    members: ['AL', 'BI', 'CI'],
    file: 'brief-uas-pemweb.pdf',
  },
  {
    id: '4',
    title: 'Makalah Matematika',
    description: 'Menyusun makalah tentang kalkulus integral dengan contoh soal beserta penyelesaiannya.',
    deadline: '2026-06-18',
    status: 'Proses',
    members: ['AL', 'BI'],
  },
  {
    id: '5',
    title: 'Quiz Kimia Organik',
    description: 'Mengerjakan quiz online bab senyawa hidrokarbon dan reaksi kimia dasar.',
    deadline: '2026-06-10',
    status: 'Selesai',
    members: ['AL'],
  },
  {
    id: '6',
    title: 'Tugas Bahasa Inggris',
    description: 'Menulis essay argumentatif tentang dampak media sosial terhadap kualitas pendidikan.',
    deadline: '2026-06-12',
    status: 'Selesai',
    members: ['AL', 'BI'],
  },
];

type AuthView = 'login' | 'register';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, userName: '', userEmail: '' });
  const [authView, setAuthView] = useState<AuthView>('login');

  const [activePage, setActivePage] = useState<Page>('Tugas');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleLogin = (email: string, name: string) => {
    setAuth({ isLoggedIn: true, userName: name, userEmail: email });
  };

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, userName: '', userEmail: '' });
    setAuthView('login');
    setActivePage('Tugas');
    setSelectedTask(null);
    setShowAddModal(false);
  };

  const moveTask = (id: string, direction: 'forward' | 'backward') => {
    const order: Task['status'][] = ['Belum', 'Proses', 'Selesai'];
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const idx = order.indexOf(t.status);
        const newIdx = direction === 'forward' ? idx + 1 : idx - 1;
        if (newIdx < 0 || newIdx >= order.length) return t;
        return { ...t, status: order[newIdx] };
      })
    );
  };

  const updateStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const addTask = (data: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...data, id: Date.now().toString() }]);
    setShowAddModal(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTask(null);
  };

  // Auth screens
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

  // Main app
  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#09090B' : '#F8FAFC', fontFamily: 'Outfit, sans-serif' }}>
      <Navbar
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        activePage={activePage}
        onNavigate={setActivePage}
        userName={auth.userName}
        userEmail={auth.userEmail}
        onLogout={handleLogout}
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
    </div>
  );
}
