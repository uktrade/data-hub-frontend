/**
 * Easily reference fixtures provided to the UAT tests
 * @type {}
 */
module.exports = {
  company: {
    companiesHouse: {
      name: 'Exobite Skeletons Ltd',
      address1: '999 Juliet Street',
      town: 'Llangefni',
      postcode: 'LL77 5RN',
      country: 'United Kingdom',
    },
    foreign: {
      pk: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
      name: 'Lambda plc',
      address1: '12 St George\'s Road',
      town: 'Paris',
      postcode: '75001',
      country: 'France',
      businessType: 'Company',
      sector: 'Retail',
      employeeRange: '500+',
      turnoverRange: '£33.5M+',
    },
    foreignOther: {
      pk: 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
      name: 'Mars Exports Ltd',
      address1: '12 First Street',
      town: 'New York',
      postcode: '765413',
      country: 'United States',
    },
    ukLtd: {
      pk: '0f5216e0-849f-11e6-ae22-56b6b6499611',
      name: 'Venus Ltd',
      referenceCode: 'ORG-10096257',
    },
  },
  contact: {
    georginaClark: {
      pk: '048f2edc-e7ed-4881-b1cc-29142a80238a',
      name: 'Georgina Clark',
    },
    johnnyCakeman: {
      pk: '9b1138ab-ec7b-497f-b8c3-27fed21694ef',
      name: 'Johnny Cakeman',
    },
  },
  event: {
    oneDayExhibition: {
      pk: 'b93d4273-36fe-4008-ac40-fbc197910791',
      name: 'One-day exhibition',
    },
    grandExhibition: {
      pk: 'bda12a57-433c-4a0c-a7ce-5ebd080e09e8',
      name: 'Grand exhibition',
    },
  },
  investmentProject: {
    newHotelCommitmentToInvest: {
      pk: 'fb5b5006-56af-40e0-8615-7aba53e0e4bf',
      name: 'New hotel (commitment to invest)',
    },
    newRollercoaster: {
      pk: '0e686ea4-b8a2-4337-aec4-114d92ad4588',
      name: 'New rollercoaster',
    },
  },
}
