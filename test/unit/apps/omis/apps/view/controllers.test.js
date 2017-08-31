const { renderWorkOrder } = require('~/src/apps/omis/apps/view/controllers')

describe('OMIS View controllers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('renderWorkOrder()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = this.sandbox.stub().returnsThis()
      this.renderSpy = this.sandbox.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
        locals: {
          order: {
            foo: 'bar',
            assignees: [
              { id: '1', estimated_time: 30 },
              { id: '2', estimated_time: 60 },
            ],
          },
        },
      }
    })

    it('should set a breadcrumb option', () => {
      renderWorkOrder({}, this.resMock)

      expect(this.breadcrumbSpy).to.have.been.called
    })

    it('should render a template', () => {
      renderWorkOrder({}, this.resMock)

      expect(this.renderSpy).to.have.been.called
    })

    it('should send expected data to view', () => {
      renderWorkOrder({}, this.resMock)

      expect(this.renderSpy).to.have.been.calledWith('omis/apps/view/views/work-order', {
        values: {
          foo: 'bar',
          assignees: [
            { id: '1', estimated_time: 30 },
            { id: '2', estimated_time: 60 },
          ],
          estimatedTimeSum: 90,
        },
      })
    })
  })
})
