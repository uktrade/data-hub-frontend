const { assign, merge } = require('lodash')
const proxyquire = require('proxyquire')

const propositionData = require('../../../../../test/unit/data/propositions/proposition.json')

const transformed = {
  id: '1',
  data: 'transformed',
}

describe('Proposition details middleware', () => {
  beforeEach(() => {
    this.savePropositionStub = sinon.stub()
    this.fetchPropositionStub = sinon.stub()
    this.transformPropositionFormBodyToApiRequestStub = sinon.stub()
    this.transformPropositionResponseToViewRecordStub = sinon.stub()

    this.middleware = proxyquire('../details', {
      '../repos': {
        saveProposition: this.savePropositionStub.resolves({ id: '1' }),
        fetchProposition: this.fetchPropositionStub.resolves(propositionData),
      },
      '../transformers': {
        transformPropositionFormBodyToApiRequest: this.transformPropositionFormBodyToApiRequestStub.returns(
          transformed
        ),
        transformPropositionResponseToViewRecord: this.transformPropositionResponseToViewRecordStub.returns(
          transformed
        ),
      },
    })

    this.req = {
      session: {
        token: 'abcd',
      },
      flash: sinon.spy(),
      body: assign({}, propositionData),
      query: {
        company: '299e7412-d9ee-4ab0-a4cb-a8cc00922c91',
      },
      params: {
        kind: 'proposition',
      },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
        company: {
          id: '1',
        },
        returnLink: '/return/',
      },
    }

    this.nextSpy = sinon.spy()

    this.activeInactiveAdviserData = {
      count: 5,
      results: [
        { id: '1', name: 'Abraham Slende', is_active: true },
        { id: '2', name: 'The Mayor of St. Albans', is_active: true },
        { id: '3', name: 'Queen Katherine of Aragon', is_active: true },
        { id: '4', name: 'Antipholus of Ephesus', is_active: false },
        { id: '5', name: 'Tullus Aufidius', is_active: false },
      ],
    }
  })

  describe('#postDetails', () => {
    context('when all fields are valid for creating', () => {
      beforeEach(async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should post to the API', () => {
        expect(this.savePropositionStub).to.have.been.calledWith(this.req)
        expect(this.savePropositionStub).to.have.been.calledOnce
        expect(this.savePropositionStub.firstCall.args[1]).to.deep.equal(
          transformed
        )
      })

      it('should flash a created message', () => {
        expect(this.req.flash).to.be.calledWith(
          'success',
          'Proposition created'
        )
      })

      it('should redirect on success', () => {
        expect(this.res.redirect).to.be.calledWith('/return/')
      })
    })

    context('when all fields are valid for updating', () => {
      beforeEach(async () => {
        const res = merge({}, this.res, {
          locals: {
            proposition: propositionData,
          },
        })
        await this.middleware.postDetails(this.req, res, this.nextSpy)
      })

      it('should flash an updated message', () => {
        expect(this.req.flash).to.be.calledWith(
          'success',
          'Proposition created'
        )
      })
    })

    context(
      'when all fields are valid for updating an proposition found from the top level navigation',
      () => {
        it('should redirect on success', async () => {
          const res = assign({}, this.res, {
            breadcrumb: sinon.stub().returnsThis(),
            render: sinon.spy(),
            redirect: sinon.spy(),
            locals: {},
          })

          await this.middleware.postDetails(this.req, res, this.nextSpy)

          expect(res.redirect).to.be.calledWith('/propositions')
        })
      }
    )

    context('when there is a 400', () => {
      beforeEach(async () => {
        this.savePropositionStub.rejects({ statusCode: 400, error: 'error' })
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should set the errors', () => {
        expect(this.res.locals.form.errors.messages).to.equal('error')
      })

      it('should not call next with errors', () => {
        expect(this.nextSpy).have.been.calledWith()
        expect(this.nextSpy).have.been.calledOnce
      })
    })

    context('when there is an error other than 400', () => {
      beforeEach(async () => {
        this.savePropositionStub.rejects({ statusCode: 500, error: 'error' })
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should not set form', () => {
        expect(this.res.locals.form).to.be.undefined
      })

      it('should call next with errors', () => {
        expect(this.nextSpy).have.been.calledWith({
          statusCode: 500,
          error: 'error',
        })
        expect(this.nextSpy).have.been.calledOnce
      })
    })
  })
})
