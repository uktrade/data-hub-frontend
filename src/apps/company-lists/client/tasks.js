import axios from 'axios'

const NOT_FOUND_MESSAGE =
  'The list you are trying to edit was not found. It may have already been deleted.'

export const editCompanyList = ({ listName, id, csrfToken }) =>
  axios({
    method: 'PATCH',
    url: `/company-lists/${id}/rename?_csrf=${csrfToken}`,
    data: { name: listName, id },
  })
    .catch(() => Promise.reject(NOT_FOUND_MESSAGE))
    .then((response) => response.data)
