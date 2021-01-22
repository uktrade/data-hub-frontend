const { v4: uuidv4 } = require('uuid')

function defaultCompany(name = 'audit testing') {
  return {
    pk: uuidv4(),
    model: 'company.company',
    fields: {
      name,
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      export_to_countries: [
        '82756b9a-5d95-e211-a939-e4115bead28a',
        '83756b9a-5d95-e211-a939-e4115bead28a',
      ],
      future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: '100 Path',
      address_town: 'A town',
      address_postcode: '12345',
      address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: '100 Path',
      registered_address_town: 'A town',
      registered_address_postcode: '12345',
      registered_address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing',
      modified_on: '2017-11-16T11:00:00Z',
    },
  }
}

function emptyUkRegion(name = 'audit testing') {
  return {
    pk: uuidv4(),
    model: 'company.company',
    fields: {
      name,
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      export_to_countries: [
        '82756b9a-5d95-e211-a939-e4115bead28a',
        '83756b9a-5d95-e211-a939-e4115bead28a',
      ],
      future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: '100 Path',
      address_town: 'A town',
      address_postcode: '12345',
      address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: '100 Path',
      registered_address_town: 'A town',
      registered_address_postcode: '12345',
      registered_address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing',
      uk_region: null,
      modified_on: '2017-11-16T11:00:00Z',
    },
  }
}

function corp() {
  return {
    pk: uuidv4(),
    model: 'company.company',
    fields: {
      name: 'One List Corp',
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: "12 St George's Road",
      address_town: 'Paris',
      address_postcode: '75001',
      address_country: '82756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: "12 St George's Road",
      registered_address_town: 'Paris',
      registered_address_postcode: '75001',
      registered_address_country: '82756b9a-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing the One List',
      headquarter_type: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
      one_list_tier: 'b91bf800-8d53-e311-aef3-441ea13961e2',
      duns_number: Math.floor(Math.random() * 1000000000),
      one_list_account_owner: '8eefe6b4-2816-4e47-94b5-a13409dcef70',
      created_on: '2015-10-26T11:00:00Z',
      modified_on: '2017-11-26T11:00:00Z',
    },
  }
}

function lambda() {
  return {
    model: 'company.company',
    pk: uuidv4(),
    fields: {
      name: 'Lambda plc',
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      export_to_countries: [
        '82756b9a-5d95-e211-a939-e4115bead28a',
        '83756b9a-5d95-e211-a939-e4115bead28a',
      ],
      future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: "12 St George's Road",
      address_town: 'Paris',
      address_postcode: '75001',
      address_country: '82756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: "12 St George's Road",
      registered_address_town: 'Paris',
      registered_address_postcode: '75001',
      registered_address_country: '82756b9a-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing',
      created_on: '2015-10-26T11:00:00Z',
      modified_on: '2017-11-26T11:00:00Z',
    },
  }
}

function archivedLtd() {
  return {
    model: 'company.company',
    pk: uuidv4(),
    fields: {
      name: 'Archived Ltd',
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: '16 Getabergsvagen',
      address_town: 'Geta',
      address_postcode: '22340',
      address_country: '0850bdb8-5d95-e211-a939-e4115bead28a',
      registered_address_1: '16 Getabergsvagen',
      registered_address_town: 'Geta',
      registered_address_postcode: '22340',
      registered_address_country: '0850bdb8-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing archived features',
      headquarter_type: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
      one_list_tier: 'b91bf800-8d53-e311-aef3-441ea13961e2',
      one_list_account_owner: '8eefe6b4-2816-4e47-94b5-a13409dcef70',
      created_on: '2014-11-11T09:00:00Z',
      modified_on: '2017-07-16T10:00:00Z',
      archived: true,
      archived_on: '2018-07-06T10:44:56Z',
      archived_by: '7bad8082-4978-4fe8-a018-740257f01637',
      archived_reason: 'Company is dissolved',
    },
  }
}

function subsidiaryCorp(companyId) {
  return {
    model: 'company.company',
    pk: uuidv4(),
    fields: {
      name: 'One List Subsidiary Ltd',
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      sector: '7ebb9fc6-5f95-e211-a939-e4115bead28a',
      address_1: '100 Fordham Rd',
      address_town: 'Hainault',
      address_postcode: 'IG6 7SQ',
      address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: '100 Fordham Rd',
      registered_address_town: 'Hainault',
      registered_address_postcode: 'IG6 7SQ',
      registered_address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
      uk_region: '874cd12a-6095-e211-a939-e4115bead28a',
      description: 'dummy company for testing subsidiaries of One List GHQ',
      archived_documents_url_path: '/documents/123',
      created_on: '2017-07-23T10:00:00Z',
      modified_on: '2017-04-07T10:00:00Z',
      global_headquarters: companyId,
    },
  }
}

module.exports = {
  defaultCompany,
  corp,
  emptyUkRegion,
  lambda,
  archivedLtd,
  subsidiaryCorp,
}
