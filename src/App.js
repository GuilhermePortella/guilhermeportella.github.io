import './App.css';
import { NavLink, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contato from './pages/Contato';

function App() {
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? 'text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-gray-800 shadow-lg">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-4">
            <NavLink to="/" className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/contato" className={getNavLinkClass}>
              Contato
            </NavLink>
            {/* Add other links for Blog, Projects etc. here */}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Guilherme Portella. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
