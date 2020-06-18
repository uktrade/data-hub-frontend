// gets new contact from query params
// can be removed after new contact form moves to React/Redux

const getContactFromQuery = () => {
  let queryParams = new URL(window.location).searchParams
  return {
    label: queryParams.get('new-contact-name'),
    value: queryParams.get('new-contact-id'),
  }
}

export default getContactFromQuery
