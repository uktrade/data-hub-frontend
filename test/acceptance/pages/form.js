module.exports = {
  elements: {
    errorSummary: '.c-error-summary li:first-child',
  },
  commands: [
    {
      getState(callback) {
        this.api.execute(
          function() {
            /* global FormData */
            const form = document.querySelector('form')
            const formData = new FormData(form)
            return Array.from(formData.entries()).reduce((obj, field) => {
              obj[field[0]] = field[1]
              return obj
            }, {})
          },
          [],
          callback
        )
      },
    },
  ],
}
