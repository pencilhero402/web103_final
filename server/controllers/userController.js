import { pool } from "../config/database.js";

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const results = await pool.query(`
                SELECT id, username, avatarurl FROM users
            `)
            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Users not found",
                });
            }
            res.json({
                success: true,
                data: results.rows[0],
            });
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
                    error: "User not found",
                });
            }
            res.json({
                success: true,
                data: results.rows[0],
            });

        } catch(error) {
            res.status(409).json( { error: error.message } )
            console.log('🚫 unable to GET user information - Error:', error.message)
        }
    },

    createUserReview: async (req, res) => {
        try {
            const username = req.params.username 
            const movie_id = parseInt(req.params.movie_id)
            const { rating, review_text } = req.body

            const results = await pool.query(`
                INSERT INTO user_reviews (user_id, movie_id, rating, review_text, username)
                VALUES (
                    (SELECT githubid FROM users WHERE username=$1),
                    $2,
                    $3,
                    $4,
                    $5)
                RETURNING *`, [username, movie_id, rating, review_text, username]
            )
            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            res.json({
                success: true,
                data: results.rows[0],
            });
            console.log('🆕 added movie reivew')
        } catch (error) {
            res.status(409).json( { error: error.message } )
            console.log('🚫 unable to POST user review - Error:', error.message)
        }
    },

    getUserReviews: async(req, res) => {
        try {
            const username = req.params.username;
            const results = await pool.query(`SELECT * FROM user_reviews WHERE username = $1`, [username])
            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            res.json({
                success: true,
                data: results.rows,
            });
        } catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to GET all user reviews  - Error:', error.message)
        }
    },

    createUserWatchlist: async(req, res) => {
        try {
            const username = req.params.username;
            const movie_id = req.params.movie_id;
            const { status, watchlist_priority } = req.body;

            const results = await pool.query(`INSERT INTO user_movie_shelf 
                (user_id, movie_id, status, watchlist_priority)
                VALUES(
                    (SELECT githubid as id FROM users WHERE username=$1),
                    $2,
                    $3,
                    $4)
                RETURNING *`, [username, movie_id, status, watchlist_priority] );

            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            res.json({
                success: true,
                data: results.rows[0],
            });
        }
        catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to POST user watchlist  - Error:', error.message)
        }
    },

    getUserWatchlist: async(req, res) => {
        try {
            const { username } = req.params;
            const results = await pool.query(
                `SELECT * FROM user_movie_shelf
                WHERE user_id = 
                (SELECT githubid FROM users WHERE username = $1);`, [username]);

            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            res.json({
                success: true,
                data: results.rows,
            });
        } catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to GET user watchlist  - Error:', error.message)
        }
    },

    updateUserWatchlist: async(req, res) => {
        try {
            const { username, movie_id } = req.params;
            const {status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false, 
                error: "Status is required" 
                });
            }
            const result = await pool.query(
                `UPDATE user_movie_shelf
                SET status = $1
                WHERE user_id = (SELECT githubid FROM users WHERE username = $2)
                AND movie_id = $3
                RETURNING *`,
                [status, username, movie_id]
            );
            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            res.json({
                success: true,
                data: results.rows,
            });
        } catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to PATCH user watchlist  - Error:', error.message)
        }
    },

    getAllWatchlist: async(req, res) => {
        try {
            const results = await pool.query(`
                SELECT * FROM user_movie_shelf`);
            if (results.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Watchlists not found",
                });
            }
            res.json({
                success: true,
                data: results.rows,
            });
        } catch (error) {
            res.status(409).json( { error: error.message })
            console.log('🚫 unable to GET all watchlists  - Error:', error.message)
        }
    },
}

export default UserController;