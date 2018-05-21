const config = require('~/config')
const { renderInteractionList } = require('~/src/apps/interactions/controllers/list')

describe('interaction list', () => {
  beforeEach(() => {
    this.req = {
      session: {
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
      },
    }

    this.res = {
      render: sinon.stub(),
    }

    this.next = sinon.stub()

    this.metadataMock = {
      teamOptions: [
        { id: 'te1', name: 'te1', disabled_on: null },
        { id: 'te2', name: 'te2', disabled_on: null },
        { id: 'te', name: 'te3', disabled_on: null },
      ],
      channelOptions: [
        { id: 'c1', name: 'c1', disabled_on: null },
        { id: 'c2', name: 'c2', disabled_on: null },
        { id: 'c3', name: 'c3', disabled_on: null },
      ],
      sectorOptions: [
        { id: 's1', name: 's1', disabled_on: null },
        { id: 's2', name: 's2', disabled_on: null },
        { id: 's3', name: 's3', disabled_on: null },
      ],
    }

    nock(config.apiRoot)
      .get('/metadata/communication-channel/')
      .reply(200, this.metadataMock.channelOptions)
      .get('/metadata/team/')
      .reply(200, this.metadataMock.teamOptions)
      .get('/metadata/sector/?level__lte=0')
      .reply(200, this.metadataMock.sectorOptions)
  })

  context('when the user is allowed to view policy feedback data', () => {
    beforeEach(async () => {
      this.req.session.user.permissions = ['interaction.read_policy_feedback_interaction']
      await renderInteractionList(this.req, this.res, this.next)
    })

    it('should show the policy feedback filter', () => {
      const options = this.res.render.firstCall.args[1]
      const filterFields = options.filtersFields

      const kindField = filterFields.find(field => field.name === 'kind')
      expect(kindField.options).to.deep.equal([
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
        { value: 'policy_feedback', label: 'Policy feedback' },
      ])
    })
  })

  context('when the user is not allowed to view policy feedback data', () => {
    beforeEach(async () => {
      await renderInteractionList(this.req, this.res, this.next)
    })

    it('should not show the policy feedback filter', () => {
      const options = this.res.render.firstCall.args[1]
      const filterFields = options.filtersFields

      const kindField = filterFields.find(field => field.name === 'kind')
      expect(kindField.options).to.deep.equal([
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
      ])
    })
  })
})
