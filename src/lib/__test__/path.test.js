const { joinPaths } = require('../path')

describe('#joinPaths', () => {
  context('when the first path has an extra forward slash at the end', () => {
    beforeEach(() => {
      this.actual = joinPaths([ '/first/', 'second', 'third' ])
    })

    it('should return the correct full path', () => {
      expect(this.actual).to.equal('/first/second/third')
    })
  })

  context('when the last path has an extra forward slash at the beginning', () => {
    beforeEach(() => {
      this.actual = joinPaths([ '/first', 'second', '/third' ])
    })

    it('should return the correct full path', () => {
      expect(this.actual).to.equal('/first/second/third')
    })
  })

  context('when the paths other than the first and last have extra forward slashes', () => {
    beforeEach(() => {
      this.actual = joinPaths([ '/first', '/second/', '/third/', '/fourth/', 'fifth' ])
    })

    it('should return the correct full path', () => {
      expect(this.actual).to.equal('/first/second/third/fourth/fifth')
    })
  })
})
