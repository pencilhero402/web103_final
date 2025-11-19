import { pool } from "../config/database.js";

// Get all movies with pagination and optional filtering
export const getAllMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre_id,
      sort = "external_avg_rating",
      order = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, 
             array_agg(DISTINCT g.name) as genres,
             array_agg(DISTINCT g.id) as genre_ids
      FROM Movies m
      LEFT JOIN Movie_Genres mg ON m.id = mg.movie_id
      LEFT JOIN Genres g ON mg.genre_id = g.id
    `;

    let queryParams = [];
    let paramCount = 0;

    // Add genre filtering if specified
    if (genre_id) {
      query += ` WHERE m.id IN (
        SELECT DISTINCT movie_id 
        FROM Movie_Genres 
        WHERE genre_id = $${++paramCount}
      )`;
      queryParams.push(genre_id);
    }

    query += ` GROUP BY m.id`;

    // Add sorting
    const validSortFields = [
      "title",
      "release_date",
      "external_avg_rating",
      "id",
    ];
    const validOrders = ["ASC", "DESC"];

    if (
      validSortFields.includes(sort) &&
      validOrders.includes(order.toUpperCase())
    ) {
      query += ` ORDER BY m.${sort} ${order.toUpperCase()}`;
    } else {
      query += ` ORDER BY m.external_avg_rating DESC`;
    }

    // Add pagination
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(DISTINCT m.id) FROM Movies m";
    let countParams = [];

    if (genre_id) {
      countQuery += ` JOIN Movie_Genres mg ON m.id = mg.movie_id WHERE mg.genre_id = $1`;
      countParams = [genre_id];
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalMovies = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMovies,
        moviesPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a specific movie by ID with its genres
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT m.*, 
             array_agg(DISTINCT g.name) as genres,
             array_agg(DISTINCT g.id) as genre_ids
      FROM Movies m
      LEFT JOIN Movie_Genres mg ON m.id = mg.movie_id
      LEFT JOIN Genres g ON mg.genre_id = g.id
      WHERE m.id = $1
      GROUP BY m.id
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Movie not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
