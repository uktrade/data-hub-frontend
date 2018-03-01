/*
 * Listens for change of sort order in the sort form and updates the filters form
 * to know about the sort order change so it is applied when the filter changes
*/
const FilterSort = {
  init (wrapper = document) {
    this.cacheEls(wrapper)
    this.bindEvents()
  },

  cacheEls (wrapper) {
    this.sortField = wrapper.querySelector('.js-FilterSort select[name="sortby"]')
    this.filterSortField = wrapper.querySelector('.c-collection-filters input[name="sortby"]')
  },

  bindEvents () {
    if (this.sortField) {
      this.sortField.addEventListener('change', this.handleSortFieldChange.bind(this))
    }
  },

  handleSortFieldChange (event) {
    this.filterSortField.value = event.target.value
  },
}

module.exports = FilterSort
