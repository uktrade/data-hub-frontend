const { filterDisabledOption } = require('~/src/apps/filters')

describe('#filterDisabledOption', () => {
  beforeEach(() => {
    this.options = [{
      id: 'ac035522-ad0b-4eeb-87f4-0ce964e4b104',
      name: 'Acquisition',
      disabled_on: '2017-01-01T11:00:00.000000Z',
    }, {
      id: '840f62c1-bbcb-44e4-b6d4-a258d2ffa07d',
      name: 'Capital only',
      disabled_on: null,
    }, {
      id: 'f8447013-cfdc-4f35-a146-6619665388b3',
      name: 'Creation of new site or activity',
      disabled_on: null,
    }, {
      id: 'd08a2f07-c366-4133-9a7e-35b6c88a3270',
      name: 'Expansion of existing site or activity',
      disabled_on: null,
    }, {
      id: 'a7dbf6b3-9c04-43a7-9be9-d3072f138fab',
      name: 'Joint venture',
      disabled_on: '2017-01-01T11:00:00.000000Z',
    }, {
      id: '32018db0-fd2d-4b8c-aee4-a931bde3abe8',
      name: 'Merger',
      disabled_on: null,
    }, {
      id: '0657168e-8a58-4f37-914f-ec541556fc28',
      name: 'Retention',
      disabled_on: '2017-01-01T11:00:00.000000Z',
    }]
  })

  it('should filter out disabled options', () => {
    const filtered = this.options.filter(filterDisabledOption())
    expect(filtered).to.have.length(4)
  })

  it('should include the current value if it is provided', () => {
    const filtered = this.options.filter(filterDisabledOption('a7dbf6b3-9c04-43a7-9be9-d3072f138fab'))
    expect(filtered).to.have.length(5)
    expect(filtered[3]).to.deep.equal(this.options[4])
  })
})
