import { apiProxyAxios } from '../../../components/Task/utils'

export const archiveContact = ({ contactId, values }) => {
  const reason =
    values.archived_reason !== 'Other'
      ? values.archived_reason
      : values.archived_reason_other
  const options = {
    data: { reason: reason },
    url: `/v3/contact/${contactId}/archive`,
    method: 'POST',
  }
  return apiProxyAxios(options)
}
