import CardUtils from '../card/CardUtils'

const maxemailCampaign = {
  'dit:application': 'maxemail',
  id: 'dit:maxemail:Campaign:1:Create',
  object: {
    contacts: [
      {
        id: '236f8b6c-afac-4fba-a8eb-5739aa14823a',
        title: null,
        first_name: 'Max',
        last_name: 'Weight',
      },
    ],
    type: 'dit:maxemail:Campaign',
  },
}

const maxemailContact = {
  'dit:application': 'maxemail',
  id: 'dit:maxemail:Campaign:1:Create',
  object: {
    type: ['dit:maxemail:Email', 'dit:maxemail:Email:Sent'],
  },
  'dit:emailAddress': 'max.speed@example.com',
}

describe('Maxemail tests', () => {
  describe('Maxemail campaigns content checker', () => {
    it('should return 1 when there is 1 contact', () => {
      const actual = CardUtils.hasMaxemailContent(maxemailCampaign)
      expect(actual).to.equal(1)
    })
    it('should return 0 when there is 0 contacts', () => {
      maxemailCampaign['object.contacts'] = []
      const actual = CardUtils.hasMaxemailContent(maxemailCampaign)
      expect(actual).to.equal(0)
    })
  })
  describe('Maxemail contact checker', () => {
    it('should return true when there is an email address', () => {
      const actual = CardUtils.hasMaxemailContent(maxemailContact)
      expect(actual && true).to.equal(true)
    })
    it('should return false when there is no email address', () => {
      maxemailContact['object.type'] = 'dit:maxemail:Email:Sent'
      const actual = CardUtils.hasMaxemailContent(maxemailContact)
      expect(actual && true).to.equal(true)
    })
    it('should return false when there is no email address', () => {
      maxemailContact['dit:emailAddress'] = ''
      const actual = CardUtils.hasMaxemailContent(maxemailContact)
      expect(actual && true).to.equal(0)
    })
    it('should return false when the type does not match', () => {
      maxemailContact['object.type'] = 'dit:Interaction'
      const actual = CardUtils.hasMaxemailContent(maxemailContact)
      expect(actual && true).to.equal(false)
    })
  })
})
