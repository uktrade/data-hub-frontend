const transformInteractionToListItem = require('~/src/apps/interactions/transformers/interaction-to-list-item')
const mockInteraction = require('~/test/unit/data/interactions/search-interaction.json')

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
      this.transformed = transformInteractionToListItem({
        ...mockInteraction,
        subject: '',
      })
    })

    it('should transform data from interaction response to list item', () => {
      expect(this.transformed).have.property('name', 'No subject')
    })
  })

  context('when the source is an interaction with a null subject', () => {
    beforeEach(() => {
      this.transformed = transformInteractionToListItem({
        ...mockInteraction,
        subject: null,
      })
    })

    it('should transform data from interaction response to list item', () => {
      expect(this.transformed).have.property('name', 'No subject')
    })
  })

  context('when the source is a policy feedback', () => {
    beforeEach(() => {
      this.transformed = transformInteractionToListItem({
        ...mockInteraction,
        kind: 'policy_feedback',
      })
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
      this.transformed = transformInteractionToListItem({
        ...mockInteraction,
        kind: 'service_delivery',
      })
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
