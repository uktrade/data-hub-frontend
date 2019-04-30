const config = require('~/config')
const moment = require('moment')
const now = moment()
const transformInteractionResponseToViewRecord = require('~/src/apps/interactions/transformers/interaction-response-to-view')
const mockInteraction = require('~/test/unit/data/interactions/interaction.json')
const mockInteractionWithPolicyFeedback = require('~/test/unit/data/interactions/interaction-with-feedback.json')

config.archivedDocumentsBaseUrl = 'http://base'

describe('#transformInteractionResponsetoViewRecord', () => {
  context('when provided a fully populated interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord({
        ...mockInteraction,
        archived_documents_url_path: '/documents/123',
        investment_project: {
          id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
        },
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of interaction': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
        },
        'Documents': {
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

  context('when there is no contact associated with the interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord({
        ...mockInteraction,
        archived_documents_url_path: '/documents/123',
        contact: null,
        investment_project: {
          id: 'bac18331-ca4d-4501-960e-a1bd68b5d47e',
          name: 'Test project',
        },
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
        },
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Documents': {
          hint: '(will open another website)',
          hintId: 'external-link-label',
          name: 'View files and documents',
          url: 'http://base/documents/123',
        },
        'Date of interaction': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
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
      this.transformed = transformInteractionResponseToViewRecord({
        ...mockInteraction,
        company: null,
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
        },
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of interaction': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
        },
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
        'Documents': {
          name: 'There are no files or documents',
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
      })
    })
  })

  context('when there is no investment project associated with the interaction', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord({
        ...mockInteraction,
        investment_project: null,
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
        },
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Documents': {
          name: 'There are no files or documents',
        },
        'Date of interaction': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
        'Communication channel': {
          id: '70c226d7-5d95-e211-a939-e4115bead28a',
          name: 'Email/Website',
        },
      })
    })
  })

  context('when provided with a fully populated service delivery', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord({
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
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
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
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of service delivery': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
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
      this.transformed = transformInteractionResponseToViewRecord({
        ...mockInteraction,
        event: null,
        kind: 'service_delivery',
        service_delivery_status: null,
        grant_amount_offered: null,
        net_company_receipt: null,
        communication_channel: null,
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
        },
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Date of service delivery': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
        },
        'Adviser(s)': ['Bob Lawson, The test team'],
        'Event': 'No',
        'Documents': {
          name: 'There are no files or documents',
        },
      })
    })
  })

  context('when there is not an archived documents URL path', () => {
    beforeEach(() => {
      this.transformed = transformInteractionResponseToViewRecord({
        ...mockInteraction,
        archived_documents_url_path: '',
      })
    })

    it('should transform to display format', () => {
      expect(this.transformed).to.deep.equal({
        'Company': {
          url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
          name: 'Venus Ltd',
        },
        'Contact(s)': [{
          url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
          name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
        }],
        'Service': {
          id: 'd320b92b-3499-e211-a939-e4115bead28a',
          name: 'Investment - Company Visit',
        },
        'Subject': 'ad',
        'Notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy area': 'Access to Public Funding (inc. EU funding)',
        'Policy feedback notes': 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        'Policy issue types': 'EU exit',
        'Documents': {
          name: 'There are no files or documents',
        },
        'Date of interaction': {
          type: 'date',
          name: now.format('YYYY-MM-DD'),
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
        this.transformed = transformInteractionResponseToViewRecord(mockInteractionWithPolicyFeedback)
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          'Company': {
            url: '/companies/0f5216e0-849f-11e6-ae22-56b6b6499611',
            name: 'Venus Ltd',
          },
          'Contact(s)': [{
            url: '/contacts/7701587b-e88f-4f39-874f-0bd06321f7df',
            name: 'Cleve Wisoky|c95c0a3f-cc44-4419-bd34-648e74d652f5',
          }],
          'Service': {
            id: 'd320b92b-3499-e211-a939-e4115bead28a',
            name: 'Investment - Company Visit',
          },
          'Subject': 'ad',
          'Notes': 'Labore culpa quas cupiditate voluptatibus magni.',
          'Date of interaction': {
            type: 'date',
            name: '2058-11-25',
          },
          'Adviser(s)': ['Bob Lawson, The test team'],
          'Communication channel': {
            id: '70c226d7-5d95-e211-a939-e4115bead28a',
            name: 'Email/Website',
          },
          'Documents': {
            name: 'There are no files or documents',
          },
          'Policy issue types': 'Domestic',
          'Policy feedback notes': 'Labore culpa quas cupiditate voluptatibus magni.',
        })
      })
    })

    context('and multiple policy areas', () => {
      beforeEach(() => {
        this.transformed = transformInteractionResponseToViewRecord({
          ...mockInteractionWithPolicyFeedback,
          policy_areas: [{
            name: 'p a 1',
            id: 'pa1',
          }, {
            name: 'p a 2',
            id: 'pa2',
          }],
        })
      })

      it('should transform to display format', () => {
        expect(this.transformed['Policy area']).to.equal('p a 1, p a 2')
      })
    })
  })
})
