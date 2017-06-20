const { addClass, removeClass } = require('../../lib/element-stuff')

const CompanyAdd = {
  init () {
    this.form = document.getElementById('company-add-form')

    if (!this.form) { return }

    const step = this.form.getAttribute('data-step')

    if (step === '1') {
      this.step1()
    }
  },

  step1 () {
    const otherUkTypeWrapper = document.getElementById('other-uk-type-wrapper')
    const otherUkField = document.getElementById('ukother')
    const otherForeignTypeWrapper = document.getElementById('other-for-type-wrapper')
    const otherForeignField = document.getElementById('foreign')

    function updateVisibility () {
      if (otherUkField.checked === true) {
        removeClass(otherUkTypeWrapper, 'hidden')
      } else {
        addClass(otherUkTypeWrapper, 'hidden')
      }

      if (otherForeignField.checked === true) {
        removeClass(otherForeignTypeWrapper, 'hidden')
      } else {
        addClass(otherForeignTypeWrapper, 'hidden')
      }
    }

    this.form.addEventListener('change', function (event) {
      if (event.target.name && event.target.name === 'business_type') {
        updateVisibility()
      }
    })

    updateVisibility()
  },
}

module.exports = CompanyAdd
