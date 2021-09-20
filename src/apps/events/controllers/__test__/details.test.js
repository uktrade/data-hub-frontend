const { expect } = require('chai')
const proxyquire = require('proxyquire')

describe('Event details controller', () => {
  beforeEach(() => {
    this.controller = proxyquire('../details', {
      '../labels': {
        displayEventLabels: {
          label: 'Mare',
        },
      },
    })

    this.req = {
      params: {
        eventId: '1234',
      },
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      locals: {
        event: {
          name: 'Dance',
        },
      },
    }

    this.next = sinon.spy()
  })

  describe('#renderDetailsPage', async () => {
    beforeEach(async () => {
      await this.controller.renderDetailsPage(this.req, this.res, this.next)
    })

    it('should render breadcrumbs', () => {
      const breadcrumbs = this.res.locals
      expect(breadcrumbs)
        .to.have.property('event')
        .and.deep.equal({ name: 'Dance' })
    })

    it('should render the event details template', () => {
      expect(this.res.render).to.be.calledWith('events/views/details')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should return transformed events props', () => {
      const options = this.res.render.firstCall.args[1]
      expect(options)
        .to.have.property('props')
        .and.deep.equal({ eventId: '1234' })
    })
  })
})
