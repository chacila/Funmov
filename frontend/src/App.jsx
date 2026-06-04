import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Find from './pages/Find/Find';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Users from './pages/Users/Users';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import Profile from './pages/Profile/Profile';
import AddMovie from './pages/AddMovie/AddMovie';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<Find />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/users" element={<Users />} />
        <Route path="/about" element={<About />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
