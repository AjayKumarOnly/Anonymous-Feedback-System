const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: 3306,
            ssl: {
                rejectUnauthorized: true
            }
        });
        console.log('Connected to MySQL server.');

        await connection.query('CREATE DATABASE IF NOT EXISTS cipherfeedback');
        console.log('Database ensured.');

        await connection.query('USE cipherfeedback');

        await connection.query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      role VARCHAR(50)
    )`);
        console.log('Tables ensured.');

        // Check if other tables from previous implementation need to be created
        // groups, topics, feedback
        await connection.query(`CREATE TABLE IF NOT EXISTS \`groups\` (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        teacherId VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacherId) REFERENCES users(id) ON DELETE CASCADE
    )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS topics (
        id VARCHAR(255) PRIMARY KEY,
        groupId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (groupId) REFERENCES \`groups\`(id) ON DELETE CASCADE
    )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS feedback (
        id VARCHAR(255) PRIMARY KEY,
        topicId VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        toxicityScore FLOAT,
        isBlocked BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topicId) REFERENCES topics(id) ON DELETE CASCADE
    )`);

        console.log('Database setup complete.');
        process.exit(0);

    } catch (err) {
        console.error('MySQL connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
