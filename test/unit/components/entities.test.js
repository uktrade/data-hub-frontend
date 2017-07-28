const { getMacros } = require('~/test/unit/component-helper')
const entitiesMacros = getMacros('entities')

describe('Entities macros', () => {
  describe('Entity macro', () => {
    describe('invalid props', () => {
      it('should not render if props is not given', () => {
        const component = entitiesMacros.renderToDom('Entity')
        expect(component).to.be.null
      })

      it('should not render if required props are not given', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          id: '12345',
          name: 'Horse',
        })
        expect(component).to.be.null
      })
    })

    describe('valid props', () => {
      it('should render entity component', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          id: '12345',
          name: 'Horse',
          type: 'animal',
        })
        expect(component.className.trim()).to.equal('c-entity c-entity--animal')
        expect(component.querySelector('.c-entity__title a')).to.have.property('href', '/animals/12345')
      })

      it('should render entity component with modifier', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          id: '12345',
          name: 'Horse',
          type: 'animal',
          meta: [
            { label: 'Colour', value: 'brown', isBadge: true },
            { label: 'DOB', value: '2015-11-10', name: 'date_of_birth', isBadge: false },
          ],
        })

        expect(component.querySelector('.c-entity__header .c-entity__badges')).to.exist
        expect(component.querySelector('.c-entity__header .c-meta-item').textContent.replace(/\s+/g, ' ').trim())
          .to.equal('Colour: brown')
        expect(component.querySelector('.c-entity__content .c-meta-item').textContent.replace(/\s+/g, ' ').trim())
          .to.equal('DOB: November 10, 2015')
      })
    })
  })

  describe('MetaItem macro', () => {
    describe('invalid props', () => {
      it('should not render if props is not given', () => {
        const component = entitiesMacros.renderToDom('MetaItem')
        expect(component).to.be.null
      })

      it('should not render if required props are not given', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          label: 'Dessert',
        })
        expect(component).to.be.null
      })
    })

    describe('valid props', () => {
      const value = {
        id: '12345',
        name: 'Chocolate',
      }

      it('should render flat metadata item component', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          label: 'Dessert',
          value,
        })

        expect(component.className).to.equal('c-meta-item')
      })

      it('should render metadata without label', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          label: 'Dessert',
          value,
          isLabelHidden: true,
        })

        expect(component.querySelector('.c-meta-item__label.u-visually-hidden')).to.exist
      })

      it('should render metadata without label', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          name: 'land_date',
          label: 'Land date',
          value: '2017-07-26',
        })

        expect(component.querySelector('.c-meta-item__value').textContent).to.equal('July 26, 2017')
      })

      it('should render metadata item component with link', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          name: 'land_date',
          label: 'Land date',
          value: '2017-07-26',
          url: '/dessert',
        })

        expect(component.querySelector('a.c-meta-item__value.js-xhr')).to.exist
      })

      it('should render metadata item inert', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          label: 'Dessert',
          value,
          url: '/dessert',
          isInert: true,
        })

        expect(component.querySelector('span.c-meta-item__value')).to.exist
        expect(component.querySelector('a.c-meta-item__value')).to.not.exist
      })

      it('should render metadata as badge', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          label: 'Dessert',
          value,
          isBadge: true,
        })

        expect(component.querySelector('.c-meta-item__label').className).to.contain('u-visually-hidden')
        expect(component.querySelector('.c-badge')).to.exist
      })

      it('should render selected metadata link', () => {
        const component = entitiesMacros.renderToDom('MetaItem', {
          label: 'Dessert',
          value,
          isSelected: true,
          url: '/dessert',
        })

        expect(component.querySelector('a.c-meta-item__value').className).to.contain('is-selected')
      })
    })
  })
})
