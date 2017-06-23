/* eslint handle-callback-err: 0, camelcase: 0 */

describe('interaction data service', function () {
  let interactionDataService
  let getContactStub
  let getDitCompanyStub
  let getInteractionStub
  let company
  let contact
  let dit_adviser
  let interaction_type
  let interaction
  const token = '9876'

  beforeEach(function () {
    company = { id: '1234', name: 'Fred ltd' }
    contact = { id: '3321', name: 'Fred Smith', first_name: 'Fred', last_name: 'Smith', company }
    dit_adviser = { id: '4455', name: 'Fred Jones', first_name: 'Fred', last_name: 'Jones' }
    interaction_type = { id: '1234', name: 'Email' }
    interaction = { id: '999', company: { id: company.id } }

    getContactStub = sinon.stub().resolves(contact)
    getDitCompanyStub = sinon.stub().resolves(company)
    getInteractionStub = sinon.stub().resolves(interaction)

    interactionDataService = proxyquire('~/src/services/interaction-data.service', {
      '../repos/company.repo': {
        getDitCompany: getDitCompanyStub,
      },
      '../apps/contacts/contact.repo': {
        getContact: getContactStub,
      },
      '../repos/interaction.repo': {
        getInteraction: getInteractionStub,
      },
      '../repos/metadata.repo': {
        interactionTypeOptions: [interaction_type],
      },
    })
  })

  describe('get hydrated interaction', function () {
    it('should get an interaction and hydrating it by adding the company', function () {
      interactionDataService.getHydratedInteraction(token, '1234')
      .then((resultInteraction) => {
        expect(resultInteraction).to.not.be.null
        expect(getInteractionStub).to.be.calledWith(token, '1234')
        expect(getDitCompanyStub).to.be.calledWith(token, interaction.company.id)
        expect(resultInteraction.company.name).to.equal(company.name)
      })
    })
    it('should throw an error if fetching something fails', function (done) {
      getInteractionStub = sinon.stub().rejects(new Error('error'))

      interactionDataService = proxyquire('~/src/services/interaction-data.service', {
        '../repos/company.repo': {
          getDitCompany: getDitCompanyStub,
        },
        '../apps/contacts/contact.repo': {
          getContact: getContactStub,
        },
        '../repos/interaction.repo': {
          getInteraction: getInteractionStub,
        },
        '../repos/metadata.repo': {
          interactionTypeOptions: [interaction_type],
        },
      })
      interactionDataService.getHydratedInteraction(token, '1234')
      .catch(() => {
        done()
      })
    })
  })
  describe('get interaction type', function () {
    it('should return interaction type details for a given id', function () {
      expect(interactionDataService.getInteractionType('1234')).to.deep.equal(interaction_type)
    })
    it('should return null if passed a null id', function () {
      expect(interactionDataService.getInteractionType()).to.be.null
    })
    it('should return null if the interaction type is invalid', function () {
      expect(interactionDataService.getInteractionType('888')).to.be.null
    })
  })
  describe('Create blank interaction for contact', function () {
    it('should return a valid blank interaction with contact and company populated', function () {
      return interactionDataService.createBlankInteractionForContact(token, dit_adviser, interaction_type.id, contact.id)
      .then((interaction) => {
        expect(interaction).to.not.be.null
        expect(interaction).to.not.have.property('id')
        expect(interaction.contact).to.deep.equal(contact)
        expect(interaction.company).to.deep.equal(company)
        expect(interaction.interaction_type).to.deep.equal(interaction_type)
        expect(interaction.dit_adviser).to.deep.equal(dit_adviser)
        expect(interaction).to.have.property('date')
        expect(interaction.service).to.deep.equal({ id: null, name: null })
        expect(interaction.dit_team).to.deep.equal({ id: null, name: null })
        expect
      })
    })
    it('should throw an error for a null contact', function (done) {
      interactionDataService.createBlankInteractionForContact(token, dit_adviser, interaction_type.id, null)
      .catch((error) => {
        done()
      })
    })
    it('should throw an error if something goes wrong', function (done) {
      getContactStub = sinon.stub().rejects(new Error('error'))

      interactionDataService = proxyquire('~/src/services/interaction-data.service', {
        '../repos/company.repo': {
          getDitCompany: getDitCompanyStub,
        },
        '../apps/contacts/contact.repo': {
          getContact: getContactStub,
        },
        '../repos/interaction.repo': {
          getInteraction: getInteractionStub,
        },
        '../repos/metadata.repo': {
          interactionTypeOptions: [interaction_type],
        },
      })

      interactionDataService.createBlankInteractionForContact(token, dit_adviser, interaction_type.id, 'YYY')
      .catch((error) => {
        done()
      })
    })
    it('should throw null for a contact with an invalid company', function (done) {
      getContactStub = sinon.stub().rejects(new Error('error'))

      interactionDataService = proxyquire('~/src/services/interaction-data.service', {
        '../repos/company.repo': {
          getDitCompany: getDitCompanyStub,
        },
        '../apps/contacts/contact.repo': {
          getContact: getContactStub,
        },
        '../repos/interaction.repo': {
          getInteraction: getInteractionStub,
        },
        '../repos/metadata.repo': {
          interactionTypeOptions: [interaction_type],
        },
      })
      interactionDataService.createBlankInteractionForContact(token, dit_adviser, interaction_type.id, 'YYY')
      .catch((error) => {
        done()
      })
    })
  })
  describe('create blank interaction for company', function () {
    it('should return a valid blank interaction with company populated', function () {
      return interactionDataService.createBlankInteractionForCompany(token, dit_adviser, interaction_type.id, company.id)
      .then((interaction) => {
        expect(interaction).to.not.be.null
        expect(interaction).to.not.have.property('id')
        expect(interaction.contact).to.be.null
        expect(interaction.company).to.deep.equal(company)
        expect(interaction.interaction_type).to.deep.equal(interaction_type)
        expect(interaction.dit_adviser).to.deep.equal(dit_adviser)
        expect(interaction).to.have.property('date')
        expect(interaction.service).to.deep.equal({ id: null, name: null })
        expect(interaction.dit_team).to.deep.equal({ id: null, name: null })
        expect
      })
    })
    it('should throw an error for a null company', function (done) {
      interactionDataService.createBlankInteractionForCompany(token, dit_adviser, interaction_type.id, null)
      .catch((error) => {
        done()
      })
    })
    it('should throw an error if something goes wrong', function (done) {
      getDitCompanyStub = sinon.stub().rejects(new Error('error'))

      interactionDataService = proxyquire('~/src/services/interaction-data.service', {
        '../repos/company.repo': {
          getDitCompany: getDitCompanyStub,
        },
        '../apps/contacts/contact.repo': {
          getContact: getContactStub,
        },
        '../repos/interaction.repo': {
          getInteraction: getInteractionStub,
        },
        '../repos/metadata.repo': {
          interactionTypeOptions: [interaction_type],
        },
      })
      interactionDataService.createBlankInteractionForCompany(token, dit_adviser, interaction_type.id, 'YYY')
      .catch((error) => {
        done()
      })
    })
  })
})
