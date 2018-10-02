const {
  overseasAddressForm,
  postcodeLookupForm,
  selectUkAddressForm,
  ukOrOverseasForm,
} = require('../../macros')

module.exports = {
  steps: [
    {
      path: '/create/step-1',
      type: 'form',
      heading: 'Is this a UK or overseas address?',
      breadcrumbs: [
        { name: 'Add an address' },
      ],
      macro: ukOrOverseasForm,
      nextPath: ({ uk_or_overseas: ukOrOverseas }) => {
        const path = {
          uk: '/create/postcode-lookup',
          overseas: '/create/overseas-address',
        }

        return path[ukOrOverseas]
      },
    },
    {
      path: '/create/postcode-lookup',
      type: 'form',
      heading: 'Add a company address',
      breadcrumbs: [
        { name: 'Add an address' },
      ],
      macro: postcodeLookupForm,
      nextPath: '/create/select-uk-address',
    },
    {
      path: '/create/select-uk-address',
      type: 'form',
      heading: 'Add a company address',
      breadcrumbs: [
        { name: 'Add an address' },
      ],
      macro: selectUkAddressForm,
      nextPath: '/',
    },
    {
      path: '/create/overseas-address',
      type: 'form',
      heading: 'Add a company address',
      breadcrumbs: [
        { name: 'Add an address' },
      ],
      macro: overseasAddressForm,
      nextPath: '/',
    },
  ],
}
