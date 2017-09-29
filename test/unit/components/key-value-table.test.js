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

  it('should render a table with an object with a name', () => {
    const component = renderComponentToDom(
      'key-value-table',
      {
        items: {
          'Adviser': {
            name: 'Fred Smith',
          },
          'Second label': '#2 label content',
        },
      }
    )

    expect(component.className).to.contain('table--key-value')
    const rows = component.querySelectorAll('tr')
    expect(rows.length).to.equal(2)
    expect(rows[0].querySelector('th').textContent).to.equal('Adviser')
    expect(rows[0].querySelector('td').textContent).to.equal('Fred Smith')
    expect(rows[1].querySelector('th').textContent).to.equal('Second label')
    expect(rows[1].querySelector('td').textContent).to.equal('#2 label content')
  })

  it('it sould render a table with an object with a null name', () => {
    const component = renderComponentToDom(
      'key-value-table',
      {
        items: {
          'Start date': {
            type: 'date',
            name: null,
          },
          'Second label': '#2 label content',
        },
      }
    )

    expect(component.className).to.contain('table--key-value')
    const rows = component.querySelectorAll('tr')
    expect(rows.length).to.equal(2)
    expect(rows[0].querySelector('th').textContent).to.equal('Start date')
    expect(rows[0].querySelector('td').textContent).to.equal('')
    expect(rows[1].querySelector('th').textContent).to.equal('Second label')
    expect(rows[1].querySelector('td').textContent).to.equal('#2 label content')
  })

  it('should render a table with a date', () => {
    const component = renderComponentToDom(
      'key-value-table',
      {
        items: {
          'Start date': {
            type: 'date',
            name: '1971-01-07',
          },
          'Second label': '#2 label content',
        },
      }
    )

    expect(component.className).to.contain('table--key-value')
    const rows = component.querySelectorAll('tr')
    expect(rows.length).to.equal(2)
    expect(rows[0].querySelector('th').textContent).to.equal('Start date')
    expect(rows[0].querySelector('td').textContent).to.equal('7 January 1971')
    expect(rows[1].querySelector('th').textContent).to.equal('Second label')
    expect(rows[1].querySelector('td').textContent).to.equal('#2 label content')
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
