import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./animated/GlassCard";
import { ShimmerButton } from "./animated/ShimmerButton";
import { AnimatedText } from "./animated/AnimatedText";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      if (wishlist.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const moviePromises = wishlist.map((movieId) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
              import.meta.env.VITE_MOVIE_API_KEY
            }`
          ).then((res) => res.json())
        );

        const moviesData = await Promise.all(moviePromises);
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching wishlist movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistMovies();
  }, [wishlist]);

  const handleRemoveFromWishlist = (movieId: number) => {
    removeFromWishlist(movieId);
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-100 relative">
      <div className="container mx-auto px-4 py-8">
        <AnimatedText
          text="💝 Ma Wishlist"
          className="text-5xl font-black mb-8 bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
        />

        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Rechercher un film dans la wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 text-lg shadow-2xl transition-all"
              />
            </div>
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
                className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}

          {!loading && wishlist.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <GlassCard className="text-center p-12 max-w-md">
                <div className="text-7xl mb-6">💔</div>
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Votre wishlist est vide
                </h2>
                <p className="text-gray-400 mb-6">
                  Découvrez des films incroyables et ajoutez-les à votre wishlist !
                </p>
                <ShimmerButton
                  onClick={() => navigate("/")}
                  variant="primary"
                  className="px-8 py-3"
                >
                  🎬 Découvrir des films
                </ShimmerButton>
              </GlassCard>
            </motion.div>
          )}

          {!loading && filteredMovies.length === 0 && wishlist.length > 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-xl font-semibold">
                Aucun film trouvé pour cette recherche.
              </p>
            </motion.div>
          )}

          {!loading && filteredMovies.length > 0 && (
            <motion.div
              key="movies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-xl inline-block"
              >
                <span className="text-gray-100 font-bold text-lg">
                  {filteredMovies.length} film{filteredMovies.length > 1 ? "s" : ""} dans votre wishlist
                </span>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map((movie, index) => (
                  <GlassCard key={movie.id} delay={index * 0.05} className="group">
                    <div className="relative aspect-2/3 overflow-hidden">
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
                      <div className="flex flex-col gap-2">
                        <ShimmerButton
                          onClick={() => handleMovieClick(movie.id)}
                          className="w-full py-2 text-sm"
                          variant="secondary"
                        >
                          👁️ Voir les détails
                        </ShimmerButton>
                        <ShimmerButton
                          onClick={() => handleRemoveFromWishlist(movie.id)}
                          className="w-full py-2 text-sm"
                          variant="danger"
                        >
                          🗑️ Supprimer
                        </ShimmerButton>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Wishlist;
