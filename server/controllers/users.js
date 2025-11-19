import { pool } from '../config/database.js';

const createUsersTableQuery = ` CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        githubid int NOT NULL,
        username varchar(200) NOT NULL,
        avatarurl varchar(500),
        accesstoken varchar(500) NOT NULL
    );
`

const createUserReviewTable = ` CREATE TABLE IF NOT EXISTS user_reviews (
                id serial PRIMARY KEY,
                user_id int NOT NULL,
                movie_id int NOT NULL,
                rating int,
                review_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (movie_id) REFERENCES movies(id)
            );
`

const createUserMovieShelf = `CREATE TABLE IF NOT EXISTS user_movie_shelf (
            id serial PRIMARY KEY,
            user_id int NOT NULL,
            movie_id int NOT NULL,
            status TEXT,
            watchlist_priority int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
`
pool.query(createUsersTableQuery, (error, res) => {
    if (error) {
        console.log(error)
        return
    }
    console.log('✅ users table created successfully!')
})

pool.query(createUserReviewTable, (error, res) => {
    if (error) {
        console.log(error)
    }
    console.log('✅ user reivew table created successfully!')
})

pool.query(createUserMovieShelf, (error, res) => {
    if (error) {
        console.log(error)
    }
    console.log('✅ user movie shelf table created successfully!')
})

const UserController = {
    createUserReview: async (req, res) => {
        try {
            user_id = parseInt(req.params.user_id)
            movie_id = parseInt(req.params.movie_id)
            const { rating, review_text } = req.body

            const results = await pool.query(`
                INSERT INTO user_reviews (user_id, movie_id, rating, review_text)
                VALUES($1, $2, $3, $4)
                RETURNING *`, [user_id, movie_id, rating, review_text]
            )
            res.status(200).json(results.rows[0])
            console.log('🆕 added movie reivew')
        } catch (error) {
            res.status(409).json( { error: error.message } )
            console.log('Error:', error.message)
        }
    },

    getUserReviews: async(req, res) => {
        try {
            const user_id = parseInt(req.params.user_id)
            const results = await pool.query(`SELECT * FROM user_reviews WHERE user_id = $1`, [user_id])
            res.status(200).json(results.rows)
        } catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to GET all user reviews  - Error:', error.message)
        }
    },
}

export default UserController;