const { expect } = require('chai')

const { transformResponseToEventAventriDetails } = require('../transformers')

describe('#transformResponseToEventAventriDetails', () => {
  context(
    'When registrationStatusCounts contains a mix of registration status',
    () => {
      let transformedResult
      before(() => {
        transformedResult = transformResponseToEventAventriDetails({
          object: {},
          registrationStatuses: [
            { status: 'A', count: 2 },
            { status: 'B', count: 1 },
            { status: 'C', count: 0 },
            { status: 'D', count: 9 },
            { status: 'E', count: 0 },
          ],
        })
      })

      it('Should only return statuses where count > 0', () => {
        expect(transformedResult.registrationStatusCounts).to.be.deep.equal([
          { status: 'A', count: 2 },
          { status: 'B', count: 1 },
          { status: 'D', count: 9 },
        ])
      })
    }
  )
})
