const axios = require('axios')

const CONSTANTS = {
  events: {
    change: 'change',
  },
}

const FetchFormItemDetails = {
  isSubmitting: false,
  counter: 0,

  init (root, config) {
    this.root = document.querySelectorAll(`.${root}`)
    this.entity = config.entity

    if (this.root.length) {
      this.bindEvents()
    }
  },

  buildItemDetailsView (item, data) {
    item.innerHTML = (`
      ${data.details.map(detail =>
        `<p>
            <strong>${detail.label}:</strong> 
            ${detail.value.length ? detail.value.map(listItem => listItem.name) : detail.value.name}
          </p>`
      ).join(' ')}
    `)
  },

  handleFormItemChange (event) {
    const target = event.target

    Array.from(this.root).forEach(
      (item) => {
        if (target.id === item.dataset.target) {
          const path = `/api/options/${this.entity}?term=${target.options[target.selectedIndex].value}`
          axios.get(path)
            .then((response) => {
              const data = response.data
              this.buildItemDetailsView(item, data)
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      }
    )
  },

  bindEvents () {
    document.addEventListener(CONSTANTS.events.change, this.handleFormItemChange.bind(this))
  },
}

module.exports = FetchFormItemDetails
