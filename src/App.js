import './App.css';
import { NavLink, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contato from './pages/Contato';

function App() {
  return (
    <div className="App">
      <nav className="nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/contato">Contato</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </div>
  );
}

export default App;
