describe('Investment create invenstor profile controller', () => {
  beforeEach(() => {
    this.req = {
      session: {
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
        token: 'abcd',
      },
      query: { },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      query: {},
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    }
    this.nextSpy = sinon.spy()
  })

  describe('#renderCreateInvestorProfileView', () => {
    beforeEach(async () => {
      const controller = require('~/src/apps/investments/controllers/create/investor-profile')

      await controller.renderCreateInvestorProfilePage(this.req, this.res, this.nextSpy)
    })

    it('should render', () => {
      expect(this.res.render).to.be.calledOnce
    })

    it('should render the collection template', () => {
      expect(this.res.render.firstCall.args[0]).to.equal('investments/views/create/investor-profile')
    })

    it('should set breadcrumb', () => {
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })
  })
})
