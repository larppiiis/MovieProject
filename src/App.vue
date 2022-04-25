<template>
  <!-- Tän divin voi poistaa, kun muokkaa sivun ulkoasua -->
  <div class="container p-5">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Add Movie
    </button>

  <movie-form @add:movie="addMovie" />
  <movie-table
      :movies="movies"
      @delete:movie="deleteMovie"
      @edit:movie="editMovie"
  />
  </div>
</template>
<script>
//importing bootstrap 5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import MovieTable from '@/components/MovieTable.vue';
import MovieForm from '@/components/MovieForm.vue'

export default {
  components: {
    MovieTable,
    MovieForm
  },
  data() {
    return {
      movies: {},
    }
  },
  mounted() {
    this.getMovies()
  },
  methods: {
    async getMovies() {
      try {
        const response = await fetch('http://localhost:8081/api/movies')
        const data = await response.json()
        this.movies = data
      } catch (error) {
        console.error(error)
      }
    },
    //ei toimi vielä
    async addMovie(movie) {
      try {
        const response = await fetch('http://localhost:8081/api/addMovie', {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        const data = await response.json()
        this.movies = [...this.movies, data]
      } catch (error) {
        console.error(error)
      }
    },
    async deleteMovie(Movie_id) {
      try {
        await fetch(`http://localhost:8081/api/delete/${Movie_id}`, {
          method: 'DELETE'
        })
        this.movies = this.movies.filter(movie => movie.Movie_id !== Movie_id)
      } catch (error) {
        console.error(error)
      }
    },
    async editMovie(movie_id, updatedMovie) {
      try {
        const response = await fetch(`http://localhost:8081/api/update/${movie_id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedMovie),
          headers: { "Content-type": "application/json" }
        })
        const data = await response.json()
        this.movies = this.movies.map(movie => movie.movie_id === movie_id ? data : movie)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
