export const transformArrayToObject = (array) => {
  return array?.length > 0
    ? array.reduce((previous, current) => ({ ...previous, ...current }))
    : {}
}
