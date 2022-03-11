import axios from 'axios'

export const getAdviserNames = (adviser) => {
  if (!adviser) {
    return []
  }

  const advisers = Array.isArray(adviser) ? adviser : [adviser]

  return axios
    .all(advisers.map((adviser) => axios.get(`/adviser/${adviser}/`)))
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          advisers: data,
        }))
      )
    )
}
