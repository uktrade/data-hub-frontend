const { addClass, removeClass } = require('../lib/elementstuff')
const form = document.getElementById('company-add-form')
const step = form.getAttribute('data-step')

function step1 () {
  const otherUkTypeWrapper = document.getElementById('other-uk-type-wrapper')
  const otherUkField = document.getElementById('ukother')
  const otherForeignTypeWrapper = document.getElementById('other-for-type-wrapper')
  const otherForeignField = document.getElementById('forother')

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

  form.addEventListener('change', function (event) {
    if (event.target.name && event.target.name === 'business_type') {
      updateVisibility()
    }
  })

  updateVisibility()
}

if (step === '1') {
  step1()
}
