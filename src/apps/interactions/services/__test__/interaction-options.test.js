const proxyquire = require('proxyquire')

const config = require('../../../../config')
const serviceOptions = require('../../../../../test/unit/data/interactions/service-options-data.json')
const { transformServicesOptions } = require('../../transformers/index')

const serviceOptionsTransformed = transformServicesOptions(serviceOptions)

describe('Interaction options', () => {
  let req, res
  let getServiceOptionsStub
  let getCommonOptionsStub
  let activeInactiveAdviserData

  beforeEach(() => {
    getServiceOptionsStub = sinon.stub()
    getCommonOptionsStub = sinon.stub()

    req = { session: { token: 'abcd' }, params: { kind: 'interaction' } }
    res = {
      locals: { 'interaction.created_on': '2018-01-23T10:39:18.220321Z' },
    }
    activeInactiveAdviserData = [
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

    const contactsData = [
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
      .reply(200, { results: contactsData })
      .get('/adviser/?limit=100000&offset=0')
      .reply(200, { results: activeInactiveAdviserData })
  })

  context('when there is no tap services', () => {
    it('should return an empty list for tapServices', async () => {
      const interactionOption = proxyquire('../interaction-options', {
        '../../../lib/options': {
          getOptions: getServiceOptionsStub.resolves(serviceOptionsTransformed),
        },
        getCommonOptions: getCommonOptionsStub,
      })

      const formOptions = await interactionOption.getInteractionOptions(
        req,
        res
      )
      expect(formOptions.tapServices).to.deep.equal([])
    })
  })

  context('when there is a tap services', () => {
    it('should return a single tap service', async () => {
      serviceOptionsTransformed[0].label = '(TAP)'
      const interactionOption = proxyquire('../interaction-options', {
        '../../../lib/options': {
          getOptions: getServiceOptionsStub.resolves(serviceOptionsTransformed),
        },
        getCommonOptions: getCommonOptionsStub,
      })

      const formOptions = await interactionOption.getInteractionOptions(
        req,
        res
      )
      expect(formOptions.tapServices).to.deep.equal(['sv1'])
    })
  })
})
