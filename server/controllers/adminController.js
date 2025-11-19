import { pool } from "../config/database.js";
import { seedDatabase } from "../config/seedData.js";

// Seeding endpoint - Run this once to populate your database
export const seedDatabaseController = async (req, res) => {
  try {
    console.log("🌱 Starting database seeding via API...");
    await seedDatabase();
    res.json({
      success: true,
      message: "Database seeded successfully with TMDB data!",
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Database stats endpoint
export const getDatabaseStats = async (req, res) => {
  try {
    const genreCount = await pool.query("SELECT COUNT(*) FROM Genres");
    const movieCount = await pool.query("SELECT COUNT(*) FROM Movies");
    const relationCount = await pool.query("SELECT COUNT(*) FROM Movie_Genres");

    // Get most popular genres
    const popularGenres = await pool.query(`
      SELECT g.name, g.id, COUNT(mg.movie_id) as movie_count
      FROM Genres g
      LEFT JOIN Movie_Genres mg ON g.id = mg.genre_id
      GROUP BY g.id, g.name
      ORDER BY movie_count DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        totalGenres: parseInt(genreCount.rows[0].count),
        totalMovies: parseInt(movieCount.rows[0].count),
        totalRelations: parseInt(relationCount.rows[0].count),
        popularGenres: popularGenres.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
