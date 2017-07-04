const ErrorSummary = {
  selector: '.js-FormErrors',

  init () {
    const errorSummaryEl = document.querySelector(this.selector)

    if (!errorSummaryEl) { return }

    errorSummaryEl.setAttribute('tabindex', '-1')
    errorSummaryEl.focus()
  },
}

module.exports = ErrorSummary
