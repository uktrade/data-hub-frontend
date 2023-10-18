const ADDRESS = {
  country: {
    name: 'Test Country',
  },
  county: 'Test County',
  line1: 'Address line 1',
  line2: 'Address line 2',
  postcode: 'postcode',
  town: 'town',
}

const REGISTERED_ADDRESS = {
  country: {
    name: 'Test Registered Country',
  },
  county: 'Test Registered County',
  line1: 'Registered Address line 1',
  line2: 'Registered Address line 2',
  postcode: 'Registered postcode',
  town: 'Registered town',
}

export const COMPANY_ADDRESS = {
  name: 'Company with address',
  address: ADDRESS,
}

export const COMPANY_REGISTERED_ADDRESS = {
  name: 'Company with reg address',
  registeredAddress: REGISTERED_ADDRESS,
}

export const COMPANY_BOTH_ADDRESSES = {
  name: 'Company with both addresses',
  address: ADDRESS,
  registeredAddress: REGISTERED_ADDRESS,
}
