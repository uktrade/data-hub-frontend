export const getTwelveMonthsAgo = () => {
  const today = new Date()
  return new Date(today.getFullYear() - 1, today.getMonth(), 1)
}
