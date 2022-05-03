
<template>

  <div class="container p-5">
    <h1></h1>
    <h2></h2>
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

//bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import MovieTable from './components/MovieTable.vue';
import MovieForm from './components/MovieForm.vue';

export default {
  components: {
    MovieTable,
    MovieForm,
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
    /**
     * Hakee kaikki elokuvat
     * @returns {Promise<void>} koko lista
     */
    async getMovies() {
      try {
        const response = await fetch('http://localhost:8081/api/movies');
        const data = await response.json();
        this.movies = data;
      } catch (error) {
        console.error(error);
      }
    },
    /**
     * Lisaa elokuvan listaan
     * @param movie lisattava elokuva
     * @returns {Promise<void>} palauttaa listan
     */
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
    /**
     * Poistaa elokuvan
     * @param Movie_id poistettavan elokuvan id
     * @returns {Promise<void>} filtteroity lista elokuvista
     */
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
    /**
     *
     * Merkitsee elokuvan katsotuksi
     * @param Movie_id elokuvan id
     * @param updatedMovie paivitetty elokuva
     * @returns {Promise<void>} palauttaa paivitetyn elokuvan kaikki taulut
     */
    async watchedMovie(Movie_id, updatedMovie) {
      try {
        const response = await fetch(`http://localhost:8081/api/movies/watched/${Movie_id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedMovie),
          headers: {'Content-type': 'application/json'},
        });
        const data = await response.json();
        this.movies = this.movies.map(movie => movie.Movie_id === Movie_id ? data : movie);
      } catch (error) {
        console.error(error);
      }
    },
    /**
     *
     * Tekee elokuvasta ei katsotun.
     * @param Movie_id elokuvan id
     * @param updatedMovie paivitetty elokuva
     * @returns {Promise<void>} palauttaa paivitetyn elokuvan movie-taulun tiedot
     */
    async unWatchedMovie(Movie_id, updatedMovie) {
      try {
        const response = await fetch(`http://localhost:8081/api/movies/unwatched?id=${Movie_id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedMovie),
          headers: {'Content-type': 'application/json'},
        });
        const data = await response.json();
        this.movies = this.movies.map(movie => movie.Movie_id === Movie_id ? data[0] : movie);
      } catch (error) {
        console.error(error);
      }
    },
  },
};

</script>
<style src="./style.css"> </style>