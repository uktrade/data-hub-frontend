const pagination = require(`${root}/src/lib/pagination`)

describe('Pagination', () => {
  describe('Start and end index', () => {
    it('should show 1..5 when on the first pages of many', () => {
      const req = {
        query: {
          page: '1'
        }
      }

      const result = {
        total: 1000
      }

      const pages = pagination.getPageIndexes(req, result)

      expect(pages).to.not.have.property('previousPage')
      expect(pages.nextPage).to.equal(2)
      expect(pages.startPage).to.equal(1)
      expect(pages.endPage).to.equal(5)
    })
    it('should show 1..5 when on the second pages of many', () => {
      const req = {
        query: {
          page: '2'
        }
      }

      const result = {
        total: 1000
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages.previousPage).to.equal(1)
      expect(pages.nextPage).to.equal(3)
      expect(pages.startPage).to.equal(1)
      expect(pages.endPage).to.equal(5)
    })
    it('should show 3..7 when on the fifth pages of many', () => {
      const req = {
        query: {
          page: '5'
        }
      }

      const result = {
        total: 1000
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages.previousPage).to.equal(4)
      expect(pages.nextPage).to.equal(6)
      expect(pages.startPage).to.equal(3)
      expect(pages.endPage).to.equal(7)
    })
    it('should show 10..14 when on pages 13 of 14', () => {
      const req = {
        query: {
          page: '13'
        }
      }

      const result = {
        total: 140
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages.previousPage).to.equal(12)
      expect(pages.nextPage).to.equal(14)
      expect(pages.startPage).to.equal(10)
      expect(pages.endPage).to.equal(14)
    })
    it('should show 1..3 when on the first pages of 25 results', () => {
      const req = {
        query: {
          page: '1'
        }
      }

      const result = {
        total: 25
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages).to.not.have.property('previousPage')
      expect(pages.nextPage).to.equal(2)
      expect(pages.startPage).to.equal(1)
      expect(pages.endPage).to.equal(3)
    })
    it('should show 1..3 when on the second pages of 25 results', () => {
      const req = {
        query: {
          page: '2'
        }
      }

      const result = {
        total: 25
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages.previousPage).to.equal(1)
      expect(pages.nextPage).to.equal(3)
      expect(pages.startPage).to.equal(1)
      expect(pages.endPage).to.equal(3)
    })
    it('should not have a next link when on the last pages', () => {
      const req = {
        query: {
          page: '3'
        }
      }

      const result = {
        total: 25
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages).to.not.have.property('nextPage')
    })
    it('should show 1..5 when many results and no page number in url', () => {
      const req = {
        query: {}
      }

      const result = {
        total: 1000
      }

      const pages = pagination.getPageIndexes(req, result)
      expect(pages).to.not.have.property('previousPage')
      expect(pages.nextPage).to.equal(2)
      expect(pages.startPage).to.equal(1)
      expect(pages.endPage).to.equal(5)
    })
  })
})
