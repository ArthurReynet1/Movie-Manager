import { Routes, Route } from "react-router";
import MovieList from "./components/MovieList";
import Wishlist from "./components/Wishlist";
import MovieDetails from "./components/MovieDetails";
import { PATHS } from "./routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={PATHS.HOME} element={<MovieList />} />
        <Route path={PATHS.WISHLIST} element={<Wishlist />} />
        <Route path={PATHS.MOVIE_DETAILS} element={<MovieDetails />} />
      </Routes>
    </>
  );
}

export default App;
