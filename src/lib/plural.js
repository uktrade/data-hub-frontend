function pluralise (string, count, pluralisedWord) {
  if (parseInt(count, 10) !== 1) {
    if (pluralisedWord) {
      string = pluralisedWord
    } else if (string.match(/[^aeiou]y$/)) {
      string = string.replace(/y$/, 'ies')
    } else {
      string += 's'
    }
  }

  return string
}

function singularise (string, count, singularisedWord) {
  if (parseInt(count, 10) === 1) {
    if (singularisedWord) {
      return singularisedWord
    } else if (string.endsWith('ies')) {
      return string.substr(0, string.length - 3) + 'y'
    } else {
      return string.substr(0, string.length - 1)
    }
  }

  return string
}

module.exports = {
  pluralise,
  singularise,
}
