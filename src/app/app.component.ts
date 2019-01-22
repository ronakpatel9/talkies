import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { OmdbService } from './omdb.service'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog } from '@angular/material';
import { Movie } from './movie';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: String = 'Talkies';
  isAuthenticated: boolean = false;
  usersRef: AngularFireList<any>;
  moviesToRender: Observable<any[]>;


  constructor(private aRef: ChangeDetectorRef, private afAuth: AngularFireAuth, private omdbService: OmdbService, private db: AngularFireDatabase, public addMovieDialog: MatDialog) {
    this.afAuth.authState.subscribe((user) => {
      if (user.uid) {
        this.isAuthenticated = true;
        this.omdbService.currentUser = user;
        this.omdbService.getMoviesInit();
        this.moviesToRender = this.db.list('users/' + this.omdbService.currentUser.uid + '/movies/').valueChanges();

        // this.moviesToRender = return this.db.list('users/' + this.omdbService.currentUser.uid + '/movies/').valueChanges();
        //   return new Movie(snapshot.val().Ritle, snapshot.val().Year, snapshot.val().Poster, snapshot.val().imdbID)
        // })
      }
    });

  }

  ngOnInit() {
  }
  // getMovies() {
  //     this.db.list('users/' + this.omdbService.currentUser.uid + '/movies/').query.orderByKey().on('child_added', (snapshot) => {
  //   console.log(snapshot.val());
  //   this.someData = snapshot.val();
  //   this.castToMovies();
  // })
  // }

  castToMovies(someData) {
    // return new Movie(someData['title'], someData['year'], someData['posterPath'], someData['id']);
    // console.log(`The array length is ${this.moviesToWatch.length}`);
  }

  saveUser(user: firebase.User) {
    console.log(`The user is ${user}`);
    this.omdbService.saveUser(user);
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log("Signed in!");
    this.isAuthenticated = true;
    this.omdbService.currentUser = data.authResult.user;
    this.omdbService.getMoviesInit();
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.error("Unable to sign in");
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.isAuthenticated = false;
    console.log("Signed out");
    // this.omdbService.moviesToWatch = [];
  }

  showMovieDialog() {
    let adMovieDialog = this.addMovieDialog.open(AddMovieDialogComponent, {
      height: '90vh',
      width: '90vw',
    })
  }

  deleteMovie (key : any) {
    console.log(key);
    this.omdbService.deleteMovieFromUser(key);
  }
}


@Component({
  selector: 'add-movie-dialog',
  templateUrl: 'add-movie-dialog.html',
  styleUrls: ['add-movie-dialog.css']
})
export class AddMovieDialogComponent {
  public moviesSearchResults: Array<Movie> = [];

  constructor(private omdbService: OmdbService, private db: AngularFireDatabase) { }

  searchMovie(searchTitle: String) {
    if (searchTitle.length > 0) {
      this.moviesSearchResults = [];
      this.omdbService.searchMovie(searchTitle).subscribe(val => {
        if (val.Search) {
          val.Search.forEach(element => {
            this.moviesSearchResults.push(new Movie(element.Title,
              element.Year, element.Poster,
              element.imdbID, undefined));
          });
        }
      });
    }
  }

  addMovie(index: number) {
    this.omdbService.addMovieFirebase(this.moviesSearchResults[index]);
  }
}