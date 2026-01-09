import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { WishlistContext } from "../context/WishlistProvider";

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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Ma Wishlist</h1>

        {wishlist.length > 0 && (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Rechercher un film dans la wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && wishlist.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              Votre wishlist est vide.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Découvrir des films
            </button>
          </div>
        )}

        {!loading && filteredMovies.length === 0 && wishlist.length > 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Aucun film trouvé pour cette recherche.
            </p>
          </div>
        )}

        {!loading && filteredMovies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-2/3">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
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
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-10">
                    {movie.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleMovieClick(movie.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Voir les détails
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(movie.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
