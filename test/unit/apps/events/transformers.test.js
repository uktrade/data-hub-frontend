/* eslint camelcase: 0 */

const {
  transformEventToListItem,
  transformEventResponseToViewRecord,
} = require('~/src/apps/events/transformers')

describe('Event transformers', function () {
  const mockEvent = require('~/test/unit/data/events/event-data')

  describe('#transformEventToListItem', () => {
    it('should return undefined when no arguments', () => {
      expect(transformEventToListItem({})).to.be.undefined
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
          { label: 'Ends', type: 'date', value: '2017-11-11' },
          { label: 'Organiser', value: 'Jeff Smith' },
          { label: 'Country', type: 'badge', value: 'United Kingdom' },
          { label: 'Lead team', value: 'Association of Cats' },
          { label: 'Region', type: 'badge', value: 'FDI Hub' },
        ])
      })
    })
  })

  describe('#transformEventToDisplayEvent', () => {
    context('when all event fields are populated', () => {
      beforeEach(() => {
        this.transformedEvent = transformEventResponseToViewRecord(mockEvent)
      })

      it('should transform to a display event', () => {
        expect(this.transformedEvent).to.deep.equal({
          'Address': '1 Uk Street, The Lane, Plymouth, Devon, PL1 3FG, United Kingdom',
          'Event end date': {
            type: 'date',
            name: '2017-11-11',
          },
          'Type of event': {
            id: '6031f993-a689-49af-9a11-942a8413a779',
            name: 'Outward mission',
          },
          'Lead team': {
            id: '32f12898-9698-e211-a939-e4115bead28a',
            name: 'Association of Cats',
          },
          'Event location type': {
            id: 'cf45bf02-8ea7-4e53-af0e-b5676a30cb96',
            name: 'Other',
          },
          'Notes': 'An example event for testing',
          'Organiser': {
            id: '0919a99e-9798-e211-a939-e4115bead28a',
            first_name: 'Jeff',
            last_name: 'Smith',
            name: 'Jeff Smith',
          },
          'Related programmes': ['Example Programme'],
          'Event start date': {
            type: 'date',
            name: '2017-11-10',
          },
          'Other teams': [],
          'Region': {
            id: '804cd12a-6095-e211-a939-e4115bead28a',
            name: 'FDI Hub',
          },
          'Service': {
            id: '9484b82b-3499-e211-a939-e4115bead28a',
            name: 'Account Management',
          },
        })
      })
    })

    context('when the event contains minimal data', () => {
      beforeEach(() => {
        const minimalEvent = require('~/test/unit/data/events/minimal-event.json')
        this.transformedEvent = transformEventResponseToViewRecord(minimalEvent)
      })

      it('should transform to a display event', () => {
        expect(this.transformedEvent).to.deep.equal({
          'Address': '1 Uk Street, Plymouth, Devon, PL1 3FG, United Kingdom',
          'Type of event': {
            id: '6031f993-a689-49af-9a11-942a8413a779',
            name: 'Outward mission',
          },
          'Lead team': null,
          'Event location type': null,
          'Notes': null,
          'Organiser': null,
          'Related programmes': [],
          'Event date': {
            type: 'date',
            name: null,
          },
          'Other teams': [],
          'Region': null,
          'Service': null,
        })
      })
    })

    describe('date transformer', () => {
      context('when start and end date are identical', () => {
        beforeEach(() => {
          const eventWithDates = Object.assign({}, mockEvent, {
            start_date: '2017-11-11',
            end_date: '2017-11-11',
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithDates)
        })

        it('should include a single date', () => {
          expect(this.transformedEvent['Event date']).to.deep.equal({
            type: 'date',
            name: '2017-11-11',
          })
          expect(this.transformedEvent).to.not.have.property('Start date')
          expect(this.transformedEvent).to.not.have.property('End date')
        })
      })

      context('when there is only a start date', () => {
        beforeEach(() => {
          const eventWithNoEndDate = Object.assign({}, mockEvent, {
            start_date: '2017-11-10',
            end_date: null,
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithNoEndDate)
        })

        it('should format the start date', () => {
          expect(this.transformedEvent['Event start date']).to.deep.equal({
            type: 'date',
            name: '2017-11-10',
          })
        })

        it('should return a blank end date', () => {
          expect(this.transformedEvent['Event end date']).to.deep.equal({
            type: 'date',
            name: null,
          })
        })
      })

      context('when there is only an end date', () => {
        beforeEach(() => {
          const eventWithNoStartDate = Object.assign({}, mockEvent, {
            start_date: null,
            end_date: '2017-11-11',
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithNoStartDate)
        })

        it('should format the end date', () => {
          expect(this.transformedEvent['Event end date']).to.deep.equal({
            type: 'date',
            name: '2017-11-11',
          })
        })
        it('should return a blank start date', () => {
          expect(this.transformedEvent['Event start date']).to.deep.equal({
            type: 'date',
            name: null,
          })
        })
      })
    })

    describe('team transformer', () => {
      context('when there is only one team involved', () => {
        beforeEach(() => {
          const lead_team = {
            id: '1',
            name: 'Team 1',
          }

          const eventWithNoTeams = Object.assign({}, mockEvent, {
            lead_team,
            teams: [lead_team],
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithNoTeams)
        })

        it('should indicate there are no other teams', () => {
          expect(this.transformedEvent['Other teams']).to.deep.equal([])
        })
      })

      context('when there are two teams', () => {
        beforeEach(() => {
          const lead_team = {
            id: '1',
            name: 'Team 1',
          }

          const eventWithTwoTeams = Object.assign({}, mockEvent, {
            lead_team,
            teams: [lead_team, {
              id: '2',
              name: 'Team 2',
            }],
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithTwoTeams)
        })

        it('should display the other team', () => {
          expect(this.transformedEvent['Other teams']).to.deep.equal(['Team 2'])
        })
      })

      context('when there is more than two teams', () => {
        beforeEach(() => {
          const lead_team = {
            id: '1',
            name: 'Team 1',
          }

          const eventWithThreeTeams = Object.assign({}, mockEvent, {
            lead_team,
            teams: [lead_team, {
              id: '2',
              name: 'Team 2',
            }, {
              id: '3',
              name: 'Team 3',
            }],
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithThreeTeams)
        })

        it('should include a list of other teams', () => {
          expect(this.transformedEvent['Other teams']).to.deep.equal(['Team 2', 'Team 3'])
        })
      })
    })

    describe('programmes transformer', () => {
      context('when there are no related programmes', () => {
        beforeEach(() => {
          const eventWithNoProgrammes = Object.assign({}, mockEvent, {
            related_programmes: [],
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithNoProgrammes)
        })

        it('should indicate there are no related programmes', () => {
          expect(this.transformedEvent['Related programmes']).to.deep.equal([])
        })
      })

      context('when there are related programmes', () => {
        beforeEach(() => {
          const eventWithNoProgrammes = Object.assign({}, mockEvent, {
            related_programmes: [{
              id: '1',
              name: 'Programme 1',
            }, {
              id: '2',
              name: 'Programme 2',
            }],
          })

          this.transformedEvent = transformEventResponseToViewRecord(eventWithNoProgrammes)
        })

        it('should include the related programme', () => {
          expect(this.transformedEvent['Related programmes']).to.deep.equal(['Programme 1', 'Programme 2'])
        })
      })
    })
  })
})
