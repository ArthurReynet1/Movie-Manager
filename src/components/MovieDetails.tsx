import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";
import { motion } from "framer-motion";
import { GlassCard } from "./animated/GlassCard";
import { ShimmerButton } from "./animated/ShimmerButton";

interface MovieDetail {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const isInWishlist = movie ? wishlist.includes(movie.id) : false;

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const [movieResponse, creditsResponse, similarResponse] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${
                import.meta.env.VITE_MOVIE_API_KEY
              }`
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${
                import.meta.env.VITE_MOVIE_API_KEY
              }`
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${
                import.meta.env.VITE_MOVIE_API_KEY
              }`
            ),
          ]);

        const movieData = await movieResponse.json();
        const creditsData = await creditsResponse.json();
        const similarData = await similarResponse.json();

        setMovie(movieData);
        setCast(creditsData.cast?.slice(0, 10) || []);
        setSimilarMovies(similarData.results?.slice(0, 10) || []);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!movie) return;
    if (isInWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie.id);
    }
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          className="w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen text-gray-100 flex justify-center items-center">
        <GlassCard className="text-center p-12">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-3xl font-bold mb-6 text-white">Film not found</h2>
          <ShimmerButton onClick={() => navigate("/")} variant="primary">
            Back to home
          </ShimmerButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 relative">
      {movie.backdrop_path && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[500px] overflow-hidden"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 -mt-64 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="shrink-0"
          >
            <GlassCard hover={false}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-64 rounded-2xl"
                />
              ) : (
                <div className="w-64 h-96 bg-white/5 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500 text-6xl">🎬</span>
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <h1 className="text-5xl font-black mb-6 bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-3 rounded-xl shadow-lg"
              >
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-2xl font-bold text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
              </motion.div>

              {movie.release_date && (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-3 rounded-xl">
                  <span className="text-gray-200 font-semibold">
                    📅 {new Date(movie.release_date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {movie.runtime && (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-3 rounded-xl">
                  <span className="text-gray-200 font-semibold">
                    ⏱️ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {movie.genres.map((genre, index) => (
                  <motion.span
                    key={genre.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="backdrop-blur-xl bg-linear-to-r from-violet-600/50 to-fuchsia-600/50 border border-white/20 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                  >
                    {genre.name}
                  </motion.span>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <ShimmerButton
                onClick={handleWishlistToggle}
                variant={isInWishlist ? "danger" : "primary"}
                className="px-8 py-4 text-lg"
              >
                {isInWishlist ? "❌ Retirer de la wishlist" : "💝 Ajouter à la wishlist"}
              </ShimmerButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">📖 Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-lg backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
                {movie.overview || "Aucun synopsis disponible."}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-black mb-8 bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              🎭 Main Cast
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {cast.map((actor, index) => (
                <GlassCard key={actor.id} delay={0.8 + index * 0.05} hover={false}>
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full aspect-2/3 object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-2/3 bg-white/5 flex items-center justify-center rounded-t-2xl">
                      <span className="text-gray-500 text-5xl">👤</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 text-white">{actor.name}</h3>
                    <p className="text-gray-400 text-xs">{actor.character}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {similarMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-black mb-8 bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              🎥 Similar Movies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarMovies.map((similarMovie, index) => (
                <GlassCard key={similarMovie.id} delay={1.0 + index * 0.05} className="group">
                  <div className="relative aspect-2/3 overflow-hidden">
                    {similarMovie.poster_path ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                        alt={similarMovie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <span className="text-gray-500 text-4xl">🎬</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 backdrop-blur-xl bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="text-sm font-bold text-white">
                        {similarMovie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-3 line-clamp-2 min-h-10 text-white">
                      {similarMovie.title}
                    </h3>
                    <ShimmerButton
                      onClick={() => handleMovieClick(similarMovie.id)}
                      className="w-full py-2 text-sm"
                      variant="primary"
                    >
                      View details
                    </ShimmerButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
