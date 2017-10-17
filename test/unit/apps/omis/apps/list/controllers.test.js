const { renderCollectionList, renderReconciliationList } = require('~/src/apps/omis/apps/list/controllers')

describe('OMIS list controllers', () => {
  describe('renderCollectionList()', () => {
    it('should render a template', () => {
      const res = {
        render: sinon.spy(),
      }

      renderCollectionList({}, res)

      expect(res.render).to.have.been.calledOnce
    })
  })

  describe('renderReconciliationList()', () => {
    it('should render a template', () => {
      const res = {
        render: sinon.spy(),
      }

      renderReconciliationList({}, res)

      expect(res.render).to.have.been.calledOnce
    })
  })
})
