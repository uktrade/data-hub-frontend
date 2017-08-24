const { getMacros } = require('~/test/unit/macro-helper')
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

      it('should render entity component with meta items', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          id: '12345',
          name: 'Horse',
          type: 'animal',
          meta: [
            { label: 'Colour', value: 'brown', type: 'badge' },
            { label: 'DOB', value: '2015-11-10', type: 'date', name: 'date_of_birth' },
          ],
        })

        expect(component.querySelector('.c-entity__header .c-entity__badges')).to.exist
        expect(component.querySelector('.c-entity__header .c-meta-list__item').textContent.replace(/\s+/g, ' ').trim())
          .to.equal('Colour: brown')
        expect(component.querySelector('.c-entity__content .c-meta-list__item').textContent.replace(/\s+/g, ' ').trim())
          .to.equal('DOB: 10 November 2015')
      })

      it('should render a title without a link if no id passed', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          name: 'Horse',
          type: 'animal',
        })

        expect(component.querySelector('.c-entity__title').textContent.replace(/\s+/g, ' ').trim())
          .to.equal('Horse')
        expect(component.querySelector('.c-entity__title a')).not.to.exist
      })

      it('should use a default modifier of inline split it no modifier specified', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          id: '12345',
          name: 'Horse',
          type: 'animal',
          meta: [
            { label: 'Colour', value: 'brown', type: 'badge' },
            { label: 'DOB', value: '2015-11-10', type: 'date', name: 'date_of_birth' },
          ],
        })
        expect(component.querySelector('.c-meta-list.c-meta-list--split.c-meta-list--inline')).to.exist
      })

      it('should use a content meta modifier if specified', () => {
        const component = entitiesMacros.renderToDom('Entity', {
          id: '12345',
          name: 'Horse',
          type: 'animal',
          contentMetaModifier: 'test',
          meta: [
            { label: 'Colour', value: 'brown', type: 'badge' },
            { label: 'DOB', value: '2015-11-10', type: 'date', name: 'date_of_birth' },
          ],
        })

        expect(component.querySelector('.c-meta-list.c-meta-list--split.c-meta-list--inline')).not.to.exist
        expect(component.querySelector('.c-meta-list.c-meta-list--test')).to.exist
      })
    })
  })

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
          items: [{
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
          items: [{
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
          items: [{
            label: 'Land date',
            type: 'date',
            name: 'land_date',
            value: '2017-07-26',
          }],
        })

        expect(component.querySelector('.c-meta-list__item-value').textContent).to.equal('26 July 2017')
      })

      it('should render item with link', () => {
        const component = entitiesMacros.renderToDom('MetaList', {
          items: [{
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
          items: [{
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
          items: [{
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
          items: [{
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
})
