<template>

  <div id="movie-form">
    <div class="modal fade" id="movieModal" tabindex="-1" aria-labelledby="movieModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="movieModalLabel">Add a new movie</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

<!--            Input-kentät uuden elokuvan lisäämiseksi-->

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label>Movie name</label>
                <input ref="first"
                       type="text"
                       :class="{ 'has-error': submitting && invalidName }"
                       v-model="movie.Name"
                       @focus="clearStatus"
                       @keypress="clearStatus"
                />
              </div>
              <div class="mb-3">
                <label>Genre</label>
                <input
                    type="text"
                    :class="{ 'has-error': submitting && invalidGenre }"
                    v-model="movie.Genre"
                    @focus="clearStatus"
                />
              </div>
              <div class="mb-3">
                <label>Duration</label>
                <input
                    type="text"
                    :class="{ 'has-error': submitting && invalidDuration}"
                    v-model="movie.Duration"
                    @focus="clearStatus"
                />
              </div>
              <div class="mb-3">
                <label>Description</label>
                <input
                    type="text"
                    :class="{ 'has-error': submitting && invalidDescription }"
                    v-model="movie.Description"
                    @focus="clearStatus"
                />
              </div>

              <div class="mb-3">
                <label>Release date</label>
                <input
                    type="date"
                    format="dd/MM/yyyy"
                    value-format="dd-MM-yyyy"
                    :class="{ 'has-error': submitting && invalidRelease }"
                    v-model="movie.Release_date"
                    @focus="clearStatus"
                />
              </div>

              <!--Mikäli elokuva on jo katsottu, checkboksista pääsee täyttämään arvostelun-->

              <div class="mb-3">
                <label>Watched?</label>

                <input
                    type="checkbox"
                    id="collapse"
                    :class="{ 'has-error': submitting}"
                    v-model="movie.is_watched"
                    @focus="clearStatus"
                />

                <div id="collapsible">

                  <div class="mb-3">
                    <label class="form-label">Place</label>
                    <input ref="first"
                           type="text"
                           v-model="movie.Place"
                           @focus="clearStatus"
                           @keypress="clearStatus"
                           class="form-control"

                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input
                        type="Date"
                        v-model="movie.Date"
                        @focus="clearStatus"
                        class="form-control"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Rating 1-5</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        :class="{ 'has-error': submitting && invalidRating}" class="form-control"
                        v-model="movie.Rating"
                        @focus="clearStatus"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Comments</label>
                    <textarea class="form-control" v-model="movie.Comments" @focus="clearStatus"></textarea>
                  </div>
                </div>
              </div>

              <p v-if="error && submitting" class="error-message">❗Please fill out all required fields</p>
              <p v-if="success" class="success-message">✅ Movie successfully added</p>
              <button type="submit" id="submitbutton" class="btn btn-primary"></button>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" id="closebutton" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'movie-form',
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      movie: {
        Name: '',
        Genre: '',
        Duration: '',
        Description: '',
        Release_date: '',
        is_watched: '',
      },
    };
  },
  methods: {
    handleSubmit() {
      this.clearStatus();
      this.submitting = true;

      if (this.invalidName || this.invalidGenre || this.invalidDuration || this.invalidDescription || this.invalidRelease) {
        this.error = true;
        return;
      }

      this.$emit('add:movie', this.movie);
      this.$refs.first.focus();
      this.movie = {
        Name: '',
        Genre: '',
        Duration: '',
        Description: '',
        Release_date: '',
        is_watched: '',
      };
      this.error = false;
      this.success = true;
      this.submitting = false;
    },

    clearStatus() {
      this.success = false;
      this.error = false;
    },
  },
  computed: {
    invalidName() {
      return this.movie.Name === ''
    },
    invalidGenre() {
      return this.movie.Genre === ''
    },
    invalidDuration() {
      return this.movie.Duration === ''
    },
    invalidDescription() {
      return this.movie.Description === ''
    },
    invalidRelease() {
      return this.movie.Release_date === ''
    },
  },
};
</script>

<style scoped>
form {
  margin-bottom: 2rem;
}

[class*='-message'] {
  font-weight: 500;
}

.error-message {
  color: #d33c40;
}

.success-message {

  color: #32a95d;
}
</style>