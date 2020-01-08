const proxyquire = require('proxyquire')

const config = require('../../../../config')
const serviceOptions = require('../../../../../test/unit/data/interactions/service-options-data.json')
const { transformServicesOptions } = require('../../transformers/index')

const serviceOptionsTransformed = transformServicesOptions(serviceOptions)

describe('Interaction options', () => {
  beforeEach(() => {
    this.getServiceOptionsStub = sinon.stub()
    this.getCommonOptionsStub = sinon.stub()

    this.req = { session: { token: 'abcd' }, params: { kind: 'interaction' } }
    this.res = {
      locals: { 'interaction.created_on': '2018-01-23T10:39:18.220321Z' },
    }
    this.createdOn = '2018-01-23T10:39:18.220321Z'
    this.activeInactiveAdviserData = [
      {
        id: '1',
        name: 'Jeff Smith',
        is_active: true,
      },
      {
        id: '2',
        name: 'John Smith',
        is_active: true,
      },
      {
        id: '3',
        name: 'Zac Smith',
        is_active: true,
      },
      {
        id: '4',
        name: 'Fred Smith',
        is_active: false,
      },
      {
        id: '5',
        name: 'Jim Smith',
        is_active: false,
      },
    ]

    this.contactsData = [
      {
        id: '999',
        first_name: 'Fred',
        last_name: 'Smith',
        job_title: 'Manager',
      },
      {
        id: '998',
        first_name: 'Emily',
        last_name: 'Brown',
        job_title: 'Director',
      },
    ]

    nock(config.apiRoot)
      .get('/v3/contact?limit=500')
      .reply(200, { results: this.contactsData })
      .get('/adviser/?limit=100000&offset=0')
      .reply(200, { results: this.activeInactiveAdviserData })
  })

  context('when there is no tap services', () => {
    beforeEach(() => {
      this.interactionOption = proxyquire('../interaction-options', {
        '../../../lib/options': {
          getOptions: this.getServiceOptionsStub.resolves(
            serviceOptionsTransformed
          ),
        },
        getCommonOptions: this.getCommonOptionsStub.resolves(
          this.commonOptions
        ),
      })
    })

    it('should return an empty list for tapServices', async () => {
      const formOptions = await this.interactionOption.getInteractionOptions(
        this.req,
        this.res
      )
      expect(formOptions.tapServices).to.deep.equal([])
    })
  })

  context('when there is a tap services', () => {
    beforeEach(() => {
      serviceOptionsTransformed[0].label = '(TAP)'
      this.interactionOption = proxyquire('../interaction-options', {
        '../../../lib/options': {
          getOptions: this.getServiceOptionsStub.resolves(
            serviceOptionsTransformed
          ),
        },
        getCommonOptions: this.getCommonOptionsStub.resolves(
          this.commonOptions
        ),
      })
    })

    it('should return a single tap service', async () => {
      const formOptions = await this.interactionOption.getInteractionOptions(
        this.req,
        this.res
      )
      expect(formOptions.tapServices).to.deep.equal(['sv1'])
    })
  })
})
