const { get } = require('lodash')

const transformReferralDetails = ({
  id,
  subject,
  company,
  contact,
  created_by,
  recipient,
  created_on,
  notes,
}) => {
  return {
    subject,
    company: company.name,
    contact: contact.name,
    sendingAdviser: {
      name: created_by.name,
      email: get(created_by, 'contact_email'),
      team: get(created_by.dit_team, 'name'),
    },
    receivingAdviser: {
      name: recipient.name,
      email: get(recipient, 'contact_email'),
      team: get(recipient.dit_team, 'name'),
    },
    date: created_on,
    notes,
  }
}

module.exports = transformReferralDetails
