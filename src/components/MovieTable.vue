<template>
  <div id="movie-table">
    <p v-if="movies.length < 1" class="empty-table">No movies</p>
    <table v-else>
      <thead>
      <tr>
        <th>Name</th>
        <th>Genre</th>
        <th>Duration</th>
        <th>Release Date</th>
        <th>Description</th>
        <th>Rating</th>
        <th>Place</th>
        <th>Comments</th>
        <th>Watched?</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="movie.Movie_id" v-for="movie in movies ">

        <td>{{ movie.Name }}</td>
        <td>{{ movie.Genre }}</td>
        <td>{{ movie.Duration }}h</td>

        <td v-if="!movie.Release_date"></td>
        <td v-else>{{ $moment(movie.Release_date).format('DD-MM-YYYY') }}</td>

        <td>{{ movie.Description }}</td>

        <td v-if="editing === movie.Movie_id">
          <input
              type="number"
              min="1"
              max="5"
              v-model="movie.Rating"
          >
        </td>
        <td v-else>{{ movie.Rating }}</td>
        <td v-if="editing === movie.Movie_id">
          <input
              type="text"
              v-model="movie.Place"
          >
        </td>
        <td v-else>{{ movie.Place }}</td>

        <td v-if="editing === movie.Movie_id">
          <textarea v-model="movie.Comments" placeholder="Add your comment" rows="3" cols="2000"></textarea>
        </td>
        <td v-else>{{ movie.Comments }}</td>

        <td>
          <span v-if="movie.is_watched">Yes</span>
          <span v-else>No</span>
        </td>

        <td v-if="editing === movie.Movie_id">
          <button class="btn btn-primary" @click="watchedMovie(movie)">Save</button>
          <button
              class="btn btn-primary"
              @click="cancelEdit(movie)"
          >Cancel
          </button>
        </td>
        <td v-else id="buttons">
          <button type="button" class="btn btn-primary" @click="unWatchedMovie(movie)" v-if="movie.is_watched === 1">
            Unwatched
          </button>
          <button type="button" class="btn btn-primary" @click="editMode(movie)" v-else>
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
    movies: Array,
  },
  data() {
    return {
      editing: null,
    };
  },
  methods: {
    /**
     * Paivitetaan elokuva
     * @param movie paivetettava elokuva
     */
    editMode(movie) {
      this.cachedMovie = Object.assign({}, movie);
      this.editing = movie.Movie_id;
    },
    /**
     * Peruuta paivittaminen
     * @param movie peruutettava elokuva
     */
    cancelEdit(movie) {
      Object.assign(movie, this.cachedMovie);
      this.editing = null;
    },
    /**
     * Katsotun elokuvan paivittaminen
     * @param movie katsottu elokuva
     */
    watchedMovie(movie) {
      if (movie.Rating === '' || movie.Place === '' || movie.Date === '' || movie.Comments === '') return;
      movie.is_watched = 1;
      this.$emit('edit:movie', movie.Movie_id, movie);
      this.editing = null;
    },
    /**
     * Elokuvan paivittaminen ei katsotuksi
     * @param movie ei katsottu elokuva
     */
    unWatchedMovie(movie) {
      if (movie.Name === '' || movie.Genre === '' || movie.Duration === '' || movie.Release_date === ''
          || movie.Description === '' || movie.is_watched === '') return;
      movie.is_watched = 0;
      this.$emit('edit2:movie', movie.Movie_id, movie);
      this.editing = null;
    },
  },
};

</script>

<style scoped>
button {
  margin: 0 0.5rem 0 0;
}
</style>