const searchEntitySelector = '.js-search-entity'

const SearchAnalytics = {
  init() {
    this.pageNumber =
      new URLSearchParams(window.location.search).get('page') || 1
    const entities = document.querySelectorAll(searchEntitySelector)
    if (entities) {
      for (let i = 0; i < entities.length; i++) {
        entities[i].addEventListener('click', this.onClickHandler.bind(this))
      }
    }
  },

  pushAnalyticsEvent({
    searchResultRank,
    searchResultPageNumber,
    searchCategory,
  }) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'searchResultClick',
      searchResultPageNumber,
      searchResultRank,
      searchCategory,
    })
  },

  onClickHandler(e) {
    const target = e.target
    if (target) {
      this.pushAnalyticsEvent({
        searchResultRank: target.dataset.searchResultRank,
        searchResultPageNumber: this.pageNumber,
        searchCategory: target.dataset.searchCategory,
      })
    }
  },
}

module.exports = SearchAnalytics
