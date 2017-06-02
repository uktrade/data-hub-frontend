
describe('Interaction formatting service', function () {
  let interaction
  let interactionFormattingService

  beforeEach(function () {
    interactionFormattingService = proxyquire('~/src/services/interaction-formatting.service', {
      './company.service': {
        buildCompanyUrl: sinon.stub().returns('/test')
      }
    })

    interaction = {
      id: '22651151-2149-465e-871b-ac45bc568a62',
      interaction_type: { id: '1234', name: 'Email' },
      subject: 'Subject 1234',
      date: '2017-02-14T14:49:17',
      dit_advisor: { id: '666', name: 'John Brown' },
      service: { id: '333', name: 'service name' },
      dit_team: { id: '222', name: 'team name' },
      contact: { id: '444', first_name: 'Fred', last_name: 'Smith' },
      company: { id: '555', name: 'Fred ltd' },
      notes: 'Here are some notes\nline 2.'
    }
  })

  describe('Company interactions', function () {
    it('should return the required fields for the display interaction', function () {
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        subject: 'Subject 1234',
        interaction_type: 'Email',
        advisor: 'John Brown',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: '14 Feb 2017',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayCompanyInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle a missing advisor', function () {
      interaction.dit_advisor = null
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        date: '14 Feb 2017',
        advisor: null,
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayCompanyInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no first name', function () {
      interaction.contact.first_name = null
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        date: '14 Feb 2017',
        advisor: 'John Brown',
        contact: '<a href="/contact/444/details">Smith</a>',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayCompanyInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no last name', function () {
      interaction.contact.last_name = null
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        date: '14 Feb 2017',
        advisor: 'John Brown',
        contact: '<a href="/contact/444/details">Fred</a>',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayCompanyInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should create the alternative url for service deliveries', function () {
      interaction.interaction_type = {id: '333', name: 'Service delivery'}
      const actual = interactionFormattingService.getDisplayCompanyInteraction(interaction)
      expect(actual.url).to.equal('/servicedelivery/22651151-2149-465e-871b-ac45bc568a62/details')
    })
  })
  describe('Interaction details', function () {
    it('should return the required fields for the interaction detail display', function () {
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: '14 February 2017',
        dit_advisor: 'John Brown',
        service: 'service name',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle a missing advisor', function () {
      interaction.dit_advisor = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: '14 February 2017',
        dit_advisor: null,
        service: 'service name',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no first name', function () {
      interaction.contact.first_name = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Smith</a>',
        date: '14 February 2017',
        dit_advisor: 'John Brown',
        service: 'service name',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no last name', function () {
      interaction.contact.last_name = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Fred</a>',
        date: '14 February 2017',
        dit_advisor: 'John Brown',
        service: 'service name',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no notes', function () {
      interaction.notes = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: null,
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: '14 February 2017',
        dit_advisor: 'John Brown',
        service: 'service name',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle an interaction with no date', function () {
      interaction.date = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: null,
        dit_advisor: 'John Brown',
        service: 'service name',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle an interaction with no service', function () {
      interaction.service = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: '14 February 2017',
        dit_advisor: 'John Brown',
        service: null,
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle an interaction with no dit team', function () {
      interaction.dit_team = null
      const expectedDisplayInteraction = {
        company: '<a href="/test">Fred ltd</a>',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        notes: 'Here are some notes<br/>line 2.',
        contact: '<a href="/contact/444/details">Fred Smith</a>',
        date: '14 February 2017',
        dit_advisor: 'John Brown',
        service: 'service name',
        dit_team: null
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
  })
  describe('Contact interactions', function () {
    it('should return the required fields for the display interaction', function () {
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        subject: 'Subject 1234',
        interaction_type: 'Email',
        advisor: 'John Brown',
        date: '14 Feb 2017',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayContactInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle a missing advisor', function () {
      interaction.dit_advisor = null
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        date: '14 Feb 2017',
        advisor: null,
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayContactInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no first name', function () {
      interaction.contact.first_name = null
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        date: '14 Feb 2017',
        advisor: 'John Brown',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayContactInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should handle contact with no last name', function () {
      interaction.contact.last_name = null
      const expectedDisplayInteraction = {
        id: '22651151-2149-465e-871b-ac45bc568a62',
        url: '/interaction/22651151-2149-465e-871b-ac45bc568a62/details',
        interaction_type: 'Email',
        subject: 'Subject 1234',
        date: '14 Feb 2017',
        advisor: 'John Brown',
        service: 'service name',
        notes: 'Here are some notes<br/>line 2.',
        dit_team: 'team name'
      }
      const actualDisplayInteraction = interactionFormattingService.getDisplayContactInteraction(interaction)
      expect(actualDisplayInteraction).to.deep.equal(expectedDisplayInteraction)
    })
    it('should create the alternative url for service deliveries', function () {
      interaction.interaction_type = {id: '333', name: 'Service delivery'}
      const actual = interactionFormattingService.getDisplayContactInteraction(interaction)
      expect(actual.url).to.equal('/servicedelivery/22651151-2149-465e-871b-ac45bc568a62/details')
    })
  })
})
