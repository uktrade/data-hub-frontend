import axios from 'axios'

import { createZenDeskMessage } from './utils'

export const submitSupportRequest = ({ values }) => {
  const ticket = createZenDeskMessage(values)
  return axios
    .post(
      values.zenVariables.ticketsURL,
      { ticket },
      {
        auth: {
          username: `${values.zenVariables.email}/token`,
          password: values.zenVariables.token,
        },
      }
    )
    .catch((e) => Promise.reject(e.message))
    .then((response) => response.data)
}
