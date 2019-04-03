const transformInteractionToListItem = require('~/src/apps/interactions/transformers/interaction-to-list-item')
const mockInteraction = require('~/test/unit/data/interactions/search-interaction.json')
const mockInteractionWithFeedback = require('~/test/unit/data/interactions/search-interaction-with-feedback.json')

describe('#transformInteractionToListItem', () => {
  context('when the source is an interaction', () => {
    beforeEach(() => {
      mockInteraction.kind = 'interaction'
      this.transformed = transformInteractionToListItem(mockInteraction)
    })

    it('should transform data from interaction response to list item', () => {
      expect(this.transformed).to.deep.equal({
        was_policy_feedback_provided: false,
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
            label: 'Contact(s)',
            value: ['Jackson Whitfield'],
          },
          {
            label: 'Company',
            value: {
              id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
              name: 'Samsung',
            },
          },
          {
            label: 'Adviser(s)',
            value: ['Bob Lawson, The test team'],
          },
          {
            label: 'Service',
            value: {
              id: '1231231231312',
              name: 'Test service',
            },
          },
          null,
        ],
      })
    })
  })

  context('When the source is an interaction with multiple contacts', () => {
    beforeEach(() => {
      this.transformed = transformInteractionToListItem({
        ...mockInteraction,
        contacts: [{
          'id': 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          'first_name': 'Jackson',
          'last_name': 'Whitfield',
          'name': 'Jackson Whitfield',
        }, {
          'id': 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
          'first_name': 'Jackson2',
          'last_name': 'Whitfield2',
          'name': 'Jackson2 Whitfield2',
        }],
      })
    })

    it('should transform the contacts names value', () => {
      const contacts = this.transformed.meta.find((element) => {
        return element.label === 'Contact(s)'
      })
      expect(contacts.value).to.equal('Multiple contacts')
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

  context('when the source is a service delivery', () => {
    beforeEach(() => {
      this.transformed = transformInteractionToListItem({
        ...mockInteraction,
        kind: 'service_delivery',
      })
    })

    it('should transform data from interaction response to list item', () => {
      expect(this.transformed).to.deep.equal({
        was_policy_feedback_provided: false,
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
            label: 'Contact(s)',
            value: ['Jackson Whitfield'],
          },
          {
            label: 'Company',
            value: {
              id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
              name: 'Samsung',
            },
          },
          {
            label: 'Adviser(s)',
            value: ['Bob Lawson, The test team'],
          },
          {
            label: 'Service',
            value: {
              id: '1231231231312',
              name: 'Test service',
            },
          },
          null,
        ],
      })
    })
  })

  context('when the source is an interaction and has feedback', () => {
    beforeEach(() => {
      this.transformed = transformInteractionToListItem(mockInteractionWithFeedback)
    })
    it('should transform data from interaction response to list item', () => {
      expect(this.transformed).to.deep.equal({
        was_policy_feedback_provided: true,
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
            label: 'Contact(s)',
            value: ['Jackson Whitfield'],
          },
          {
            label: 'Company',
            value: {
              id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
              name: 'Samsung',
            },
          },
          {
            label: 'Adviser(s)',
            value: ['Bob Lawson, The test team'],
          },
          {
            label: 'Service',
            value: {
              id: '1231231231312',
              name: 'Test service',
            },
          },
          {
            label: 'Type',
            type: 'badge',
            value: 'Policy feedback',
          },
        ],
      })
    })
  })

  context('when the source is an service delivery and has feedback', () => {
    beforeEach(() => {
      this.transformed = transformInteractionToListItem({
        ...mockInteractionWithFeedback,
        kind: 'service_delivery',
      })
    })
    it('should transform data from interaction response to list item', () => {
      expect(this.transformed).to.deep.equal({
        was_policy_feedback_provided: true,
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
            label: 'Contact(s)',
            value: ['Jackson Whitfield'],
          },
          {
            label: 'Company',
            value: {
              id: 'dcdabbc9-1781-e411-8955-e4115bead28a',
              name: 'Samsung',
            },
          },
          {
            label: 'Adviser(s)',
            value: ['Bob Lawson, The test team'],
          },
          {
            label: 'Service',
            value: {
              id: '1231231231312',
              name: 'Test service',
            },
          },
          {
            label: 'Type',
            type: 'badge',
            value: 'Policy feedback',
          },
        ],
      })
    })
  })
})
