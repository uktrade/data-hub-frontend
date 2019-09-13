const config = require('~/config')
const { fetchOrganisationTypes } = require('~/src/apps/companies/apps/add-company/repos')
const businessTypeFixture = require('../../../../data/metadata/business-type')

const token = 'abcd'

describe('Add company form repos', () => {
  describe('#fetchOrganisationTypes', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/metadata/business-type/')
        .reply(200, businessTypeFixture)

      this.actual = await fetchOrganisationTypes(token)
    })

    it('should return the organisation types', () => {
      expect(this.actual).to.deep.equal([
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
