import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterControls from "../components/FilterControls";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort states
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch movies from backend API
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API URL with genre filter if selected
      let apiUrl = "http://localhost:3001/api/movies?limit=100";
      if (selectedGenre) {
        apiUrl += `&genre_id=${selectedGenre}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success) {
        setMovies(data.data);
        applyFiltersAndSort(data.data);
      } else {
        setError("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch genres for filter dropdown
  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/genres");
      const data = await response.json();
      if (data.success) {
        setGenres(data.data);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Apply all filters and sorting
  const applyFiltersAndSort = (movieList = movies) => {
    let filtered = [...movieList];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter (client-side)
    if (selectedYear) {
      filtered = filtered.filter((movie) => {
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear.toString() === selectedYear;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "highest_rated":
          const ratingA = parseFloat(a.external_avg_rating) || 0;
          const ratingB = parseFloat(b.external_avg_rating) || 0;
          return ratingB - ratingA;
        case "newest":
          const dateA = new Date(a.release_date || 0);
          const dateB = new Date(b.release_date || 0);
          return dateB - dateA;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  };

  // Re-apply filters when any filter changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, selectedYear, sortBy, movies]);

  // Fetch movies and genres on component mount
  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  // Re-fetch movies when genre filter changes (for backend filtering)
  useEffect(() => {
    fetchMovies();
  }, [selectedGenre]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMovies}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Search */}
      <section className="bg-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Search for a movie...
          </h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </section>

      {/* Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterControls
          genres={genres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </section>

      {/* Movies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {searchTerm ? `Search Results for "${searchTerm}"` : "All Movies"}
            </h2>
            <p className="text-gray-600">
              {filteredMovies.length}{" "}
              {filteredMovies.length === 1 ? "movie" : "movies"} found
            </p>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Movies Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No movies match "${searchTerm}". Try a different search term.`
                : "No movies available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MoviesPage;
