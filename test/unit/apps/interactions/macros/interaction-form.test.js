const { find } = require('lodash')

const macros = require('~/src/apps/interactions/macros')

function getFormFieldOptions (form, fieldName) {
  const formFields = form.children

  const field = find(formFields, (field) => {
    return field.name === fieldName
  })

  return field.options || field.children[0].options
}

describe('Interaction macros', () => {
  describe('#interactionForm', () => {
    context('when called with interaction options', () => {
      beforeEach(() => {
        this.formParams = {
          returnLink: 'test',
          contacts: [],
          advisers: [],
          services: [],
          teams: [],
          channels: [],
          hiddenFields: [],
        }

        this.form = macros.interactionForm(this.formParams)
      })

      it('should return object with specified returnLink present', () => {
        expect(this.form).to.have.property('returnLink', this.formParams.returnLink)
      })

      it('should return object with specified hidden fields', () => {
        expect(this.form).to.have.property('hiddenFields', this.formParams.hiddenFields)
      })

      it('should return object with contact options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'contact')
        expect(fieldOptions).to.deep.equal(this.formParams.contacts)
      })

      it('should return object with provider options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'dit_team')
        expect(fieldOptions).to.deep.equal(this.formParams.teams)
      })

      it('should return object with service options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'service')
        expect(fieldOptions).to.deep.equal(this.formParams.services)
      })

      it('should return object with adviser options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'dit_adviser')
        expect(fieldOptions).to.deep.equal(this.formParams.advisers)
      })

      it('should return object with communication channel options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'communication_channel')
        expect(fieldOptions).to.deep.equal(this.formParams.channels)
      })
    })
  })

  describe('#serviceDeliveryForm', () => {
    context('when called with service delivery options', () => {
      beforeEach(() => {
        this.formParams = {
          returnLink: 'test',
          contacts: [],
          advisers: [],
          services: [],
          teams: [],
          events: [],
          hiddenFields: [],
        }

        this.form = macros.serviceDeliveryForm(this.formParams)
      })

      it('should return object with specified returnLink present', () => {
        expect(this.form).to.have.property('returnLink', this.formParams.returnLink)
      })

      it('should return object with specified hidden fields', () => {
        expect(this.form).to.have.property('hiddenFields', this.formParams.hiddenFields)
      })

      it('should return object with contact options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'contact')
        expect(fieldOptions).to.deep.equal(this.formParams.contacts)
      })

      it('should return object with provider options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'dit_team')
        expect(fieldOptions).to.deep.equal(this.formParams.teams)
      })

      it('should return object with service options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'service')
        expect(fieldOptions).to.deep.equal(this.formParams.services)
      })

      it('should return object with adviser options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'dit_adviser')
        expect(fieldOptions).to.deep.equal(this.formParams.advisers)
      })

      it('should return object with event options', () => {
        const fieldOptions = getFormFieldOptions(this.form, 'event')
        expect(fieldOptions).to.deep.equal(this.formParams.events)
      })
    })
  })
})
