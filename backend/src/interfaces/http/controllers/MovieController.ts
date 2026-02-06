// src/interfaces/http/controllers/MovieController.ts
import type { Request, Response } from "express";
import { GetMovies } from "../../../application/use-cases/GetMovies.ts";
import { SqlFileWriter } from "../../../infrastructure/utils/SqlFileWriter.ts";

export class MovieController {
    private useCase: GetMovies;
    private sqlWriter: SqlFileWriter; // <--- Declarar propiedad

    constructor(useCase: GetMovies, sqlWriter: SqlFileWriter) {
        this.useCase = useCase;
        this.sqlWriter = sqlWriter;
    }

    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const movies = await this.useCase.execute(page);
            
            // Guardar en SQL
            await this.sqlWriter.saveMoviesToSql(movies, `Popular - Page ${page}`);

            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las peliculas" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const movie = await this.useCase.executeById(Number(req.params.id));
            
            res.json(movie);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener la pelicula" });
        }
    }

    async getByName(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const movies = await this.useCase.executeByName(req.params.name! as string, page);

            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener la pelicula" });
        }
    }

    // --- MÉTODOS MODIFICADOS PARA GUARDAR SQL ---

    async getPopular(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const movies = await this.useCase.executePopular(page);

            // Guardar en SQL
            await this.sqlWriter.saveMoviesToSql(movies, `Popular - Page ${page}`);

            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las peliculas populares" });
        }
    }

    async getTopRated(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const movies = await this.useCase.executeTopRated(page);

            // Guardar en SQL
            await this.sqlWriter.saveMoviesToSql(movies, `Top Rated - Page ${page}`);

            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las peliculas mejor valoradas" });
        }
    }

    async getUpcoming(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const movies = await this.useCase.executeUpcoming(page);

            // Guardar en SQL
            await this.sqlWriter.saveMoviesToSql(movies, `Upcoming - Page ${page}`);

            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las peliculas proximas" });
        }
    }

    async getNowPlaying(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const movies = await this.useCase.executeNowPlaying(page);

            // Guardar en SQL
            await this.sqlWriter.saveMoviesToSql(movies, `Now Playing - Page ${page}`);

            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las peliculas en cartelera" });
        }
    }

    // Dentro de MovieController
    async getTrailer(req: Request, res: Response) {
        try {
            const trailerUrl = await this.useCase.executeGetTrailer(Number(req.params.id));

            if (!trailerUrl) {
                res.status(404).json({ message: "Trailer no encontrado" });
                return
            }

            // Devolvemos un objeto JSON con la URL
            res.json({ url: trailerUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener el trailer" });
        }
    }
}