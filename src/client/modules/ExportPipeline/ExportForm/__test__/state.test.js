import { ID as COMPANY_DETAILS_ID } from '../../../Companies/CompanyDetails/state'
import { ID as EXPORT_DETAILS_ID } from '../../../ExportPipeline/ExportDetails/state'

import { overwriteObjectWithSessionStorageValues, state2props } from '../state'

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

const emptySessionState = () => null
const populatedSessionState = () => JSON.stringify(exportItemSessionStorage)
let getItem = emptySessionState

describe('overwriteObjectWithSessionStorageValues', () => {
  before(() => {
    global.window = {
      sessionStorage: {
        getItem: (key) => getItem(key),
      },
    }
  })

  context(
    'when sessionState contains values and query string is populated',
    () => {
      before(() => (getItem = populatedSessionState))
      it('should return exportItem with any field in the state overwritten by the same field in the sessionStorage and the new contact in the list of contacts', () => {
        expect(
          overwriteObjectWithSessionStorageValues(
            {
              company: {
                id: 2,
                name: 'b',
              },
              team_members: [{ label: 'd', value: 3 }],
              contact: [
                { label: 'contact 1', value: 1 },
                { label: 'contact 2', value: 2 },
              ],
              notes: 'long notes',
            },
            new URLSearchParams('?new-contact-name=abc&new-contact-id=10')
          )
        ).to.deep.equal({
          ...exportItemSessionStorage,
          contacts: [
            ...exportItemSessionStorage.contacts,
            { label: 'abc', value: '10' },
          ],
          scrollToContact: true,
        })
      })
    }
  )

  context('when sessionState is null and query string is populated', () => {
    beforeEach(() => (getItem = emptySessionState))

    it('should return exportItem with no values overriden from sessionStorage', () => {
      expect(
        overwriteObjectWithSessionStorageValues(
          {
            company: {
              id: 2,
              name: 'b',
            },
            title: 'title 123',
            contacts: [{ name: 'd', id: 3 }],
          },
          new URLSearchParams('?new-contact-name=abc&new-contact-id=1')
        )
      ).to.deep.include({
        company: {
          id: 2,
          name: 'b',
        },
        title: 'title 123',
        contacts: [{ label: 'd', value: 3 }],
      })
    })
  })

  context(
    'when sessionState contains values and query string is missing',
    () => {
      beforeEach(() => (getItem = populatedSessionState))

      it('should return exportItem with no values overriden from sessionStorage', () => {
        expect(
          overwriteObjectWithSessionStorageValues(
            {
              company: {
                id: 2,
                name: 'b',
              },
              team_members: [{ name: 'd', id: 3 }],
            },
            new URLSearchParams()
          )
        ).to.deep.include({
          company: {
            id: 2,
            name: 'b',
          },
          team_members: [{ label: 'd', value: 3 }],
        })
      })
    }
  )
})

describe('state2props', () => {
  context('when company and exportItem state values are null', () => {
    it('should return exportItem prop as empty object', () => {
      expect(
        state2props(
          { [COMPANY_DETAILS_ID]: {}, [EXPORT_DETAILS_ID]: {} },
          { router: { location: {} } }
        )
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
        state2propsResult = state2props(
          {
            [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
            [EXPORT_DETAILS_ID]: {},
            currentAdviserId: 2,
            currentAdviserName: 'b',
          },
          { router: { location: {} } }
        ).exportItem
      })

      it('should return exportItem prop with company details populated from the company in state', () => {
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
    it('should return exportItem prop with company details populated from the exportItem in state', () => {
      expect(
        state2props(
          {
            [COMPANY_DETAILS_ID]: { company: { id: 1, name: 'a' } },
            [EXPORT_DETAILS_ID]: {
              exportItem: { company: { id: 2, name: 'b' } },
            },
          },
          { router: { location: {} } }
        ).exportItem
      ).to.deep.include({
        company: { id: 2, name: 'b' },
      })
    })
  })
})
