const eventTypeOptions = [
  {
    value: '85f2f48f-0ecb-4a3a-b7d2-8106b8733769',
    label: 'Account management',
  },
  {
    value: '2fade471-e868-4ea9-b125-945eb90ae5d4',
    label: 'Exhibition',
  },
]

const relatedTradeAgreements = [
  {
    value: 'af704a93-5404-4bc6-adda-381756993902',
    label:
      'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
  },
  {
    value: '72b0f84a-77cd-4216-841f-0a75b56f8174',
    label: 'EU-UK Trade Co-operation Agreement',
  },
]

const eventLocationTypes = [
  {
    value: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
    label: 'HQ',
  },
  {
    value: 'cf45bf02-8ea7-4e53-af0e-b5676a30cb96',
    label: 'Other',
  },
]

const countries = [
  {
    value: '87756b9a-5d95-e211-a939-e4115bead28a',
    label: 'Afghanistan',
  },
  {
    value: '80756b9a-5d95-e211-a939-e4115bead28a',
    label: 'United Kingdom',
  },
]

const teams = [
  {
    value: 'cff02898-9698-e211-a939-e4115bead28a',
    label: 'Aberdeen City Council',
  },
  {
    value: '6b7b1ca4-9698-e211-a939-e4115bead28a',
    label: 'Aerospace, Defense & Security (ADS)',
  },
]

const services = [
  {
    value: '6fd4b203-8e73-4a39-96ea-188bdb623b69',
    label: 'Making Other Introductions : UK Export Finance (UKEF)',
  },
  {
    value: '5c13807a-5639-4b1b-8fb6-2531645b49bc',
    label: 'COP26 : Nature, including supply chains',
  },
]

const ukRegions = [
  {
    value: '1718e330-6095-e211-a939-e4115bead28a',
    label: 'All',
  },
  {
    value: '844cd12a-6095-e211-a939-e4115bead28a',
    label: 'East Midlands',
  },
]

const programmes = [
  {
    value: 'e2a8be20-7a54-e311-a33a-e4115bead28a',
    label: 'Aid Funded Business Service (AFBS)',
  },
  {
    value: 'e1dd40e9-3dfd-e311-8a2b-e4115bead28a',
    label: 'UKTI Dubai Hub Programme',
  },
]

const initialValues = {
  address_1: 'Address 1',
  address_2: 'Address 2',
  address_country: {
    value: '80756b9a-5d95-e211-a939-e4115bead28a',
    label: 'United Kingdom',
  },
  address_county: 'County',
  address_postcode: 'Postcode',
  address_town: 'Town',
  end_date: {
    year: '2021',
    month: '11',
    day: '11',
  },
  event_type: {
    value: '85f2f48f-0ecb-4a3a-b7d2-8106b8733769',
    label: 'Account management',
  },
  lead_team: {
    value: 'cff02898-9698-e211-a939-e4115bead28a',
    label: 'Aberdeen City Council',
  },
  location_type: {
    value: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
    label: 'HQ',
  },
  name: 'Test min entry',
  notes: 'Example of updating event ready to go',
  organiser: {
    value: '8eefe6b4-2816-4e47-94b5-a13409dcef70',
    label: 'Travis Greene',
  },
  has_related_trade_agreements: 'yes',
  related_trade_agreements: [
    {
      value: 'af704a93-5404-4bc6-adda-381756993902',
      label:
        'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
    },
    {
      value: '72b0f84a-77cd-4216-841f-0a75b56f8174',
      label: 'EU-UK Trade Co-operation Agreement',
    },
  ],
  related_programmes: [
    {
      value: 'e2a8be20-7a54-e311-a33a-e4115bead28a',
      label: 'Aid Funded Business Service (AFBS)',
    },
  ],
  start_date: {
    year: '2021',
    month: '11',
    day: '11',
  },
  teams: [
    {
      value: 'cff02898-9698-e211-a939-e4115bead28a',
      label: 'Aberdeen City Council',
    },
  ],
  service: {
    value: '6fd4b203-8e73-4a39-96ea-188bdb623b69',
    label: 'Making Other Introductions : UK Export Finance (UKEF)',
  },
  uk_region: {
    value: '874cd12a-6095-e211-a939-e4115bead28a',
    label: 'London',
  },
  event_shared: 'no',
}

export default {
  ['TASK_GET_EVENTS_FORM_AND_METADATA']: () =>
    new Promise((resolve) =>
      setTimeout(resolve, 1000, {
        metadata: {
          eventTypeOptions,
          relatedTradeAgreements,
          eventLocationTypes,
          countries,
          teams,
          services,
          programmes,
          ukRegions,
        },
        ...initialValues,
      })
    ),
}
