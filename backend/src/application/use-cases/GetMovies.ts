import type { Movie } from "../../domain/entities/Movie.ts";
import type { MovieRepository } from "../../domain/repositories/MovieRepository.ts";


export class GetMovies {
    private movieRepository: MovieRepository
    constructor(
        movieRepository: MovieRepository
    ) {
        this.movieRepository = movieRepository
    }

    async execute(page: number = 1): Promise<Movie[]> {
        return this.movieRepository.getAll(page)
    }

    async executeById(id: number): Promise<Movie | null> {
        return this.movieRepository.getById(id)
    }

    async executeByName(name: string, page: number = 1): Promise<Movie[] | null> {
        return this.movieRepository.getByName(name, page)
    }

    async executePopular(page: number = 1): Promise<Movie[]> {
        return this.movieRepository.getPopular(page)
    }

    async executeTopRated(page: number = 1): Promise<Movie[]> {
        return this.movieRepository.getTopRated(page)
    }

    async executeUpcoming(page: number = 1): Promise<Movie[]> {
        return this.movieRepository.getUpcoming(page)
    }

    async executeNowPlaying(page: number = 1): Promise<Movie[]> {
        return this.movieRepository.getNowPlaying(page)
    }
    // Dentro de la clase GetMovies
    async executeGetTrailer(id: number): Promise<string | null> {
        return this.movieRepository.getTrailer(id);
    }
}