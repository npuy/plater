import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(__dirname, "../../plater.db"));

// Crear tabla de matrículas
db.exec(`
  CREATE TABLE IF NOT EXISTS plates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number TEXT NOT NULL,
    image_path TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
