const Database = require("better-sqlite3");

const db = new Database("internship.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        mode TEXT NOT NULL,
        location TEXT NOT NULL,
        skills TEXT NOT NULL,
        openings INTEGER NOT NULL
    )
`);

module.exports = db;