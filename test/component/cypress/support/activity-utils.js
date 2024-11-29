// Builder function for interaction adviser and contact fields
export const buildPersonMetadata = (noOfPeople, p1, p2) => {
  const noPeople = []

  if (noOfPeople === 1) {
    return noPeople.concat(p1)
  }

  if (noOfPeople === 2) {
    return noPeople.concat(p1, p2)
  }

  return noPeople
}

export const checkName = (item) =>
  item
    ? {
        name: item,
      }
    : item
