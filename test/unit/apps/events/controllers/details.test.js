describe('Event details controller', () => {
  beforeEach(() => {
    this.controller = proxyquire('~/src/apps/events/controllers/details', {
      '../labels': {
        displayEventLabels: {
          label: 'Mare',
        },
      },
    })

    this.req = {
      params: {
        id: '1234',
      },
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      locals: {
        event: {
          name: 'Dance',
        },
      },
    }

    this.next = sandbox.spy()
  })

  describe('#renderDetailsPage', async () => {
    beforeEach(async () => {
      await this.controller.renderDetailsPage(this.req, this.res, this.next)
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb).to.be.calledWith('Dance')
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should render the event details template', () => {
      expect(this.res.render).to.be.calledWith('events/views/details')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should return transformed events data', () => {
      const options = this.res.render.firstCall.args[1]
      expect(options).to.have.property('displayEventLabels').and.deep.equal({ label: 'Mare' })
    })
  })
})
