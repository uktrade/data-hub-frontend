const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('collection')

describe('CollectionFilters macro', () => {
  describe('invalid props', () => {
    it('should not render if props are not given', () => {
      const component = entitiesMacros.renderToDom('CollectionFilters')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    beforeEach(() => {
      this.filter1 = {
        macroName: 'MultipleChoiceField',
        name: 'who-are-you',
        label: 'Who are you?',
        type: 'radio',
        options: [
          { label: 'Human', value: 'h' },
          { label: 'Alien', value: 'a' },
        ],
      }

      this.filter2 = {
        macroName: 'MultipleChoiceField',
        name: 'fav-colour',
        label: 'Favourite colour',
        options: [
          { label: 'Red', value: 'r' },
          { label: 'Green', value: 'g' },
          { label: 'Blue', value: 'b' },
        ],
      }
    })

    it('should render collection filters component', () => {
      const component = entitiesMacros.renderToDom('CollectionFilters', {
        filtersFields: [
          this.filter1,
          this.filter2,
        ],
      })
      const renderedFilter1 = component.querySelector('#group-field-who-are-you')
      const renderedFilter2 = component.querySelector('#group-field-fav-colour')
      const rendererFilter1Inputs = renderedFilter1.querySelectorAll('[type=radio]')
      const rendererFilter2Options = renderedFilter2.querySelectorAll('option')

      expect(component.className).to.contain('c-collection-filters js-AutoSubmit')
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

    it('should render results filters component with custom heading', () => {
      const component = entitiesMacros.renderToDom('CollectionFilters', {
        heading: 'Pick one',
        filtersFields: [
          this.filter1,
        ],
      })
      expect(component.querySelector('.c-collection-filters__heading').textContent.trim()).to.equal('Pick one')
    })

    it('should render collection filters form with custom fields', () => {
      const component = entitiesMacros.renderToDom('CollectionFilters', {
        query: {
          sortby: 'alphabetical',
        },
        filtersFields: [
          this.filter1,
        ],
      })

      const hiddenFields = component.querySelectorAll('input[type=hidden]')
      expect(hiddenFields).to.have.length(2)
      expect(hiddenFields[0].name).to.equal('sortby')
      expect(hiddenFields[0].value).to.equal('alphabetical')
      expect(hiddenFields[1].name).to.equal('custom')
      expect(hiddenFields[1].value).to.equal('true')
    })
  })
})
