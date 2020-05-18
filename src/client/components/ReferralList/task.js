import axios from 'axios'

import { SENT, RECEIVED } from './constants'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const convertAdviser = ({ name, contact_email, dit_team }) => ({
  name,
  email: contact_email,
  team: dit_team?.name,
})

export default () =>
  Promise.all([
    axios.get('/api-proxy/v4/company-referral'),
    axios.get('/api-proxy/whoami/'),
  ])
    .catch(handleError)
    .then(([{ data: { results } }, { data: { id } }]) =>
      results.map((referral) => ({
        companyId: referral.company.id,
        id: referral.id,
        subject: referral.subject,
        companyName: referral.company.name,
        date: referral.created_on,
        dateAccepted: referral.completed_on,
        sender: convertAdviser(referral.created_by),
        recipient: convertAdviser(referral.recipient),
        direction: referral.created_by.id === id ? SENT : RECEIVED,
      }))
    )
