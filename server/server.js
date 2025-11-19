import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import router from './routes/auth.js'
import userRouter from './routes/users.js'

dotenv.config()
const PORT = process.env.PORT || 3000;

// initalize express
const app = express();

// middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(GitHub)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

// routes
app.use('/auth', router)
app.use('/api', userRouter)

// Root Router
app.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">SceneIt</h1>')
}) 


// listens for app on port 3000 for connections
app.listen(PORT, () => {
  console.log(`CONNECTED. Listing on port ${PORT}`)
})