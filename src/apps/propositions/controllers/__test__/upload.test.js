const propositionData = require('../../../../../test/unit/data/propositions/proposition.json')

describe('Proposition upload controller', () => {
  beforeEach(() => {
    this.req = {
      params: {
        id: '1234',
      },
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      title: sinon.stub().returnsThis(),
      render: sinon.spy(),
      locals: {
        retrurnText: 'Pisica',
        proposition: propositionData,
        investment: {
          id: 1,
        },
        features: {
          'proposition-documents': true,
        },
      },
    }

    this.next = sinon.spy()
    this.controller = require('../upload')
  })

  describe('#renderUpload', () => {
    beforeEach(() => {
      this.controller.renderUpload(this.req, this.res, this.next)
    })

    it('should set the title', () => {
      expect(this.res.title).to.be.calledWith('Choose files')
    })

    it('should render the proposition details template', () => {
      expect(this.res.render).to.be.calledWith('propositions/views/upload')
    })
  })
})
