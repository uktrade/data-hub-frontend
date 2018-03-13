function highlight (words, query) {
  if (!query) { return words }
  const iQuery = new RegExp(query, 'ig')
  return words.toString().replace(iQuery, (matchedTxt, a, b) => {
    return ('<span class=\'highlight\'>' + matchedTxt + '</span>')
  })
}

module.exports = {
  highlight,
}
