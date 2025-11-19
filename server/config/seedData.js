import { pool } from "./database.js";
import "./dotenv.js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Helper to build complete image URLs from TMDB paths
const buildImageURL = (path) => {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : null;
};

// Step 1: Fetch and insert genres using TMDB genre IDs
const seedGenres = async () => {
  try {
    console.log("🎭 Fetching genres from TMDB...");

    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    console.log(`Found ${data.genres.length} genres from TMDB`);

    for (const genre of data.genres) {
      await pool.query(
        "INSERT INTO Genres (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name",
        [genre.id, genre.name] // Using TMDB's exact genre ID
      );
    }

    console.log(`✅ Successfully seeded ${data.genres.length} genres`);
    return data.genres.length;
  } catch (error) {
    console.error("❌ Error seeding genres:", error.message);
    throw error;
  }
};

// Step 2: Fetch and insert movies using TMDB movie IDs
const seedMovies = async (totalPages = 10) => {
  try {
    console.log(`🎬 Fetching ${totalPages} pages of movies from TMDB...`);

    let totalMovies = 0;
    let totalGenreRelations = 0;

    for (let page = 1; page <= totalPages; page++) {
      console.log(`📄 Processing page ${page}/${totalPages}...`);

      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
      );

      if (!response.ok) {
        console.log(`⚠️ Failed to fetch page ${page}: ${response.status}`);
        break;
      }

      const data = await response.json();

      for (const movie of data.results) {
        try {
          // Insert movie using TMDB's exact movie ID
          await pool.query(
            `INSERT INTO Movies (id, title, release_date, overview, img_path, external_avg_rating) 
                         VALUES ($1, $2, $3, $4, $5, $6) 
                         ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            release_date = EXCLUDED.release_date,
                            overview = EXCLUDED.overview,
                            img_path = EXCLUDED.img_path,
                            external_avg_rating = EXCLUDED.external_avg_rating`,
            [
              movie.id, // TMDB movie ID (exact match)
              movie.title,
              movie.release_date || null,
              movie.overview || null,
              buildImageURL(movie.poster_path),
              movie.vote_average || null,
            ]
          );

          totalMovies++;

          // Insert movie-genre relationships using exact TMDB IDs
          if (movie.genre_ids && movie.genre_ids.length > 0) {
            for (const genreId of movie.genre_ids) {
              await pool.query(
                "INSERT INTO Movie_Genres (movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [movie.id, genreId] // Both IDs match TMDB exactly
              );
              totalGenreRelations++;
            }
          }
        } catch (movieError) {
          console.error(
            `Error inserting movie ${movie.title}:`,
            movieError.message
          );
        }
      }

      // Be respectful to TMDB API - small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    console.log(`✅ Successfully seeded ${totalMovies} movies`);
    console.log(`🔗 Created ${totalGenreRelations} movie-genre relationships`);

    return { movies: totalMovies, relations: totalGenreRelations };
  } catch (error) {
    console.error("❌ Error seeding movies:", error.message);
    throw error;
  }
};

// Step 3: Verify data integrity
const verifySeeding = async () => {
  try {
    const genreCount = await pool.query("SELECT COUNT(*) FROM Genres");
    const movieCount = await pool.query("SELECT COUNT(*) FROM Movies");
    const relationCount = await pool.query("SELECT COUNT(*) FROM Movie_Genres");

    console.log("📊 Database Summary:");
    console.log(`   Genres: ${genreCount.rows[0].count}`);
    console.log(`   Movies: ${movieCount.rows[0].count}`);
    console.log(`   Movie-Genre Relations: ${relationCount.rows[0].count}`);

    // Sample verification - get a movie with its genres
    const sampleMovie = await pool.query(`
            SELECT m.id, m.title, array_agg(g.name) as genres
            FROM Movies m
            JOIN Movie_Genres mg ON m.id = mg.movie_id
            JOIN Genres g ON mg.genre_id = g.id
            GROUP BY m.id, m.title
            LIMIT 1
        `);

    if (sampleMovie.rows.length > 0) {
      const movie = sampleMovie.rows[0];
      console.log(
        `🎬 Sample: "${movie.title}" (ID: ${
          movie.id
        }) - Genres: ${movie.genres.join(", ")}`
      );
    }
  } catch (error) {
    console.error("❌ Error verifying data:", error.message);
  }
};

// Main seeding function
const seedDatabase = async () => {
  const startTime = Date.now();

  try {
    console.log("🌱 Starting database seeding with TMDB data...");
    console.log("📝 Note: Using exact TMDB IDs to prevent duplication");

    // Check if TMDB API key exists
    if (!TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY not found in environment variables");
    }

    // Step 1: Seed genres (this creates the foundation for movie-genre relationships)
    await seedGenres();

    // Step 2: Seed movies and their genre relationships (10 pages = ~200 movies)
    await seedMovies(10);

    // Step 3: Verify everything worked
    await verifySeeding();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🎉 Database seeding completed successfully in ${duration}s!`);
    console.log(
      "💡 Your database now contains TMDB movies with matching IDs for easy API integration"
    );
  } catch (error) {
    console.error("💥 Database seeding failed:", error.message);
    console.error("🔍 Please check your TMDB API key and database connection");
    throw error;
  }
};

// Export functions for individual use
export { seedDatabase, seedGenres, seedMovies, verifySeeding };
