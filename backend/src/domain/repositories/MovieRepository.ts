import type { Movie } from "../entities/Movie.ts"

export interface MovieRepository {
    getPopular(page: number): Promise<Movie[]>
    getNowPlaying(page: number): Promise<Movie[]>
    getTopRated(page: number): Promise<Movie[]>
    getUpcoming(page: number): Promise<Movie[]>
    getTrailer(id: number): Promise<string | null>
    getAll(page: number): Promise<Movie[]>
    getById(id: number): Promise<Movie | null>
    getByName(name: string, page: number): Promise<Movie[] | null>
    create(movie: Movie): Promise<Movie>
    update(id: number, movie: Movie): Promise<Movie | null>
    delete(id: number): Promise<boolean>
}