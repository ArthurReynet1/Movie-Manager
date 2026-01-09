import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";

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
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Film not found</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {movie.backdrop_path && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-64 rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-64 h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No poster</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-xl font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>

              {movie.release_date && (
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-gray-300">
                    {new Date(movie.release_date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {movie.runtime && (
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-gray-300">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleWishlistToggle}
              className={`mb-6 px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl ${
                isInWishlist
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isInWishlist
                ? "Retirer de la wishlist"
                : "Ajouter à la wishlist"}
            </button>

            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || "Aucun synopsis disponible."}
              </p>
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Main Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full aspect-2/3 object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-2/3 bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">👤</span>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{actor.name}</h3>
                    <p className="text-gray-400 text-xs">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similarMovies.length > 0 && (
          <div className="mt-12 pb-12">
            <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarMovies.map((similarMovie) => (
                <div
                  key={similarMovie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="relative aspect-2/3">
                    {similarMovie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                        alt={similarMovie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No poster</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-semibold">
                        {similarMovie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-10">
                      {similarMovie.title}
                    </h3>
                    <button
                      onClick={() => handleMovieClick(similarMovie.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
