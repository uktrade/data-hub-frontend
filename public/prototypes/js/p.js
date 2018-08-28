const defaultLocation = {
  id: 1,
  name: 'Head office',
  meta: [
    {
      label: 'Address',
      value: 'Yeomans Drive, Blakelands, MK14 5LR, Milton Keynes, United Kingdom',
    },
    {
      label: 'Description',
      value: 'Registered company address. From Blakelands the company controls sourcing, marketing and distribution of all vehicles and parts in the UK.',
    },
  ],
  badges: [
    {
      label: 'UK region',
      value: 'South East',
    },
  ],
}

const contacts = [
  {
    name: 'Emma Jones',
    updated: 'todo',
    meta: [
      {
        label: 'Job title',
        value: 'Managing Director',
      },
      {
        label: 'Location',
        value: 'Milton Keynes - Head office (MK14 5LR)',
      },
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'London',
      },
      {
        label: 'Phone number',
        value: '+44123456789',
      },
      {
        label: 'Email',
        value: 'emma.jones@volkswagen.co.uk',
      },
    ],
  },
  {
    name: 'Sam Hobkinson',
    updated: 'todo',
    meta: [
      {
        label: 'Job title',
        value: 'Business Development Director',
      },
      {
        label: 'Location',
        value: 'Milton Keynes - Head office (MK14 5LR)',
      },
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'London',
      },
      {
        label: 'Phone number',
        value: '+44123456789',
      },
      {
        label: 'Email',
        value: 'sam.hobkinson@volkswagen.co.uk',
      },
    ],
  },
  {
    name: 'Frank Gareth',
    updated: 'todo',
    meta: [
      {
        label: 'Job title',
        value: 'Finance Director',
      },
      {
        label: 'Location',
        value: 'Milton Keynes - Office (MK15 8HG)',
      },
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'London',
      },
      {
        label: 'Phone number',
        value: '+44123456789',
      },
      {
        label: 'Email',
        value: 'frank.gareth@volkswagen.co.uk',
      },
    ],
  },
]

const subsidiaries = [
  {
    id: 1,
    name: 'Volkswagen Group',
    name2: 'Volkswagen Group',
    breadcrumb: 'Volkswagen Group',
    address: 'Yeomans Drive, Blakelands, MK14 5LR, Milton Keynes, United Kingdom',
    businessType: 'Company',
    ukRegion: 'South East',
    headquarterType: 'Not a headquarters',
    globalHq: 'Volkswagen AG',
    sector: 'Automotive',
    website: 'http://www.volkswagen.co.uk',
    businessDescription: 'Volkswagen UK, as part of the Volkswagen Group, is one of the country\'s largest importers of vehicles.',
    updated: '9 Aug 2018, 11:03am',
    meta: [
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Address',
        value: 'Yeomans Drive, Blakelands, MK14 5LR, Milton Keynes, United Kingdom',
      },
    ],
    badges: [
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'South East',
      },
    ],
  },
  {
    id: 2,
    name: 'Volkswagen Commercial Vehicles UK',
    name2: 'Volkswagen Commercial Vehicles UK',
    breadcrumb: 'Volkswagen Commercial Vehicles UK',
    address: 'Spring Hill Parkway, Spring Croft Road, Baillieston, Glasgow, G69 6GA, United Kingdom',
    businessType: 'Company',
    ukRegion: 'Scotland',
    headquarterType: 'Not a headquarters',
    globalHq: 'Volkswagen AG',
    sector: 'Automotive',
    updated: '9 Aug 2018, 11:03am',
    meta: [
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Address',
        value: 'Spring Hill Parkway, Spring Croft Road, Baillieston, Glasgow, G69 6GA, United Kingdom',
      },
    ],
    badges: [
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'Scotland',
      },
    ],
  },
  {
    id: 3,
    name: 'Volkswagen of America Inc',
    name2: 'Volkswagen of America Inc',
    breadcrumb: 'Volkswagen of America Inc',
    address: '2200 Ferdinand Porche Dr, Herndon, Virginia (state), 20171, United States',
    businessType: 'Company',
    headquarterType: 'Not a headquarters',
    globalHq: 'Volkswagen AG',
    sector: 'Automotive',
    updated: '9 Aug 2018, 11:03am',
    meta: [
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Address',
        value: '2200 Ferdinand Porche Dr, Herndon, Virginia (state), 20171, United States',
      },
    ],
    badges: [
      {
        label: 'Country',
        value: 'United States',
      },
    ],
  },
  {
    id: 4,
    name: 'Volkswagen Slovakia',
    name2: 'Volkswagen Slovakia',
    breadcrumb: 'Volkswagen Slovakia',
    address: 'J.jonasa 1, Bratislava, Slovakia, 84302, Slovakia',
    businessType: 'Company',
    headquarterType: 'Not a headquarters',
    globalHq: 'Volkswagen AG',
    sector: 'Automotive',
    updated: '9 Aug 2018, 11:03am',
    meta: [
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Address',
        value: 'J.jonasa 1, Bratislava, Slovakia, 84302, Slovakia',
      },
    ],
    badges: [
      {
        label: 'Country',
        value: 'Slovakia',
      },
    ],
  },
  {
    id: 5,
    name: 'Volkswagen Sarajevo',
    name2: 'Volkswagen Sarajevo',
    breadcrumb: 'Volkswagen Sarajevo',
    address: 'Igmanska 36, Sarajevo, 71320, Bosnia and Herzegovina',
    businessType: 'Company',
    headquarterType: 'Not a headquarters',
    globalHq: 'Volkswagen AG',
    sector: 'Automotive',
    updated: '9 Aug 2018, 11:03am',
    meta: [
      {
        label: 'Sector',
        value: 'Automotive',
      },
      {
        label: 'Address',
        value: 'Igmanska 36, Sarajevo, 71320, Bosnia and Herzegovina',
      },
    ],
    badges: [
      {
        label: 'Country',
        value: 'Bosnia and Herzegovina',
      },
    ],
  },
]


