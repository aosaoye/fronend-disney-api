import fs from 'node:fs/promises';
import path from 'node:path';
import type { Movie, Actor } from '../../domain/entities/Movie.ts';
import { TMDB } from '../db/db.ts'; // Usamos tu clase de conexión existente

export class SqlFileWriter {
    private filePath: string;
    private tmdb: TMDB;

    constructor(filename: string = '') {
        this.filePath = path.join(process.cwd(), filename);
        this.tmdb = new TMDB();
    }

    async saveMoviesToSql(basicMovies: Movie[], section: string) {
        if (basicMovies.length === 0) return;
        this.filePath = path.join(process.cwd(), `movies_${section}.sql`);

        console.log(`⏳ [SQL Writer] Procesando ${basicMovies.length} películas para '${section}'...`);
        let sqlBuffer = `\n-- === LOTE: ${section} (${new Date().toISOString()}) ===\n`;

        // Procesamos película a película para obtener detalles (Actores, Trailer, Duración)
        for (const movie of basicMovies) {
            try {
                // 1. Enriquecer datos (Fetch extra a TMDB)
                const fullData = await this.enrichMovieData(movie.id);

                // Preparar datos para SQL
                const titulo = this.escape(movie.title);
                const desc = this.escape(movie.overview);
                const poster = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : '';
                const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
                const trailer = fullData.trailer || '';
                const anio = movie.release_date ? movie.release_date.split('-')[0] : '2024';
                const duracion = fullData.duration || 0;
                const rating = movie.vote_average || 0;
                const votos = movie.vote_count || 0;

                // CAMBIO 1: Actores (INSERT OR IGNORE para no fallar si ya existe)
                if (fullData.actors) {
                    for (const actor of fullData.actors) {
                        const actorName = this.escape(actor.name);
                        const actorPhoto = actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.profile_path}` : '';
                        sqlBuffer += `INSERT OR IGNORE INTO Actor (id_actor, nombre, foto_path) VALUES (${actor.id}, '${actorName}', '${actorPhoto}');\n`;
                    }
                }

                // CAMBIO 2: Película (INSERT OR REPLACE para actualizar si ya existe y evitar errores de duplicados)
                sqlBuffer += `INSERT OR REPLACE INTO Pelicula (id_pelicula, titulo, descripcion, poster_path, backdrop_path, trailer, anio_estreno, duracion) VALUES (${movie.id}, '${titulo}', '${desc}', '${poster}', '${backdrop}', '${trailer}', ${anio}, ${duracion});\n`;


                // Guardamos la relacion entre pelicula y actor
                if (fullData.actors) {
                    for (const actor of fullData.actors) {
                        sqlBuffer += `INSERT OR REPLACE INTO Pelicula_Actor (id_pelicula, id_actor, personaje) VALUES (${movie.id}, ${actor.id}, '${actor.character}');\n`;
                    }
                }

                // CAMBIO 3: Relaciones (INSERT OR IGNORE para evitar duplicados en la tabla intermedia)
                if (movie.genre_ids) {
                    for (const genreId of movie.genre_ids) {
                        const myCatId = (genreId % 12) + 1;
                        // Verificamos que no rompa FK con Categorias insertando solo IDs válidos si es necesario, 
                        // pero con el script init_db.sql ya tenemos las categorías 1-12 seguras.
                        sqlBuffer += `INSERT OR IGNORE INTO Pelicula_Categoria (id_pelicula, id_categoria) VALUES (${movie.id}, ${myCatId});\n`;
                    }
                }

                if (movie.company) {

                        // Verificamos que no rompa FK con Categorias insertando solo IDs válidos si es necesario, 
                        // pero con el script init_db.sql ya tenemos las categorías 1-12 seguras.
                        sqlBuffer += `INSERT OR IGNORE INTO Pelicula_Compania (id_pelicula, id_compania) VALUES (${movie.id}, ${movie.company.id});\n`;
                
                }
                if (movie.colection) {

                        // Verificamos que no rompa FK con Categorias insertando solo IDs válidos si es necesario, 
                        // pero con el script init_db.sql ya tenemos las categorías 1-12 seguras.
                        sqlBuffer += `INSERT OR IGNORE INTO Pelicula_Coleccion (id_pelicula, id_coleccion) VALUES (${movie.id}, ${movie.colection.id});\n`;
                
                }
                sqlBuffer += `-- Fin película: ${titulo} --\n`;

            } catch (err) {
                console.error(`❌ Error procesando película ID ${movie.id}:`, err);
            }
        }

        // Escribir en disco
        try {
            await fs.appendFile(this.filePath, sqlBuffer, 'utf-8');
            console.log(`✅ [SQL Writer] Datos guardados en ${this.filePath}`);
        } catch (error) {
            console.error("❌ Error escribiendo archivo:", error);
        }
    }

    // Método auxiliar para pedir detalles extra
    private async enrichMovieData(movieId: number): Promise<{ trailer: string | undefined, actors: Actor[], duration: number }> {
        // Pedimos "credits" y "videos" en la misma llamada (append_to_response es clave en TMDB)
        // endpoint: /movie/123?append_to_response=credits,videos&language=es-ES
        const data: any = await this.tmdb.TMDBAPI(`/movie/${movieId}`, {
            append_to_response: 'credits,videos',
            language: 'es-ES'
        });

        // Extraer Trailer
        const videos = data.videos?.results || [];
        const trailerObj = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')
            || videos.find((v: any) => v.site === 'YouTube');
        const trailer = trailerObj ? `https://www.youtube.com/watch?v=${trailerObj.key}` : undefined;

        // Extraer Actores (Top 5 para no llenar demasiado la BD)
        const actors = data.credits?.cast?.slice(0, 5).map((c: any) => ({
            id: c.id,
            name: c.name,
            profile_path: c.profile_path,
            character: c.character
        })) || [];

        return {
            trailer,
            actors,
            duration: data.runtime
        };
    }

    private escape(str: string): string {
        return str ? str.replace(/'/g, "''") : '';
    }
}