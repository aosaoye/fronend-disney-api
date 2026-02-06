

export class Movie {
    public readonly id: number;
    public readonly title: string;
    public readonly adult:boolean;
    public readonly backdrop_path:string;
    public readonly genre_ids:number[];
    public readonly original_language:string;
    public readonly original_title:string;
    public readonly overview:string;
    public readonly popularity:number;
    public readonly poster_path:string;
    public readonly release_date:string;
    public readonly video:boolean;
    public readonly vote_average:number;
    public readonly vote_count:number;
    public trailer: string;
    public actors: Actor[];
    public duration: number;
    public rating: number;
    constructor(
        id: number,
        adult: boolean,
        backdrop_path: string,
        genre_ids: number[],
        original_language: string,
        original_title: string,
        overview: string,
        popularity: number,
        poster_path: string,
        release_date: string,
        title: string,
        video: boolean,
        vote_average: number,
        vote_count: number,
        trailer: string,
        actors: Actor[],
        duration: number,
        rating: number,
        ) {
        this.id = id;
        this.adult = adult;
        this.backdrop_path = backdrop_path;
        this.genre_ids = genre_ids;
        this.original_language = original_language;
        this.original_title = original_title;
        this.overview = overview;
        this.popularity = popularity;
        this.poster_path = poster_path;
        this.release_date = release_date;
        this.title = title;
        this.video = video;
        this.vote_average = vote_average;
        this.vote_count = vote_count;
        this.trailer = trailer;
        this.actors = actors;
        this.duration = duration;
        this.rating = rating;

    }
}

export interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    character?: string;
}

