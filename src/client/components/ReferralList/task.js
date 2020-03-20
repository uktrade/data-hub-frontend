import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const convertAdviser = ({ name, contact_email, dit_team }) => ({
  name,
  email: contact_email,
  team: dit_team?.name,
})

export default () =>
  axios
    .get('/api-proxy/v4/company-referral')
    .catch(handleError)
    .then(({ data: { results } }) =>
      results.map((referral) => ({
        companyId: referral.company.id,
        id: referral.id,
        subject: referral.subject,
        companyName: referral.company.name,
        date: referral.created_on,
        dateAccepted: referral.completed_on,
        sender: convertAdviser(referral.created_by),
        recipient: convertAdviser(referral.recipient),
      }))
    )
