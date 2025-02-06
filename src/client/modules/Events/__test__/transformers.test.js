import urls from '../../../../lib/urls'

const { expect } = require('chai')

const {
  transformResponseToEventAventriDetails,
  transformResponseToEventCollection,
} = require('../transformers')

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

describe('#transformResponseToEventCollection', () => {
  let requiredTransformData = [
    {
      id: 'an-id-for-event',
      name: 'a test event',
      event_type: null,
      modified_on: null,
      start_date: null,
      end_date: null,
      organiser: null,
      lead_team: null,
      service: null,
      stova_event: null,
    },
  ]
  let stovaEvent = {
    id: 'an-id-for-stova-event',
  }

  context('When event URL is set', () => {
    it('Should be a data hub event link for events with no stova event', () => {
      const transformedResult = transformResponseToEventCollection({
        count: 0,
        results: requiredTransformData,
      })
      expect(transformedResult.results[0].headingUrl).to.equal(
        urls.events.details('an-id-for-event')
      )
    })

    it('Should be a stova event link for events with a stova event', () => {
      requiredTransformData[0].stova_event = stovaEvent

      const transformedResult = transformResponseToEventCollection({
        count: 0,
        results: requiredTransformData,
      })
      expect(transformedResult.results[0].headingUrl).to.equal(
        urls.events.stova.details('an-id-for-stova-event')
      )
    })
  })
})
