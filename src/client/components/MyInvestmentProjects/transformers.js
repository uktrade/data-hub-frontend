export const summaryToDataRange = ({ summary, adviser }) =>
  summary
    ? Object.keys(summary).map((key) => ({
        link: `/investments/projects?stage=${summary[key].id}&adviser=${adviser.id}`,
        ...summary[key],
      }))
    : []
