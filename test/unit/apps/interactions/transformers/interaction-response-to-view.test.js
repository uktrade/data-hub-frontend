const { assign } = require('lodash')

const config = require('~/config')
const transformInteractionResponseToViewRecord = require('~/src/apps/interactions/transformers/interaction-response-to-view')
const mockInteraction = require('~/test/unit/data/interactions/search-interaction.json')
const policyFeedbackData = require('~/test/unit/data/interactions/policy-feedback.json')

config.archivedDocumentsBaseUrl = 'http://base'

describe('#transformInteractionResponsetoViewRecord', () => {
  context('when provided a fully populated interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(mockInteraction)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
          name: 'Samsung',
        },
        'Contact': {
          url: '/contacts/b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          name: 'Jackson Whitfield',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Date of interaction': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Investment project': {
          url: '/investment-projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Communication channel': {
          id: '72c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Telephone',
        },
      })
    })
  })

  context('when there is no contact associated with the interaction', () => {
    beforeEach(() => {
      const interaction = assign({}, mockInteraction, { contact: null })
      this.transformed = transformInteractionResponseToViewRecord(interaction)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
          name: 'Samsung',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'Date of interaction': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Investment project': {
          url: '/investment-projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Communication channel': {
          id: '72c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Telephone',
        },
      })
    })
  })

  context('when there is no company associated with the interaction', () => {
    beforeEach(() => {
      const interaction = assign({}, mockInteraction, { company: null })
      this.transformed = transformInteractionResponseToViewRecord(interaction)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Contact': {
          url: '/contacts/b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          name: 'Jackson Whitfield',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Date of interaction': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Investment project': {
          url: '/investment-projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Communication channel': {
          id: '72c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Telephone',
        },
      })
    })
  })

  context('when there is no investment project associated with the interaction', () => {
    beforeEach(() => {
      const interaction = assign({}, mockInteraction, { investment_project: null })
      this.transformed = transformInteractionResponseToViewRecord(interaction)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
          name: 'Samsung',
        },
        'Contact': {
          url: '/contacts/b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          name: 'Jackson Whitfield',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'Date of interaction': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Communication channel': {
          id: '72c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Telephone',
        },
      })
    })
  })

  context('when provided with a fully populated service delivery', () => {
    beforeEach(() => {
      const serviceDelivery = assign({}, mockInteraction, {
        event: {
          id: '4444',
          name: 'Event title',
        },
        kind: 'service_delivery',
        service_delivery_status: {
          name: 'Offered',
          id: '45329c18-6095-e211-a939-e4115bead28a',
        },
        grant_amount_offered: '1000.00',
        net_company_receipt: '500.00',
      })

      delete serviceDelivery.communication_channel

      this.transformed = transformInteractionResponseToViewRecord(serviceDelivery)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
          name: 'Samsung',
        },
        'Contact': {
          url: '/contacts/b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          name: 'Jackson Whitfield',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Service status': {
          id: '45329c18-6095-e211-a939-e4115bead28a',
          name: 'Offered',
        },
        'Grant offered': {
          name: '1000.00',
          type: 'currency',
        },
        'Net receipt': {
          name: '500.00',
          type: 'currency',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Date of service delivery': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Investment project': {
          url: '/investment-projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'Event': {
          url: '/events/4444',
          name: 'Event title',
        },
      })
    })
  })

  context('when provided with a service delivery with optional fields not set', () => {
    beforeEach(() => {
      const serviceDelivery = assign({}, mockInteraction, {
        event: null,
        kind: 'service_delivery',
        service_delivery_status: null,
        grant_amount_offered: null,
        net_company_receipt: null,
      })

      delete serviceDelivery.communication_channel

      this.transformed = transformInteractionResponseToViewRecord(serviceDelivery)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
          name: 'Samsung',
        },
        'Contact': {
          url: '/contacts/b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          name: 'Jackson Whitfield',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Date of service delivery': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Investment project': {
          url: '/investment-projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Event': 'No',
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
      })
    })
  })

  context('when there is not an archived documents URL path', () => {
    beforeEach(() => {
      const interaction = assign({}, mockInteraction, { archived_documents_url_path: '' })
      this.transformed = transformInteractionResponseToViewRecord(interaction)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
          name: 'Samsung',
        },
        'Contact': {
          url: '/contacts/b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          name: 'Jackson Whitfield',
        },
        'Service provider': {
          id: '222',
          name: 'Team',
        },
        'Service': {
          id: '1231231231312',
          name: 'Test service',
        },
        'Subject': 'Test interactions',
        'Notes': 'lorem ipsum',
        'Documents': {
          name: 'There are no files or documents',
        },
        'Date of interaction': {
          type: 'date',
          name: '2017-05-31T00:00:00',
        },
        'DIT adviser': {
          id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
          first_name: 'Test',
          last_name: 'CMU 1',
          name: 'Test CMU 1',
        },
        'Investment project': {
          url: '/investment-projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Communication channel': {
          id: '72c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Telephone',
        },
      })
    })
  })

  context('when provided with a policy feedback', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(policyFeedbackData)
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact': {
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky',
        },
        'Service provider': {
          id: '16362a92-9698-e211-a939-e4115bead28a',
          name: 'UKTI Chief Executive\'s Office',
        },
        'Service': {
          id: 'PF1',
          name: 'Policy Feedback',
        },
        'Subject': 'ad',
        'Notes': 'Labore culpa quas cupiditate voluptatibus magni.',
        'Date of interaction': {
          type: 'date',
          name: '2058-11-25',
        },
        'DIT adviser': {
          id: '537df876-5062-e311-8255-e4115bead28a',
          first_name: 'Priyanka',
          last_name: 'Karunan',
          name: 'Priyanka Karunan',
        },
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
        'Documents': {
          name: 'There are no files or documents',
        },
        'Policy area': {
          name: 'p a 1',
          id: 'pa1',
        },
        'Policy issue type': {
          name: 'p i t 1',
          id: 'pit1',
        },
      })
    })
  })
})
