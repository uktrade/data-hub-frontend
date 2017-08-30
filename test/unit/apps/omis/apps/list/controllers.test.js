const { renderList } = require('~/src/apps/omis/apps/list/controllers')

describe('OMIS list controllers', () => {
  describe('renderList()', () => {
    it('should render a template', () => {
      const res = {
        render: sinon.spy(),
      }

      renderList({}, res)

      expect(res.render).to.have.been.calledOnce
    })
  })
})
