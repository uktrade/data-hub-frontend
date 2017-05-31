const {renderComponentToDom} = require('../component-helper')

describe('Results Summary component', () => {
  it('should render with default values', () => {
    const mockData = {
      searchTerm: 'example search term'
    }
    const component = renderComponentToDom(
      'results-summary',
      mockData
    )

    const resultsSummaryCount = component.querySelector('.results-summary__count')
    const resultsSummaryQuery = component.querySelector('.result-summary__query')

    expect(component.className).to.equal('results-summary')
    expect(component.textContent).to.contain(`results found containing ${mockData.searchTerm}`)
    expect(resultsSummaryCount.textContent).to.contain('0')
    expect(resultsSummaryQuery.textContent).to.equal(mockData.searchTerm)
  })

  it('should render with singular default values', () => {
    const mockData = {
      total: 1,
      searchTerm: 'example search term'
    }
    const component = renderComponentToDom(
      'results-summary',
      mockData
    )

    const resultsSummaryCount = component.querySelector('.results-summary__count')
    const resultsSummaryQuery = component.querySelector('.result-summary__query')

    expect(component.className).to.equal('results-summary')
    expect(component.textContent).to.contain(`result found containing ${mockData.searchTerm}`)
    expect(resultsSummaryCount.textContent).to.contain(mockData.total)
    expect(resultsSummaryQuery.textContent).to.equal(mockData.searchTerm)
  })

  it('should render with 1 result with search term', () => {
    const mockData = {
      total: 1,
      searchTerm: 'example search term'
    }
    const component = renderComponentToDom(
      'results-summary',
      mockData
    )

    const resultsSummaryCount = component.querySelector('.results-summary__count')
    const resultsSummaryQuery = component.querySelector('.result-summary__query')

    expect(component.className).to.equal('results-summary')
    expect(component.textContent).to.contain('result found containing example search term')
    expect(resultsSummaryCount.textContent).to.contain(mockData.total)
    expect(resultsSummaryQuery.textContent).to.equal(mockData.searchTerm)
  })

  it('should render multiple results with search term', () => {
    const mockData = {
      total: 11,
      searchTerm: 'example search term'
    }
    const component = renderComponentToDom(
      'results-summary',
      mockData
    )

    const resultsSummaryCount = component.querySelector('.results-summary__count')
    const resultsSummaryQuery = component.querySelector('.result-summary__query')

    expect(component.className).to.equal('results-summary')
    expect(component.textContent).to.contain('result\'s found containing example search term')
    expect(resultsSummaryCount.textContent).to.contain(mockData.total)
    expect(resultsSummaryQuery.textContent).to.equal(mockData.searchTerm)
  })
})