new Vue({
  el: '#blah',
  data: {
    contacts,
    subsidiaries,
    options: [],
    addresses: [
      {
        id: '1',
        line1: 'One Delaware Drive',
        line2: 'Tongwell',
        townOrCity: 'Milton Keynes',
        county: '',
        postcode: 'MK15 8HG',
        display: 'One Delaware Drive, Tongwell, Milton Keynes, MK15 8HG, United Kingdom',
      },
      {
        id: '2',
        line1: 'Two Delaware Drive',
        line2: 'Tongwell',
        townOrCity: 'Milton Keynes',
        county: '',
        postcode: 'MK15 8HG',
        display: 'Two Delaware Drive, Tongwell, Milton Keynes, MK15 8HG, United Kingdom',
      },
      {
        id: '3',
        line1: 'Three Delaware Drive',
        line2: 'Tongwell',
        townOrCity: 'Milton Keynes',
        county: '',
        postcode: 'MK15 8HG',
        display: 'Three Delaware Drive, Tongwell, Milton Keynes, MK15 8HG, United Kingdom',
      },
    ],
  },
  methods: {
    getEntity() {
      const entity = {}
      _.forEach(_.keys(this.$refs), (k) => { // todo
        entity[k] = _.get(this.$refs, `${k}.value`)
      })

      return entity
    },

    addToCollection () {
      const key = getQueryParam('key')
      const entity = this.refreshEntity(key, this.getEntity())
      const collectionName = entity['collection-name']
      const collection = this.getCollection(collectionName)
      collection.items.push(entity)

      this.setState(collectionName, collection)

      window.location.href = `${entity['next-page']}?success=${entity['success-message']}&id=${getQueryParam('id')}`
    },

    moveToNextStep (nextPage) {
      const key = getQueryParam('key')
      const entity = this.getEntity()

      this.setState(key, this.refreshEntity(key, entity))

      window.location.href = `${nextPage}?key=${key}&id=${getQueryParam('id')}`
    },

    setState (name, o) {
      localStorage.setItem(name, JSON.stringify(o))
    },

    getCollection (name) {
      return JSON.parse(localStorage.getItem(name)) || { items: [], count: 0 }
    },

    getCollectionCount (name) {
      return this.getCollection(name).items.length + (name === 'locations' ? 1 : 0)
    },

    refreshEntity (key, entity) {
      const stale = JSON.parse(localStorage.getItem(key))
      return {
        ...stale,
        ...entity,
      }
    },

    getTransformedCollection (name, transform) {
      return transform(this.getCollection(name).items)
    },

    populateDropdown (options) {
      this.options = options
    },

    setAddressFields (event) {
      const id = event.target.value
      const address = _.find(this.addresses, { id })
      document.getElementById('address-1').value = address.line1
      document.getElementById('address-2').value = address.line2
      document.getElementById('town-or-city').value = address.townOrCity
      document.getElementById('county').value = address.county
      document.getElementById('postcode').value = address.postcode
    },

    setHidden (id, value) {
      document.getElementById('type-of-location').value = value
    },

    transformLocationsToView (locations) {
      const mapped = _.map(locations, (location) => {
        return {
          id: 1,
          name: location['type-of-location'],
          meta: [
            {
              label: 'Address',
              value: `${location['address-1']}, ${location['address-2']}, ${location['town-or-city']}, ${location['postcode']}, United Kingdom`,
            },
            {
              label: 'Description',
              value: location['description'],
            },
          ],
          badges: [
            {
              label: 'UK region',
              value: location['region'] || 'todo',
            },
          ],
        }
      })

      return _.concat([ defaultLocation ], mapped)
    },

    appendKey (href) {
      return `${href}?key=${uuid()}`
    },

    appendQueryParam (href) {
      return `${href}&id=${getQueryParam('id')}`
    },

    getUniqueLocations() {
      return _.uniq(_.map(contacts, (contact) => {
        return _.find(contact.meta, (item) => {
          return item.label === 'Location'
        }).value
      }))
    },

    getCount(name) {
      return this[name].length
    },

    filterContacts(event) {
      const location = event.target.value

      if (location === 'All locations') {
        this.contacts = contacts
      } else {
        this.contacts = _.filter(contacts, (contact) => {
          return _.some(contact.meta, (item) => {
            return item.label === 'Location' && item.value === location
          })
        })
      }
    },

    setDataFields(name, fields) {
      const id = parseInt(getQueryParam('id'))
      const entity = _.find(this[name], { id })
      fields.forEach((field) => {
        document.getElementById(field).innerHTML = entity[field]
      })
    },

    getTableDataFields(name, fields) {
      const id = parseInt(getQueryParam('id'))
      const entity = _.find(this[name], { id })
      return _.map(fields, (field) => {
        return {
          ...field,
          value: entity[field.key],
        }
      })
    }
  }
})
