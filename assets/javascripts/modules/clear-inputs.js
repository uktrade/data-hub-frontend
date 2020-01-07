function getFormControls(form) {
  const formInputs = form.querySelectorAll('input, select, checkbox, textarea')

  return Array.from(formInputs).filter((element) => {
    return element.tagName !== 'INPUT' || element.type !== 'hidden'
  })
}

function clearValues(formInputs) {
  formInputs.forEach((field) => {
    if (['select', 'radio', 'checkbox'].indexOf(field.type) > -1) {
      field.checked = false
    } else {
      field.value = ''
    }
  })
}

const ClearInputs = {
  selector: '.js-ClearInputs',

  init(wrapper = document) {
    this.wrapper = wrapper
    wrapper.addEventListener('click', this.handleClick.bind(this))
  },

  handleClick(event) {
    const target = event.target
    const url = target.getAttribute('href')
    const hasClass = target.classList.contains(this.selector.substring(1))
    const shouldClear = target.tagName === 'A' && hasClass

    if (!shouldClear || !url || url.match(/^http:\/\//)) {
      return
    }

    event.preventDefault()

    const targetSelector = target.getAttribute('data-target-selector')
    const targetForm = this.wrapper.querySelector(targetSelector)

    if (targetForm) {
      const formControls = getFormControls(targetForm)
      clearValues(formControls)

      Array.from(
        targetForm.querySelectorAll('.js-ClearInputs--removable-field')
      ).forEach((input) => input.parentNode.removeChild(input))

      targetForm.submit()
    }
  },
}

module.exports = ClearInputs
