import express from "express";
import "./config/dotenv.js";

// Import controllers
import { getAllMovies, getMovieById } from "./controllers/movieController.js";
import {
  getAllGenres,
  getMoviesByGenre,
} from "./controllers/genreController.js";
import {
  seedDatabaseController,
  getDatabaseStats,
} from "./controllers/adminController.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Basic health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Admin routes
app.get("/seed-database", seedDatabaseController);
app.get("/api/stats", getDatabaseStats);

// Genre routes
app.get("/api/genres", getAllGenres);
app.get("/api/genres/:genre_id/movies", getMoviesByGenre);

// Movie routes
app.get("/api/movies", getAllMovies);
app.get("/api/movies/:id", getMovieById);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET /api/genres - Get all genres`);
  console.log(`   GET /api/movies - Get movies (with pagination & filtering)`);
  console.log(`   GET /api/movies/:id - Get specific movie`);
  console.log(`   GET /api/genres/:id/movies - Get movies by genre`);
  console.log(`   GET /api/stats - Database statistics`);
});
