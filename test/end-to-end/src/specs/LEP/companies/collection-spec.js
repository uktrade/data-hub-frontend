import assert from 'assert'
import actionSequence from '../../../action-sequence'

describe('Company Collections', () => {
  beforeEach(() => {
    browser.url('/companies')
  })

  it('should return the results summary for a company collection', () => {
    const headerCount = actionSequence.collection.headerCount()
    const itemCount = actionSequence.collection.itemCount()
    assert(headerCount, itemCount)
  })
})
