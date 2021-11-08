const { expect } = require('chai')

const { transformEventFormForAPIRequest } = require('./transformers')

describe('transformers', () => {
  describe('transformEventFormForAPIRequest', () => {
    it('should transform the minimum amount of event form values with expected result', () => {
      const values = {
        has_related_trade_agreements: 'No',
        start_date: {
          day: '11',
          month: '04',
          year: '2022',
        },
        end_date: {
          day: '11',
          month: '04',
          year: '2020',
        },
        lead_team: {
          value: 'cff02898-9698-e211-a939-e4115bead28a',
          label: 'Aberdeen City Council',
        },
        service: {
          value: '0396b92b-3499-e211-a939-e4115bead28a',
          label: 'Gateway to Global Growth',
        },
        organiser: {
          label: 'Travis Greene, IST - Sector Advisory Services',
          value: '8eefe6b4-2816-4e47-94b5-a13409dcef70',
        },
        event_shared: 'No',
        // Duplicate programmes
        related_programmes: [
          {
            value: 'e2a8be20-7a54-e311-a33a-e4115bead28a',
          },
          {
            value: 'e2a8be20-7a54-e311-a33a-e4115bead28a',
          },
        ],
        related_trade_agreements: [],
      }

      const actual = transformEventFormForAPIRequest(values)

      expect(actual).to.eql({
        has_related_trade_agreements: false,
        related_trade_agreements: [],
        event_type: null,
        start_date: '2022-04-11',
        end_date: '2020-04-11',
        location_type: null,
        address_country: null,
        lead_team: 'cff02898-9698-e211-a939-e4115bead28a',
        service: '0396b92b-3499-e211-a939-e4115bead28a',
        organiser: '8eefe6b4-2816-4e47-94b5-a13409dcef70',
        event_shared: false,
        // Single result
        related_programmes: ['e2a8be20-7a54-e311-a33a-e4115bead28a'],
        teams: ['cff02898-9698-e211-a939-e4115bead28a'],
        uk_region: null,
      })
    })

    it('should transform all form values with the expected format', () => {
      const values = {
        has_related_trade_agreements: 'Yes',
        event_type: {
          value: '85f2f48f-0ecb-4a3a-b7d2-8106b8733769',
          label: 'Account management',
        },
        start_date: {
          day: '11',
          month: '7',
          year: '2021',
        },
        end_date: {
          day: '11',
          month: '7',
          year: '2021',
        },
        location_type: {
          value: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
          label: 'HQ',
        },
        address_country: {
          value: '80756b9a-5d95-e211-a939-e4115bead28a',
          label: 'United Kingdom',
        },
        uk_region: {
          value: '934cd12a-6095-e211-a939-e4115bead28a',
          label: 'Alderney',
        },
        notes: 'adsasdas',
        lead_team: {
          value: 'cff02898-9698-e211-a939-e4115bead28a',
          label: 'Aberdeen City Council',
        },
        service: {
          value: '0396b92b-3499-e211-a939-e4115bead28a',
          label: 'Gateway to Global Growth',
        },
        organiser: {
          label:
            'Harold Jones, International Trade Team Business Link North Manchester (Wigan, Bolton, Bury, Oldham and Rochdale)',
          value: '453a608e-84a4-11e6-ea22-56b6b6499622',
        },
        event_shared: 'Yes',
        related_programmes: [
          {
            value: 'e2a8be20-7a54-e311-a33a-e4115bead28a',
          },
        ],
        related_trade_agreements: [
          {
            value: 'af704a93-5404-4bc6-adda-381756993902',
          },
        ],
        teams: [
          {
            value: '08c14624-2f50-e311-a56a-e4115bead28a',
          },
        ],
      }

      const actual = transformEventFormForAPIRequest(values)

      expect(actual).to.eql({
        has_related_trade_agreements: true,
        related_trade_agreements: ['af704a93-5404-4bc6-adda-381756993902'],
        event_type: '85f2f48f-0ecb-4a3a-b7d2-8106b8733769',
        start_date: '2021-7-11',
        end_date: '2021-7-11',
        location_type: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        lead_team: 'cff02898-9698-e211-a939-e4115bead28a',
        service: '0396b92b-3499-e211-a939-e4115bead28a',
        organiser: '453a608e-84a4-11e6-ea22-56b6b6499622',
        event_shared: true,
        related_programmes: ['e2a8be20-7a54-e311-a33a-e4115bead28a'],
        teams: [
          '08c14624-2f50-e311-a56a-e4115bead28a',
          'cff02898-9698-e211-a939-e4115bead28a',
        ],
        uk_region: '934cd12a-6095-e211-a939-e4115bead28a',
      })
    })
  })
})
