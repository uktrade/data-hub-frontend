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
        value: 'London Office',
        postcode: 'N1 6NU',
      },
      {
        label: 'Sector',
        value: 'Creative and Media',
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
        value: 'emma.jones@email.com',
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
        value: 'London Office',
        postcode: 'N1 6NU',
      },
      {
        label: 'Sector',
        value: 'Creative and Media',
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
        value: 'sam.hobkinson@email.com',
      },
    ],
  },
  {
    name: 'Frank Gareth',
    updated: 'todo',
    meta: [
      {
        label: 'Job title',
        value: 'Managing Director',
      },
      {
        label: 'Location',
        value: 'Cambridge Office',
        postcode: 'CB1 8GL',
      },
      {
        label: 'Sector',
        value: 'Creative and Media',
      },
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'East of England',
      },
      {
        label: 'Phone number',
        value: '+44123456789',
      },
      {
        label: 'Email',
        value: 'frank.gareth@email.com',
      },
    ],
  },
]

const subsidiaries = [
  {
    id: 1,
    name: 'Siemens',
    name2: 'Siemens',
    breadcrumb: 'Siemens',
    address: '4 Highlands Court, Cranmore Avenue, Solihull, B90 4LE, United Kingdom',
    businessType: 'Company',
    ukRegion: 'West Midlands',
    headquarterType: 'Not a headquarters',
    globalHq: 'Siemens AG (Munich) (GLOBAL HQ)s',
    sector: 'Energy',
    updated: '9 Aug 2018, 11:03am',
    meta: [
      {
        label: 'Sector',
        value: 'Energy',
      },
      {
        label: 'Primary address',
        value: '4 Highlands Court, Cranmore Avenue, Solihull, B90 4LE, United Kingdom',
      },
    ],
    badges: [
      {
        label: 'Country',
        value: 'United Kingdom',
      },
      {
        label: 'UK region',
        value: 'West Midlands',
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
        line1: '70 Crown Street',
        line2: 'Some place',
        townOrCity: 'London',
        county: 'Greater London',
        display: '70 Crown Street, Some place, London E1 3EZ',
      },
      {
        id: '2',
        line1: '19 Union Terrace',
        line2: 'Some place',
        townOrCity: 'London',
        county: 'Greater London',
        display: '19 Union Terrace, Some place, London WC1V 6UG',
      },
      {
        id: '2',
        line1: '74 Guild Street',
        line2: 'Some place',
        townOrCity: 'London',
        county: 'Greater London',
        display: '74 Guild Street, Some place, London E5 2WR',
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
      return this.getCollection(name).items.length
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
    },

    setHidden (id, value) {
      document.getElementById('type-of-location').value = value
    },

    transformLocationsToView (locations) {
      return _.map(locations, (location) => {
        return {
          id: 1,
          name: location['type-of-location'],
          meta: [
            {
              label: 'Address',
              value: `${location['address-1']}, ${location['address-2']}, ${location['town-or-city']}, ${location['county']}, United Kingdom`,
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
        })
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
