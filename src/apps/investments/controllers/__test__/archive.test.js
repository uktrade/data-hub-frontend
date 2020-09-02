/* eslint camelcase: 0 */
const proxyquire = require('proxyquire')

const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')

describe('Investment archive controller', () => {
  beforeEach(() => {
    this.next = sinon.stub()
    this.token = '1234'
    this.archiveInvestmentProject = sinon.stub().resolves(investmentData)
    this.unarchiveInvestmentProject = sinon.stub().resolves(investmentData)
    this.controller = proxyquire('../archive', {
      '../repos': {
        archiveInvestmentProject: this.archiveInvestmentProject,
        unarchiveInvestmentProject: this.unarchiveInvestmentProject,
      },
    })
    this.flashStub = sinon.stub()
    this.session = {
      token: this.token,
      user: {
        name: 'Fred Smith',
      },
    }
  })

  describe('archive', () => {
    it('should call the archive investment project repo method for the id and reason', (done) => {
      const archived_reason = 'test'
      const stubRequest = {
        session: this.session,
        body: {
          archived_reason,
        },
        params: {
          investmentId: investmentData.id,
        },
      }

      this.controller.archiveInvestmentProjectHandler(
        stubRequest,
        {
          locals: {},
        },
        () => {
          expect(this.archiveInvestmentProject).to.be.calledWith(
            stubRequest,
            investmentData.id,
            archived_reason
          )
          done()
        }
      )
    })
    it('should use the other reason in the call to the repo if it is provided', (done) => {
      const archived_reason = 'Other'
      const archived_reason_other = 'Some other reason'
      const stubRequest = {
        session: this.session,
        body: {
          archived_reason,
          archived_reason_other,
        },
        params: {
          investmentId: investmentData.id,
        },
      }

      this.controller.archiveInvestmentProjectHandler(
        stubRequest,
        {
          locals: {},
        },
        () => {
          expect(this.archiveInvestmentProject).to.be.calledWith(
            stubRequest,
            investmentData.id,
            archived_reason_other
          )
          done()
        }
      )
    })
    it('should update the investment project being displayed with the reason selected', (done) => {
      const archived_reason = 'test'
      const locals = {
        investment: {},
      }

      this.controller.archiveInvestmentProjectHandler(
        {
          session: this.session,
          body: {
            archived_reason,
          },
          params: {
            investmentId: investmentData.id,
          },
        },
        {
          locals,
        },
        () => {
          expect(locals.investment.archived).to.equal(true)
          expect(locals.investment.archived_reason).to.equal(archived_reason)
          expect(locals.investment.archived_by).to.deep.equal(this.session.user)
          expect(locals.investment).to.have.property('archived_on')
          done()
        }
      )
    })
    it('should update the investment project being displayed with the other reason if provided', (done) => {
      const archived_reason = 'Other'
      const archived_reason_other = 'something else'
      const locals = {
        investment: {},
      }

      this.controller.archiveInvestmentProjectHandler(
        {
          session: this.session,
          body: {
            archived_reason,
            archived_reason_other,
          },
          params: {
            investmentId: investmentData.id,
          },
        },
        {
          locals,
        },
        () => {
          expect(locals.investment.archived).to.equal(true)
          expect(locals.investment.archived_reason).to.equal(
            archived_reason_other
          )
          expect(locals.investment.archived_by).to.deep.equal(this.session.user)
          expect(locals.investment).to.have.property('archived_on')
          done()
        }
      )
    })
    it('should pass on the form values and error if validation failed.', (done) => {
      this.controller = proxyquire('../archive', {
        '../repos': {
          archiveInvestmentProject: sinon.stub().rejects({
            statusCode: 400,
            error: 'Some error',
          }),
          unarchiveInvestmentProject: this.unarchiveInvestmentProject,
        },
      })

      const locals = {
        investment: {},
      }
      const body = {
        archived_reason: 'Stuff',
      }

      this.controller.archiveInvestmentProjectHandler(
        {
          session: this.session,
          body,
          params: {
            investmentId: investmentData.id,
          },
        },
        {
          locals,
        },
        () => {
          expect(locals.form.state).to.deep.equal(body)
          done()
        }
      )
    })
    it('should call the error page if any other error occours', (done) => {
      const error = new Error()
      this.controller = proxyquire('../archive', {
        '../repos': {
          archiveInvestmentProject: sinon.stub().rejects(error),
          unarchiveInvestmentProject: this.unarchiveInvestmentProject,
        },
      })

      const locals = {
        investment: {},
      }
      const body = {
        archived_reason: 'Stuff',
      }

      this.controller.archiveInvestmentProjectHandler(
        {
          session: this.session,
          body,
          params: {
            investmentId: investmentData.id,
          },
        },
        {
          locals,
        },
        (err) => {
          expect(err).to.deep.equal(error)
          done()
        }
      )
    })
  })

  describe('unarchive', () => {
    it('should call unarchive on repository', (done) => {
      const stubRequest = {
        session: {
          token: this.token,
        },
        params: {
          investmentId: investmentData.id,
        },
        flash: this.flashStub,
      }
      this.controller.unarchiveInvestmentProjectHandler(
        stubRequest,
        {
          redirect: () => {
            expect(this.unarchiveInvestmentProject).to.be.calledWith(
              stubRequest,
              investmentData.id
            )
            done()
          },
        },
        this.next
      )
    })

    it('should redirect to the investment project', (done) => {
      this.controller.unarchiveInvestmentProjectHandler(
        {
          session: {
            token: this.token,
          },
          body: {
            archived_reason: 'test',
          },
          params: {
            investmentId: investmentData.id,
          },
          flash: this.flashStub,
        },
        {
          redirect: (url) => {
            try {
              expect(url).to.equal('details')
              done()
            } catch (e) {
              done(e)
            }
          },
        },
        this.next
      )
    })

    it('should send a flash message that all went well', (done) => {
      this.controller.unarchiveInvestmentProjectHandler(
        {
          session: {
            token: this.token,
          },
          params: {
            investmentId: investmentData.id,
          },
          flash: this.flashStub,
        },
        {
          redirect: () => {
            expect(this.flashStub).to.be.calledWith(
              'success',
              'Investment project updated'
            )
            done()
          },
        },
        this.next
      )
    })
  })
})
