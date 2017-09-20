const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('entity')

describe('MetaList macro', () => {
  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = entitiesMacros.renderToDom('MetaList')
      expect(component).to.be.null
    })

    it('should not render if required props are not given', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        modifier: 'stacked',
      })
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    it('should render when items array is provided', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Dessert',
            value: {
              id: '12345',
              name: 'chocolate',
            },
          }],
      })

      expect(component.className.trim()).to.equal('c-meta-list')
      expect(component.querySelectorAll('.c-meta-list__item')).to.have.length(1)
    })

    it('should render item with hidden label', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Dessert',
            isLabelHidden: true,
            value: {
              id: '12345',
              name: 'Chocolate',
            },
          }],
      })

      expect(component.querySelector('.c-meta-list__item-label.u-visually-hidden')).to.exist
    })

    it('should render item formatted as date', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Land date',
            type: 'date',
            name: 'land_date',
            value: '2017-07-26',
          }],
      })

      expect(component.querySelector('.c-meta-list__item-value').textContent).to.equal('26 July 2017')
    })

    it('should not render item formatted as date if it has no value', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Land date',
            type: 'date',
            name: 'land_date',
            value: '2017-07-26',
          }, {
            label: 'Expiry date',
            type: 'date',
            name: 'expiry_date',
          }],
      })

      expect(component.querySelector('.c-meta-list__item-value').textContent).to.equal('26 July 2017')
      expect(component.querySelectorAll('.c-meta-list__item')).to.have.length(1)
      expect(component.textContent).not.to.contain('Expiry date')
    })

    it('should render item with link', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Land date',
            type: 'date',
            name: 'land_date',
            value: '2017-07-26',
            url: '/dessert',
          }],
      })

      expect(component.querySelector('a.c-meta-list__item-value.js-xhr')).to.exist
    })

    it('should render metadata item inert', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Dessert',
            isInert: true,
            value: {
              id: '12345',
              name: 'Chocolate',
            },
          }],
      })

      expect(component.querySelector('span.c-meta-list__item-value')).to.exist
      expect(component.querySelector('a.c-meta-list__item-value')).to.not.exist
    })

    it('should render list item as badge', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Dessert',
            type: 'badge',
            value: {
              id: '12345',
              name: 'Chocolate',
            },
          }],
      })

      expect(component.querySelector('.c-meta-list__item-label').className).to.contain('u-visually-hidden')
      expect(component.querySelector('.c-badge')).to.exist
    })

    it('should render list item link as selected', () => {
      const component = entitiesMacros.renderToDom('MetaList', {
        items: [
          {
            label: 'Dessert',
            isSelected: true,
            value: {
              id: '12345',
              name: 'Chocolate',
            },
            url: '/dessert',
          }],
      })

      expect(component.querySelector('a.c-meta-list__item-value').className).to.contain('is-selected')
    })
  })
})
