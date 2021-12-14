import axios from 'axios'

const NOT_FOUND_MESSAGE =
  'The list you are trying to edit was not found. It may have already been deleted.'

export const editCompanyList = ({ listName, id, csrfToken }) =>
  axios({
    method: 'PATCH',
    url: `/company-lists/${id}/rename?_csrf=${csrfToken}`,
    data: { name: listName, id },
  })
    .catch(({ message, response: { status } }) =>
      Promise.reject(status === 404 ? NOT_FOUND_MESSAGE : message)
    )
    .then((response) => response.data)

export const createList = ({ csrfToken, id, values }) => {
  const postUrl = `/companies/${id}/lists/create?_csrf=${csrfToken}`
  return axios
    .post(postUrl, { name: values.listName })
    .catch((e) => Promise.reject(e.message))
    .then((response) => response.data)
}
