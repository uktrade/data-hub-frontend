const searchEntitySelector = '.js-search-entity'
const searchResultsSelector = '.js-search-results'

const SearchAnalytics = {
  init() {
    window.dataLayer = window.dataLayer || []

    this.pageNumber =
      new URLSearchParams(window.location.search).get('page') || 1
    const entities = document.querySelectorAll(searchEntitySelector)
    if (entities) {
      for (let i = 0; i < entities.length; i++) {
        entities[i].addEventListener('click', this.onClickHandler.bind(this))
      }
    }
    const searchResults = document.querySelectorAll(searchResultsSelector)
    if (searchResults?.length) {
      if (!sessionStorage.getItem('searchCount')) {
        sessionStorage.setItem('searchCount', 1)
      } else if (this.pageNumber == 1) {
        // Only increment search count when visiting first page of results
        sessionStorage.setItem(
          'searchCount',
          parseInt(sessionStorage.getItem('searchCount')) + 1
        )
      }
      for (let i = 0; i < searchResults.length; i++) {
        window.dataLayer.push({
          searchCategory: searchResults[i].dataset.searchCategory,
          resultsReturned: searchResults[i].dataset.resultsReturned,
          countOfSearch: sessionStorage.getItem('searchCount'),
        })
      }
    }
  },

  pushAnalyticsEvent({
    searchResultRank,
    searchResultPageNumber,
    searchCategory,
  }) {
    window.dataLayer.push({
      event: 'searchResultClick',
      searchResultPageNumber,
      searchResultRank,
      searchCategory,
    })
  },

  onClickHandler(e) {
    const target = e.currentTarget
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
