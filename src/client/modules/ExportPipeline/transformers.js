const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({ company, id, title, owner }) => ({
  company,
  id,
  title,
  owner: owner.value,
})

export const transformAPIValuesForForm = ({ company, id, title, owner }) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
})
