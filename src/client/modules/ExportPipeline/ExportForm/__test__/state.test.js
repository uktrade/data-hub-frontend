import { ID as COMPANY_DETAILS_ID } from '../../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../../ExportPipeline/ExportDetails/state'

import { ID, state2props } from '../state'

const exportItemSessionStorage = {
  title: 'title sessionStorage',
  owner: {
    value: 'owner.value sessionStorage',
    label: 'owner.label sessionStorage',
  },
  team_members: [
    {
      value: 'team.member[0].value sessionStorage',
      label: 'team.member[0].label sessionStorage',
    },
    {
      value: 'team.member[1].value sessionStorage',
      label: 'team.member[1].label sessionStorage',
    },
  ],
  estimated_export_value_years: 'estimated_export_value_years sessionStorage',
  estimated_export_value_amount: 'estimated_export_value_amount sessionStorage',
  estimated_win_date: { month: -1, year: -2 },
  destination_country: {
    value: 'destination_country.value sessionStorage',
    label: 'destination_country.label sessionStorage',
  },
  sector: {
    value: 'sector.value sessionStorage',
    label: 'sector.label sessionStorage',
  },
  status: 'status sessionStorage',
  export_potential: 'export_potential sessionStorage',
  contacts: [
    {
      value: 'contacts[0].value sessionStorage',
      label: 'contacts[0].label sessionStorage',
    },
  ],
  exporter_experience: 'exporter_experience sessionStorage',
  notes: 'notes sessionStorage',
  company: {
    id: 'company.id sessionStorage',
    name: 'company.name sessionStorage',
  },
  id: 'id sessionStorage',
}

let getItemKey

describe('state2props', () => {
  before(() => {
    global.window = {
      sessionStorage: {
        getItem: function (key) {
          if (key === getItemKey) {
            return JSON.stringify(exportItemSessionStorage)
          }
          return null
        },
      },
    }
  })
  afterEach(() => {
    getItemKey = undefined
  })

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
          owner: { value: 2, label: 'b' },
        })
      })
    }
  )

  context('when company and exportItem state values are not null', () => {
    context('and sessionStorage does not contain any form data', () => {
      it('should return exportItem prop with company details populated from the exportItem in state', () => {
        expect(
          state2props({
            [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
            [EXPORT_DETAILS_ID]: {
              exportItem: { company: { id: 2, name: 'b' } },
            },
          }).exportItem
        ).to.deep.include({
          company: { id: 2, name: 'b' },
        })
      })
    })

    context('and sessionStorage contains form data', () => {
      beforeEach(() => {
        getItemKey = ID
      })

      it('should return exportItem prop with company details populated from the sessionStorage', () => {
        expect(
          state2props({
            [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
            [EXPORT_DETAILS_ID]: {
              exportItem: { company: { id: 2, name: 'b' } },
            },
          }).exportItem
        ).to.deep.include({
          company: {
            id: 'company.id sessionStorage',
            name: 'company.name sessionStorage',
          },
        })
      })

      it('should return exportItem prop with any field in the state overwritten by the same field in the sessionStorage', () => {
        expect(
          state2props({
            [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
            [EXPORT_DETAILS_ID]: {
              exportItem: {
                company: {
                  id: 2,
                  name: 'b',
                  team_members: [{ label: 'd', value: 3 }],
                  notes: 'long notes',
                },
              },
            },
          }).exportItem
        ).to.deep.equal(exportItemSessionStorage)
      })
    })
  })
})
