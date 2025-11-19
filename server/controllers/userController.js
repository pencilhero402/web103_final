import { pool } from "../config/database.js";

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const results = await pool.query(`
                SELECT id, username, avatarurl FROM users
                `)
            res.status(200).json(results.rows)
        } catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to GET all users - Error:', error.message)
        }
    },

    getUserByUsername: async (req, res) => {
        try {
            const username = req.params.username
            const results = await pool.query(`
                SELECT id, username, avatarurl
                FROM users
                WHERE username = $1
                `, [username])

            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Movie not found",
                });
            }
            res.status(200).json(results.rows[0])
        } catch(error) {
            res.status(409).json( { error: error.message } )
            console.log('🚫 unable to GET user information - Error:', error.message)
        }
    },

    createUserReview: async (req, res) => {
        try {
            const user_id = parseInt(req.params.user_id)
            const movie_id = parseInt(req.params.movie_id)
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