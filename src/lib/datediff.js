const DateDiff = {}

DateDiff.inDays = function inDays (d1, d2) {
  const t2 = Date.parse(d2)
  const t1 = Date.parse(d1)
  return parseInt((t2 - t1) / (24 * 3600 * 1000), 10)
}

DateDiff.inWeeks = function inWeeks (d1, d2) {
  const t2 = Date.parse(d2)
  const t1 = Date.parse(d1)
  return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7), 10)
}

DateDiff.inMonths = function inMonths (d1, d2) {
  const date2 = new Date(d2)
  const date1 = new Date(d1)

  const d1Y = date1.getFullYear()
  const d2Y = date2.getFullYear()
  const d1M = date1.getMonth()
  const d2M = date2.getMonth()

  return (d2M + (12 * d2Y)) - (d1M + (12 * d1Y))
}

DateDiff.inYears = function inYears (d1, d2) {
  const date1 = new Date(d1)
  const date2 = new Date(d2)

  return date2.getFullYear() - date1.getFullYear()
}

DateDiff.timeDiffHuman = function timeDiffHuman (d1, d2) {
  const years = DateDiff.inYears(d1, d2)
  const months = DateDiff.inMonths(d1, d2)
  const weeks = DateDiff.inWeeks(d1, d2)
  const days = DateDiff.inDays(d1, d2)

  let result

  if (months > 23) {
    result = `${years} years`
  } else if (days > 28 && months > 0) {
    result = `${months} months`
  } else if (weeks > 1) {
    result = `${weeks} weeks`
  } else {
    result = `${days} days`
  }

  if (result.substr(0, 2) === '1 ') {
    result = result.substring(0, result.length - 1)
  }

  return result
}

module.exports = DateDiff
