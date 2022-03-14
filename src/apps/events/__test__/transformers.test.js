/* eslint camelcase: 0 */
const { assign } = require('lodash')
const proxyquire = require('proxyquire')

const mockEvent = require('../../../../test/unit/data/events/event-data.json')

const archivedDocumentsBaseUrl = 'http://base'

const { transformEventToListItem, transformEventFormBodyToApiRequest } =
  proxyquire('../transformers', {
    '../../config': {
      archivedDocumentsBaseUrl,
    },
  })

describe('Event transformers', () => {
  describe('#transformEventToListItem', () => {
    it('should return undefined when no arguments', () => {
      expect(transformEventToListItem({})).to.be.undefined
    })

    it('should return undefined for properties not in transform', () => {
      expect(transformEventToListItem({ a: 'b' })).to.be.undefined
      expect(transformEventToListItem({ id: 'abcd' })).to.be.undefined
      expect(
        transformEventToListItem({ first_name: 'Peter', last_name: 'Great' })
      ).to.be.undefined
    })

    context('with mock event data', () => {
      let event

      beforeEach(() => {
        event = transformEventToListItem(mockEvent)
      })

      it('should return expected id property', () => {
        expect(event).to.have.property('id').a('string')
        expect(event.id).to.equal(mockEvent.id)
      })

      it('should return expected name property', () => {
        expect(event).to.have.property('name').a('string')
        expect(event.name).to.equal(mockEvent.name)
      })

      it('should return a sub-title property', () => {
        expect(event).to.have.deep.property('subTitle', {
          value: '2017-09-19T15:20:26.834094',
          type: 'datetime',
          label: 'Updated on',
        })
      })

      it('should return expected type property', () => {
        expect(event).to.have.property('type').a('string')
        expect(event.type).to.equal('event')
      })

      it('should return expected meta property', () => {
        expect(event)
          .to.have.property('meta')
          .an('array')
          .to.deep.equal([
            { label: 'Type', value: 'Outward mission' },
            { label: 'Begins', type: 'date', value: '2017-11-10' },
            { label: 'Ends', type: 'date', value: '2017-11-11' },
            { label: 'Organiser', value: 'Jeff Smith' },
            { label: 'Country', type: 'badge', value: 'United Kingdom' },
            { label: 'Lead team', value: 'Association of Dogs' },
            { label: 'Region', type: 'badge', value: 'FDI Hub' },
          ])
      })
    })

    context('when the event is disabled', () => {
      beforeEach(() => {
        this.event = transformEventToListItem({
          ...mockEvent,
          disabled_on: '2017-09-05T00:00:00Z',
        })
      })

      it('should show a badge indicating the event was disabled', () => {
        const disabledBadge = this.event.meta.find(
          (metaItem) => metaItem.label === 'Disabled'
        )
        expect(disabledBadge).to.deep.equal({
          label: 'Disabled',
          value: 'Disabled',
          type: 'badge',
        })
      })
    })
  })

  describe('#transformEventFormBodyToApiRequest', () => {
    it('should add combined date string from date object', () => {
      this.requestBody = transformEventFormBodyToApiRequest(
        assign({}, mockEvent, {
          start_date_year: '2017',
          start_date_month: '10',
          start_date_day: '31',
          end_date_year: '2017',
          end_date_month: '11',
          end_date_day: '01',
        })
      )

      expect(this.requestBody).to.have.property('start_date', '2017-10-31')
      expect(this.requestBody).to.have.property('end_date', '2017-11-01')
    })

    context('when not selecting the lead team', () => {
      it('should not add to the teams', () => {
        this.requestBody = transformEventFormBodyToApiRequest(
          assign({}, mockEvent, {
            lead_team: null,
          })
        )

        expect(this.requestBody).to.have.property('lead_team', null)
        expect(this.requestBody)
          .to.have.property('teams')
          .and.deep.equal(mockEvent.teams)
      })
    })

    context('when there are event programmes', () => {
      it('should cast event programme into an array', async () => {
        this.requestBody = transformEventFormBodyToApiRequest(
          assign({}, mockEvent, {
            related_programmes: 'programme1',
          })
        )

        expect(this.requestBody)
          .to.have.property('related_programmes')
          .to.be.an('array')
      })

      it('should prepopulate event programmes', async () => {
        this.requestBody = transformEventFormBodyToApiRequest(
          assign({}, mockEvent, {
            related_programmes: ['programme1', 'programme2', ''],
          })
        )

        expect(this.requestBody)
          .to.have.property('related_programmes')
          .to.be.an('array')
          .and.have.length(2)
      })
    })
  })
})
