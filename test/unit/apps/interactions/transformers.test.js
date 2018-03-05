const { assign } = require('lodash')
const mockInteraction = require('~/test/unit/data/interactions/search-interaction.json')
const archivedDocumentsBaseUrl = 'http://base'

const {
  transformInteractionResponseToForm,
  transformInteractionToListItem,
  transformInteractionFormBodyToApiRequest,
  transformInteractionResponseToViewRecord,
  transformInteractionListItemToHaveUrlPrefix,
} = proxyquire('~/src/apps/interactions/transformers', {
  '../../../config': {
    archivedDocumentsBaseUrl,
  },
})

describe('Interaction transformers', () => {
  describe('#transformInteractionResponseToForm', () => {
    context('when the source is an interaction', () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToForm(mockInteraction)
      })

      it('should transform data from interaction response to list item', () => {
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

      it('should transform data from interaction response to list item', () => {
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

      it('should transform data from interaction response to list item', () => {
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
        })
      })
    })
  })

  describe('#transformInteractionToListItem', () => {
    context('when the source is an interaction', () => {
      beforeEach(() => {
        mockInteraction.kind = 'interaction'
        this.transformed = transformInteractionToListItem(mockInteraction)
      })

      it('should transform data from interaction response to list item', () => {
        expect(this.transformed).to.deep.equal({
          id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
          type: 'interaction',
          name: 'Test interactions',
          meta: [
            {
              label: 'Type',
              type: 'badge',
              value: 'Interaction',
            },
            {
              label: 'Date',
              type: 'date',
              value: '2017-05-31T00:00:00',
            },
            {
              label: 'Contact',
              value: {
                id: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
                first_name: 'Jackson',
                last_name: 'Whitfield',
                name: 'Jackson Whitfield',
              },
            },
            {
              label: 'Company',
              value: {
                id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
                name: 'Samsung',
              },
            },
            {
              label: 'Adviser',
              value: {
                id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
                first_name: 'Test',
                last_name: 'CMU 1',
                name: 'Test CMU 1',
              },
            },
            {
              label: 'Service provider',
              value: {
                id: '222',
                name: 'Team',
              },
            },
          ],
        })
      })
    })

    context('when the source is an interaction with an empty subject', () => {
      beforeEach(() => {
        this.transformed = transformInteractionToListItem(assign({}, mockInteraction, { subject: '' }))
      })

      it('should transform data from interaction response to list item', () => {
        expect(this.transformed).have.property('name', 'No subject')
      })
    })

    context('when the source is an interaction with a null subject', () => {
      beforeEach(() => {
        this.transformed = transformInteractionToListItem(assign({}, mockInteraction, { subject: null }))
      })

      it('should transform data from interaction response to list item', () => {
        expect(this.transformed).have.property('name', 'No subject')
      })
    })

    context('when the source is a policy feedback', () => {
      beforeEach(() => {
        const policyFeedback = assign({}, mockInteraction, { kind: 'policy_feedback' })
        this.transformed = transformInteractionToListItem(policyFeedback)
      })

      it('should transform data from policy feedback response to list item', () => {
        expect(this.transformed).to.deep.equal({
          id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
          type: 'interaction',
          name: 'Test interactions',
          meta: [
            {
              label: 'Type',
              type: 'badge',
              value: 'Policy feedback',
            },
            {
              label: 'Date',
              type: 'date',
              value: '2017-05-31T00:00:00',
            },
            {
              label: 'Contact',
              value: {
                id: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
                first_name: 'Jackson',
                last_name: 'Whitfield',
                name: 'Jackson Whitfield',
              },
            },
            {
              label: 'Company',
              value: {
                id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
                name: 'Samsung',
              },
            },
            {
              label: 'Adviser',
              value: {
                id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
                first_name: 'Test',
                last_name: 'CMU 1',
                name: 'Test CMU 1',
              },
            },
            {
              label: 'Service provider',
              value: {
                id: '222',
                name: 'Team',
              },
            },
          ],
        })
      })
    })

    context('when the source is a service delivery', () => {
      beforeEach(() => {
        const serviceDelivery = assign({}, mockInteraction, { kind: 'service_delivery' })
        this.transformed = transformInteractionToListItem(serviceDelivery)
      })

      it('should transform data from interaction response to list item', () => {
        expect(this.transformed).to.deep.equal({
          id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
          type: 'interaction',
          name: 'Test interactions',
          meta: [
            {
              label: 'Type',
              type: 'badge',
              value: 'Service delivery',
            },
            {
              label: 'Date',
              type: 'date',
              value: '2017-05-31T00:00:00',
            },
            {
              label: 'Contact',
              value: {
                id: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
                first_name: 'Jackson',
                last_name: 'Whitfield',
                name: 'Jackson Whitfield',
              },
            },
            {
              label: 'Company',
              value: {
                id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
                name: 'Samsung',
              },
            },
            {
              label: 'Adviser',
              value: {
                id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
                first_name: 'Test',
                last_name: 'CMU 1',
                name: 'Test CMU 1',
              },
            },
            {
              label: 'Service provider',
              value: {
                id: '222',
                name: 'Team',
              },
            },
          ],
        })
      })
    })
  })

  describe('#transformInteractionFormBodyToApiRequest', () => {
    context('when all fields are populated', () => {
      beforeEach(() => {
        this.transformed = transformInteractionFormBodyToApiRequest({
          date_year: '2018',
          date_month: '01',
          date_day: '02',
          grant_amount_offered: '1000',
          net_company_receipt: '500',
        })
      })

      it('should set the date', () => {
        expect(this.transformed.date).to.equal('2018-01-02')
      })

      it('should set the grant amount offered', () => {
        expect(this.transformed.grant_amount_offered).to.equal('1000')
      })

      it('should set the net company receipt', () => {
        expect(this.transformed.net_company_receipt).to.equal('500')
      })
    })

    context('when the optional fields have not been entered', () => {
      beforeEach(() => {
        this.transformed = transformInteractionFormBodyToApiRequest({
          grant_amount_offered: '',
          net_company_receipt: '',
        })
      })

      it('should set the grant amount offered to null', () => {
        expect(this.transformed.grant_amount_offered).to.be.null
      })

      it('should set the net company receipt to null', () => {
        expect(this.transformed.net_company_receipt).to.be.null
      })
    })
  })

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
  })

  describe('#transformInteractionListItemToHaveUrlPrefix', () => {
    context('when there is a leading forward slash', () => {
      it('should set the URL prefix without a leading forward slash', () => {
        const actualInteraction = transformInteractionListItemToHaveUrlPrefix('/url')(mockInteraction)
        const expectedInteraction = assign({}, mockInteraction, { urlPrefix: 'url' })

        expect(actualInteraction).to.deep.equal(expectedInteraction)
      })
    })

    context('when there is not a leading forward slash', () => {
      it('should set the complete URL prefix', () => {
        const actualInteraction = transformInteractionListItemToHaveUrlPrefix('url')(mockInteraction)
        const expectedInteraction = assign({}, mockInteraction, { urlPrefix: 'url' })

        expect(actualInteraction).to.deep.equal(expectedInteraction)
      })
    })

    context('when there is not a return link', () => {
      it('should not set the complete URL prefix', () => {
        const actualInteraction = transformInteractionListItemToHaveUrlPrefix(undefined)(mockInteraction)
        const expectedInteraction = assign({}, mockInteraction)

        expect(actualInteraction).to.deep.equal(expectedInteraction)
      })
    })
  })
})
