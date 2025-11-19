import { pool } from "./database.js";
import "./dotenv.js";

const testDB = async () => {
  const testQuery = `
        SELECT version()
    `;
};

const createMoviesTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Movies (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            release_date DATE,
            overview TEXT,
            img_path TEXT,
            external_avg_rating DECIMAL(5,3)
        )
    `;

  try {
    await pool.query(createTableQuery);
    console.log("Movies table created successfully");
  } catch (error) {
    console.log("Error creating movies table" + error);
  }
};

const createGenresTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Genres (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        )
    `;

  try {
    await pool.query(createTableQuery);
    console.log("Genres table created successfully");
  } catch (error) {
    console.log("Error creating Genres table" + error);
  }
};

const createMovieGenresTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Movie_Genres (
            movie_id INTEGER,
            genre_id INTEGER,
            PRIMARY KEY (movie_id, genre_id),
            FOREIGN KEY (movie_id) REFERENCES Movies(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE CASCADE
        )
    `;

  try {
    await pool.query(createTableQuery);
    console.log("MovieGenres table created successfully");
  } catch (error) {
    console.log("Error creating MovieGenres table" + error);
  }
};

await createMoviesTable();
await createGenresTable();
await createMovieGenresTable();
export default testDB;
