const nock = require('nock')
const { assign } = require('lodash')
const uuid = require('uuid')

const config = require('~/config')
const investmentData = require('~/test/unit/data/investment/investment-data.json')
const { teamMembersLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment form middleware - team members', () => {
  beforeEach(() => {
    this.updateInvestmentTeamMembersStub = sandbox.stub().resolves({})

    this.nextSpy = sandbox.spy()
    this.reqMock = {
      session: {
        token: uuid(),
      },
    }

    this.resMock = {
      locals: {
        form: {
          state: {},
        },
        investmentData,
      },
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/team-members', {
      '../../repos': {
        updateInvestmentTeamMembers: this.updateInvestmentTeamMembersStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#populateForm', () => {
    beforeEach(() => {
      this.nockScope = nock(config.apiRoot)
        .get(`/adviser/?limit=100000&offset=0`)
        .reply(200, {
          count: 5,
          results: [
            { id: '1', name: 'Jeff Smith', is_active: true },
            { id: '2', name: 'John Smith', is_active: true },
            { id: '3', name: 'Zac Smith', is_active: true },
            { id: '4', name: 'Fred Smith', is_active: false },
            { id: '5', name: 'Jim Smith', is_active: false },
          ],
        })
    })

    context('when the investment project contains team members', () => {
      beforeEach(async () => {
        this.resMock.locals.investmentData = assign({}, this.resMock.locals.investmentData, {
          team_members: [{
            adviser: { id: '4', name: 'Fred Smith' },
            role: 'Manager',
          }],
        })

        await this.controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should include transformed team members', () => {
        expect(this.resMock.locals.form.fields).to.have.property('teamMembers')
      })

      it('should include the adviser id for a team member', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[0]
        expect(teamMember).to.have.property('adviser', '4')
      })

      it('should include the role for a team member', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[0]
        expect(teamMember).to.have.property('role', 'Manager')
      })

      it('should include active adviser options for a team member', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[0]

        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Fred Smith', value: '4' },
        ]

        expect(teamMember.options).to.deep.equal(expectedOptions)
      })

      it('should include a blank team member with no id', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[1]
        expect(teamMember).to.have.property('adviser', undefined)
      })

      it('should include a blank team member for no role', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[1]
        expect(teamMember).to.have.property('role', undefined)
      })

      it('should include a blank team member with active adviser options', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[1]

        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
        ]

        expect(teamMember.options).to.deep.equal(expectedOptions)
      })

      it('should include labels for the form', () => {
        expect(this.resMock.locals.form.labels).to.deep.equal(teamMembersLabels.edit)
      })

      it('should include button text and a return link', () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(`/investment-projects/${investmentData.id}/team`)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when the investment project contains no team member data', () => {
      beforeEach(async () => {
        this.resMock.locals.investmentData = assign({}, this.resMock.locals.investmentData, {
          team_members: [],
        })

        await this.controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should include a blank team member with no id', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[0]
        expect(teamMember).to.have.property('adviser', undefined)
      })

      it('should include a blank team member for no role', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[0]
        expect(teamMember).to.have.property('role', undefined)
      })

      it('should include a blank team member with active adviser options', () => {
        const teamMember = this.resMock.locals.form.fields.teamMembers[0]

        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
        ]

        expect(teamMember.options).to.deep.equal(expectedOptions)
      })

      it('should include labels for the form', () => {
        expect(this.resMock.locals.form.labels).to.deep.equal(teamMembersLabels.edit)
      })

      it('should include button text and a return link', () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(`/investment-projects/${investmentData.id}/team`)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })
  })

  describe('#handleFormpost', () => {
    beforeEach(() => {
      this.body = {
        adviser: ['1', '2'],
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
            adviser: '1',
            role: 'manager',
          }, {
            adviser: '2',
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
            role: ['This field is required'],
          },
        }
        const resMock = assign({}, this.resMock)

        this.updateInvestmentTeamMembersStub.rejects(this.error)

        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: {
            adviser: ['1', '2', '3'],
            role: ['manager', 'supervisor', ''],
          },
        }, resMock, (error) => {
          expect(error).to.equal(undefined)
          expect(resMock.locals.form.state.teamMembers).to.deep.equal([
            { adviser: '1', role: 'manager' },
            { adviser: '2', role: 'supervisor' },
            { adviser: '3', role: '' },
          ])
          expect(this.resMock.locals.form.errors.messages).to.deep.equal({
            'role-2': ['This field is required'],
          })
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

    it('should handle absent adviser and return empty array', () => {
      const body = {}

      const expected = []

      const actual = this.controller.transformDataToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })
  })
})
