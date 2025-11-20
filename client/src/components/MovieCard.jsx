import { useState } from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie, rating, status: initialStatus, onStatusChange }) {
  // Build TMDB image URL
  const buildImageURL = (path, size = "w500") => {
    if (!path) return "/placeholder-movie.svg";
    return `https://image.tmdb.org/t/p/${size}${path}`;
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

  // Format rating
  const formatRating = (rating) => {
    return rating ? parseFloat(rating).toFixed(1) : "N/A";
  };

    const [status, setStatus] = useState(initialStatus || "Not watched");

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        if (onStatusChange) {
            onStatusChange(movie.id, newStatus)
        }
    }

    const formatStatus =(status) => {
    return status || "N/A";
    }

  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer">
        {/* Movie Poster */}
        <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden">
        <Link to={`/movie/${movie.id}`} className="block">
          <img
            src={buildImageURL(movie.img_path)}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/placeholder-movie.svg";
            }}
          />
        </Link>

          {/* Rating Badge */}
          {movie.external_avg_rating && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-semibold">
              ⭐ {formatRating(movie.external_avg_rating)}
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
            {movie.title}
          </h3>

          {/* Genres - Pill Style */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getGenreColor(
                    genre,
                    index
                  )}`}
                >
                  {genre}
                </span>
              ))}
              {movie.genres.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  +{movie.genres.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium">Rating</span>
            <span>{formatRating(movie.external_avg_rating)}</span>
          </div>

        {/* Your rating */}
        {rating && (
            <div className="flex justify-between items-center text-sm text-gray-600">
                <span className="font-medium">Your Rating</span>
                <span>{formatRating(rating)}</span>
            </div>
        )}

        {/* Status */}
        {status && (
            <div className="flex justify-between items-center text-sm text-gray-600">
                <span className="font-medium">Status: </span>
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="rounded px-2 py-1 text-xs"
                    >
                    <option value="Not watched">🔵 Not watched</option>
                    <option value="Watching">🟡 Watching</option>
                    <option value="Watched">🟢 Watched</option>
                </select>
            </div>
        )}

          {movie.release_date && (
            <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span className="font-medium">Year</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          )}
        </div>
      </div>
  );
}

export default MovieCard;
