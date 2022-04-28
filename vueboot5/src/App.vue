
<template>

  <!-- Tän divin voi poistaa, kun muokkaa sivun ulkoasua -->
  <div class="container p-5">
    <h1></h1>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#movieModal" id="add-movie-button">

    </button>

    <movie-form @add:movie="addMovie"/>
    <movie-table
        :movies="movies"
        @delete:movie="deleteMovie"
        @edit2:movie="unWatchedMovie"
        @edit:movie="watchedMovie"
    />
  </div>
  <watched-form
      @edit:movie="watchedMovie"
  />
</template>
<script>

//importing bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import MovieTable from './components/MovieTable.vue';
import MovieForm from './components/MovieForm.vue';
import WatchedForm from './components/WatchedForm.vue';
export default {
  components: {
    MovieTable,
    MovieForm,
    WatchedForm,
  },
  data() {
    return {
      movies: {},
    };
  },
  mounted() {
    this.getMovies();
  },
  methods: {
    async getMovies() {
      try {
        const response = await fetch('http://localhost:8081/api/movies');
        const data = await response.json();
        this.movies = data;
      } catch (error) {
        console.error(error);
      }
    },
    async addMovie(movie) {
      try {
        const response = await fetch('http://localhost:8081/api/addMovie', {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: {'Content-type': 'application/json; charset=UTF-8'},
        });
        const data = await response.json();
        this.movies = [...this.movies, data];
      } catch (error) {
        console.error(error);
      }
    },
    async deleteMovie(Movie_id) {
      try {
        await fetch(`http://localhost:8081/api/delete/${Movie_id}`, {
          method: 'DELETE',
        });
        this.movies = this.movies.filter(movie => movie.Movie_id !== Movie_id);
      } catch (error) {
        console.error(error);
      }
    },
    async watchedMovie(Movie_id, updatedMovie) {
      try {
        const response = await fetch(`http://localhost:8081/api/movies/watched/${Movie_id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedMovie),
          headers: {'Content-type': 'application/json'},
        });
        const data = await response.json();
        this.movies = this.movies.map(movie => movie.Movie_id === Movie_id ? data : movie);
        this.movies = this.getMovies();
      } catch (error) {
        console.error(error);
      }
    },
    async unWatchedMovie(Movie_id, updatedMovie) {
      try {
        const response = await fetch(`http://localhost:8081/api/movies/unwatched?id=${Movie_id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedMovie),
          headers: {'Content-type': 'application/json'},
        });
        const data = await response.json();
        this.movies = this.movies.map(movie => movie.Movie_id === Movie_id ? data : movie);
        this.movies = this.getMovies();
      } catch (error) {
        console.error(error);
      }
    },
  },
};

</script>
<style src="./style.css"> </style>