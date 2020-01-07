const { getMacros } = require('../../../../../test/unit/macro-helper')

const detailsContainerMacro = getMacros('details-container/macro')

describe('Details container', () => {
  context('when there are no props', () => {
    beforeEach(() => {
      this.component = detailsContainerMacro.renderToDom('DetailsContainer')
    })

    it('should render the container', () => {
      expect(this.component.className.trim()).to.equal('c-details-container')
    })

    it('should not render the heading', () => {
      expect(this.component.querySelector('h2')).to.not.exist
    })

    it('should not render the edit link', () => {
      expect(this.component.querySelector('a')).to.not.exist
    })

    it('should render any caller content', () => {
      expect(this.component.querySelector('.c-details-container__content')).to
        .not.exist
    })
  })

  context('when there is all props', () => {
    beforeEach(() => {
      this.component = detailsContainerMacro.renderWithCallerToDom(
        'DetailsContainer',
        {
          heading: 'heading',
          editUrl: '/edit',
        }
      )('<caller></caller>')
    })

    it('should render the container', () => {
      expect(this.component.className.trim()).to.equal('c-details-container')
    })

    it('should render the heading', () => {
      expect(this.component.querySelector('h2').textContent.trim()).to.equal(
        'heading'
      )
    })

    it('should render the edit link', () => {
      const editLink = this.component.querySelector('a')

      expect(editLink.textContent.trim()).to.equal('Edit')
      expect(editLink.getAttribute('href')).to.equal('/edit')
    })

    it('should render the caller content', () => {
      expect(this.component.querySelector('.c-details-container__content')).to
        .exist
      expect(this.component.querySelector('caller')).to.exist
    })
  })
})
