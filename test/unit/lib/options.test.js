const nock = require('nock')
const moment = require('moment')

const config = require('~/config')
const yesterday = moment().subtract(1, 'days').toISOString()
const lastWeek = moment().subtract(1, 'weeks').toISOString()
const today = moment().toISOString()

const { getOptions } = require('~/src/lib/options')

const regionOptions = [
  { id: '1', name: 'r1', disabled_on: null },
  { id: '2', name: 'r2', disabled_on: yesterday },
  { id: '3', name: 'r3', disabled_on: null },
]

describe('#options', () => {
  beforeEach(() => {
    this.nockScope = nock(config.apiRoot)
      .get('/metadata/uk-region/')
      .reply(200, regionOptions)
  })

  context('when asking for options for a new record', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region')
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when asking for options for an existing record using disabled value', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { currentValue: '2', createdOn: today })
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r2', value: '2' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when asking for options for an existing record created before option disabled', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { currentValue: '1', createdOn: lastWeek })
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r2', value: '2' },
        { label: 'r3', value: '3' },
      ])
    })
  })

  context('when asking for all options for a filter form', () => {
    beforeEach(async () => {
      this.options = await getOptions('1234', 'uk-region', { includeDisabled: true })
    })

    it('should return just active options', () => {
      expect(this.options).to.deep.equal([
        { label: 'r1', value: '1' },
        { label: 'r2', value: '2' },
        { label: 'r3', value: '3' },
      ])
    })
  })
})
