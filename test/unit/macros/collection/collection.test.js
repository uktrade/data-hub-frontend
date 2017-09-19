const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('collection')

describe('Collection macro', () => {
  it('should render results summary component', () => {
    const component = entitiesMacros.renderToDom('Collection')

    expect(component.tagName).to.equal('ARTICLE')
    expect(component.className).to.equal('c-collection')
    expect(component.querySelector('.c-collection__header')).to.exist
    expect(component.querySelector('.c-collection__result-count').parentNode.textContent.trim()).equal('0 results')
  })

  it('should render results summary component with correct count', () => {
    const component = entitiesMacros.renderToDom('Collection', {
      count: 10,
      countLabel: 'cat',
    })

    expect(component.querySelector('.c-collection__result-count').parentNode.textContent.trim()).equal('10 cats')
  })

  it('should render results summary component with correct count', () => {
    const component = entitiesMacros.renderToDom('Collection', {
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

    const removeLinks = component.querySelectorAll('.c-collection__filter-remove')
    expect(removeLinks).to.have.length(2)
    expect(removeLinks[0].href).to.not.contain('stage=s1')
    expect(removeLinks[1].href).to.not.contain('type=t1')
    expect(component.querySelector('.c-collection__filter-remove-all')).to.exist
  })
})
