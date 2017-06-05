function trimArray (value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item.length > 0)
  } else if (value && value.length > 0) {
    return [value]
  }
  return null
}

function joinArray (value) {
  let trimmed = trimArray(value)
  if (trimmed && trimmed.length > 0) {
    return trimmed.join()
  }
  return null
}

function toArray (value) {
  if (!Array.isArray(value)) {
    let array = [value]
    value = array
  }
  return value
}

function yesNoToBoolean (value) {
  if (!value) {
    return null
  }
  return value.toLocaleLowerCase() === 'yes'
}

module.exports = {
  trimArray, joinArray, yesNoToBoolean, toArray,
}
