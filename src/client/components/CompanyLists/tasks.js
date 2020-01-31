import { get, pick } from 'lodash'
import axios from 'axios'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const fetchCompanyLists = () =>
  axios
    .get('/api-proxy/v4/company-list')
    .catch(handleError)
    .then((res) =>
      res.data.results.reduce(
        (acc, { id, name }) => ({
          ...acc,
          [id]: name,
        }),
        {}
      )
    )

export const fetchCompanyList = (id) =>
  axios
    .get(`/api-proxy/v4/company-list/${id}/item`)
    .catch(handleError)
    .then((res) =>
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
