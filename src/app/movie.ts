export class Movie {
    key: string;
    title: string;
    year: string;
    posterPath: string;
    // imdbRating: number;
    id?: string;
    // releaseDate: string

    constructor(title: string, year: string, posterPath: string, id: string, key: string) {
        this.title = title;
        this.year = year;
        this.posterPath = posterPath;
        // this.imdbRating = +imdbRating;
        this.id = id;
        // this.releaseDate = releaseDate;
        this.key = key;
    }
}
