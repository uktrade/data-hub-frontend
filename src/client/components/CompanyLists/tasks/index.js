import { get, pick } from 'lodash'
import { apiProxyAxios } from '../../Task/utils'
import axios from 'axios'

export const fetchCompanyLists = () =>
  apiProxyAxios.get('v4/company-list').then((res) =>
    res.data.results.reduce(
      (acc, { id, name }) => ({
        ...acc,
        [id]: name,
      }),
      {}
    )
  )

export const fetchCompanyList = (id) =>
  apiProxyAxios.get(`v4/company-list/${id}/item`).then((res) =>
    res.data.results.map(({ company: { id, name }, latest_interaction }) => ({
      id,
      name,
      ...pick(latest_interaction, ['date', 'subject']),
      interactionId: get(latest_interaction, 'id'),
      ditParticipants: get(latest_interaction, 'dit_participants', []).map(
        (x) => ({
          name: get(x, 'adviser.name'),
          team: get(x, 'team.name'),
        })
      ),
    }))
  )

export const addOrRemoveFromList = ({ token, companyId, list }) =>
  axios({
    method: 'POST',
    url: `/companies/${companyId}/lists/add-remove?_csrf=${token}`,
    data: {
      list,
    },
  })
    .catch((error) => {
      if (get(error, 'response.status') === 404) {
        return Promise.reject('Request failed with status code 404')
      } else {
        return Promise.reject(error.message || error.toString())
      }
    })
    .then((response) => {
      response.data
    })
