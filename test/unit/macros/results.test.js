const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('results')
const formMacros = getMacros('form')

describe('Results macros', () => {
  describe('ResultsFilters macro', () => {
    describe('invalid props', () => {
      it('should not render if props are not given', () => {
        const component = entitiesMacros.renderToDom('ResultsFilters')
        expect(component).to.be.null
      })
    })

    describe('valid props', () => {
      beforeEach(() => {
        this.filter1 = formMacros.render('MultipleChoiceField', {
          name: 'who-are-you',
          label: 'Who are you?',
          type: 'radio',
          options: [
            { label: 'Human', value: 'h' },
            { label: 'Alien', value: 'a' },
          ],
        })

        this.filter2 = formMacros.render('MultipleChoiceField', {
          name: 'fav-colour',
          label: 'Favourite colour',
          options: [
            { label: 'Red', value: 'r' },
            { label: 'Green', value: 'g' },
            { label: 'Blue', value: 'b' },
          ],
        })
      })

      it('should render results filters component', () => {
        const component = entitiesMacros.renderToDom('ResultsFilters', {
          filters: [
            this.filter1,
            this.filter2,
          ],
        })
        const renderedFilter1 = component.querySelector('#group-field-who-are-you')
        const renderedFilter2 = component.querySelector('#group-field-fav-colour')
        const rendererFilter1Inputs = renderedFilter1.querySelectorAll('[type=radio]')
        const rendererFilter2Options = renderedFilter2.querySelectorAll('option')

        expect(component.className).to.contain('c-filters js-AutoSubmit')
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
        const component = entitiesMacros.renderToDom('ResultsFilters', {
          heading: 'Pick one',
          filters: [
            this.filter1,
          ],
        })
        expect(component.querySelector('.c-filters__heading').textContent.trim()).to.equal('Pick one')
      })

      it('should render results filters form with custom fields', () => {
        const component = entitiesMacros.renderToDom('ResultsFilters', {
          selectedSorting: {
            sortby: 'alphabetical',
          },
          filters: [
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

  describe('ResultsSummary macro', () => {
    it('should render results summary component', () => {
      const component = entitiesMacros.renderToDom('ResultsSummary')

      expect(component.tagName).to.equal('DIV')
      expect(component.className).to.equal('c-results-summary')
      expect(component.querySelector('.c-results-summary__count').parentNode.textContent.trim()).equal('0 results')
    })

    it('should render results summary component with custom HTML element', () => {
      const component = entitiesMacros.renderToDom('ResultsSummary', {
        el: 'header',
      })

      expect(component.tagName).to.equal('HEADER')
      expect(component.className).to.equal('c-results-summary')
    })

    it('should render results summary component with correct count', () => {
      const component = entitiesMacros.renderToDom('ResultsSummary', {
        count: 10,
        countLabel: 'cat',
      })

      expect(component.querySelector('.c-results-summary__count').parentNode.textContent.trim()).equal('10 cats')
    })

    it('should render results summary component with correct count', () => {
      const component = entitiesMacros.renderToDom('ResultsSummary', {
        count: 2,
        query: {
          stage: 's1',
          type: 't1',
        },
        selectedFiltersHumanised: {
          stage: { label: 'Stage', value: 'Initial' },
          type: { label: 'Type', value: 'Manual' },
        },
      })

      const removeLinks = component.querySelectorAll('.c-results-summary__filter-remove')
      expect(removeLinks).to.have.length(2)
      expect(removeLinks[0].href).to.not.contain('stage=s1')
      expect(removeLinks[1].href).to.not.contain('type=t1')
    })
  })
})
