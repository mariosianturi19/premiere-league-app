import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import TeamDetail from './pages/TeamDetail';
import About from './pages/About'; // <-- Import halaman About

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/about" element={<About />} /> {/* <-- Tambahkan Route */}
      </Routes>
    </Router>
  );
}

export default App;