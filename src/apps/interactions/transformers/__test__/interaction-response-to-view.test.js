const config = require('../../../../config')
const transformInteractionResponseToViewRecord = require('../interaction-response-to-view')

const mcokDraftPastMeeting = require('../../../../../test/unit/data/interactions/draft-past-meeting.json')
const mockInteraction = require('../../../../../test/unit/data/interactions/interaction.json')
const mockInteractionWithPolicyFeedback = require('../../../../../test/unit/data/interactions/interaction-with-feedback.json')

const {
  generateExportCountries,
} = require('../../../../../test/unit/helpers/generate-export-countries')
const urls = require('../../../../lib/urls')

config.archivedDocumentsBaseUrl = 'http://base'

function getCountryNames(countries) {
  return countries
    .map(({ name }) => name)
    .sort((a, b) => a.localeCompare(b))
    .join(', ')
}

describe('#transformInteractionResponsetoViewRecord', () => {
  context('with different values for export_countries', () => {
    const transformedMockInteraction = {
      Company: {
        url: urls.companies.detail('0f5216e0-849f-11e6-ae22-56b6b6499611'),
        name: 'Venus Ltd',
      },
      'Contact(s)': [
        {
          url: urls.contacts.contact('7701587b-e88f-4f39-874f-0bd06321f7df'),
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        },
      ],
      Service: {
        id: 'sv1',
        name: 'Account Management',
      },
      Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
      'Policy area': 'Access to Public Funding (inc. EU funding)',
      'Policy feedback notes':
        'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
      'Policy issue types': 'EU exit',
      'Date of interaction': {
        type: 'date',
        name: '2058-11-25',
      },
      Documents: {
        hint: '(will open another website)',
        hintId: 'external-link-label',
        name: 'View files and documents',
        url: 'http://base/documents/123',
      },
      'Adviser(s)': ['Bob Lawson, The test team'],
      'Investment project': {
        url: urls.investments.projects.project(
          'bac18331-ca4d-4501-960e-a1bd68b5d47e'
        ),
        name: 'Test project',
      },
      'Communication channel': {
        id: '70c226d7-5d95-e211-a939-e4115bead28a',
        name: 'Email/Website',
      },
    }

    const LABELS = {
      CURRENT: 'Countries currently exporting to',
      FUTURE: 'Future countries of interest',
      NOT_INTERESTED: 'Countries not interested in',
    }

    context(
      'when provided a fully populated interaction with export countries',
      () => {
        context('When the array has entries for each status', () => {
          it('should transform to display format', () => {
            const countries = generateExportCountries()
            const transformed = transformInteractionResponseToViewRecord(
              {
                ...mockInteraction,
                archived_documents_url_path: '/documents/123',
                investment_project: {
                  id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
                  name: 'Test project',
                },
                export_countries: countries.exportCountries,
              },
              true,
              true
            )

            expect(transformed).to.deep.equal({
              ...transformedMockInteraction,
              [LABELS.CURRENT]: getCountryNames(countries.current),
              [LABELS.FUTURE]: getCountryNames(countries.future),
              [LABELS.NOT_INTERESTED]: getCountryNames(countries.noInterest),
            })
          })
        })

        context('When the array has one entry for future interest', () => {
          it('should transform to display format', () => {
            const countries = generateExportCountries()
            const transformed = transformInteractionResponseToViewRecord(
              {
                ...mockInteraction,
                archived_documents_url_path: '/documents/123',
                investment_project: {
                  id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
                  name: 'Test project',
                },
                export_countries: [countries.exportCountries[0]],
              },
              true,
              true
            )

            expect(transformed).to.deep.equal({
              ...transformedMockInteraction,
              [LABELS.FUTURE]: countries.future[0].name,
            })
            expect(transformed[LABELS.CURRENT]).to.be.undefined
            expect(transformed[LABELS.NOT_INTERESTED]).to.be.undefined
          })
        })
      }
    )

    context(
      'with a fully populated interaction without export countries',
      () => {
        it('should transform to display format', () => {
          const transformed = transformInteractionResponseToViewRecord(
            {
              ...mockInteraction,
              archived_documents_url_path: '/documents/123',
              investment_project: {
                id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
                name: 'Test project',
              },
            },
            true,
            true
          )

          expect(transformed).to.deep.equal(transformedMockInteraction)
          expect(transformed[LABELS.CURRENT]).to.be.undefined
          expect(transformed[LABELS.FUTURE]).to.be.undefined
          expect(transformed[LABELS.NOT_INTERESTED]).to.be.undefined
        })
      }
    )
  })

  context('when provided a fully populated interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(
        {
          ...mockInteraction,
          archived_documents_url_path: '/documents/123',
          investment_project: {
            id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
            name: 'Test project',
          },
        },
        true
      )
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        Company: {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [
          {
            url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
            name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
          },
        ],
        Service: {
          id: 'sv1',
          name: 'Account Management',
        },
        Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes':
          'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of interaction': {
          type: 'date',
          name: '2058-11-25',
        },
        Documents: {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
        'Investment project': {
          url: '/investments/projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
      })
    })
  })

  context(
    'when provided a fully populated interaction & service name has a deliminator',
    () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord(
          {
            ...mockInteraction,
            service: {
              name: 'Specific type of management',
              id: 'sv1',
            },
            archived_documents_url_path: '/documents/123',
            investment_project: {
              id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
              name: 'Test project',
            },
          },
          true
        )
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Company: {
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
            name: 'Venus Ltd',
          },
          'Contact(s)': [
            {
              url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
              name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
            },
          ],
          Service: {
            id: 'sv1',
            name: 'Specific type of management',
          },
          Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy area': 'Access to Public Funding (inc. EU funding)',
          'Policy feedback notes':
            'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy issue types': 'EU exit',
          'Date of interaction': {
            type: 'date',
            name: '2058-11-25',
          },
          Documents: {
            hint: '(will open another website)',
            hintId: 'external-link-label',
            name: 'View files and documents',
            url: 'http://base/documents/123',
          },
          'Adviser(s)': ['Bob Lawson, The test team'],
          'Investment project': {
            url: '/investments/projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
            name: 'Test project',
          },
          'Communication channel': {
            id: '70c226d7-5d95-e211-a939-e4115bead28a',
            name: 'Email/Website',
          },
        })
      })
    }
  )

  context(
    'when provided a fully populated interaction & service name has a deliminator & has deliminator exlusion string ',
    () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord(
          {
            ...mockInteraction,
            service: {
              name: 'A Specific DIT : Specific type of service',
              id: 'sv1',
            },
            archived_documents_url_path: '/documents/123',
            investment_project: {
              id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
              name: 'Test project',
            },
          },
          true
        )
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Company: {
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
            name: 'Venus Ltd',
          },
          'Contact(s)': [
            {
              url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
              name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
            },
          ],
          Service: {
            id: 'sv1',
            name: 'A Specific DIT : Specific type of service',
          },
          Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy area': 'Access to Public Funding (inc. EU funding)',
          'Policy feedback notes':
            'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy issue types': 'EU exit',
          'Date of interaction': {
            type: 'date',
            name: '2058-11-25',
          },
          Documents: {
            hint: '(will open another website)',
            hintId: 'external-link-label',
            name: 'View files and documents',
            url: 'http://base/documents/123',
          },
          'Adviser(s)': ['Bob Lawson, The test team'],
          'Investment project': {
            url: '/investments/projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
            name: 'Test project',
          },
          'Communication channel': {
            id: '70c226d7-5d95-e211-a939-e4115bead28a',
            name: 'Email/Website',
          },
        })
      })
    }
  )

  context('when there is no contact associated with the interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(
        {
          ...mockInteraction,
          archived_documents_url_path: '/documents/123',
          contact: null,
          investment_project: {
            id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
            name: 'Test project',
          },
        },
        true
      )
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        Company: {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [
          {
            url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
            name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
          },
        ],
        Service: {
          id: 'sv1',
          name: 'Account Management',
        },
        Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes':
          'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        Documents: {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'Date of interaction': {
          type: 'date',
          name: '2058-11-25',
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
        'Investment project': {
          url: '/investments/projects/bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
      })
    })
  })

  context('when there is no company associated with the interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(
        {
          ...mockInteraction,
          company: null,
        },
        true
      )
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Contact(s)': [
          {
            url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
            name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
          },
        ],
        Service: {
          id: 'sv1',
          name: 'Account Management',
        },
        Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes':
          'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of interaction': {
          type: 'date',
          name: '2058-11-25',
        },
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
      })
    })
  })

  context(
    'when there is no investment project associated with the interaction',
    () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord(
          {
            ...mockInteraction,
            investment_project: null,
          },
          true
        )
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Company: {
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
            name: 'Venus Ltd',
          },
          'Contact(s)': [
            {
              url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
              name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
            },
          ],
          Service: {
            id: 'sv1',
            name: 'Account Management',
          },
          Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy area': 'Access to Public Funding (inc. EU funding)',
          'Policy feedback notes':
            'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy issue types': 'EU exit',
          'Date of interaction': {
            type: 'date',
            name: '2058-11-25',
          },
          'Adviser(s)': ['Bob Lawson, The test team'],
          'Communication channel': {
            id: '70c226d7-5d95-e211-a939-e4115bead28a',
            name: 'Email/Website',
          },
        })
      })
    }
  )

  context('when provided with a fully populated service delivery', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(
        {
          ...mockInteraction,
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
          archived_documents_url_path: '/documents/123',
          communication_channel: null,
        },
        true
      )
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        Company: {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [
          {
            url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
            name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
          },
        ],
        Service: {
          id: 'sv1',
          name: 'Account Management',
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
        Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes':
          'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of service delivery': {
          type: 'date',
          name: '2058-11-25',
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
        Documents: {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        Event: {
          url: '/events/4444',
          name: 'Event title',
        },
      })
    })
  })

  context(
    'when provided with a service delivery with optional fields not set',
    () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord(
          {
            ...mockInteraction,
            event: null,
            kind: 'service_delivery',
            service_delivery_status: null,
            grant_amount_offered: null,
            net_company_receipt: null,
            communication_channel: null,
          },
          true
        )
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Company: {
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
            name: 'Venus Ltd',
          },
          'Contact(s)': [
            {
              url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
              name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
            },
          ],
          Service: {
            id: 'sv1',
            name: 'Account Management',
          },
          Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy area': 'Access to Public Funding (inc. EU funding)',
          'Policy feedback notes':
            'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
          'Policy issue types': 'EU exit',
          'Date of service delivery': {
            type: 'date',
            name: '2058-11-25',
          },
          'Adviser(s)': ['Bob Lawson, The test team'],
          Event: 'No',
        })
      })
    }
  )

  context('when there is not an archived documents URL path', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord(
        {
          ...mockInteraction,
          archived_documents_url_path: '',
        },
        true
      )
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        Company: {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [
          {
            url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
            name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
          },
        ],
        Service: {
          id: 'sv1',
          name: 'Account Management',
        },
        Notes: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes':
          'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of interaction': {
          type: 'date',
          name: '2058-11-25',
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
      })
    })
  })

  context('when provided with an interaction with policy feedback', () => {
    context('and one policy area', () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord(
          mockInteractionWithPolicyFeedback,
          true
        )
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Company: {
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
            name: 'Venus Ltd',
          },
          'Contact(s)': [
            {
              url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
              name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
            },
          ],
          Service: {
            id: 'sv1',
            name: 'Account Management',
          },
          Notes: 'Labore culpa quas cupiditate voluptatibus magni.',
          'Date of interaction': {
            type: 'date',
            name: '2058-11-25',
          },
          'Adviser(s)': ['Bob Lawson, The test team'],
          'Communication channel': {
            id: '70c226d7-5d95-e211-a939-e4115bead28a',
            name: 'Email/Website',
          },
          'Policy issue types': 'Domestic',
          'Policy feedback notes':
            'Labore culpa quas cupiditate voluptatibus magni.',
        })
      })
    })

    context('and multiple policy areas', () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord({
          ...mockInteractionWithPolicyFeedback,
          policy_areas: [
            {
              name: 'p a 1',
              id: 'pa1',
            },
            {
              name: 'p a 2',
              id: 'pa2',
            },
          ],
        })
      })

      it('should transform to display format', () => {
        expect(this.transformed['Policy area']).to.equal('p a 1, p a 2')
      })
    })
  })

  context(
    'when transforming a draft and not showing document information',
    () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord(
          mcokDraftPastMeeting
        )
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          'Adviser(s)': ['Brendan Smith, Aberdeen City Council'],
          Company: {
            name: 'Venus Ltd',
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          },
          'Contact(s)': [
            {
              name: 'Theodore Schaden|6e4b048d-5bb5-4868-9455-aa712f4ceffd',
              url: '/contacts/71906039-858e-47ba-8016-f3c80da69ace',
            },
          ],
          'Date of interaction': {
            name: '2019-05-20',
            type: 'date',
          },
        })
      })
    }
  )
})
