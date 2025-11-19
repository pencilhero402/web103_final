import { pool } from "./database.js";
import "./dotenv.js";

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

const createUsersTable = async () => {
    const createTableQuery = ` CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        githubid int NOT NULL,
        username varchar(200) NOT NULL,
        avatarurl varchar(500),
        accesstoken varchar(500) NOT NULL
    );
`;  try {
        await pool.query(createTableQuery);
        console.log("Movies table created successfully");
    } catch (error) {
        console.log("Error creating movies table" + error);
    };

};

const createUserReviewTable = async () => {
    const createTableQuery = ` CREATE TABLE IF NOT EXISTS user_reviews (
                id serial PRIMARY KEY,
                user_id int NOT NULL,
                movie_id int NOT NULL,
                rating int,
                review_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (movie_id) REFERENCES movies(id)
            );
`;  try {
        await pool.query(createTableQuery);
        console.log("Movies table created successfully");
    } catch (error) {
        console.log("Error creating movies table" + error);
    };
}    


const createUserMovieShelfTable = async() => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS user_movie_shelf (
            id serial PRIMARY KEY,
            user_id int NOT NULL,
            movie_id int NOT NULL,
            status TEXT,
            watchlist_priority int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
`;  try {
        await pool.query(createTableQuery);
        console.log("Movies table created successfully");
    } catch (error) {
        console.log("Error creating movies table" + error);
    };
};


await createMoviesTable();
await createGenresTable();
await createMovieGenresTable();
await createUsersTable();
await createUserReviewTable();
await createUserMovieShelfTable();
