import { Injectable, ApplicationRef } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Movie } from './movie';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private baseURL: String = "http://omdbapi.com/?apikey=" + environment.apiKey;
  currentUser: firebase.User;
  moviesToWatch: Observable<Movie[]>;

  constructor(private http: Http, private db: AngularFireDatabase) { }

  searchMovie(searchTitle: String) {
    return this.http.get(`${this.baseURL}s=${searchTitle}`).pipe(map(res => res.json()));
  }

  getMoviesInit() {
    this.moviesToWatch = this.db.list<Movie>('users/' + this.currentUser.uid + '/movies/').snapshotChanges().pipe(map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))))
  }

  addMovieFirebase(addMovie: Movie) {
    this.db.database.ref('users/' + this.currentUser.uid + '/movies/').push({
      title: addMovie.title,
      year: addMovie.year,
      id: addMovie.id,
      posterPath: addMovie.posterPath
    });
  }

  deleteMovieFromUser(key: string) {
    this.db.list('users/' + this.currentUser.uid + '/movies/').remove(key);
  }

  saveUser(user: firebase.User) {
    this.currentUser = user;
    console.log(`%%%%%%%%%%%%%%%%%%%%%% THE USER UID IS ${this.currentUser.uid} %%%%%%%%%%%%%%%%%%%`);
    this.db.database.ref('users/' + user.uid).update({
      username: user.displayName ? user.displayName : user.email,
      email: user.email,
      lastLogin: (new Date()).getTime()
    });
  }
}
