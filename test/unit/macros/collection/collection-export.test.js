const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('collection')

describe('CollectionExport macro', () => {
  describe('invalid props', () => {
    it('should not render if there is no form', () => {
      const component = entitiesMacros.renderToDom('CollectionExport')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    beforeEach(() => {
      this.props = {
        hiddenFields: {
          'favourite-shape': 'hexagon',
          'favourite-tea': 'assam',
        },
        action: 'example_action',
        queryString: '?example_query=123',
      }
    })

    it('should render collection export component', () => {
      const component = entitiesMacros.renderToDom('CollectionExport', this.props)
      expect(component.action).to.equal('example_action?_csrf=')

      const renderInputFilters = component.querySelectorAll('input[type="hidden"]')
      const renderInputFilter1 = component.querySelector('input[type="hidden"][name="favourite-shape"]')
      const renderInputFilter2 = component.querySelector('input[type="hidden"][name="favourite-tea"]')

      const renderedButton = component.querySelector('button')
      expect(renderedButton).to.exist
      expect(renderedButton.disabled).to.equal(false)

      expect(renderInputFilters.length).to.equal(2)
      expect(renderInputFilter1).to.exist
      expect(renderInputFilter1.name).to.equal('favourite-shape')
      expect(renderInputFilter1.value).to.equal('hexagon')

      expect(renderInputFilter2).to.exist
      expect(renderInputFilter2.name).to.equal('favourite-tea')
      expect(renderInputFilter2.value).to.equal('assam')
    })

    it('is possible to disable the button', () => {
      const component = entitiesMacros.renderToDom('CollectionExport', this.props, true)
      const renderedButton = component.querySelector('button')

      expect(renderedButton).to.exist
      expect(renderedButton.disabled).to.equal(true)
    })
  })
})
