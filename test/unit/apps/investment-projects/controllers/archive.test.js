/* eslint camelcase: 0 */
const investmentProjectData = require('~/test/unit/data/investment/project-summary.json')

describe('Investment archive controller', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.token = '1234'
    this.archiveInvestmentProject = this.sandbox.stub().resolves(investmentProjectData)
    this.unarchiveInvestmentProject = this.sandbox.stub().resolves(investmentProjectData)
    this.controller = proxyquire('~/src/apps/investment-projects/controllers/archive', {
      '../repos': {
        archiveInvestmentProject: this.archiveInvestmentProject,
        unarchiveInvestmentProject: this.unarchiveInvestmentProject,
      },
    })
    this.flashStub = this.sandbox.stub()
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

      this.controller.archiveInvestmentProjectHandler({
        session: this.session,
        body: {
          archived_reason,
        },
        params: {
          id: investmentProjectData.id,
        },
      }, {
        locals: {},
      }, () => {
        expect(this.archiveInvestmentProject).to.be.calledWith(this.token, investmentProjectData.id, archived_reason)
        done()
      })
    })
    it('should use the other reason in the call to the repo if it is provided', (done) => {
      const archived_reason = 'Other'
      const archived_reason_other = 'Some other reason'

      this.controller.archiveInvestmentProjectHandler({
        session: this.session,
        body: {
          archived_reason,
          archived_reason_other,
        },
        params: {
          id: investmentProjectData.id,
        },
      }, {
        locals: {},
      }, () => {
        expect(this.archiveInvestmentProject).to.be.calledWith(this.token, investmentProjectData.id, archived_reason_other)
        done()
      })
    })
    it('should update the investment project being displayed with the reason selected', (done) => {
      const archived_reason = 'test'
      const locals = {
        projectData: {},
      }

      this.controller.archiveInvestmentProjectHandler({
        session: this.session,
        body: {
          archived_reason,
        },
        params: {
          id: investmentProjectData.id,
        },
      }, {
        locals,
      }, () => {
        expect(locals.projectData.archived).to.equal(true)
        expect(locals.projectData.archived_reason).to.equal(archived_reason)
        expect(locals.projectData.archived_by).to.deep.equal(this.session.user)
        expect(locals.projectData).to.have.property('archived_on')
        done()
      })
    })
    it('should update the investment project being displayed with the other reason if provided', (done) => {
      const archived_reason = 'Other'
      const archived_reason_other = 'something else'
      const locals = {
        projectData: {},
      }

      this.controller.archiveInvestmentProjectHandler({
        session: this.session,
        body: {
          archived_reason,
          archived_reason_other,
        },
        params: {
          id: investmentProjectData.id,
        },
      }, {
        locals,
      }, () => {
        expect(locals.projectData.archived).to.equal(true)
        expect(locals.projectData.archived_reason).to.equal(archived_reason_other)
        expect(locals.projectData.archived_by).to.deep.equal(this.session.user)
        expect(locals.projectData).to.have.property('archived_on')
        done()
      })
    })
    it('should pass on the form values and error if validation failed.', (done) => {
      this.controller = proxyquire('~/src/apps/investment-projects/controllers/archive', {
        '../repos': {
          archiveInvestmentProject: this.sandbox.stub().rejects({
            statusCode: 400,
            error: 'Some error',
          }),
          unarchiveInvestmentProject: this.unarchiveInvestmentProject,
        },
      })

      const locals = {
        projectData: {},
      }
      const body = {
        archived_reason: 'Stuff',
      }

      this.controller.archiveInvestmentProjectHandler({
        session: this.session,
        body,
        params: {
          id: investmentProjectData.id,
        },
      }, {
        locals,
      }, () => {
        expect(locals.form.state).to.deep.equal(body)
        done()
      })
    })
    it('should call the error page if any other error occours', (done) => {
      const error = new Error()
      this.controller = proxyquire('~/src/apps/investment-projects/controllers/archive', {
        '../repos': {
          archiveInvestmentProject: this.sandbox.stub().rejects(error),
          unarchiveInvestmentProject: this.unarchiveInvestmentProject,
        },
      })

      const locals = {
        projectData: {},
      }
      const body = {
        archived_reason: 'Stuff',
      }

      this.controller.archiveInvestmentProjectHandler({
        session: this.session,
        body,
        params: {
          id: investmentProjectData.id,
        },
      }, {
        locals,
      }, (err) => {
        expect(err).to.deep.equal(error)
        done()
      })
    })
  })

  describe('unarchive', () => {
    it('should call unarchive on repository', (done) => {
      this.controller.unarchiveInvestmentProjectHandler({
        session: {
          token: this.token,
        },
        params: {
          id: investmentProjectData.id,
        },
        flash: this.flashStub,
      }, {
        redirect: () => {
          expect(this.unarchiveInvestmentProject).to.be.calledWith(this.token, investmentProjectData.id)
          done()
        },
      }, this.next)
    })

    it('should redirect to the investment project', (done) => {
      this.controller.unarchiveInvestmentProjectHandler({
        session: {
          token: this.token,
        },
        body: {
          archived_reason: 'test',
        },
        params: {
          id: investmentProjectData.id,
        },
        flash: this.flashStub,
      }, {
        redirect: (url) => {
          try {
            expect(url).to.equal('details')
            done()
          } catch (e) {
            done(e)
          }
        },
      }, this.next)
    })

    it('should send a flash message that all went well', (done) => {
      this.controller.unarchiveInvestmentProjectHandler({
        session: {
          token: this.token,
        },
        params: {
          id: investmentProjectData.id,
        },
        flash: this.flashStub,
      }, {
        redirect: () => {
          expect(this.flashStub).to.be.calledWith('success-message', 'Updated investment project')
          done()
        },
      }, this.next)
    })
  })
})
