const GROUP_TIME_DELTA = 1000

const isInteraction = (item) => item.hasOwnProperty('kind')

function isTimeMatch(timestampA, timestampB) {
  const dateA = Date.parse(timestampA)
  const dateB = Date.parse(timestampB)

  return Math.abs(dateA - dateB) < GROUP_TIME_DELTA
}

function isHistoryItemMatch(a, b) {
  const userMatch = a.history_user?.id === b.history_user?.id
  const typeMatch = a.history_type === b.history_type
  const statusMatch = a.status === b.status

  return userMatch && typeMatch && statusMatch && isTimeMatch(a.date, b.date)
}

export function groupHistoryItems(results) {
  const groupedResults = []

  results.forEach((item) => {
    if (isInteraction(item)) {
      groupedResults.push(item)
    } else {
      const lastItem = groupedResults[groupedResults.length - 1]
      const canUpdateLastItem = lastItem && !isInteraction(lastItem)

      if (canUpdateLastItem && isHistoryItemMatch(lastItem, item)) {
        lastItem.countries.push(item.country)
      } else {
        const { country, ...rest } = item
        groupedResults.push({
          ...rest,
          countries: [country],
        })
      }
    }
  })

  return groupedResults
}
