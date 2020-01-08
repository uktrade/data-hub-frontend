const config = require('../../../../../config')
const { getHeadquarterOptions } = require('../repos')
const headquarterTypeFixture = require('../../../../../../test/unit/data/metadata/headquarter-type')

const token = 'abcd'

describe('Edit company form repos', () => {
  describe('#getHeadquarterOptions', () => {
    let actual

    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v4/metadata/headquarter-type')
        .reply(200, headquarterTypeFixture)

      actual = await getHeadquarterOptions(token)
    })

    it('should return the organisation types', () => {
      expect(actual).to.deep.equal([
        {
          label: 'Not a headquarters',
          value: 'not_headquarters',
        },
        {
          label: 'Global HQ',
          value: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
        },
        {
          label: 'European HQ',
          value: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
        },
        {
          label: 'UK HQ',
          value: '3e6debb4-1596-40c5-aa25-f00da0e05af9',
        },
      ])
    })
  })
})
