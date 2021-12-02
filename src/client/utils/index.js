export const idNameToValueLabel = ({ id, name }) => ({
  value: id,
  label: name,
})

export const idNamesToValueLabels = (idNames) => idNames.map(idNameToValueLabel)
