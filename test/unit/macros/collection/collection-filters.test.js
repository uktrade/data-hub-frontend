const { JSDOM } = require('jsdom')

const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('collection')

describe('CollectionFilters macro', () => {
  context('invalid props', () => {
    it('should not render if props are not given', () => {
      const component = entitiesMacros.renderToDom('CollectionFilters')
      expect(component).to.be.null
    })
  })

  context('valid props', () => {
    beforeEach(() => {
      const macroOutput = entitiesMacros.render('CollectionFilters', {
        query: {
          sortby: 'alphabetical',
        },
        filtersFields: [
          {
            macroName: 'MultipleChoiceField',
            name: 'who-are-you',
            label: 'Who are you?',
            type: 'radio',
            options: [
              { label: 'Human', value: 'h' },
              { label: 'Alien', value: 'a' },
            ],
          },
          {
            macroName: 'MultipleChoiceField',
            name: 'fav-colour',
            label: 'Favourite colour',
            options: [
              { label: 'Red', value: 'r' },
              { label: 'Green', value: 'g' },
              { label: 'Blue', value: 'b' },
            ],
          },
        ],
        selectedFiltersSummary: [
          {
            label: 'filter 1',
            filters: [
              'value 1',
              'value 2',
            ],
          },
          {
            label: 'filter 2',
            filters: [
              'value 3',
              'value 4',
            ],
          },
        ],
      })
      this.component = (new JSDOM(macroOutput)).window.document.body
    })

    it('should render collection filters component', () => {
      const renderedFilter1 = this.component.querySelector('#group-field-who-are-you')
      const renderedFilter2 = this.component.querySelector('#group-field-fav-colour')

      const rendererFilter1Inputs = renderedFilter1.querySelectorAll('[type=radio]')
      const rendererFilter2Options = renderedFilter2.querySelectorAll('option')

      expect(renderedFilter1).to.exist
      expect(renderedFilter2).to.exist
      expect(rendererFilter1Inputs).to.have.length(2)
      expect(rendererFilter1Inputs[0].name).to.equal('who-are-you')
      expect(rendererFilter1Inputs[0].value).to.equal('h')
      expect(rendererFilter1Inputs[1].value).to.equal('a')
      expect(rendererFilter2Options).to.have.length(3)
      expect(rendererFilter2Options[0].textContent).to.equal('Red')
      expect(rendererFilter2Options[0].value).to.equal('r')
    })

    it('should render collection filters form with custom fields', () => {
      const hiddenFields = this.component.querySelectorAll('input[type=hidden]')
      expect(hiddenFields).to.have.length(2)
      expect(hiddenFields[0].name).to.equal('sortby')
      expect(hiddenFields[0].value).to.equal('alphabetical')
      expect(hiddenFields[1].name).to.equal('custom')
      expect(hiddenFields[1].value).to.equal('true')
    })

    it('should render selected filters', () => {
      const selectedFilters = this.component.querySelectorAll('.c-collection-selected-filters__list-item-link')
      expect(selectedFilters).to.have.length(4)
    })

    it('should render remove filters link', () => {
      expect(this.component.querySelector('.c-collection-selected-filters__clear-filters')).to.exist
    })
  })
})
