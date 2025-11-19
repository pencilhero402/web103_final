import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build TMDB image URL
  const buildImageURL = (path, size = "w500") => {
    if (!path) return "/placeholder-movie.svg";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  // Format rating
  const formatRating = (rating) => {
    return rating ? parseFloat(rating).toFixed(1) : "N/A";
  };

  // Format release date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate distinct colors for genre pills
  const getGenreColor = (genre, index) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ];
    return colors[index % colors.length];
  };

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3001/api/movies/${id}`);
        const data = await response.json();

        if (data.success) {
          setMovie(data.data);
        } else {
          setError("Movie not found");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
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
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {error || "Movie not found"}
          </h3>
          <p className="text-gray-600 mb-6">
            The movie you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            to="/movies"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/movies"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Movies
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={buildImageURL(movie.img_path, "w500")}
                alt={movie.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-movie.svg";
                }}
              />
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              {/* Title and Basic Info */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {/* Rating */}
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold text-gray-900">
                      {formatRating(movie.external_avg_rating)}
                    </span>
                    <span className="text-gray-600 ml-1">User Score: 80%</span>
                  </div>

                  {/* Release Date */}
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">
                    {formatDate(movie.release_date)}
                  </span>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      Genres:
                    </span>
                    <div className="inline-flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getGenreColor(
                            genre,
                            index
                          )}`}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Watchlist Button */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-6">
                  Add to Watchlist
                </button>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Overview:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Movie Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Movie Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="block text-sm font-medium text-gray-600">
                  Release Date
                </span>
                <span className="text-gray-900">
                  {formatDate(movie.release_date)}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">
                  Rating
                </span>
                <span className="text-gray-900">
                  {formatRating(movie.external_avg_rating)}/10
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">
                  Movie ID
                </span>
                <span className="text-gray-900">#{movie.id}</span>
              </div>
            </div>
          </div>

          {/* Community Rating */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Community Rating
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatRating(movie.external_avg_rating)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <=
                      Math.round(parseFloat(movie.external_avg_rating || 0) / 2)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on community reviews
              </p>
            </div>
          </div>

          {/* Your Review Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Review
            </h3>
            <div className="text-center text-gray-500">
              <p className="mb-4">/10</p>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Rate This Movie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
