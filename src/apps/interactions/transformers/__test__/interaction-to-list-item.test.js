const { find } = require('lodash')
const transformInteractionToListItem = require('../interaction-to-list-item')
const mockInteraction = require('../../../../../test/unit/data/interactions/search-interaction.json')
const mockInteractionWithFeedback = require('../../../../../test/unit/data/interactions/search-interaction-with-feedback.json')

describe('#transformInteractionToListItem', () => {
  let transformed
  context('when the source is an interaction', () => {
    beforeEach(() => {
      mockInteraction.kind = 'interaction'
      transformed = transformInteractionToListItem()(mockInteraction)
    })

    it('should transform data from interaction response to list item', () => {
      expect(transformed).to.deep.equal({
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
              id: 'sv1',
              name: 'Account Management',
            },
          },
        ],
      })
    })
  })

  context('When the source is an interaction with multiple contacts', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        contacts: [
          {
            id: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
            first_name: 'Jackson',
            last_name: 'Whitfield',
            name: 'Jackson Whitfield',
          },
          {
            id: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
            first_name: 'Jackson2',
            last_name: 'Whitfield2',
            name: 'Jackson2 Whitfield2',
          },
        ],
      })
    })

    it('should transform the contacts names value', () => {
      const contacts = transformed.meta.find((element) => {
        return element.label === 'Contact(s)'
      })
      expect(contacts.value).to.equal('Multiple contacts')
    })
  })

  context('when the source is an interaction with an empty subject', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        subject: '',
      })
    })

    it('should transform data from interaction response to list item', () => {
      expect(transformed).have.property('name', 'No subject')
    })
  })

  context('when the source is an interaction with a null subject', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        subject: null,
      })
    })

    it('should transform data from interaction response to list item', () => {
      expect(transformed).have.property('name', 'No subject')
    })
  })

  context(
    'when the source is an interaction with adviser and team name',
    () => {
      it('should return adviser name and team', () => {
        transformed = transformInteractionToListItem()({
          ...mockInteraction,
          dit_participants: [
            {
              adviser: {
                id: 1,
                first_name: 'Bob',
                last_name: 'Lawson',
                name: 'Bob Lawson',
              },
              team: {
                id: 1,
                name: 'The test team',
              },
            },
          ],
        })
        const metadata = transformed.meta
        const adviserName = find(
          metadata,
          (item) => item.label === 'Adviser(s)'
        )
        expect(adviserName.value).to.deep.equal(['Bob Lawson, The test team'])
      })
    }
  )

  context('when the source is an interaction with a null team name', () => {
    it('should return just an adviser name', () => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        dit_participants: [
          {
            adviser: {
              id: 1,
              first_name: 'Bob',
              last_name: 'Lawson',
              name: 'Bob Lawson',
            },
            team: null,
          },
        ],
      })
      const metadata = transformed.meta
      const adviserName = find(metadata, (item) => item.label === 'Adviser(s)')
      expect(adviserName.value).to.deep.equal(['Bob Lawson'])
    })
  })

  context('when the source is an interaction with a null adviser', () => {
    it('should return unknown name', () => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        dit_participants: [
          {
            adviser: null,
            team: {
              id: 1,
              name: 'The test team',
            },
          },
        ],
      })
      const metadata = transformed.meta
      const adviserName = find(metadata, (item) => item.label === 'Adviser(s)')
      expect(adviserName.value).to.deep.equal(['Unknown adviser'])
    })
  })

  context('when the source is an interaction with a null contact name', () => {
    it('should return unknown name', () => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        contacts: [
          {
            id: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306',
            first_name: 'Jackson',
            last_name: 'Whitfield',
            name: null,
          },
        ],
      })
      const metadata = transformed.meta
      const contactName = find(metadata, (item) => item.label === 'Contact(s)')
      expect(contactName.value).to.deep.equal(['Unknown contact'])
    })
  })

  context('when the source is a service delivery', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem()({
        ...mockInteraction,
        kind: 'service_delivery',
      })
    })

    it('should transform data from interaction response to list item', () => {
      expect(transformed).to.deep.equal({
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
              id: 'sv1',
              name: 'Account Management',
            },
          },
        ],
      })
    })
  })

  context('when the source is an interaction and has feedback', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem()(
        mockInteractionWithFeedback
      )
    })
    it('should transform data from interaction response to list item', () => {
      expect(transformed).to.deep.equal({
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
            label: 'Type',
            type: 'badge',
            value: 'Business intelligence',
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
        ],
      })
    })
  })

  context('when the source is an service delivery and has feedback', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem()({
        ...mockInteractionWithFeedback,
        kind: 'service_delivery',
      })
    })
    it('should transform data from interaction response to list item', () => {
      expect(transformed).to.deep.equal({
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
            label: 'Type',
            type: 'badge',
            value: 'Business intelligence',
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
        ],
      })
    })
  })

  context('when the interactions are rendered within company context', () => {
    beforeEach(() => {
      transformed = transformInteractionToListItem(false)({
        ...mockInteractionWithFeedback,
        kind: 'service_delivery',
      })
    })
    it('should transform data from interaction response to list item without company field included', () => {
      expect(transformed).to.deep.equal({
        was_policy_feedback_provided: true,
        id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
        type: 'interaction',
        name: 'Test interactions',
        meta: [
          {
            value: 'Service delivery',
            type: 'badge',
            label: 'Type',
          },
          {
            value: 'Business intelligence',
            type: 'badge',
            label: 'Type',
          },
          {
            value: '2017-05-31T00:00:00',
            type: 'date',
            label: 'Date',
          },
          {
            value: ['Jackson Whitfield'],
            label: 'Contact(s)',
          },
          {
            value: ['Bob Lawson, The test team'],
            label: 'Adviser(s)',
          },
          {
            value: {
              id: '1231231231312',
              name: 'Test service',
            },
            label: 'Service',
          },
        ],
      })
    })
  })
})
