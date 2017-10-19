const investmentData = require('~/test/unit/data/investment/investment-data.json')
const adviserData = require('~/test/unit/data/investment/interaction/advisers')
const { teamMembersLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment form middleware - team members', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getAdvisersStub = this.sandbox.stub().resolves(adviserData)
    this.updateInvestmentTeamMembersStub = this.sandbox.stub().resolves({})
    this.nextSpy = this.sandbox.spy()
    this.resMock = {
      locals: {
        form: {},
        investmentData,
      },
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/team-members', {
      '../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
      '../../repos': {
        updateInvestmentTeamMembers: this.updateInvestmentTeamMembersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateForm', () => {
    it('should generate a list of advisers to use for adviser dropdowns', (done) => {
      const mockAdviser = adviserData.results[0]
      const expectedAdvisers = [{
        value: mockAdviser.id,
        label: mockAdviser.name,
      }]

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.options.advisers).to.deep.equal(expectedAdvisers)
        done()
      })
    })

    it('should populate the form state with the existing team members if there is data', (done) => {
      const investmentDataWithTeam = Object.assign({}, investmentData, {
        team_members: [{
          adviser: {
            id: '1234',
          },
          role: 'manager',
        }, {
          adviser: {
            id: '4321',
          },
          role: 'director',
        }],
      })

      this.resMock = {
        locals: {
          form: {},
          investmentData: investmentDataWithTeam,
        },
      }

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        const state = this.resMock.locals.form.state
        expect(state.teamMembers[0].adviser).to.equal('1234')
        expect(state.teamMembers[0].role).to.equal('manager')
        expect(state.teamMembers[1].adviser).to.equal('4321')
        expect(state.teamMembers[1].role).to.equal('director')
        done()
      })
    })

    it('should include a blank record to allow things to be added when there are existing members', (done) => {
      const investmentDataWithTeam = Object.assign({}, investmentData, {
        team_members: [{
          adviser: {
            id: '1234',
          },
          role: 'manager',
        }, {
          adviser: {
            id: '4321',
          },
          role: 'director',
        }],
      })

      this.resMock = {
        locals: {
          form: {},
          investmentData: investmentDataWithTeam,
        },
      }

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        const state = this.resMock.locals.form.state
        expect(state.teamMembers[2].adviser).to.equal(null)
        expect(state.teamMembers[2].role).to.equal(null)
        done()
      })
    })

    it('should include a blank record to allow things to be added when there are no existing members', (done) => {
      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        const state = this.resMock.locals.form.state
        expect(state.teamMembers[0].adviser).to.equal(null)
        expect(state.teamMembers[0].role).to.equal(null)
        done()
      })
    })

    it('should include labels for the form', (done) => {
      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.labels).to.deep.equal(teamMembersLabels.edit)
        done()
      })
    })

    it('should include button text and a return link', (done) => {
      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(`/investment-projects/${investmentData.id}/team`)
        done()
      })
    })
  })

  describe('#handleFormpost', () => {
    beforeEach(() => {
      this.body = {
        adviser: ['1234', '4321'],
        role: ['manager', 'supervisor'],
      }
    })

    describe('post with no errors', () => {
      it('updates the investment data', (done) => {
        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, () => {
          expect(this.updateInvestmentTeamMembersStub).to.be.calledWith('mock-token', investmentData.id, [{
            adviser: '1234',
            role: 'manager',
          }, {
            adviser: '4321',
            role: 'supervisor',
          }])
          done()
        })
      })

      it('continues onto the next middleware with no errors', (done) => {
        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, (error) => {
          expect(error).to.equal(undefined)
          done()
        })
      })
    })

    describe('When a form is posted with errors', () => {
      it('should set form error data for the following controllers if form error', (done) => {
        this.error = {
          statusCode: 400,
          error: {
            project_assurance_adviser: 'Cannot be null',
          },
        }

        this.updateInvestmentTeamMembersStub.rejects(this.error)

        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, (error) => {
          expect(error).to.equal(undefined)
          expect(this.resMock.locals.form.state).to.deep.equal(this.body)
          expect(this.resMock.locals.form.errors).to.deep.equal(this.error.error)
          done()
        })
      })

      it('should pass a none form error to next middleware', (done) => {
        this.error = {
          statusCode: 500,
        }

        this.updateInvestmentTeamMembersStub.rejects(this.error)

        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, (error) => {
          expect(error).to.deep.equal(this.error)
          done()
        })
      })
    })
  })

  describe('#transformDataToTeamMemberArray', () => {
    it('should transform a single populated line into a single team member object', () => {
      const body = {
        adviser: '1234',
        role: 'Director',
      }

      const expected = [{
        adviser: '1234',
        role: 'Director',
      }]

      const actual = this.controller.transformDataToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should transform multiple lines into an array of team member objects', () => {
      const body = {
        adviser: ['1234', '4321'],
        role: ['Director', 'Manager'],
      }

      const expected = [{
        adviser: '1234',
        role: 'Director',
      }, {
        adviser: '4321',
        role: 'Manager',
      }]

      const actual = this.controller.transformDataToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should strip empty lines when transforming to team member objects', () => {
      const body = {
        adviser: ['1234', ''],
        role: ['manager', ''],
      }

      const expected = [{
        adviser: '1234',
        role: 'manager',
      }]

      const actual = this.controller.transformDataToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should strip out empty single line and return empty array', () => {
      const body = {
        adviser: '',
        role: '',
      }

      const expected = []

      const actual = this.controller.transformDataToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })
  })
})
