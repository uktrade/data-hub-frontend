const { getMacros } = require('../../../../../test/unit/macro-helper')

const entitiesMacros = getMacros('collection')

describe('Collection macro', () => {
  it('should render results summary component', () => {
    const component = entitiesMacros.renderToDom('CollectionContent')

    expect(component.tagName).to.equal('ARTICLE')
    expect(component.className).to.equal('c-collection')
    expect(component.querySelector('.c-collection__header')).to.exist
    expect(
      component
        .querySelector('.c-collection__result-count')
        .parentNode.textContent.trim()
    ).to.match(/0\s+results/)
  })

  it('should render results summary component with correct count', () => {
    const component = entitiesMacros.renderToDom('CollectionContent', {
      count: 10,
      countLabel: 'cat',
    })

    expect(
      component
        .querySelector('.c-collection__result-count')
        .parentNode.textContent.trim()
    ).to.match(/10\s+cats/)
  })

  context('when filters are selected', () => {
    beforeEach(() => {
      this.component = entitiesMacros.renderToDom('CollectionContent', {
        count: 2,
        query: {
          stage: 's1',
          type: 't1',
        },
        selectedFilters: {
          stage: { label: 'Stage', valueLabel: 'Initial' },
          type: { label: 'Type', valueLabel: 'Manual' },
        },
      })
    })
    it('should render selected filters', () => {
      const selectedFilters = this.component.querySelectorAll(
        '.c-collection__filter-tag'
      )
      expect(selectedFilters).to.have.length(2)
    })

    it('should render remove filters link', () => {
      expect(this.component.querySelector('.c-collection__filter-remove-all'))
        .to.exist
    })
  })

  context('when an action button is present', () => {
    beforeEach(() => {
      this.component = entitiesMacros.renderToDom('CollectionContent', {
        count: 2000,
        actionButtons: {
          action: {
            prop: 1,
          },
        },
      })
    })

    it('should render an action button header', () => {
      const actionHeader = this.component.querySelectorAll(
        '.c-collection__header-actions'
      )
      const actionButton = this.component.querySelectorAll(
        '.govuk-button--secondary'
      )

      expect(actionHeader).to.exist
      expect(actionButton).to.exist
    })
  })
})
