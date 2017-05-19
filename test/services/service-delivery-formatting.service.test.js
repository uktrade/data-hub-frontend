
describe('Service delivery formatting service', function () {
  let serviceDelivery
  let serviceDeliveryFormattingService

  beforeEach(function () {
    serviceDeliveryFormattingService = proxyquire(`${root}/src/services/service-delivery-formatting.service`, {
      './company.service': {
        buildCompanyUrl: sinon.stub().returns('/test')
      }
    })

    serviceDelivery = {
      id: '22651151-2149-465e-871b-ac45bc568a62',
      company: { id: '555', name: 'Fred ltd' },
      service: { id: '333', name: 'service name' },
      status: { id: '666', name: 'Active' },
      subject: 'Subject 1234',
      notes: 'Here are some notes\nline 2.',
      date: '2017-02-14T14:49:17',
      contact: { id: '444', first_name: 'Fred', last_name: 'Smith' },
      dit_advisor: { id: '666', name: 'John Brown' },
      uk_region: { id: '888', name: 'London' },
      sector: { id: '999', name: 'Engineering' },
      country_of_interest: { id: '122', name: 'France' },
      dit_team: { id: '344', name: 'team name' }
    }
  })

  describe('Service delivery details', function () {
    it('should return the required fields for the service delivery detail display', function () {
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: 'Engineering',
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing team', function () {
      serviceDelivery.dit_team = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: null,
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: 'Engineering',
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing service', function () {
      serviceDelivery.service = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: 'Engineering',
        service: null,
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing status', function () {
      serviceDelivery.status = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: null,
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: 'Engineering',
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing advisor', function () {
      serviceDelivery.dit_advisor = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: null,
        uk_region: 'London',
        sector: 'Engineering',
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing region', function () {
      serviceDelivery.uk_region = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: null,
        sector: 'Engineering',
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should hand a missing sector', function () {
      serviceDelivery.sector = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: null,
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing contact', function () {
      serviceDelivery.contact = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: null,
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: 'Engineering',
        country_of_interest: 'France'
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
    it('should handle a missing country of interest', function () {
      serviceDelivery.country_of_interest = null
      const expected = {
        company: '<a href="/test">Fred ltd</a>',
        dit_team: 'team name',
        service: 'service name',
        status: 'Active',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        date: '14 February 2017',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        dit_advisor: 'John Brown',
        uk_region: 'London',
        sector: 'Engineering',
        country_of_interest: null
      }
      const actual = serviceDeliveryFormattingService.getDisplayServiceDelivery(serviceDelivery)
      expect(actual).to.deep.equal(expected)
    })
  })
})
