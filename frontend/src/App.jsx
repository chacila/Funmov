import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import AddMovie from './pages/AddMovie/AddMovie';
import Users from './pages/Users/Users';
import MovieDetails from './pages/MovieDetails/MovieDetails';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/users" element={<Users />} />
        <Route path="/about" element={<About />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
