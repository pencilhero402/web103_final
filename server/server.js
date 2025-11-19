import express from "express";
import cors from "cors";
import "./config/dotenv.js";
import passport from 'passport';
import session from 'express-session';
import { GitHub } from './config/auth.js';
import router from './routes/auth.js';
import userRouter from './routes/users.js';

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
import UserController from "./controllers/userController.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"], // Allow Vite dev server
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  })
);
app.use(express.json());

app.use(session({
    secret: 'codepath',
    resave: 'false',
    saveUnitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(GitHub);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

// routes
app.use('/auth', router);
app.use('/api/user', userRouter);

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

// User routes
app.get("/api/users", UserController.getAllUsers);
app.get("/api/user/:username", UserController.getUserByUsername)

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   GET /api/genres - Get all genres`);
    console.log(`   GET /api/movies - Get movies (with pagination & filtering)`);
    console.log(`   GET /api/movies/:id - Get specific movie`);
    console.log(`   GET /api/genres/:id/movies - Get movies by genre`);
    console.log(`   GET /api/stats - Database statistics`);
    console.log(`   GET /api/users - All users information`)
    console.log(`   GET /api/user - Get specific user information`)
});
