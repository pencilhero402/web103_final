function FilterControls({
  genres,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  sortBy,
  setSortBy,
}) {
  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const clearAllFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSortBy("newest");
  };

  const hasActiveFilters = selectedGenre || selectedYear || sortBy !== "newest";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Genre Filter */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Right side - Clear Filters */}
        <div className="flex-shrink-0">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 font-medium">
              Active filters:
            </span>

            {selectedGenre && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {genres.find((g) => g.id.toString() === selectedGenre)?.name}
                <button
                  onClick={() => setSelectedGenre("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            {selectedYear && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {selectedYear}
                <button
                  onClick={() => setSelectedYear("")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}

            {sortBy !== "newest" && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                {sortBy === "highest_rated" ? "Highest Rated" : "Title A-Z"}
                <button
                  onClick={() => setSortBy("newest")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterControls;
