const { assign } = require('lodash')

const transformInteractionResponseToForm = require('~/src/apps/interactions/transformers/interaction-response-to-form')
const mockInteraction = require('~/test/unit/data/interactions/search-interaction.json')
const policyFeedbackData = require('~/test/unit/data/interactions/policy-feedback.json')

describe('#transformInteractionResponseToForm', () => {
  context('when the source is an interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToForm(mockInteraction)
    })

    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: 'dcdabbc9-1781-e411-8955-e4115bead28a',
        contact: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
        dit_adviser: '8036f207-ae3e-e611-8d53-e4115bed50dc',
        service: '1231231231312',
        service_delivery_status: undefined,
        grant_amount_offered: undefined,
        net_company_receipt: undefined,
        dit_team: '222',
        communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '31', month: '05', year: '2017' },
        is_event: 'false',
        event: undefined,
        id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
        notes: 'lorem ipsum',
        subject: 'Test interactions',
        policy_area: undefined,
        policy_issue_type: undefined,
      })
    })
  })

  context('when the source is a service delivery and optional fields have been selected', () => {
    beforeEach(() => {
      const serviceDelivery = assign({}, mockInteraction, {
        event: { id: '1' },
        service_delivery_status: {
          name: 'Offered',
          id: '45329c18-6095-e211-a939-e4115bead28a',
        },
        grant_amount_offered: '1000.00',
        net_company_receipt: '500.00',
      })
      this.transformed = transformInteractionResponseToForm(serviceDelivery)
    })

    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: 'dcdabbc9-1781-e411-8955-e4115bead28a',
        contact: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
        dit_adviser: '8036f207-ae3e-e611-8d53-e4115bed50dc',
        service: '1231231231312',
        service_delivery_status: '45329c18-6095-e211-a939-e4115bead28a',
        grant_amount_offered: '1000.00',
        net_company_receipt: '500.00',
        dit_team: '222',
        communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '31', month: '05', year: '2017' },
        is_event: 'true',
        event: '1',
        id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
        notes: 'lorem ipsum',
        subject: 'Test interactions',
        policy_area: undefined,
        policy_issue_type: undefined,
      })
    })
  })

  context('when the source is a service delivery and optional fields have been unselected', () => {
    beforeEach(() => {
      const interaction = assign({}, mockInteraction, {
        event: null,
        service_delivery_status: null,
        grant_amount_offered: null,
        net_company_receipt: null,
      })
      this.transformed = transformInteractionResponseToForm(interaction)
    })

    it('should transform data from interaction response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: 'dcdabbc9-1781-e411-8955-e4115bead28a',
        contact: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
        dit_adviser: '8036f207-ae3e-e611-8d53-e4115bed50dc',
        service: '1231231231312',
        service_delivery_status: undefined,
        grant_amount_offered: null,
        net_company_receipt: null,
        dit_team: '222',
        communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '31', month: '05', year: '2017' },
        is_event: 'false',
        event: undefined,
        id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
        notes: 'lorem ipsum',
        subject: 'Test interactions',
        policy_area: undefined,
        policy_issue_type: undefined,
      })
    })
  })

  context('when the source is a policy feedback', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToForm(policyFeedbackData)
    })

    it('should transform data from policy feedback response to form', () => {
      expect(this.transformed).to.deep.equal({
        company: '0f5216e0-849f-11e6-ae22-56b6b6499611',
        contact: '7701587b-e88f-4f39-874f-0bd06321f7df',
        dit_adviser: '537df876-5062-e311-8255-e4115bead28a',
        service: 'PF1',
        service_delivery_status: undefined,
        grant_amount_offered: null,
        net_company_receipt: null,
        dit_team: '16362a92-9698-e211-a939-e4115bead28a',
        communication_channel: '70c226d7-5d95-e211-a939-e4115bead28a',
        date: { day: '25', month: '11', year: '2058' },
        is_event: 'false',
        event: undefined,
        id: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
        notes: 'Labore culpa quas cupiditate voluptatibus magni.',
        subject: 'ad',
        policy_area: 'pa1',
        policy_issue_type: 'pit1',
      })
    })
  })
})
