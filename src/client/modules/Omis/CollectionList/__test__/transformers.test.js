import {
  transformResponseToCollection,
  transformResponseToReconciliationCollection,
} from '../transformers'

describe('transformers', () => {
  const getInputAndExpected = () => ({
    input: { count: 10, summary: 'Test summary' },
    expected: { count: 10, summary: 'Test summary', results: [] },
  })

  it('should handle missing results by defaulting to an empty array in transformResponseToCollection', () => {
    const { input, expected } = getInputAndExpected()
    expect(transformResponseToCollection(input)).to.deep.equal(expected)
  })

  it('should handle missing results by defaulting to an empty array in transformResponseToReconciliationCollection', () => {
    const { input, expected } = getInputAndExpected()
    expect(transformResponseToReconciliationCollection(input)).to.deep.equal(
      expected
    )
  })
})
