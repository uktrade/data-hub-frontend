const { renderComponentToDom } = require('../component-helper')

describe('Key/value table component', () => {
  context('when no items are given', () => {
    beforeEach(() => {
      this.component = renderComponentToDom('key-value-table')
    })

    it('should not render', () => {
      expect(this.component).to.not.exist
    })
  })

  context('when there is one item and the data is a URL with a hint', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            url: `https://beta.companieshouse.gov.uk/company/123456`,
            name: 'View on Companies House website',
            hint: '(Opens in a new window)',
            hintId: 'external-link-label',
            newWindow: true,
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render a link that opens in a new window', () => {
      const link = this.rows[0].querySelector('td a')
      expect(link.getAttribute('href')).to.equal('https://beta.companieshouse.gov.uk/company/123456')
      expect(link.getAttribute('aria-labelledby')).to.equal('external-link-label')
      expect(link.getAttribute('target')).to.equal('_blank')
      expect(link.textContent).to.equal('View on Companies House website')
    })

    it('should render a hint', () => {
      const hint = this.rows[0].querySelector('td span')
      expect(hint.getAttribute('id')).to.equal('external-link-label')
      expect(hint.textContent).to.equal('(Opens in a new window)')
    })
  })

  context('when there is one item and the data is currency', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: 1000,
            type: 'currency',
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the formatted value', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal('£1,000.00')
    })
  })

  context('when there is one item and the data is a date', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: '10/10/2018',
            type: 'date',
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the formatted value', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal('10 October 2018')
    })
  })

  context('when there is one item and the data is a number', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: 1000,
            type: 'number',
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the formatted value', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal('1,000')
    })
  })

  context('when there is one item and the data is details', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: 'This is an estimated number',
            type: 'details',
            details: {
              summaryText: 'Summary',
              text: 'Text',
            },
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render details container', () => {
      const detailsContainer = this.rows[0].querySelector('.table__details')

      expect(detailsContainer.querySelector('.table__details-name').textContent).to.equal('This is an estimated number')
      expect(detailsContainer.querySelector('.table__details-content').textContent).to.exist
    })
  })

  context('when there is one item and the data is an address', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            type: 'address',
            address: {
              line_1: 'line 1',
              line_2: '',
              town: 'town',
              county: '',
              postcode: 'postcode',
              country: {
                name: 'country',
              },
            },
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the formatted value', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal('line 1, town, postcode, country')
    })
  })

  context('when there is one item and the data is an error', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: 'Error message',
            type: 'error',
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the error message', () => {
      expect(this.rows[0].querySelector('td span.c-message--error').textContent).to.equal('Error message')
    })
  })

  context('when there is one item and the data is a paragraph', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: 'Paragraph',
            type: 'paragraph',
            string: [{
              type: 'link',
              string:
                {
                  url: 'https://world-is-a-stage',
                  name: 'https://world-is-a-stage',
                },
            },
            { type: 'word', string: 'and' },
            { type: 'word', string: 'we' },
            { type: 'word', string: 'are' },
            { type: 'word', string: 'the' },
            { type: 'word', string: 'actors' },
            ],
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the paragraph', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal(' https://world-is-a-stage and we\n        are the actors')
    })
  })

  context('when there is one item and the data is an object with a name', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            name: 'name',
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the name', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal('name')
    })
  })

  context('when there is one item and the data is a string', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': 'content',
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render the value', () => {
      expect(this.rows[0].querySelector('td').textContent).to.equal('content')
    })
  })

  context('when there are actions', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            actions: [
              {
                label: 'Action 1',
                url: '/action-1',
              },
              {
                label: 'Action 2',
                url: '/action-2',
              },
            ],
          },
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render one row', () => {
      expect(this.rows.length).to.equal(1)
    })

    it('should render a label', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
    })

    it('should render two actions', () => {
      const actions = this.rows[0].querySelectorAll('.table__action')

      expect(actions.length).to.equal(2)
      expect(actions[0].getAttribute('href')).to.equal('/action-1')
      expect(actions[0].textContent).to.equal('Action 1')
      expect(actions[1].getAttribute('href')).to.equal('/action-2')
      expect(actions[1].textContent).to.equal('Action 2')
    })
  })

  context('when there are multiple items of each type', () => {
    beforeEach(() => {
      const component = renderComponentToDom('key-value-table', {
        items: {
          'Label 1': {
            url: `https://beta.companieshouse.gov.uk/company/123456`,
            name: 'View on Companies House website',
            hint: '(Opens in a new window)',
            hintId: 'external-link-label',
            newWindow: true,
          },
          'Label 2': {
            name: 1000,
            type: 'currency',
          },
          'Label 3': {
            name: '10/10/2018',
            type: 'date',
          },
          'Label 4': {
            name: 1000,
            type: 'number',
          },
          'Label 5': {
            name: 'This is an estimated number',
            type: 'details',
            details: {
              summaryText: 'Summary',
              text: 'Text',
            },
          },
          'Label 6': 'content',
        },
      })

      this.rows = component.querySelectorAll('tr')
    })

    it('should render two rows', () => {
      expect(this.rows.length).to.equal(6)
    })

    it('should render labels', () => {
      expect(this.rows[0].querySelector('th').textContent).to.equal('Label 1')
      expect(this.rows[1].querySelector('th').textContent).to.equal('Label 2')
      expect(this.rows[2].querySelector('th').textContent).to.equal('Label 3')
      expect(this.rows[3].querySelector('th').textContent).to.equal('Label 4')
      expect(this.rows[4].querySelector('th').textContent).to.equal('Label 5')
      expect(this.rows[5].querySelector('th').textContent).to.equal('Label 6')
    })

    it('should render a link that opens in a new window', () => {
      const link = this.rows[0].querySelector('td a')
      expect(link.getAttribute('href')).to.equal('https://beta.companieshouse.gov.uk/company/123456')
      expect(link.getAttribute('aria-labelledby')).to.equal('external-link-label')
      expect(link.getAttribute('target')).to.equal('_blank')
      expect(link.textContent).to.equal('View on Companies House website')
    })

    it('should render a hint', () => {
      const hint = this.rows[0].querySelector('td span')
      expect(hint.getAttribute('id')).to.equal('external-link-label')
      expect(hint.textContent).to.equal('(Opens in a new window)')
    })

    it('should render the currency formatted value', () => {
      expect(this.rows[1].querySelector('td').textContent).to.equal('£1,000.00')
    })

    it('should render the date formatted value', () => {
      expect(this.rows[2].querySelector('td').textContent).to.equal('10 October 2018')
    })

    it('should render the number formatted value', () => {
      expect(this.rows[3].querySelector('td').textContent).to.equal('1,000')
    })

    it('should render details container', () => {
      const detailsContainer = this.rows[4].querySelector('.table__details')

      expect(detailsContainer.querySelector('.table__details-name').textContent).to.equal('This is an estimated number')
      expect(detailsContainer.querySelector('.table__details-content').textContent).to.exist
    })

    it('should render the formatted value', () => {
      expect(this.rows[5].querySelector('td').textContent).to.equal('content')
    })
  })
})
