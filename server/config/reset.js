import { pool } from './database.js'
import './dotenv.js'

const testDB = async () => {
    const testQuery = `
        SELECT version()
    `
} 
export default testDB;