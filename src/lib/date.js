const monthNames = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sept', 'Oct',
  'Nov', 'Dec'
]

function formatDate (date) {
  const parts = date.split('-')
  const dateTime = new Date(parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10))
  const day = dateTime.getDate()
  const monthIndex = dateTime.getMonth()
  const year = dateTime.getFullYear()
  return `${day} ${monthNames[monthIndex]} ${year}`
}

module.exports = {
  formatDate
}
