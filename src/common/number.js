const roundToSignificantDigits = (number, sigDig) => {
  if (!number && number !== 0) {
    return null
  }

  return Number(number.toPrecision(sigDig))
}

module.exports = {
  roundToSignificantDigits,
}
