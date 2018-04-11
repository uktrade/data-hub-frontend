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

  },

  bindEvents () {
    document.addEventListener(CONSTANTS.events.change, this.handleFormItemChange.bind(this))
  },
}

module.exports = FetchFormItemDetails
