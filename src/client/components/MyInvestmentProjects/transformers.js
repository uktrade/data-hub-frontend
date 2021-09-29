export const summaryToDataRange = ({ summary, adviser, status, landDate }) => {
  let queryString = `adviser=${adviser.id}`
  if (landDate && landDate !== 'all-land-dates') {
    queryString += `&financial_year_start[0]=${landDate}`
  }
  if (status && status !== 'all-statuses') {
    queryString += `&status=${status}`
  }
  return summary
    ? Object.keys(summary).map((key) => ({
        link: `/investments/projects?stage=${summary[key].id}&${queryString}`,
        name: key,
        ...summary[key],
      }))
    : []
}
