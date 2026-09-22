import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MemoryDetailPage } from './pages/MemoryDetailPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { RemindersPage } from './pages/RemindersPage';
import { UploadPage } from './pages/UploadPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/memory/:id" element={<MemoryDetailPage />} />
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
