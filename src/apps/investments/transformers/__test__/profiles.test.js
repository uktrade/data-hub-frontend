const { transformLargeCapitalProfiles } = require('../profiles')

describe('#transformLargeCapitalProfiles', () => {
  let actual

  before(() => {
    actual = transformLargeCapitalProfiles({
      'investor_company': {
        'name': 'ABC Inc',
        'id': '1',
      },
      'created_on': '2019-10-29T15:50:58.399262Z',
    })
  })

  it('should return the transformed values', () => {
    const expected = {
      'headingText': 'ABC Inc',
      'headingUrl': '/companies/1',
      'itemId': '1',
      'metadata': [
        {
          'label': 'Updated on',
          'value': '29 October 2019',
        },
      ],
    }

    expect(actual).to.deep.equal(expected)
  })
})
