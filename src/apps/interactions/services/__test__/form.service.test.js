/* eslint handle-callback-err: 0, camelcase: 0 */

const proxyquire = require('proxyquire')

describe('interaction form service', () => {
  let saveInteractionStub
  let company
  let contact
  let communication_channel
  let interaction
  let interactionFormService

  beforeEach(() => {
    company = { id: '1234', name: 'Fred ltd' }
    contact = {
      id: '3321',
      name: 'Fred Smith',
      first_name: 'Fred',
      last_name: 'Smith',
      company,
    }
    communication_channel = { id: '1234', name: 'Email' }
    interaction = {
      id: '999',
      company,
      contact,
      communication_channel,
      subject: 'Test subject',
      notes: 'Test notes',
      date: '2017-01-02:T00:00:00.00Z',
    }

    saveInteractionStub = sinon.stub().resolves({
      id: '1234',
      subject: 'subject',
      company: company.id,
      contact: contact.id,
    })

    interactionFormService = proxyquire('../form', {
      '../repos': {
        saveInteraction: saveInteractionStub,
      },
    })
  })

  describe('Convert API to Form', () => {
    it('should an existing API format interaction entity into a format for use with a HTML form', () => {
      const expected = {
        id: '999',
        company: company.id,
        contact: contact.id,
        communication_channel: communication_channel.id,
        subject: 'Test subject',
        notes: 'Test notes',
        date: '2017-01-02:T00:00:00.00Z',
      }
      expect(
        interactionFormService.getInteractionAsFormData(interaction)
      ).to.deep.equal(expected)
    })
    it('should handle new blank interactions being editing for the first time', () => {
      const freshInteraction = {
        company,
        contact: null,
        communication_channel: communication_channel,
        date: '2017-01-02:T00:00:00.00Z',
      }
      const expected = {
        id: null,
        company: company.id,
        contact: null,
        communication_channel: communication_channel.id,
        subject: null,
        notes: null,
        date: '2017-01-02:T00:00:00.00Z',
      }
      expect(
        interactionFormService.getInteractionAsFormData(freshInteraction)
      ).to.deep.equal(expected)
    })
  })
})
