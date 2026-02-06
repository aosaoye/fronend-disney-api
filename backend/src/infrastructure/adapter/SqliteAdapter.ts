import { Movie } from "../../domain/entities/Movie.ts";
import type { MovieRepository } from "../../domain/repositories/MovieRepository.ts";
import { SqliteDB } from "../db/db.ts";

export class SqliteAdapter implements MovieRepository {
    private db: SqliteDB
    constructor() {
        this.db = new SqliteDB()
    }
    getTrailer(id: number): Promise<string | null> {
        throw new Error("Method not implemented.");
    }
    async getAll(page: number = 1): Promise<Movie[]> {
        const limit = 20;
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            this.db.instance().all(`SELECT * FROM characters LIMIT ${limit} OFFSET ${offset}`, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.mapRows(rows))
                }
            })
        })
    }

    async getPopular(page: number = 1): Promise<Movie[]> {
        const limit = 20;
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            this.db.instance().all(`SELECT * FROM characters ORDER BY popularity DESC LIMIT ${limit} OFFSET ${offset}`, (err, rows) => {
                if (err) resolve([])
                else resolve(this.mapRows(rows))
            })
        })
    }

    async getTopRated(page: number = 1): Promise<Movie[]> {
        const limit = 20;
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            this.db.instance().all(`SELECT * FROM characters ORDER BY vote_average DESC LIMIT ${limit} OFFSET ${offset}`, (err, rows) => {
                if (err) resolve([])
                else resolve(this.mapRows(rows))
            })
        })
    }

    async getUpcoming(page: number = 1): Promise<Movie[]> {
        // Placeholder logic: Filter by date > now? For now just generic pagination.
        // Ideally: WHERE release_date > date('now')
        const limit = 20;
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            this.db.instance().all(`SELECT * FROM characters WHERE release_date > date('now') LIMIT ${limit} OFFSET ${offset}`, (err, rows) => {
                if (err) resolve([])
                else resolve(this.mapRows(rows))
            })
        })
    }

    async getNowPlaying(page: number = 1): Promise<Movie[]> {
        // Placeholder
        return this.getAll(page);
    }

    async getById(id: number): Promise<Movie | null> {
        return new Promise((resolve, reject) => {
            this.db.instance().get("SELECT * FROM characters WHERE id = ?", [id], (err, row: any) => {
                if (err) {
                    reject(err)
                } else if (!row) {
                    resolve(null)
                } else {
                    resolve(this.mapRow(row))
                }
            })
        })
    }
    async getByName(name: string, page: number = 1): Promise<Movie[] | null> {
        const limit = 20;
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            // Use LIKE for search? TMDB uses generic search.
            this.db.instance().all(`SELECT * FROM characters WHERE title LIKE ? LIMIT ${limit} OFFSET ${offset}`, [`%${name}%`], (err, rows: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.mapRows(rows))
                }
            })
        })
    }
    async create(movie: Movie): Promise<Movie> {
        return new Promise((resolve, reject) => {
            this.db.instance().run("INSERT INTO characters (id, adult, backdrop_path, genre_ids, original_language, original_title, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                movie.id,
                movie.adult,
                movie.backdrop_path,
                JSON.stringify(movie.genre_ids), // Store array as JSON string if not separate table
                movie.original_language,
                movie.original_title,
                movie.overview,
                movie.popularity,
                movie.poster_path,
                movie.release_date,
                movie.title,
                movie.video,
                movie.vote_average,
                movie.vote_count,
            ], (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(movie)
                }
            })
        })
    }
    async update(id: number, movie: Movie): Promise<Movie | null> {
        return new Promise((resolve, reject) => {
            this.db.instance().run("UPDATE characters SET adult = ?, backdrop_path = ?, genre_ids = ?, original_language = ?, original_title = ?, overview = ?, popularity = ?, poster_path = ?, release_date = ?, title = ?, video = ?, vote_average = ?, vote_count = ? WHERE id = ?", [
                movie.adult,
                movie.backdrop_path,
                JSON.stringify(movie.genre_ids),
                movie.original_language,
                movie.original_title,
                movie.overview,
                movie.popularity,
                movie.poster_path,
                movie.release_date,
                movie.title,
                movie.video,
                movie.vote_average,
                movie.vote_count,
                id,
            ], async (err) => {
                if (err) {
                    reject(err)
                } else {
                    const result = await this.getById(id)
                    resolve(result)
                }
            })
        })
    }
    async delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.instance().run("DELETE FROM characters WHERE id = ?", [id], (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    private mapRows(rows: any[]): Movie[] {
        return rows.map(r => this.mapRow(r));
    }

    private mapRow(row: any): Movie {
        let genres = row.genre_ids;
        if (typeof genres === 'string') {
            try { genres = JSON.parse(genres); } catch (e) { genres = []; }
        }

        return {
            id: row.id,
            adult: !!row.adult,
            backdrop_path: row.backdrop_path,
            genre_ids: genres,
            original_language: row.original_language,
            original_title: row.original_title,
            overview: row.overview,
            popularity: row.popularity,
            poster_path: row.poster_path,
            release_date: row.release_date,
            title: row.title,
            video: !!row.video,
            vote_average: row.vote_average,
            vote_count: row.vote_count
        } as Movie;
    }
}