const { renderComponentToDom } = require('~/test/unit/component-helper')

describe('Search Nav component', () => {
  it('should render as expected with defaults', () => {
    const component = renderComponentToDom(
      'search-nav',
      {
        searchEntityResults: [],
      }
    )

    expect(component).to.be.null
  })

  it('should render as expected', () => {
    const mockData = {
      searchEntityResults: [
        {
          count: 1,
          text: 'Companies',
          entity: 'company',
        },
        {
          count: 2,
          text: 'Contacts',
          entity: 'contact',
        },
      ],
      searchType: 'company',
      searchTerm: 'example search term',
    }
    const component = renderComponentToDom(
      'search-nav',
      mockData
    )

    const searchNavLi = Array.from(component.querySelectorAll('.search-nav__item'))

    expect(component.className).to.equal('search-nav')
    expect(searchNavLi.length).to.equal(2)

    expect(searchNavLi[0].classList.contains('search-nav__item--selected')).to.be.true
    expect(searchNavLi[0].textContent.includes(mockData.searchEntityResults[0].text)).to.be.true
    expect(searchNavLi[0].querySelector('.search-nav__item-count').textContent.includes(
      mockData.searchEntityResults[0].count)
    ).to.be.true

    expect(searchNavLi[1].classList.contains('search-nav__item--selected')).to.be.false
    expect(searchNavLi[1].querySelector('a').href).to.equal(
      `/search/${mockData.searchEntityResults[1].entity}?term=${mockData.searchTerm}`
    )
    expect(searchNavLi[1].querySelector('a').textContent).to.contain(mockData.searchEntityResults[1].text)
    expect(searchNavLi[1].querySelector('.search-nav__item-count').textContent.includes(
      mockData.searchEntityResults[1].count)
    ).to.be.true
  })
})
