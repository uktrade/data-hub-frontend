/* globals expect: true, describe: true, it: true, beforeEach: true */
/* eslint handle-callback-err: 0, camelcase: 0 */
const stubs = require('../stubs')
const proxyquire = require('proxyquire')

describe('interaction form service', function () {
  let saveInteractionStub
  let company
  let contact
  let dit_advisor
  let interaction_type
  let interaction
  let service
  let dit_team
  const token = '9876'
  let interactionFormService

  beforeEach(function () {
    company = { id: '1234', name: 'Fred ltd' }
    contact = { id: '3321', name: 'Fred Smith', first_name: 'Fred', last_name: 'Smith', company }
    dit_advisor = { id: '4455', name: 'Fred Jones', first_name: 'Fred', last_name: 'Jones' }
    interaction_type = { id: '1234', name: 'Email' }
    service = { id: '6654', name: 'Significant Assist' }
    dit_team = { id: '90934', name: 'North East' }
    interaction = {
      id: '999',
      company,
      contact,
      interaction_type,
      subject: 'Test subject',
      notes: 'Test notes',
      interaction_date: '2017-01-02:T00:00:00.00Z',
      dit_advisor,
      service,
      dit_team
    }

    saveInteractionStub = stubs.saveStub()

    interactionFormService = proxyquire('../../src/services/interactionformservice', {
      '../repositorys/interactionrepository': {
        save: saveInteractionStub
      }
    })
  })

  describe('Convert API to Form', function () {
    it('should an existing API format interaction entity into a format for use with a HTML form', function () {
      const expected = {
        id: '999',
        company: company.id,
        contact: contact.id,
        interaction_type: interaction_type.id,
        subject: 'Test subject',
        notes: 'Test notes',
        interaction_date: '2017-01-02:T00:00:00.00Z',
        dit_advisor: dit_advisor.id,
        service: service.id,
        dit_team: dit_team.id
      }
      expect(interactionFormService.getInteractionAsFormData(interaction)).to.deep.equal(expected)
    })
    it('should handle new blank interactions being editing for the first time', function () {
      const freshInteraction = {
        company,
        contact: null,
        interaction_type: interaction_type,
        dit_advisor,
        interaction_date: '2017-01-02:T00:00:00.00Z',
        service: {
          id: null,
          name: null
        },
        dit_team: {
          id: null,
          name: null
        }
      }
      const expected = {
        id: null,
        company: company.id,
        contact: null,
        interaction_type: interaction_type.id,
        subject: null,
        notes: null,
        interaction_date: '2017-01-02:T00:00:00.00Z',
        dit_advisor: dit_advisor.id,
        service: null,
        dit_team: null
      }
      expect(interactionFormService.getInteractionAsFormData(freshInteraction)).to.deep.equal(expected)
    })
  })
  describe('Save interaction form format to the API', function () {
    let interactionForm
    beforeEach(function () {
      interactionForm = {
        id: '999',
        company: company.id,
        contact: contact.id,
        interaction_type: interaction_type.id,
        subject: 'Test subject',
        notes: 'Test notes',
        interaction_date_year: '2017',
        interaction_date_month: '2',
        interaction_date_day: '12',
        dit_advisor: dit_advisor.id,
        service: service.id,
        dit_team: dit_team.id
      }
    })

    it('should handle saving a simple form with no problems', function () {
      return interactionFormService.saveInteractionForm(token, interactionForm)
      .then((savedInteraction) => {
        expect(saveInteractionStub).to.have.been.called
      })
    })
    it('should clear fields that are empty strings', function () {
      interactionForm.subject = ''
      return interactionFormService.saveInteractionForm(token, interactionForm)
      .then((savedInteraction) => {
        expect(saveInteractionStub.firstCall.args[1].subject).to.be.null
      })
    })
    it('convert the date from seperate fields into a single date field', function () {
      return interactionFormService.saveInteractionForm(token, interactionForm)
      .then((savedInteraction) => {
        expect(saveInteractionStub.firstCall.args[1].interaction_date).to.equal('2017-2-12T00:00:00.00Z')
      })
    })
    it('should pass back any failures', function (done) {
      interactionForm.id = 'YYY'
      interactionFormService.saveInteractionForm(token, interactionForm)
      .catch(() => {
        done()
      })
    })
  })
})
