module.exports = function toISOString (year, month, day, hours = 12, mins = 0) {
  let isoString
  let now = new Date()

  if (day && month && year) {
    const dateDetails = [
      year,
      month,
      day,
      hours,
      mins,
    ]
      .map((value) => parseInt(value, 10))

    isoString = (new Date(...dateDetails)).toISOString()
  } else {
    isoString = now.toISOString()
  }

  return isoString
}
