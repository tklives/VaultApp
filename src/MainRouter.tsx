import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; 
import VaultersPage from './pages/VaultersPage';
import MeetsPage from './pages/MeetsPage';
import MeetDetailPage from './pages/MeetDetailPage';
import DevSeeder from './pages/DevSeeder';
import Layout from './components/Layout'; // Import the Layout component
import './index.css';

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Layout> {/* Wrap the routes with Layout */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/vaulters" element={<VaultersPage />} />
          <Route path="/meets" element={<MeetsPage />} />
          <Route path="/meets/:id" element={<MeetDetailPage />} />
          <Route path="/seed" element={<DevSeeder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
