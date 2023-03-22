const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({ id, title, owner }) => ({
  id,
  title,
  owner: {
    id: owner.value,
  },
})

export const transformAPIValuesForForm = ({ id, title, owner }) => ({
  id,
  title,
  owner: mapApiToField(owner),
})
