const faker = require('faker')
const proxyquire = require('proxyquire')

const modulePath = '../urls'

describe('urls', () => {
  let urls
  before(() => {
    urls = proxyquire(modulePath, {
      '../config': {
        greatProfileUrl: 'http://a.b.c.com/path/{id}',
      },
    })
  })

  describe('external', () => {
    it('should have the correct urls', () => {
      const companyNumber = faker.random.alphaNumeric(8)
      expect(urls.external.greatProfile(companyNumber)).to.equal(`http://a.b.c.com/path/${companyNumber}`)

      expect(urls.external.companiesHouse(companyNumber)).to.equal(`https://beta.companieshouse.gov.uk/company/${companyNumber}`)
    })
  })

  describe('dashboard', () => {
    it('should return the correct value', () => {
      expect(urls.dashboard()).to.equal('/')
      expect(urls.dashboard.mountPoint).to.equal('/')
      expect(urls.dashboard.route).to.equal('/')
    })
  })

  describe('companies', () => {
    let companyId
    beforeEach(() => {
      companyId = faker.random.uuid()
    })
    it('should return the correct values', () => {
      expect(urls.companies.index.mountPoint).to.equal('/companies')
      expect(urls.companies.index.route).to.equal('/')
      expect(urls.companies.index()).to.equal('/companies')

      expect(urls.companies.detail.route).to.equal('/:companyId')
      expect(urls.companies.detail(companyId)).to.equal(`/companies/${companyId}`)

      expect(urls.companies.edit(companyId)).to.equal(`/companies/${companyId}/edit`)
      expect(urls.companies.edit.route).to.equal('/:companyId/edit')

      expect(urls.companies.archive(companyId)).to.equal(`/companies/${companyId}/archive`)
      expect(urls.companies.archive.route).to.equal('/:companyId/archive')
      expect(urls.companies.unarchive(companyId)).to.equal(`/companies/${companyId}/unarchive`)
      expect(urls.companies.unarchive.route).to.equal('/:companyId/unarchive')

      expect(urls.companies.businessDetails(companyId)).to.equal(`/companies/${companyId}/business-details`)
      expect(urls.companies.businessDetails.route).to.equal('/:companyId/business-details')

      expect(urls.companies.businessDetails2(companyId)).to.equal(`/companies/${companyId}/business-details2`)
      expect(urls.companies.businessDetails2.route).to.equal('/:companyId/business-details2')

      expect(urls.companies.activity.index(companyId)).to.equal(`/companies/${companyId}/activity`)
      expect(urls.companies.activity.index.route).to.equal('/:companyId/activity')

      expect(urls.companies.activity.data(companyId)).to.equal(`/companies/${companyId}/activity/data`)
      expect(urls.companies.activity.data.route).to.equal('/:companyId/activity/data')

      expect(urls.companies.advisers.index(companyId)).to.equal(`/companies/${companyId}/advisers`)
      expect(urls.companies.advisers.index.route).to.equal('/:companyId/advisers')

      expect(urls.companies.advisers.confirm(companyId)).to.equal(`/companies/${companyId}/advisers/add`)
      expect(urls.companies.advisers.confirm.route).to.equal('/:companyId/advisers/add')

      expect(urls.companies.advisers.remove(companyId)).to.equal(`/companies/${companyId}/advisers/remove`)
      expect(urls.companies.advisers.replace(companyId)).to.equal(`/companies/${companyId}/advisers/replace`)

      expect(urls.companies.advisers.remove(companyId)).to.equal(`/companies/${companyId}/advisers/remove`)
      expect(urls.companies.advisers.remove.route).to.equal('/:companyId/advisers/remove')

      expect(urls.companies.exports(companyId)).to.equal(`/companies/${companyId}/exports`)
      expect(urls.companies.exports.route).to.equal('/:companyId/exports')

      expect(urls.companies.subsidiaries.index(companyId)).to.equal(`/companies/${companyId}/subsidiaries`)
      expect(urls.companies.subsidiaries.index.route).to.equal('/:companyId/subsidiaries')

      expect(urls.companies.subsidiaries.link(companyId)).to.equal(`/companies/${companyId}/subsidiaries/link`)
      expect(urls.companies.subsidiaries.link.route).to.equal('/:companyId/subsidiaries/link')

      expect(urls.companies.investments.largeCapitalProfile(companyId)).to.equal(`/companies/${companyId}/investments/large-capital-profile`)

      const globalHqId = faker.random.uuid()
      expect(urls.companies.hierarchies.ghq.add(companyId, globalHqId)).to.equal(`/companies/${companyId}/hierarchies/ghq/${globalHqId}/add`)
      expect(urls.companies.hierarchies.ghq.add.route).to.equal('/:companyId/hierarchies/ghq/:globalHqId/add')
      expect(urls.companies.hierarchies.ghq.link(companyId)).to.equal(`/companies/${companyId}/hierarchies/ghq/search`)
      expect(urls.companies.hierarchies.ghq.link.route).to.equal('/:companyId/hierarchies/ghq/search')
      expect(urls.companies.hierarchies.ghq.remove(companyId)).to.equal(`/companies/${companyId}/hierarchies/ghq/remove`)
      expect(urls.companies.hierarchies.ghq.remove.route).to.equal('/:companyId/hierarchies/ghq/remove')

      const interactionId = faker.random.uuid()
      expect(urls.companies.interactions.create.route).to.equal(`/interactions/:interactionId?/create`)
      expect(urls.companies.interactions.create(companyId)).to.equal(`/companies/${companyId}/interactions/create`)
      expect(urls.companies.interactions.create(companyId, interactionId)).to.equal(`/companies/${companyId}/interactions/${interactionId}/create`)

      expect(urls.companies.orders(companyId)).to.equal(`/companies/${companyId}/orders`)
      expect(urls.companies.orders.route).to.equal('/:companyId/orders')
    })
  })

  describe('contacts', () => {
    it('should return the correct values', () => {
      expect(urls.contacts.index.mountPoint).to.equal('/contacts')
      expect(urls.contacts.index.route).to.equal('/')
      expect(urls.contacts.index()).to.equal('/contacts')

      const contactId = faker.random.uuid()
      expect(urls.contacts.interactions.create(contactId)).to.equal(`/contacts/${contactId}/interactions/create`)
      expect(urls.contacts.interactions.create.route).to.equal('/interactions/:interactionId?/create')
    })
  })

  describe('search', () => {
    it('should return the correct values', () => {
      expect(urls.search.index.mountPoint).to.equal('/search')
      expect(urls.search.index.route).to.equal('/')
      expect(urls.search.index()).to.equal('/search')

      const type = faker.lorem.word()
      expect(urls.search.type.route).to.equal('/:searchPath?')
      expect(urls.search.type(type)).to.equal(`/search/${type}`)
    })
  })

  describe('support', () => {
    it('should return the correct values', () => {
      expect(urls.support()).to.equal('/support')
      expect(urls.support.route).to.equal('/')
    })
  })

  describe('interactions', () => {
    describe('subapp', () => {
      it('should return the correct values', () => {
        expect(urls.interactions.subapp.create.mountPoint).to.equal(null)
        expect(urls.interactions.subapp.create.route).to.equal('/interactions/:interactionId?/create')
      })
    })
  })
})
