const checkboxesSelector = '.js-last-interaction-filter input'

/*
  This feature is experimental to allow us to get feedback, so this is not the final version of this filter.

  Because of the differences between the UI and the API we have to do a little tidy up to reflect the truth.
  We have options of date ranges but the API has a start and end date. Therefore everything between the first
  and last selection is included - as they are effectivly setting a start date and end date. So this ensures
  that we make the UI representative of the data returned by getting the first checked item and the last
  checked item and checking everything inbetween automatically (and disabling them)
*/
const LastInteractionFilter = {
  init() {
    const checkboxes = document.querySelectorAll(checkboxesSelector)

    if (checkboxes && checkboxes.length) {
      this.checkboxes = checkboxes
      this.checkSelections()
      document.addEventListener('change', this.onChangeHandler.bind(this))
    }
  },

  checkSelections() {
    let firstCheckedIndex
    let lastCheckedIndex
    const l = this.checkboxes.length

    if (this.getCheckedCount() <= 1) {
      return // nothing to do if we have one or less checkboxes checked
    }

    for (let i = 0; i < l; i++) {
      if (this.checkboxes[i].checked) {
        firstCheckedIndex = i
        break
      }
    }

    for (let i = l - 1; i >= 0; i--) {
      if (this.checkboxes[i].checked) {
        lastCheckedIndex = i
        break
      }
    }

    for (let i = 0; i < l; i++) {
      const checkbox = this.checkboxes[i]
      const autoCheck = i > firstCheckedIndex && i < lastCheckedIndex

      if (autoCheck) {
        checkbox.checked = true
        checkbox.disabled = true
      } else {
        checkbox.disabled = false
      }
    }
  },

  getCheckedCount() {
    let checkbox
    let count = 0
    let i = 0

    while ((checkbox = this.checkboxes[i++])) {
      if (checkbox.checked) {
        count += 1
      }
    }

    return count
  },

  onChangeHandler(e) {
    const target = e.target

    if (target && target.id) {
      this.checkSelections()
    }
  },
}

module.exports = LastInteractionFilter
