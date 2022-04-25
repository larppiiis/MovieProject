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
      <tr :key="movie.Movie_id" v-for="movie in movies">
        <td v-if="editing === movie.Movie_id">
          <input type="text" v-model="movie.Name" />
        </td>
        <td v-else>{{movie.Name}}</td>

        <td v-if="editing === movie.Movie_id">
          <input type="text" v-model="movie.Genre" />
        </td>
        <td v-else>{{movie.Genre}}</td>

        <td v-if="editing === movie.Movie_id">
          <input type="text" v-model="movie.Duration" />
        </td>
        <td v-else>{{movie.Duration}}</td>

        <td v-if="editing === movie.Movie_id">
          <input type="text" v-model="movie.Rating" />
        </td>
        <td v-else>{{movie.Rating}}</td>

        <td v-if="editing === movie.Movie_id">
          <input type="checkbox" v-model="movie.is_watched.checked" v-if="movie.is_watched" checked/>
          <input type="checkbox" v-model="movie.is_watched" v-else/>
        </td>
        <td v-else>
          <span v-if="movie.is_watched">Yes</span>
          <span v-else>No</span>
        </td>


        <td v-if="editing === movie.Movie_id">
          <button class="btn btn-primary" @click="editMovie(movie)">Save</button>
          <button class="btn btn-primary" @click="cancelEdit(movie)">Cancel</button>
        </td>
        <td v-else>
          <button class="btn btn-primary" @click="editMode(movie)">Edit</button>
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
    editMode(movie) {
      this.cachedMovie = Object.assign({}, movie)
      this.editing = movie.Movie_id
    },
    cancelEdit(movie) {
      Object.assign(movie, this.cachedMovie)
      this.editing = null;
    },

    editMovie(movie) {
      if (movie.Name === '' || movie.Genre === '' || movie.Duration === '' || movie.is_watched === '') return
      this.$emit('edit:movie', movie.Movie_id, movie)
      this.editing = null
    }
  }
}

</script>

<style scoped>
button {
  margin: 0 0.5rem 0 0;
}
</style>