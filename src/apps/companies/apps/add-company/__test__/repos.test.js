const config = require('../../../../../config')
const { fetchOrganisationTypes } = require('../repos')
const businessTypeFixture = require('../../../../../../test/unit/data/metadata/business-type')

const stubRequest = { session: { token: 'abcd' } }

describe('Add company form repos', () => {
  describe('#fetchOrganisationTypes', () => {
    let actual

    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v4/metadata/business-type')
        .reply(200, businessTypeFixture)

      actual = await fetchOrganisationTypes(stubRequest)
    })

    it('should return the organisation types', () => {
      expect(actual).to.deep.equal([
        {
          value: '9dd14e94-5d95-e211-a939-e4115bead28a',
          label: 'Charity',
        },
        {
          value: '9cd14e94-5d95-e211-a939-e4115bead28a',
          label: 'Government department or other public body',
        },
        {
          value: '98d14e94-5d95-e211-a939-e4115bead28a',
          label: 'Limited company',
        },
        {
          value: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
          label: 'Limited partnership',
        },
        {
          value: '9ad14e94-5d95-e211-a939-e4115bead28a',
          label: 'Partnership',
        },
        {
          value: '99d14e94-5d95-e211-a939-e4115bead28a',
          label: 'Sole Trader',
        },
      ])
    })
  })
})
