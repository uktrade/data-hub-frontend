const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('collection')

describe('Collection macro', () => {
  it('should render results summary component', () => {
    const component = entitiesMacros.renderToDom('CollectionContent')

    expect(component.tagName).to.equal('ARTICLE')
    expect(component.className).to.equal('c-collection')
    expect(component.querySelector('.c-collection__header')).to.exist
    expect(component.querySelector('.c-collection__result-count').parentNode.textContent.trim()).equal('0 results')
  })

  it('should render results summary component with correct count', () => {
    const component = entitiesMacros.renderToDom('CollectionContent', {
      count: 10,
      countLabel: 'cat',
    })

    expect(component.querySelector('.c-collection__result-count').parentNode.textContent.trim()).equal('10 cats')
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
      const actionHeader = this.component.querySelectorAll('.c-collection__header-actions')
      const actionButton = this.component.querySelectorAll('.button--secondary')

      expect(actionHeader).to.exist
      expect(actionButton).to.exist
    })
  })
})
