const { transformServiceDeliveryToAttendeeListItem } = require('~/src/apps/events/attendees/transformers')

describe('#transformEventToAttendeeListItem', () => {
  beforeEach(() => {
    this.serviceDelivery = {
      id: '1234',
      date: '2017-05-31T00:00:00',
    }
  })

  context('when the contact is missing', () => {
    beforeEach(() => {
      this.serviceDelivery.company = {
        id: '2222',
        name: 'Test company',
      }

      this.result = transformServiceDeliveryToAttendeeListItem(this.serviceDelivery)
    })

    it('should return undefined', () => {
      expect(this.result).to.be.undefined
    })
  })

  context('when the company is missing', () => {
    beforeEach(() => {
      this.serviceDelivery.contact = {
        id: '3333',
        name: 'Test contact',
      }

      this.result = transformServiceDeliveryToAttendeeListItem(this.serviceDelivery)
    })

    it('should return undefined', () => {
      expect(this.result).to.be.undefined
    })
  })

  context('when a valid company is provided', () => {
    beforeEach(() => {
      this.serviceDelivery.company = {
        id: '2222',
        name: 'Test company',
      }
    })

    context('when a valid contact is provided without a job title', () => {
      beforeEach(() => {
        this.serviceDelivery.contact = {
          id: '3333',
          name: 'Test contact',
        }

        this.transformedAttendee = transformServiceDeliveryToAttendeeListItem(this.serviceDelivery)
      })

      it('should return a transformed attendee with the contact name and link', () => {
        expect(this.transformedAttendee).to.have.property('id', '3333')
        expect(this.transformedAttendee).to.have.property('type', 'contact')
        expect(this.transformedAttendee).to.have.property('name', 'Test contact')
      })

      it('should return a transformed attendee with the company name and link', () => {
        expect(this.transformedAttendee.meta).to.include.deep({
          label: 'Company',
          value: 'Test company',
          url: `/companies/2222`,
        })
      })

      it('should return a transformed attendee with the attendance date', () => {
        expect(this.transformedAttendee.meta).to.include.deep({
          label: 'Date attended',
          value: '2017-05-31T00:00:00',
          type: 'date',
        })
      })

      it('should return a transformed attendee with a link to the associated service delivery', () => {
        expect(this.transformedAttendee.meta).to.include.deep({
          label: 'Service delivery',
          value: 'View service delivery',
          url: '/interactions/1234',
        })
      })
    })

    context('when a valid contact is provided with a job title', () => {
      beforeEach(() => {
        this.serviceDelivery.contact = {
          id: '3333',
          name: 'Test contact',
          job_title: 'Director',
        }

        this.transformedAttendee = transformServiceDeliveryToAttendeeListItem(this.serviceDelivery)
      })

      it('should return a transformed attendee with their job title', () => {
        expect(this.transformedAttendee.meta).to.include.deep({
          label: 'Job title',
          value: 'Director',
        })
      })
    })
  })
})
