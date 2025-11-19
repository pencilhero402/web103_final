import { pool } from "../config/database.js";

// Get all genres
export const getAllGenres = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Genres ORDER BY name");
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get movies by genre
export const getMoviesByGenre = async (req, res) => {
  try {
    const { genre_id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT m.*, g.name as genre_name
      FROM Movies m
      JOIN Movie_Genres mg ON m.id = mg.movie_id
      JOIN Genres g ON mg.genre_id = g.id
      WHERE g.id = $1
      ORDER BY m.external_avg_rating DESC
      LIMIT $2 OFFSET $3
    `,
      [genre_id, limit, offset]
    );

    // Get genre info
    const genreResult = await pool.query("SELECT * FROM Genres WHERE id = $1", [
      genre_id,
    ]);

    if (genreResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Genre not found",
      });
    }

    res.json({
      success: true,
      genre: genreResult.rows[0],
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
