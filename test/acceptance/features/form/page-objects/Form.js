module.exports = {
  elements: {
    errorSummary: '.c-error-summary li:first-child',
  },
  commands: [
    {
      getState (selector = 'form') {
        const self = this

        this
          .api.execute(function (selector) {
            /* global FormData */
            const form = document.querySelector(selector)
            const formData = new FormData(form)
            return Array.from(formData.entries()).reduce((obj, field) => {
              obj[field[0]] = field[1]
              return obj
            }, {})
          }, [selector], (result) => {
            self.state = Object.assign({}, self.state, result.value)
          })

        return self
      },
    },
  ],
}
