import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
    { id: "popular" as Category, label: "Popular" },
    { id: "now_playing" as Category, label: "Now Playing" },
    { id: "top_rated" as Category, label: "Top Rated" },
    { id: "upcoming" as Category, label: "Upcoming" },
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search film..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          />
        </div>

        {!searchQuery && (
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  category === cat.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
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
                  <button
                    onClick={() => handleMovieClick(movie.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No film found for this search.
            </p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
              }`}
            >
              Précédent
            </button>

            <span className="text-gray-300 font-medium">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
              }`}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieList;
