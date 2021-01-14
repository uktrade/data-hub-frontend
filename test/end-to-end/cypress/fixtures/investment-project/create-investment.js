const { v4: uuidv4 } = require('uuid')

function create() {
  return {
    model: 'investment.investmentproject',
    pk: uuidv4(),
    fields: {
      name: 'New hotel (FDI)',
      description: 'This is a dummy investment project for testing',
      stage: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
      status: 'ongoing',
      estimated_land_date: '2020-01-01',
      investment_type: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
      investor_company: '0f5216e0-849f-11e6-ae22-56b6b6499611',
      client_contacts: ['952232d2-1d25-4c3a-bcac-2f3a30a94da9'],
      client_relationship_manager: 'e83a608e-84a4-11e6-ae22-56b6b6499611',
      referral_source_adviser: 'e83a608e-84a4-11e6-ae22-56b6b6499611',
      referral_source_activity: 'aba8f653-264f-48d8-950e-07f9c418c7b0',
      fdi_type: 'f8447013-cfdc-4f35-a146-6619665388b3',
      sector: '034be3be-5329-e511-b6bc-e4115bead28a',
      business_activities: ['a2dbd807-ae52-421c-8d1d-88adfc7a506b'],
      client_cannot_provide_total_investment: 'False',
      total_investment: 1000000.0,
      foreign_equity_investment: 200000.0,
      government_assistance: 'True',
      number_new_jobs: 20,
      average_salary: '2943bf3d-32dd-43be-8ad4-969b006dee7b',
      site_decided: 'False',
      client_considering_other_countries: 'False',
      uk_region_locations: ['814cd12a-6095-e211-a939-e4115bead28a'],
      client_requirements: 'Anywhere',
      strategic_drivers: ['382aa6d1-a362-4166-a09d-f579d9f3be75'],
      created_on: '2017-03-17T15:12:00Z',
      modified_on: '2017-06-05T10:00:00Z',
    },
  }
}

module.exports = {
  create,
}
