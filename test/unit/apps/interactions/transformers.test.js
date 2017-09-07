const { transformInteractionToListItem } = require('~/src/apps/interactions/transformers')
const interactionData = require('~/test/unit/data/interactions/search-interaction.json')

describe('Interaction transformers', () => {
  it('should transform a simple interaction', () => {
    const expected = {
      id: '7265dc3c-e89d-45ee-8106-d1e370c1c73d',
      type: 'interaction',
      name: 'Test interactionss',
      meta: [
        {
          label: 'Type:',
          type: 'badge',
          value: {
            id: '72c226d7-5d95-e211-a939-e4115bead28a',
            name: 'Telephone',
          },
        },
        {
          label: 'Contact:',
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
          value: '31 May 2017, 12:00am',
        },
        {
          label: 'Adviser:',
          value: {
            id: '8036f207-ae3e-e611-8d53-e4115bed50dc',
            first_name: 'Test',
            last_name: 'CMU 1',
            name: 'Test CMU 1',
          },
        },
      ],
    }

    const actual = transformInteractionToListItem(interactionData)

    expect(actual).to.deep.equal(expected)
  })
})
