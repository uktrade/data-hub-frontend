const PrintDialog = {
  selector: '.js-print-dialog',

  init () {
    document.addEventListener('DOMContentLoaded', this.contentLoaded.bind(this))
  },

  contentLoaded () {
    const printLinks = document.querySelectorAll(this.selector)

    printLinks.forEach((link) => {
      link.addEventListener('click', this.handleClick.bind(this))
    })
  },

  handleClick (event) {
    event.preventDefault()
    window.print()
  },
}

module.exports = PrintDialog
