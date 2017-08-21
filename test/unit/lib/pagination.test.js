const { getPageLink, buildPagination } = require('~/src/lib/pagination')

describe('Pagination', () => {
  describe('#getPageLink', () => {
    const query = { term: 'samsung' }

    it('should return a query string for query object', () => {
      expect(getPageLink(1, query)).to.equal('?page=1&term=samsung')
    })
  })

  describe('#buildPagination', () => {
    const query = { term: 'samsung' }

    it('should return null if count is not given', () => {
      const actual = buildPagination(query, { limit: 10 })
      expect(actual).to.be.null
    })

    it('should return pagination object when all required props a given', () => {
      const actual = buildPagination(query, { count: 10, limit: 5, page: 1 })
      const expected = {
        totalPages: 2,
        currentPage: 1,
        prev: null,
        next: '?page=2&term=samsung',
        pages: [
          { label: 1, url: '?page=1&term=samsung' },
          { label: 2, url: '?page=2&term=samsung' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with correct current page', () => {
      const actual = buildPagination(Object.assign({}, query, { page: 2 }), { count: 10, limit: 5 })
      const expected = {
        totalPages: 2,
        currentPage: 2,
        prev: '?page=1&term=samsung',
        next: null,
        pages: [
          { label: 1, url: '?page=1&term=samsung' },
          { label: 2, url: '?page=2&term=samsung' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with truncation', () => {
      const actual = buildPagination(query, { count: 10, limit: 2 }, 2)
      const expected = {
        totalPages: 5,
        currentPage: 1,
        prev: null,
        next: '?page=2&term=samsung',
        pages: [
          { label: 1, url: '?page=1&term=samsung' },
          { label: 2, url: '?page=2&term=samsung' },
          { label: '…' },
          { label: 5, url: '?page=5&term=samsung' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object without truncation when it’s not needed', () => {
      const actual = buildPagination(query, { count: 10, limit: 2, page: 1 }, 4)
      const expected = {
        totalPages: 5,
        currentPage: 1,
        prev: null,
        next: '?page=2&term=samsung',
        pages: [
          { label: 1, url: '?page=1&term=samsung' },
          { label: 2, url: '?page=2&term=samsung' },
          { label: 3, url: '?page=3&term=samsung' },
          { label: 4, url: '?page=4&term=samsung' },
          { label: 5, url: '?page=5&term=samsung' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with truncation in right place when current page is changed', () => {
      const actual = buildPagination(Object.assign({}, query, { page: 4 }), { count: 10, limit: 2 }, 2)
      const expected = {
        totalPages: 5,
        currentPage: 4,
        prev: '?page=3&term=samsung',
        next: '?page=5&term=samsung',
        pages: [
          { label: 1, url: '?page=1&term=samsung' },
          { label: '…' },
          { label: 4, url: '?page=4&term=samsung' },
          { label: 5, url: '?page=5&term=samsung' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with no truncation when block start page is close to first or last pages', () => {
      const actual = buildPagination(Object.assign({}, query, { page: 4 }), { count: 21, limit: 3 }, 4)
      const expected = {
        totalPages: 7,
        currentPage: 4,
        prev: '?page=3&term=samsung',
        next: '?page=5&term=samsung',
        pages: [
          { label: 1, url: '?page=1&term=samsung' },
          { label: 2, url: '?page=2&term=samsung' },
          { label: 3, url: '?page=3&term=samsung' },
          { label: 4, url: '?page=4&term=samsung' },
          { label: 5, url: '?page=5&term=samsung' },
          { label: 6, url: '?page=6&term=samsung' },
          { label: 7, url: '?page=7&term=samsung' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with a maximum of 10000 results paginated', () => {
      const limited1 = buildPagination(query, { count: 20000, limit: 10, page: 1 })
      const limited2 = buildPagination(query, { count: 20000, limit: 3, page: 1 })

      expect(limited1).to.have.property('totalPages', 1000)
      expect(limited2).to.have.property('totalPages', 3333)
    })
  })
})
