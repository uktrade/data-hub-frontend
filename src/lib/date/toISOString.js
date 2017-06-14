module.exports = function toISOString (day, month, year) {
  let isoString

  if (day && month && year) {
    isoString = (new Date(year, month, day)).toISOString()
  } else {
    isoString = (new Date()).toISOString()
  }

  return isoString
}
