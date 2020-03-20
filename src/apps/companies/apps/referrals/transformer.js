const transformReferralDetails = ({
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
    companyId: company.id,
    contact: contact && contact.name,
    sendingAdviser: {
      name: created_by.name,
      email: created_by.contact_email,
      team: created_by.dit_team && created_by.dit_team.name,
    },
    receivingAdviser: {
      name: recipient.name,
      email: recipient.contact_email,
      team: recipient.dit_team && recipient.dit_team.name,
    },
    date: created_on,
    notes,
  }
}

module.exports = transformReferralDetails
