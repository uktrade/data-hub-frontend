const {renderComponentToDom} = require('../component-helper')

describe('Search Bar component', () => {
  it('should render as expected with defaults', () => {
    const mockData = {
      action: '/example/action',
      label: 'Search for company name or contact',
      searchTerm: 'mock search term'
    }
    const component = renderComponentToDom(
      'search-bar',
      mockData
    )

    const searchInputLabel = component.querySelector('[for="search"]')
    const searchInput = component.querySelector('.search-bar__input')
    const searchSubmit = component.querySelector('.search-bar__submit')

    expect(component.className).to.equal('search-bar')
    expect(component.action).to.equal(mockData.action)
    expect(component.method).to.equal('get')
    expect(searchInputLabel.textContent).to.equal(mockData.label)
    expect(searchInput.value).to.equal(mockData.searchTerm)
    expect(searchInput.placeholder).to.equal(mockData.label)
    expect(searchSubmit.value).to.equal('Search')
  })

  it('should render as expected with overridden defaults', () => {
    const mockData = {
      action: '/example/action',
      method: 'post',
      label: 'Search for company name or contact',
      searchTerm: 'mock search term',
      placeHolder: 'mock place holder text',
      submitText: 'mock submit text'
    }
    const component = renderComponentToDom(
      'search-bar',
      mockData
    )

    const searchInputLabel = component.querySelector('[for="search"]')
    const searchInput = component.querySelector('.search-bar__input')
    const searchSubmit = component.querySelector('.search-bar__submit')

    expect(component.className).to.equal('search-bar')
    expect(component.action).to.equal(mockData.action)
    expect(component.method).to.equal(mockData.method)
    expect(searchInputLabel.textContent).to.equal(mockData.label)
    expect(searchInput.value).to.equal(mockData.searchTerm)
    expect(searchInput.placeholder).to.equal(mockData.placeHolder)
    expect(searchSubmit.value).to.equal(mockData.submitText)
  })
})
