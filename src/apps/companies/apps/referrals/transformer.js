const transformAdviser = ({ name, contact_email, dit_team }) => ({
  name,
  email: contact_email,
  team: dit_team && dit_team.name,
})

const transformReferralDetails = ({
  subject,
  company,
  contact,
  created_by,
  recipient,
  created_on,
  notes,
  status,
  completed_on,
  completed_by,
  interaction,
}) => {
  return {
    subject,
    status,
    company,
    contact,
    sendingAdviser: transformAdviser(created_by),
    receivingAdviser: transformAdviser(recipient),
    date: created_on,
    interaction,
    completed: status === 'complete' && {
      on: completed_on,
      by: transformAdviser(completed_by),
    },
    notes,
  }
}

module.exports = transformReferralDetails
