<template>
  <div id="movie-table">
    <p v-if="movies.length < 1" class="empty-table">No movies</p>
    <table v-else>
      <thead>
      <tr>
        <th>Name</th>
        <th>Genre</th>
        <th>Duration</th>
        <th>Rating</th>
        <th>Watched?</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="movie.Movie_id" v-for="movie in movies " :id="'form' + movie.Movie_id">
        <td>{{movie.Name}}</td>
        <td>{{movie.Genre}}</td>
        <td>{{movie.Duration}}</td>
        <td>{{movie.Rating}}</td>
        <td>
          <span v-if="movie.is_watched">Yes</span>
          <span v-else>No</span>
        </td>

        <td>
          <button type="button" class="btn btn-primary" @click="unWatchedMovie(movie)" v-if="movie.is_watched === 1">
            Unwatched
          </button>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#watchedModal" @click="handler( movie.Movie_id)" v-else>
            Watched
          </button>
          <button class="btn btn-primary" @click="$emit('delete:movie', movie.Movie_id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'movie-table',
  props: {
    movies: Array
  },
  data() {
    return {
      editing: null,
    }
  },
  methods: {
    watchedMovie(movie) {
      if (movie.Name === '' || movie.Genre === '' || movie.Duration === '' || movie.is_watched === '') return
      this.$emit('edit:movie', movie.Movie_id, movie)
      this.editing = null
    },
    unWatchedMovie(movie) {
      if (movie.Name === '' || movie.Genre === '' || movie.Duration === '' || movie.is_watched === '') return
      this.$emit('edit2:movie', movie.Movie_id, movie)
      this.editing = null
    },
    handler(id) {
      console.log(id);
    }
  }
}

</script>

<style scoped>
button {
  margin: 0 0.5rem 0 0;
}
</style>