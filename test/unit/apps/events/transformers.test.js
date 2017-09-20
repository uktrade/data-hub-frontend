const {
  transformEventToListItem,
} = require('~/src/apps/events/transformers')

describe('Event transformers', function () {
  describe('#transformEventToListItem', () => {
    const mockEvent = require('~/test/unit/data/events/event-data')

    it('should return undefined when no arguments', () => {
      expect(transformEventToListItem()).to.be.undefined
    })

    it('should return undefined for properties not in transform', () => {
      expect(transformEventToListItem({ a: 'b' })).to.be.undefined
      expect(transformEventToListItem({ id: 'abcd' })).to.be.undefined
      expect(transformEventToListItem({ first_name: 'Peter', last_name: 'Great' })).to.be.undefined
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

      it('should return expected type property', () => {
        expect(event).to.have.property('type').a('string')
        expect(event.type).to.equal('event')
      })

      it('should return expected meta property', () => {
        expect(event).to.have.property('meta').an('array').to.deep.equal([
          { label: 'Type', value: 'Outward mission' },
          { label: 'Updated', type: 'datetime', value: '2017-09-19T15:20:26.834094' },
          { label: 'Begins', type: 'date', value: '2017-11-10' },
          { label: 'Ends', type: 'date', value: '2017-11-10' },
          { label: 'Organiser', value: 'Jeff Smith' },
          { label: 'Country', type: 'badge', value: 'United Kingdom' },
          { label: 'Lead team', value: 'Association of Cats' },
          { label: 'Region', type: 'badge', value: 'FDI Hub' },
        ])
      })
    })
  })
})
