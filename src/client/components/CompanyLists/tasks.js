import _ from 'lodash'
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
        ..._.pick(latest_interaction, ['date', 'subject']),
        interactionId: _.get(latest_interaction, 'id'),
        ditParticipants: _.get(latest_interaction, 'dit_participants', []).map(
          (x) => ({
            name: _.get(x, 'adviser.name'),
            team: _.get(x, 'team.name'),
          })
        ),
      }))
    )
