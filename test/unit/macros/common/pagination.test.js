const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

describe('Nunjucks Pagination macro', () => {
  describe('invalid props', () => {
    it('should not render if pagination object is not given', () => {
      const component = commonMacros.renderToDom('Pagination')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    it('should render short pagination list without truncation', () => {
      const paginationObj = {
        totalPages: 2,
        currentPage: 1,
        prev: null,
        next: '?term=samsung&page=2',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
        ],
      }
      const component = commonMacros.renderToDom('Pagination', paginationObj)

      expect(component.querySelectorAll('.c-pagination__list-item')).to.have.lengthOf(2)
      expect(component.querySelector('.c-pagination__label.is-current').textContent.trim()).to.equal('1')
      expect(component.querySelector('.c-pagination__label--prev')).to.be.null
      expect(component.querySelector('.c-pagination__label--next')).to.not.be.null
    })

    it('should render long pagination list with truncation', () => {
      const paginationObj = {
        totalPages: 5,
        currentPage: 1,
        prev: null,
        next: '?term=samsung&page=2',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
          { label: '…' },
          { label: 5, url: '?term=samsung&page=5' },
        ],
      }
      const component = commonMacros.renderToDom('Pagination', paginationObj)

      expect(component.querySelectorAll('.c-pagination__list-item')).to.have.lengthOf(4)
      expect(component.querySelector('.c-pagination__label--truncation').textContent.trim()).to.equal('…')
      expect(component.querySelector('.c-pagination__label--prev')).to.be.null
      expect(component.querySelector('.c-pagination__label--next')).to.not.be.null
    })

    it('should render long pagination list with truncation and set to different page', () => {
      const paginationObj = {
        totalPages: 5,
        currentPage: 4,
        prev: '?term=samsung&page=3',
        next: '?term=samsung&page=5',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: '…' },
          { label: 4, url: '?term=samsung&page=4' },
          { label: 5, url: '?term=samsung&page=5' },
        ],
      }
      const component = commonMacros.renderToDom('Pagination', paginationObj)

      expect(component.querySelectorAll('.c-pagination__list-item')).to.have.lengthOf(4)
      expect(component.querySelector('.c-pagination__label--truncation').textContent.trim()).to.equal('…')
      expect(component.querySelector('.c-pagination__label--prev')).to.not.be.null
      expect(component.querySelector('.c-pagination__label--next')).to.not.be.null
    })
  })

  describe('customise component', () => {
    it('should render pagination without page number links', () => {
      const paginationObj = {
        totalPages: 2,
        currentPage: 1,
        prev: null,
        next: '?term=samsung&page=2',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
        ],
      }

      const component = commonMacros.renderToDom('Pagination', paginationObj, false)

      expect(component.querySelectorAll('.c-pagination__list-item')).to.have.lengthOf(0)
      expect(component.querySelector('.c-pagination__label--prev')).to.be.null
      expect(component.querySelector('.c-pagination__label--next')).to.not.be.null
    })
  })
})
