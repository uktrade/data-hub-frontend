const proxyquire = require('proxyquire')

const transformerStub = (item) => {
  return item
}

describe('OMIS View controllers', () => {
  beforeEach(() => {
    this.transformSubscriberToViewStub = sinon.stub().returns(transformerStub)

    this.controllers = proxyquire('../controllers', {
      '../../transformers': {
        transformSubscriberToView: this.transformSubscriberToViewStub,
      },
    })
  })

  describe('renderQuote()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.stub().returnsThis()
      this.renderSpy = sinon.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
      }

      this.controllers.renderQuote({}, this.resMock)
    })

    it('should set a breadcrumb option', () => {
      expect(this.breadcrumbSpy).to.have.been.called
    })

    it('should render a template', () => {
      expect(this.renderSpy).to.have.been.called
    })
  })
})
