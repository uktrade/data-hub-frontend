const { assign } = require('lodash')
const { v4: uuid } = require('uuid')

const config = require('../../../../../config')
const paths = require('../../../paths')
const investmentData = require('../../../../../../test/unit/data/investment/investment-data.json')
const { teamMembersLabels } = require('../../../labels')
const teamMembersController = require('../team-members')

// TODO: add more depth to the test/end-to-end/cypress/specs/DIT/investment-team-spec.js e2e test (or add a functional test for different aspects of editing the investment team)
describe('Investment form middleware - team members', () => {
  beforeEach(() => {
    this.nextStub = sinon.stub()
    this.reqMock = {
      session: {
        token: uuid(),
      },
      params: {
        investmentId: investmentData.id,
      },
      flash: sinon.stub(),
    }

    this.resMock = {
      locals: {
        paths,
        investment: investmentData,
      },
      redirect: sinon.stub(),
    }
  })

  describe('#populateForm', () => {
    beforeEach(() => {
      nock(config.apiRoot)
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
        this.resMock.locals.investment.team_members = [
          {
            adviser: { id: '4', name: 'Fred Smith' },
            role: 'Manager',
          },
        ]

        await teamMembersController.populateTeamEditForm(
          this.reqMock,
          this.resMock,
          this.nextStub
        )
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
        expect(this.resMock.locals.form.labels).to.deep.equal(
          teamMembersLabels.edit
        )
      })

      it('should include button text and a return link', () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(
          `/investments/projects/${investmentData.id}/team`
        )
      })
    })

    context('when the investment project contains no team member data', () => {
      beforeEach(async () => {
        this.resMock.locals.investment = assign(
          {},
          this.resMock.locals.investment,
          {
            team_members: [],
          }
        )

        await teamMembersController.populateTeamEditForm(
          this.reqMock,
          this.resMock,
          this.nextStub
        )
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
        expect(this.resMock.locals.form.labels).to.deep.equal(
          teamMembersLabels.edit
        )
      })

      it('should include button text and a return link', () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(
          `/investments/projects/${investmentData.id}/team`
        )
      })
    })
  })

  describe('#postTeamEdit', () => {
    context('when posted with valid data', () => {
      beforeEach(async () => {
        this.reqMock.params.investmentId = investmentData.id
        this.reqMock.body = {
          adviser: ['1', '2'],
          role: ['manager', 'supervisor'],
        }

        nock(config.apiRoot)
          .put(`/v3/investment/${investmentData.id}/team-member`, [
            {
              adviser: '1',
              role: 'manager',
            },
            {
              adviser: '2',
              role: 'supervisor',
            },
          ])
          .reply(200, {})

        await teamMembersController.postTeamEdit(
          this.reqMock,
          this.resMock,
          this.nextStub
        )
      })

      it('should redirect back to the details page', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7/team'
        )
      })

      it('should not carry onto the next middleware', () => {
        expect(this.nextStub.callCount).to.eq(0)
      })

      it('should not pass any error or form data to the next middleware', () => {
        expect(this.resMock.locals).to.not.have.property('form.errors')
      })
    })

    context('when a form is posted with a missing role', () => {
      beforeEach(async () => {
        const error = [{}, { role: ['This field may not be blank.'] }]

        this.reqMock = assign({}, this.reqMock, {
          params: {
            investmentId: investmentData.id,
          },
          body: {
            adviser: ['1', '2'],
            role: ['manager', undefined],
          },
        })

        nock(config.apiRoot)
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
          .put(`/v3/investment/${investmentData.id}/team-member`, [
            {
              adviser: '1',
              role: 'manager',
            },
            {
              adviser: '2',
            },
          ])
          .reply(400, error)

        await teamMembersController.postTeamEdit(
          this.reqMock,
          this.resMock,
          this.nextStub
        )
      })

      it('should call the next middleware', () => {
        expect(this.nextStub.callCount).to.eq(1)
        expect(this.nextStub.firstCall.args.length).to.eq(0)
      })

      it('should indicate which field has the error', () => {
        expect(this.resMock.locals.form.errors.messages['role-1']).to.eq(
          'This field may not be blank.'
        )
      })

      it('should pass through the form state for re-rendering', () => {
        expect(this.resMock.locals.form.fields.teamMembers).to.deep.equal([
          {
            adviser: '1',
            role: 'manager',
            options: [
              { label: 'Jeff Smith', value: '1' },
              { label: 'John Smith', value: '2' },
              { label: 'Zac Smith', value: '3' },
            ],
          },
          {
            adviser: '2',
            role: undefined,
            options: [
              { label: 'Jeff Smith', value: '1' },
              { label: 'John Smith', value: '2' },
              { label: 'Zac Smith', value: '3' },
            ],
          },
        ])
      })
    })

    context('when a form is posted with a none field error', () => {
      beforeEach(async () => {
        const error = {
          non_field_errors: ['No data provided'],
        }

        this.reqMock = assign({}, this.reqMock, {
          params: {
            investmentId: investmentData.id,
          },
          body: {
            adviser: ['1', '2'],
            role: ['manager', undefined],
          },
        })

        nock(config.apiRoot)
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
          .put(`/v3/investment/${investmentData.id}/team-member`, [
            {
              adviser: '1',
              role: 'manager',
            },
            {
              adviser: '2',
            },
          ])
          .reply(400, error)

        await teamMembersController.postTeamEdit(
          this.reqMock,
          this.resMock,
          this.nextStub
        )
      })

      it('should call the next middleware', () => {
        expect(this.nextStub.callCount).to.eq(1)
        expect(this.nextStub.firstCall.args.length).to.eq(0)
      })

      it('should indicate the generic error', () => {
        expect(
          this.resMock.locals.form.errors.messages['non_field_errors-0']
        ).to.eq('No data provided')
      })

      it('should pass through the form state for re-rendering', () => {
        expect(this.resMock.locals.form.fields.teamMembers).to.deep.equal([
          {
            adviser: '1',
            role: 'manager',
            options: [
              { label: 'Jeff Smith', value: '1' },
              { label: 'John Smith', value: '2' },
              { label: 'Zac Smith', value: '3' },
            ],
          },
          {
            adviser: '2',
            role: undefined,
            options: [
              { label: 'Jeff Smith', value: '1' },
              { label: 'John Smith', value: '2' },
              { label: 'Zac Smith', value: '3' },
            ],
          },
        ])
      })
    })
  })

  describe('#transformDataToTeamMemberArray', () => {
    it('should transform a single populated line into a single team member object', () => {
      const body = {
        adviser: '1234',
        role: 'Director',
      }

      const expected = [
        {
          adviser: '1234',
          role: 'Director',
        },
      ]

      const actual = teamMembersController.transformFormToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should transform multiple lines into an array of team member objects', () => {
      const body = {
        adviser: ['1234', '4321'],
        role: ['Director', 'Manager'],
      }

      const expected = [
        {
          adviser: '1234',
          role: 'Director',
        },
        {
          adviser: '4321',
          role: 'Manager',
        },
      ]

      const actual = teamMembersController.transformFormToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should strip empty lines when transforming to team member objects', () => {
      const body = {
        adviser: ['1234', ''],
        role: ['manager', ''],
      }

      const expected = [
        {
          adviser: '1234',
          role: 'manager',
        },
      ]

      const actual = teamMembersController.transformFormToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should strip out empty single line and return empty array', () => {
      const body = {
        adviser: '',
        role: '',
      }

      const expected = []

      const actual = teamMembersController.transformFormToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })

    it('should handle absent adviser and return empty array', () => {
      const body = {}

      const expected = []

      const actual = teamMembersController.transformFormToTeamMemberArray(body)

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('#transformErrorResponseToFormErrors', () => {
    context('Called with a missing role', () => {
      beforeEach(() => {
        const error = [{}, { role: ['This field may not be blank.'] }]

        this.errorMessages = teamMembersController.transformErrorResponseToFormErrors(
          error
        )
      })

      it('should convert the error into the correct format for the form', () => {
        expect(this.errorMessages).to.deep.equal({
          'role-1': 'This field may not be blank.',
        })
      })
    })
  })
})
