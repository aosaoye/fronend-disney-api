import axios from "axios"
import path from "node:path"
import sqlite3 from "sqlite3"

export class TMDB {
    async TMDBAPI(endpoint: string = "", params: Record<string, any> = {}) {
        const url = `${process.env.TMDB_API_URL}${endpoint}`
        const response = await axios.get(url, { params, headers: { Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` } })
        return response.data
    }
}

export class SqliteDB {
    instance() {
        const dbpath = path.join(path.resolve(), "data", "disney.sqlite")
        const db = new sqlite3.Database(dbpath)
        return db
    }
}