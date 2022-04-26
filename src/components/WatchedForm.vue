<template>
  <div id="watched-form">
    <div class="modal fade" id="watchedModal" tabindex="-1" aria-labelledby="watchedModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="watchedModalLabel">Add new view</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div id="watched-form1">{{movie.Movie_id}}</div>
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
              <div class="mb-3">
                <label class="form-label">Watched?</label>
                <input
                    type="checkbox"
                    v-model="movie.is_watched.checked"
                    @focus="clearStatus"
                    checked
                    disabled
                />
              </div>

              <p v-if="error && submitting" class="error-message">❗Please fill out rating required field</p>
              <p v-if="success" class="success-message">✅ Movie successfully added</p>
              <button type="submit" class="btn btn-primary">Save</button>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'watched-form',
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      movie: {
        Name: '',
        Genre: '',
        Duration: '',
        Rating: '',
        is_watched: ''

      }
    }
  },
  methods: {
    handleSubmit() {
      this.clearStatus()
      this.submitting = true

      if (this.invalidRating ) {
        this.error = true
        return
      }

      this.$emit('edit:movie', this.movie)
      this.$refs.first.focus()
      this.movie = {
        Name: '',
        Genre: '',
        Duration: '',
        Rating: '',
        is_watched: ''
      }
      this.error = false
      this.success = true
      this.submitting = false
    },

    clearStatus() {
      this.success = false
      this.error = false
    },
  },
  computed: {
    invalidRating() {
      return this.movie.Rating === ''
    }
  },
}
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