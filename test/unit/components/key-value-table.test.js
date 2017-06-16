const { renderComponentToDom } = require('../component-helper')

describe('Key/value table component', () => {
  it('should not render if no items are given', () => {
    const component = renderComponentToDom('key-value-table')

    expect(component).to.be.null
  })

  it('should render a table ', () => {
    const component = renderComponentToDom(
      'key-value-table',
      {
        items: {
          'First label': '#1 label content',
          'Second label': '#2 label content',
        },
      }
    )

    expect(component.className).to.contain('table--key-value')
    const rows = component.querySelectorAll('tr')
    expect(rows.length).to.equal(2)
    expect(rows[0].querySelector('th').textContent).to.equal('First label')
    expect(rows[0].querySelector('td').textContent).to.equal('#1 label content')
    expect(rows[1].querySelector('th').textContent).to.equal('Second label')
    expect(rows[1].querySelector('td').textContent).to.equal('#2 label content')
  })

  it('should render a table with link', () => {
    const component = renderComponentToDom(
      'key-value-table',
      {
        items: {
          'First label': {
            name: '#1 label content',
            url: '/label-1',
          },
        },
      }
    )

    expect(component.querySelector('td').innerHTML.trim())
      .to.equal('<a href="/label-1">#1 label content</a>')
  })

  it('should render one section title', () => {
    const component = renderComponentToDom(
      'key-value-table',
      {
        items: {
          'First label': '#1 label content',
        },
        variant: 'custom-variant',
      }
    )

    expect(component.className).to.contain('table--custom-variant')
  })
})
