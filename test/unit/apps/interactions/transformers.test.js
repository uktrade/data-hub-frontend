const { assign } = require('lodash')
const mockInteraction = require('~/test/unit/data/interactions/search-interaction.json')

const {
  transformInteractionToListItem,
  transformInteractionResponseToForm,
  transformInteractionFormBodyToApiRequest,
  transformInteractionResponsetoViewRecord,
} = require('~/src/apps/interactions/transformers')

describe('Interaction transformers', () => {
  describe('#transformInteractionToListItem', () => {
    context('when the source in an interaction', () => {
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
              label: 'Date',
              type: 'date',
              value: '2017-05-31T00:00:00',
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
          ],
        })
      })
    })

    context('when the source in a service delivery', () => {
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
              label: 'Date',
              type: 'date',
              value: '2017-05-31T00:00:00',
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
          ],
        })
      })
    })
  })

  describe('#transformInteractionResponseToForm', () => {
    it('should transform data from interaction response to form', () => {
      const expected = {
        interaction_type: '72c226d7-5d95-e211-a939-e4115bead28a',
        company: 'dcdabbc9-1781-e411-8955-e4115bead28a',
        subject: 'Test interactions',
        notes: 'lorem ipsum',
        contact: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
        date: { day: '31', month: '05', year: '2017' },
        dit_adviser: '8036f207-ae3e-e611-8d53-e4115bed50dc',
        service: '1231231231312',
        dit_team: '222',
      }

      const actual = transformInteractionResponseToForm(mockInteraction)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('#transformInteractionFormBodyToApiRequest', () => {
    it('should set the date', () => {
      const actual = transformInteractionFormBodyToApiRequest(
        {
          props: {
            date_year: '2018',
            date_month: '01',
            date_day: '02',
          },
        }
      )

      expect(actual.date).to.equal('2018-01-02')
    })

    it('should set the company', () => {
      const expected = 'company'
      const actual = transformInteractionFormBodyToApiRequest({ company: expected })

      expect(actual.company).to.equal(expected)
    })

    it('should set the communication channel', () => {
      const expected = 'communication channel'
      const actual = transformInteractionFormBodyToApiRequest({ communicationChannel: expected })

      expect(actual.communication_channel).to.equal(expected)
    })
  })

  describe('#transformInteractionResponsetoViewRecord', () => {
    context('when provided a fully populated interaction', () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponsetoViewRecord(mockInteraction)
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
          'Interaction date': {
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

    context('when there is no contact associated with the interaction', () => {
      beforeEach(() => {
        const interaction = assign({}, mockInteraction, { contact: null })
        this.transformed = transformInteractionResponsetoViewRecord(interaction)
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          'Company': {
            url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a',
            name: 'Samsung',
          },
          'Contact': null,
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
          'Interaction date': {
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
        this.transformed = transformInteractionResponsetoViewRecord(interaction)
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          'Company': null,
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
          'Interaction date': {
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

    context('when there is no investment project associated with the interaction', () => {
      beforeEach(() => {
        const interaction = assign({}, mockInteraction, { investment_project: null })
        this.transformed = transformInteractionResponsetoViewRecord(interaction)
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
          'Interaction date': {
            type: 'date',
            name: '2017-05-31T00:00:00',
          },
          'DIT adviser': {
            id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
            first_name: 'Test',
            last_name: 'CMU 1',
            name: 'Test CMU 1',
          },
          'Investment project': null,
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
        })

        delete serviceDelivery.communication_channel

        this.transformed = transformInteractionResponsetoViewRecord(serviceDelivery)
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
          'Interaction date': {
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
          'Event': {
            url: '/events/4444',
            name: 'Event title',
          },
        })
      })
    })

    context('when provided with a service delivery with no event', () => {
      beforeEach(() => {
        const serviceDelivery = assign({}, mockInteraction, {
          event: null,
          kind: 'service_delivery',
        })

        delete serviceDelivery.communication_channel

        this.transformed = transformInteractionResponsetoViewRecord(serviceDelivery)
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
          'Interaction date': {
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
          'Event': null,
        })
      })
    })
  })
})
