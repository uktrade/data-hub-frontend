import { ID as COMPANY_DETAILS_ID } from '../../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../../ExportPipeline/ExportDetails/state'

import { state2props } from '../state'

describe('state2props', () => {
  context('when company and exportItem state values are null', () => {
    it('should return exportItem prop as empty object', () => {
      expect(
        state2props({ [COMPANY_DETAILS_ID]: {}, [EXPORT_DETAILS_ID]: {} })
      ).to.deep.equal({
        exportItem: null,
      })
    })
  })

  context(
    'when company in state is not null and exportItem in state is null',
    () => {
      let state2propsResult
      beforeEach(() => {
        state2propsResult = state2props({
          [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
          [EXPORT_DETAILS_ID]: {},
          currentAdviserId: 2,
          currentAdviserName: 'b',
        }).exportItem
      })

      it('should return exportItem prop with company details populated from the company in state and owner set to logged in user', () => {
        expect(state2propsResult).to.deep.include({
          company: { id: 1, name: 'a' },
        })
      })
      it('should return exportItem prop with owner set to current adviser', () => {
        expect(state2propsResult).to.deep.include({
          owner: { id: 2, name: 'b' },
        })
      })
      it('should return exportItem prop with empty defaults for meta data fields', () => {
        expect(state2propsResult).to.deep.include({
          team_members: [],
          estimated_export_value_years: {},
          estimated_win_date: {},
          exporter_experience: {},
        })
      })
    }
  )

  context('when company and exportItem state values are not null', () => {
    it('should return exportItem prop with company details populated from the exportItem in state', () => {
      expect(
        state2props({
          [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
          [EXPORT_DETAILS_ID]: {
            exportItem: { company: { id: 2, name: 'b' } },
          },
        })
      ).to.deep.equal({
        exportItem: { company: { id: 2, name: 'b' } },
      })
    })
  })
})
