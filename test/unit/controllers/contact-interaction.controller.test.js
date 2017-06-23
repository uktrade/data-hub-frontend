const { render } = require('../nunjucks')
const contactDataService = require('~/src/apps/contacts/contact-data.service')
const interactionFormattingService = require('~/src/services/interaction-formatting.service')

const next = function (error) {
  throw Error(error)
}

describe('Contact interactions controller', function () {
  let interaction
  let formattedInteraction
  let contactInteractionController
  let contact

  beforeEach(function () {
    contactInteractionController = require('~/src/apps/contacts/contact-interaction.controller')
    contact = require('../data/simple-contact')
    interaction = require('../data/simple-interaction')
    formattedInteraction = require('../data/formatted-contact-interaction')

    contactDataService.getContactInteractionsAndServiceDeliveries = sinon.stub().resolves([interaction])
    interactionFormattingService.getDisplayContactInteraction = sinon.stub().resolves(formattedInteraction)
  })

  describe('data', function () {
    it('should get interactions and service deliveries for a contact', function (done) {
      const req = {
        session: { token: '1234' },
        params: { contactId: '1' },
      }
      const res = {
        locals: {
          contact,
          title: [],
        },
        render: function () {
          expect(contactDataService.getContactInteractionsAndServiceDeliveries).to.be.calledWith(req.session.token, req.params.contactId)
          done()
        },
      }
      contactInteractionController.getInteractions(req, res, next)
    })

    it('should format interactions for display', function (done) {
      const req = {
        session: { token: '1234' },
        params: { contactId: '1' },
      }
      const res = {
        locals: {
          contact,
          title: [],
        },
        render: function (template, options) {
          expect(interactionFormattingService.getDisplayContactInteraction).to.be.calledWith(interaction)
          done()
        },
      }
      contactInteractionController.getInteractions(req, res, next)
    })

    it('should return a list of interactions', function (done) {
      const req = {
        session: { token: '1234' },
        params: { contactId: '1' },
      }
      const res = {
        locals: {
          contact,
          title: [],
        },
        render: function (template, options) {
          expect(res.locals).to.have.property('interactions')
          expect(res.locals.interactions).to.have.length(1)
          done()
        },
      }
      contactInteractionController.getInteractions(req, res, next)
    })
  })

  describe('markup', function () {
    let interactions
    let addInteractionUrl

    beforeEach(function () {
      interactions = [formattedInteraction, formattedInteraction]
      addInteractionUrl = '/interaction/add?contact=1234'
    })

    it('should render a list of interactions', function () {
      return render('../../src/views/contact/interactions.njk', { interactions, addInteractionUrl, contact })
      .then((document) => {
        expect(document.getElementById('interaction-list')).to.not.be.null
      })
    })

    it('each line should include the required data', function () {
      return render('../../src/views/contact/interactions.njk', { interactions, addInteractionUrl, contact })
      .then((document) => {
        const interactionElement = document.querySelector('#interaction-list .card')
        expect(interactionElement.innerHTML).to.include('Email')
        expect(interactionElement.innerHTML).to.include('Subject 1234')
        expect(interactionElement.innerHTML).to.include('14 Feb 2017')
        expect(interactionElement.innerHTML).to.include('John Brown')
        expect(interactionElement.innerHTML).to.include('service name')
        expect(interactionElement.innerHTML).to.include('Here are some notes<br>line 2.')
        expect(interactionElement.innerHTML).to.include('team name')
      })
    })

    it('include a link to add a new interaction', function () {
      return render('../../src/views/contact/interactions.njk', { interactions, addInteractionUrl, contact })
      .then((document) => {
        const link = document.querySelector('a#add-interaction-link')
        expect(link.href).to.eq('/interaction/add?contact=1234')
      })
    })

    it('should not render interactions if there are none and warn user', function () {
      return render('../../src/views/contact/interactions.njk', { interactions: [], addInteractionUrl, contact })
      .then((document) => {
        expect(document.getElementById('interaction-list')).to.be.null
        expect(document.querySelector('#no-interaction-warning.infostrip').textContent).to.include('You currently have no interactions for this contact.')
      })
    })
  })
})
