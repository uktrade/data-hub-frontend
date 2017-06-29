const { renderComponentToDom } = require('../component-helper')

describe('Pagination component', () => {
  it('should not render if pagination array not provided', () => {
    const component = renderComponentToDom(
      'pagination',
      {
        pages: [],
      }
    )

    expect(component).to.be.null
  })

  it('should render with correct pagination elements', () => {
    const mockData = {
      pages: [
        {
          label: 'example-label',
          link: '?example-link',
          currentPage: true,
        },
        {
          label: 'example-label-1',
          link: '?example-link-1',
          currentPage: false,
        },
      ],
    }
    const component = renderComponentToDom(
      'pagination',
      mockData
    )

    const paginationItems = component.querySelectorAll('.pagination__item')

    expect(component.className).to.equal('pagination')
    expect(paginationItems[0].textContent).to.contain(mockData.pages[0].label)
    expect(paginationItems[1].querySelector('a').href).to.equal(`${mockData.pages[1].link}`)
    expect(paginationItems[1].textContent).to.contain(mockData.pages[1].label)
  })
})
