const { renderComponentToDom } = require('../component-helper')

const data = [{
  id: '1234',
  name: 'Fred Smith',
  address: '10 The Street',
  uk: true,
}, {
  id: '5678',
  name: 'John Brown',
  address: '10 The Street',
  uk: true,
}]

const columns = {
  'name': 'Name',
  'address': 'Address',
}

describe('Data table component', () => {
  describe('when data is supplied with no columns', () => {
    beforeEach(() => {
      this.component = renderComponentToDom('data-table', { data })
    })

    it('should use the keys as headings and show all columns', () => {
      const tableHeadings = this.component.querySelectorAll('thead tr th')

      expect(tableHeadings.length).to.equal(4)
      expect(tableHeadings[0].textContent).to.equal('id')
      expect(tableHeadings[1].textContent).to.equal('name')
      expect(tableHeadings[2].textContent).to.equal('address')
      expect(tableHeadings[3].textContent).to.equal('uk')
    })

    it('should include all properties columns', () => {
      const firstRow = this.component.querySelectorAll('tbody tr:first-child td')

      expect(firstRow.length).to.equal(4)
      expect(firstRow[0].textContent).to.equal('1234')
      expect(firstRow[1].textContent).to.equal('Fred Smith')
      expect(firstRow[2].textContent).to.equal('10 The Street')
      expect(firstRow[3].textContent).to.equal('true')
    })

    it('should render the correct amount of rows', () => {
      const tableRows = this.component.querySelectorAll('tbody tr')

      expect(tableRows.length).to.equal(2)
    })
  })

  describe('when data is supplied with columns', () => {
    describe('when headings match keys within data', () => {
      beforeEach(() => {
        this.component = renderComponentToDom('data-table', { columns, data })
      })

      it('should use values for headings', () => {
        const tableHeadings = this.component.querySelectorAll('thead tr th')

        expect(tableHeadings.length).to.equal(2)
        expect(tableHeadings[0].textContent).to.equal('Name')
        expect(tableHeadings[1].textContent).to.equal('Address')
      })

      it('should only render data with headings', () => {
        const bodyColumns = this.component.querySelectorAll('tbody tr:first-child td')

        expect(bodyColumns.length).to.equal(2)
      })
    })

    describe('when headings do not match keys within data', () => {
      it('should only render data for headings that exist', () => {
        const component = renderComponentToDom('data-table', {
          columns,
          data: [{
            id: '1234',
            name: 'John Brown',
          }],
        })
        const bodyColumns = component.querySelectorAll('tbody tr:first-child td')

        expect(bodyColumns.length).to.equal(2)
        expect(bodyColumns[0].textContent).to.equal('John Brown')
        expect(bodyColumns[1].textContent).to.equal('')
      })
    })
  })

  describe('sortable param', () => {
    describe('when true', () => {
      it('should apply correct hooks', () => {
        const component = renderComponentToDom('data-table', {
          data,
          sortable: true,
        })

        expect(component.className).to.contain('js-SortableTable')
        expect(component.className).to.contain('is-sortable')
      })
    })

    describe('when false', () => {
      it('should not show sortable hook', () => {
        const component = renderComponentToDom('data-table', {
          data,
          sortable: false,
        })

        expect(component.className).not.to.contain('js-SortableTable')
        expect(component.className).not.to.contain('is-sortable')
      })
    })

    describe('when not set', () => {
      it('should not show sortable hook', () => {
        const component = renderComponentToDom('data-table', { data })

        expect(component.className).not.to.contain('js-SortableTable')
        expect(component.className).not.to.contain('is-sortable')
      })
    })
  })

  describe('variant param', () => {
    describe('when set', () => {
      it('should set a modifier', () => {
        const component = renderComponentToDom('data-table', {
          data,
          variant: 'striped',
        })

        expect(component.className).to.contain('data-table--striped')
      })
    })

    describe('when not set', () => {
      it('should not contain a modifier class', () => {
        const component = renderComponentToDom('data-table', {
          data,
        })

        expect(component.className).not.to.contain('data-table--')
      })
    })
  })

  describe('when nothing is supplied', () => {
    it('should not render', () => {
      const component = renderComponentToDom('data-table')
      expect(component).to.be.null
    })
  })

  describe('when only columns are supplied', () => {
    it('should not render', () => {
      const component = renderComponentToDom('data-table', { columns })
      expect(component).to.be.null
    })
  })

  describe('when data is an empty array', () => {
    it('should not render', () => {
      const component = renderComponentToDom('data-table', { data: [] })
      expect(component).to.be.null
    })
  })
})
