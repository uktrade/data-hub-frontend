const serviceOptionData = require('../../../../../test/unit/data/interactions/service-options-data.json')
const transformers = require('../index')

describe('Global transformers', () => {
  describe('#transformServicesOptions', () => {
    context(
      'when the service options have no interaction questions or secondary options',
      () => {
        it('should return the correct options', () => {
          const actual = transformers.transformServicesOptions([
            serviceOptionData[0],
          ])
          expect(actual).to.deep.equal([
            {
              label: 'Account Management',
              value: 'sv1',
              interactionQuestions: [],
              secondaryOptions: [],
            },
          ])
        })
      }
    )
    context('when the service options have interaction questions', () => {
      it('should return the correct options', () => {
        const actual = transformers.transformServicesOptions([
          serviceOptionData[1],
        ])
        expect(actual).to.deep.equal([
          {
            label: 'Providing Export Advice & Information',
            value: 'Providing Export Advice & Information',
            interactionQuestions: [],
            secondaryOptions: [
              {
                label: 'Advice & information',
                value: 'sv2',
                parent: 'Providing Export Advice & Information',
                interactionQuestions: [
                  {
                    label: 'What did you give advice about?',
                    value: 'sv2-q1',
                    options: [
                      { label: 'Banking & Funding', value: 'sv2-q1-a1' },
                      {
                        label: 'More Banking & Funding',
                        value: 'sv2-q1-a2',
                      },
                    ],
                    serviceId: 'sv2',
                    isControlledBySecondary: true,
                  },
                  {
                    label: 'Another question?',
                    value: 'sv2-q2',
                    options: [
                      { label: 'Banking & Funding', value: 'sv2-q2-a1' },
                      {
                        label: 'More Banking & Funding',
                        value: 'sv2-q2-a2',
                      },
                    ],
                    serviceId: 'sv2',
                    isControlledBySecondary: true,
                  },
                ],
              },
            ],
          },
        ])
      })
    })
    context('when the service options have no interaction questions', () => {
      it('should return the correct options', () => {
        const actual = transformers.transformServicesOptions([
          serviceOptionData[0],
        ])
        expect(actual).to.deep.equal([
          {
            label: 'Account Management',
            value: 'sv1',
            interactionQuestions: [],
            secondaryOptions: [],
          },
        ])
      })
    })

    context('when the service has questions but no sub service', () => {
      it('should return the correct options', () => {
        const actual = transformers.transformServicesOptions([
          serviceOptionData[2],
        ])
        expect(actual).to.deep.equal([
          {
            interactionQuestions: [
              {
                label: 'Who was the company introduced to?',
                options: [
                  {
                    label: 'Customers',
                    value: 'sv3-q1-a1',
                  },
                  {
                    label: 'More customers',
                    value: 'sv3-q1-a2',
                  },
                ],
                serviceId: 'sv3',
                value: 'sv3-q1',
              },
            ],
            label: 'Making Introductions (Export)',
            secondaryOptions: [],
            value: 'sv3',
          },
        ])
      })
    })
  })
})
