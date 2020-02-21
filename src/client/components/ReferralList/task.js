import { apiProxyAxios } from '../../components/Task/utils'
import { SENT, RECEIVED } from './constants'

const convertAdviser = ({ name, contact_email, dit_team }) => ({
  name,
  email: contact_email,
  team: dit_team?.name,
})

export default () =>
  Promise.all([
    apiProxyAxios.get('v4/company-referral'),
    apiProxyAxios.get('whoami/'),
  ]).then(([{ data: { results } }, { data: { id } }]) =>
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
