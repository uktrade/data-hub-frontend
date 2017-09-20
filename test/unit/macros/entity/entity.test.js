const { getMacros } = require('~/test/unit/macro-helper')
const entitiesMacros = getMacros('entity')

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
        .to.equal('Colour brown')
      expect(component.querySelector('.c-entity__content .c-meta-list__item').textContent.replace(/\s+/g, ' ').trim())
        .to.equal('DOB 10 November 2015')
    })

    it('should render a title without a link if no id passed', () => {
      const component = entitiesMacros.renderToDom('Entity', {
        name: 'Horse',
        type: 'animal',
      })

      expect(component.querySelector('.c-entity__title').textContent.replace(/\s+/g, ' ').trim()).to.equal('Horse')
      expect(component.querySelector('.c-entity__title a')).not.to.exist
    })

    it('should render a custom url if passed', () => {
      const component = entitiesMacros.renderToDom('Entity', {
        id: '12345',
        name: 'Horse',
        type: 'animal',
        urlPrefix: 'horses/',
      })

      expect(component.querySelector('.c-entity__title a')).to.have.property('href', '/horses/12345')
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
