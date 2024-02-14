import { ID as COMPANY_DETAILS_ID } from '../../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../../ExportPipeline/ExportDetails/state'

import { state2props } from '../state'

describe('state2props', () => {
  context('when both company and exportItem are null', () => {
    it('should return exportItem as null', () => {
      expect(
        state2props(
          {
            [COMPANY_DETAILS_ID]: {
              company: null,
            },
            [EXPORT_DETAILS_ID]: {
              exportItem: null,
            },
          },
          { location: {} }
        )
      ).to.deep.equal({
        exportItem: null,
      })
    })
  })

  context('when a company is defined and exportItem is null', () => {
    it('should return exportItem with both company and owner', () => {
      const { exportItem } = state2props(
        {
          [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
          [EXPORT_DETAILS_ID]: {},
          currentAdviserId: 2,
          currentAdviserName: 'b',
        },
        { location: { search: '' } }
      )

      expect(exportItem).to.deep.include({
        company: { id: 1, name: 'a' },
        owner: { value: 2, label: 'b' },
      })
    })
  })

  context('when both company and exportItem are defined', () => {
    it('should return an exportItem with company details taken from the export details', () => {
      expect(
        state2props(
          {
            [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
            [EXPORT_DETAILS_ID]: {
              exportItem: { company: { id: 2, name: 'b' } },
            },
          },
          { location: { search: '' } }
        ).exportItem
      ).to.deep.include({
        company: { id: 2, name: 'b' },
      })
    })
  })

  context('when a contact has been added to the query params', () => {
    it('should return an exportItem with the contact in an array and scrollToContact set to true', () => {
      expect(
        state2props(
          {
            [COMPANY_DETAILS_ID]: {},
            [EXPORT_DETAILS_ID]: {
              exportItem: { company: { id: 2, name: 'b' } },
            },
          },
          {
            location: {
              search:
                '?new-contact-id=9eae1a1b-2767-4cd5-8590-abe76e53e1ea&new-contact-name=Rob+Davies',
            },
          }
        ).exportItem
      ).to.deep.include({
        contacts: [
          {
            value: '9eae1a1b-2767-4cd5-8590-abe76e53e1ea',
            label: 'Rob Davies',
          },
        ],
        scrollToContact: true,
        company: { id: 2, name: 'b' },
      })
    })
  })
})
