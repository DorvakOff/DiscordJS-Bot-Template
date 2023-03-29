import {Database} from "sqlite3";
import {log} from "./logger";

const db = new Database("db.sqlite");

export default db;

// Load schema
export function loadSchema(): void {
    db.serialize(() => {
        log("Loading database schema")

        db.run("CREATE TABLE IF NOT EXISTS discord_servers (id INTEGER PRIMARY KEY, added_at DATE DEFAULT CURRENT_TIMESTAMP, disabled_commands TEXT DEFAULT '[]', disabled_modules TEXT DEFAULT '[]')")
        log("Loaded discord_servers table")

        log("Database schema loaded")
    })
}