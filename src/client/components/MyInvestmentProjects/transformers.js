export const summaryToDataRange = ({ summary, adviser }) =>
  Object.keys(summary).map((key) => ({
    link: `/investments/projects?stage=${summary[key].id}&adviser=${adviser.id}`,
    ...summary[key],
  }))
