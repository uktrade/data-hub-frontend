const transformInteractionResponseToForm = require('~/src/apps/interactions/transformers/interaction-response-to-form')
const mockInteraction = require('~/test/unit/data/interactions/interaction-with-feedback.json')
const mockInteractionNoFeedback = { ...mockInteraction }

describe('#transformInteractionResponseToForm', () => {
  context('when the source is an interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToForm(mockInteraction)
    })

    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: '0f5216e0-849f-11e6-ae22-56b6b6499611',
        contacts: ['7701587b-e88f-4f39-874f-0bd06321f7df'],
        dit_participants: [1],
        service: 'd320b92b-3499-e211-a939-e4115bead28a',
        service_delivery_status: undefined,
        grant_amount_offered: null,
        net_company_receipt: null,
        communication_channel: '70c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '25', month: '11', year: '2058' },
        is_event: 'false',
        event: undefined,
        id: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
        policy_issue_types: ['4b9142df-0520-46bd-9da9-94147cdbae13'],
        policy_feedback_notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        was_policy_feedback_provided: 'true',
        notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        subject: 'ad',
        policy_areas: [],
        kind: 'interaction',
      })
    })
  })

  context('when the source is a service delivery and optional fields have been selected', () => {
    beforeEach(() => {
      const serviceDelivery = {
        ...mockInteraction,
        event: { id: '1' },
        service_delivery_status: {
          name: 'Offered',
          id: '45329c18-6095-e211-a939-e4115bead28a',
        },
        grant_amount_offered: '1000.00',
        net_company_receipt: '500.00',
      }
      this.transformed = transformInteractionResponseToForm(serviceDelivery)
    })

    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: '0f5216e0-849f-11e6-ae22-56b6b6499611',
        contacts: ['7701587b-e88f-4f39-874f-0bd06321f7df'],
        dit_participants: [1],
        service: 'd320b92b-3499-e211-a939-e4115bead28a',
        service_delivery_status: '45329c18-6095-e211-a939-e4115bead28a',
        grant_amount_offered: '1000.00',
        net_company_receipt: '500.00',
        communication_channel: '70c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '25', month: '11', year: '2058' },
        is_event: 'true',
        event: '1',
        id: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
        policy_issue_types: ['4b9142df-0520-46bd-9da9-94147cdbae13'],
        policy_feedback_notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        was_policy_feedback_provided: 'true',
        notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        subject: 'ad',
        policy_areas: [],
        kind: 'interaction',
      })
    })
  })

  context('when the source is a service delivery and optional fields have been unselected', () => {
    beforeEach(() => {
      const interaction = {
        ...mockInteraction,
        event: null,
        service_delivery_status: null,
        grant_amount_offered: null,
        net_company_receipt: null,
      }
      this.transformed = transformInteractionResponseToForm(interaction)
    })

    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: '0f5216e0-849f-11e6-ae22-56b6b6499611',
        contacts: ['7701587b-e88f-4f39-874f-0bd06321f7df'],
        dit_participants: [1],
        service: 'd320b92b-3499-e211-a939-e4115bead28a',
        service_delivery_status: undefined,
        grant_amount_offered: null,
        net_company_receipt: null,
        communication_channel: '70c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '25', month: '11', year: '2058' },
        is_event: 'false',
        event: undefined,
        id: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
        policy_issue_types: ['4b9142df-0520-46bd-9da9-94147cdbae13'],
        policy_feedback_notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        was_policy_feedback_provided: 'true',
        notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        subject: 'ad',
        policy_areas: [],
        kind: 'interaction',
      })
    })
  })

  context('when the source is a service delivery and has no policy feedback', () => {
    mockInteractionNoFeedback.was_policy_feedback_provided = false
    mockInteractionNoFeedback.policy_issue_types = []
    mockInteractionNoFeedback.policy_feedback_notes = ''
    beforeEach(() => {
      this.transformed = transformInteractionResponseToForm(mockInteractionNoFeedback)
    })
    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: '0f5216e0-849f-11e6-ae22-56b6b6499611',
        contacts: ['7701587b-e88f-4f39-874f-0bd06321f7df'],
        dit_participants: [1],
        service: 'd320b92b-3499-e211-a939-e4115bead28a',
        service_delivery_status: undefined,
        grant_amount_offered: null,
        net_company_receipt: null,
        communication_channel: '70c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '25', month: '11', year: '2058' },
        is_event: 'false',
        event: undefined,
        id: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
        policy_issue_types: [],
        policy_feedback_notes: '',
        was_policy_feedback_provided: 'false',
        notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        subject: 'ad',
        policy_areas: [],
        kind: 'interaction',
      })
    })
  })
})
