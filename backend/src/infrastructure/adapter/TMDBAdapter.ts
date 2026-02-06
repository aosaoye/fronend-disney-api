import type { Movie } from "../../domain/entities/Movie.ts"
import type { MovieRepository } from "../../domain/repositories/MovieRepository.ts"
import { TMDB } from "../db/db.ts"

export class TMDBAdapter implements MovieRepository {
    async getPopular(page: number = 1): Promise<Movie[]> {
        try {
            const response: any = await new TMDB().TMDBAPI("/movie/popular", { page, language: 'es-ES' })
            return this.mapToEntities(response.results)
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async getNowPlaying(page: number = 1): Promise<Movie[]> {
        try {
            const response: any = await new TMDB().TMDBAPI("/movie/now_playing", { page, language: 'es-ES' })
            return this.mapToEntities(response.results)
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async getTopRated(page: number = 1): Promise<Movie[]> {
        try {
            const response: any = await new TMDB().TMDBAPI("/movie/top_rated", { page, language: 'es-ES' })
            return this.mapToEntities(response.results)
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async getUpcoming(page: number = 1): Promise<Movie[]> {
        try {
            const response: any = await new TMDB().TMDBAPI("/movie/upcoming", { page, language: 'es-ES' })
            return this.mapToEntities(response.results)
        } catch (error) {
            console.error(error)
            return []
        }
    }

    // Dentro de la clase TMDBAdapter
    async getTrailer(id: number): Promise<string | null> {
        try {
            // Petición al endpoint de videos
            // Nota: A veces los trailers están en inglés, si no hay en español podrías quitar el language
            const response: any = await new TMDB().TMDBAPI(`/movie/${id}/videos`, { language: 'es-ES' });

            const videos = response.results;

            // Buscamos el mejor candidato (Youtube + Trailer)
            const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
                || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')
                || videos.find((v: any) => v.site === 'YouTube'); // Fallback por si solo hay Teasers

            // Construimos la URL completa
            return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
        } catch (error) {
            console.error("Error fetching trailer:", error);
            return null;
        }
    }

    async getAll(page: number = 1): Promise<Movie[]> {
        // Defaults to popular for now as "all" is ambiguous for TMDB
        return this.getPopular(page)
    }

    async getById(id: number): Promise<Movie | null> {
        try {
            const result: any = await new TMDB().TMDBAPI(`/movie/${id}`, { language: 'es-ES' })
            return this.mapToEntity(result)
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getByName(name: string, page: number = 1): Promise<Movie[] | null> {
        try {
            const response: any = await new TMDB().TMDBAPI(`/search/movie`, { query: name, page, language: 'es-ES' })
            return this.mapToEntities(response.results)
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async create(movie: Movie): Promise<Movie> {
        throw new Error("Method not supported for TMDB")
    }
    async update(id: number, movie: Movie): Promise<Movie | null> {
        throw new Error("Method not supported for TMDB")
    }
    async delete(id: number): Promise<boolean> {
        throw new Error("Method not supported for TMDB")
    }

    private mapToEntities(results: any[]): Movie[] {
        return results.map(this.mapToEntity).filter((movie): movie is Movie => movie !== null);
    }

    private mapToEntity(data: any): Movie {
        // Ensure we have all necessary fields or provide defaults
        return {
            id: data.id,
            adult: data.adult,
            backdrop_path: data.backdrop_path,
            genre_ids: data.genre_ids || data.genres?.map((g: any) => g.id) || [], // TMDB detail endpoint returns 'genres' array of objects, lists return 'genre_ids'
            original_language: data.original_language,
            original_title: data.original_title,
            overview: data.overview,
            popularity: data.popularity,
            poster_path: data.poster_path,
            release_date: data.release_date,
            title: data.title,
            video: data.video,
            vote_average: data.vote_average,
            vote_count: data.vote_count
        } as Movie;
        // Note: Direct casting as Movie because the class structure matches TMDB response.
        // If strict class instantiation is needed based on the class definition:
        /*
        return new Movie(
            data.id, data.adult, data.backdrop_path, data.genre_ids || [], 
            data.original_language, data.original_title, data.overview, 
            data.popularity, data.poster_path, data.release_date, 
            data.title, data.video, data.vote_average, data.vote_count
        )
        */
    }
}