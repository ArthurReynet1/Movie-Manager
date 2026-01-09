import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./animated/GlassCard";
import { ShimmerButton } from "./animated/ShimmerButton";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

type Category = "popular" | "now_playing" | "top_rated" | "upcoming";

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<Category>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const endpoint = searchQuery
          ? `https://api.themoviedb.org/3/search/movie?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`
          : `https://api.themoviedb.org/3/movie/${category}?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }&page=${currentPage}`;

        const response = await fetch(endpoint);
        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [category, searchQuery, currentPage]);

  const categories = [
    { id: "popular" as Category, label: "Popular", icon: "🔥" },
    { id: "now_playing" as Category, label: "Now Playing", icon: "🎬" },
    { id: "top_rated" as Category, label: "Top Rated", icon: "⭐" },
    { id: "upcoming" as Category, label: "Upcoming", icon: "🎭" },
  ];

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen text-gray-100 relative">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search for movies..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-6 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-lg shadow-2xl transition-all"
            />
          </div>
        </motion.div>

        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  category === cat.id
                    ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-violet-500/50"
                    : "backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <motion.div
                className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}

          {!loading && movies.length > 0 && (
            <motion.div
              key="movies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {movies.map((movie, index) => (
                <GlassCard key={movie.id} delay={index * 0.05} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.poster_path ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <span className="text-gray-500 text-4xl">🎬</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 backdrop-blur-xl bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="text-sm font-bold text-white">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </motion.div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-3 line-clamp-2 min-h-10 text-white">
                      {movie.title}
                    </h3>
                    <ShimmerButton
                      onClick={() => handleMovieClick(movie.id)}
                      className="w-full py-2 text-sm"
                      variant="primary"
                    >
                      View details
                    </ShimmerButton>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {!loading && movies.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400 text-xl font-semibold">
                No films found for this search.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && movies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-6 mt-12"
          >
            <ShimmerButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-8 py-3"
              variant="secondary"
            >
              ← Précédent
            </ShimmerButton>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-xl">
              <span className="text-gray-100 font-bold text-lg">
                Page {currentPage} / {totalPages}
              </span>
            </div>

            <ShimmerButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-8 py-3"
              variant="secondary"
            >
              Suivant →
            </ShimmerButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MovieList;
