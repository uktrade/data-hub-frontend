const { renderComponentToDom } = require('../component-helper')

describe('Data table component', () => {
  const data = [{
    id: '1234',
    name: 'Fred Smith',
    address: '10 The Street',
    uk: true
  }, {
    id: '5678',
    name: 'John Brown',
    address: '10 The Street',
    uk: true
  }]

  const columns = {
    'name': 'Name',
    'address': 'Address'
  }

  it('should render table headings', () => {
    const component = renderComponentToDom('data-table', { columns })

    expect(component.className).to.contain('data-table')
    const tableHeadings = component.querySelectorAll('thead tr th')

    expect(tableHeadings.length).to.equal(2)
    expect(tableHeadings[0].textContent).to.equal('Name')
    expect(tableHeadings[1].textContent).to.equal('Address')
  })
  it('should render table rows', () => {
    const component = renderComponentToDom('data-table', {
      data,
      columns
    })

    const rows = component.querySelectorAll('tbody tr')
    expect(rows.length).to.equal(2)

    const firstRowCells = rows[0].querySelectorAll('td')
    expect(firstRowCells.length).to.equal(2)
    expect(firstRowCells[0].textContent).to.include('Fred Smith')
    expect(firstRowCells[1].textContent).to.include('10 The Street')
  })
  it('should render the header only, if no items are given', () => {
    const component = renderComponentToDom('data-table', { columns })

    expect(component.querySelector('tbody')).to.be.null
  })
  it('should mark the table as sortable by default', () => {
    const component = renderComponentToDom('data-table', { columns })

    expect(component.className).to.contain('js-sortable-table')
  })
  it('should allow you to specify a table that is not sortable', () => {
    const component = renderComponentToDom('data-table', {
      columns,
      sortable: false
    })

    expect(component.className).to.contain('js-sortable-table')
  })
  it('should add a class if passed', () => {
    const cssClass = 'test'

    const component = renderComponentToDom('data-table', {
      columns,
      sortable: false,
      class: cssClass
    })

    expect(component.className).to.contain(cssClass)
  })
  it('should use an ID if passed', () => {
    const id = 'test'

    const component = renderComponentToDom('data-table', {
      columns,
      sortable: false,
      id
    })

    expect(component.id).to.equal(id)
  })
  it('should use the keys as heading and show all columns if none specified', () => {
    const component = renderComponentToDom('data-table', { data })
    const tableHeadings = component.querySelectorAll('thead tr th')

    expect(tableHeadings.length).to.equal(4)
    expect(tableHeadings[0].textContent).to.equal('id')
    expect(tableHeadings[1].textContent).to.equal('name')
    expect(tableHeadings[2].textContent).to.equal('address')
    expect(tableHeadings[3].textContent).to.equal('uk')
  })
  it('should include all properties in a table body if no columns specified', () => {
    const component = renderComponentToDom('data-table', { data })
    const tableRow = component.querySelectorAll('tbody tr:first-child td')

    expect(tableRow.length).to.equal(4)
    expect(tableRow[0].textContent).to.equal('1234')
    expect(tableRow[1].textContent).to.equal('Fred Smith')
    expect(tableRow[2].textContent).to.equal('10 The Street')
    expect(tableRow[3].textContent).to.equal('true')
  })
  it('should not break if you pass a column and its not found in a data row', () => {
    const brokenData = [{
      id: '1234',
      name: 'John Brown'
    }]

    const component = renderComponentToDom('data-table', {
      data: brokenData,
      columns
    })

    const tableRow = component.querySelectorAll('tbody tr:first-child td')

    expect(tableRow.length).to.equal(2)
    expect(tableRow[0].textContent).to.equal('John Brown')
    expect(tableRow[1].textContent).to.equal('')
  })
  it('should return nothing if no columns and no data', () => {
    const component = renderComponentToDom('data-table')
    expect(component).to.be.null
  })
  it('should return nothing if no columns and empty data', () => {
    const component = renderComponentToDom('data-table', { data: [] })
    expect(component).to.be.null
  })
})
