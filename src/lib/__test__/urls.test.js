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

      expect(urls.companies.activity.data(companyId)).to.equal(`/companies/${companyId}/activity/data`)
      expect(urls.companies.activity.index(companyId)).to.equal(`/companies/${companyId}/activity`)

      expect(urls.companies.advisers.index(companyId)).to.equal(`/companies/${companyId}/advisers`)

      expect(urls.companies.advisers.confirm(companyId)).to.equal(`/companies/${companyId}/advisers/add`)
      expect(urls.companies.advisers.replace(companyId)).to.equal(`/companies/${companyId}/advisers/replace`)

      expect(urls.companies.dnbSubsidiaries.index.route).to.equal('/:companyId/dnb-subsidiaries')
      expect(urls.companies.dnbSubsidiaries.index(companyId)).to.equal(`/companies/${companyId}/dnb-subsidiaries`)

      expect(urls.companies.dnbSubsidiaries.data.route).to.equal('/:companyId/dnb-subsidiaries/data')
      expect(urls.companies.dnbSubsidiaries.data(companyId)).to.equal(`/companies/${companyId}/dnb-subsidiaries/data`)

      expect(urls.companies.exports.route).to.equal('/:companyId/exports')
      expect(urls.companies.exports(companyId)).to.equal(`/companies/${companyId}/exports`)

      expect(urls.companies.subsidiaries(companyId)).to.equal(`/companies/${companyId}/subsidiaries`)

      const globalHqId = faker.random.uuid()
      expect(urls.companies.hierarchies.ghq.add.route).to.equal('/:companyId/hierarchies/ghq/:globalHqId/add')
      expect(urls.companies.hierarchies.ghq.add(companyId, globalHqId)).to.equal(`/companies/${companyId}/hierarchies/ghq/${globalHqId}/add`)

      const interactionId = faker.random.uuid()
      expect(urls.companies.interactions.create.route).to.equal(`/interactions/:interactionId?/create`)
      expect(urls.companies.interactions.create(companyId)).to.equal(`/companies/${companyId}/interactions/create`)
      expect(urls.companies.interactions.create(companyId, interactionId)).to.equal(`/companies/${companyId}/interactions/${interactionId}/create`)

      expect(urls.companies.orders(companyId)).to.equal(`/companies/${companyId}/orders`)
    })
  })

  describe('contacts', () => {
    it('should return the correct values', () => {
      expect(urls.contacts.index.mountPoint).to.equal('/contacts')
      expect(urls.contacts.index.route).to.equal('/')
      expect(urls.contacts.index()).to.equal('/contacts')

      const contactId = faker.random.uuid()
      expect(urls.contacts.interactions.create(contactId)).to.equal(`/contacts/${contactId}/interactions/create`)
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

  describe('interactions', () => {
    describe('subapp', () => {
      it('should return the correct values', () => {
        expect(urls.interactions.subapp.create.mountPoint).to.equal(null)
        expect(urls.interactions.subapp.create.route).to.equal('/interactions/:interactionId?/create')
      })
    })
  })
})
