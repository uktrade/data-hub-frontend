/**
 * Picks a random item from an array
 */
const randomChoice = (list) => list[Math.floor(Math.random() * list.length)]

/**
 * Snake case an object created by a faker
 */
const keysToSnakeCase = (o) => _.mapKeys(o, (v, k) => _.snakeCase(k))

/**
 * Fakes a list of items using a faker function on each
 */
const listFaker = ({ fakerFunction, length = 1, overrides = {} }) => {
  let list = []
  for (let i = 0; i < length; i++) {
    list.push(fakerFunction(overrides))
  }
  return list
}

/**
 * Fakes a list of items using a faker function on each with
 * more overrides for objects within objects.
 */
const listFakerAdditionalOverrides = ({
  fakerFunction,
  length = 1,
  overrides = {},
  additionalOverrides = {},
}) => {
  let list = []
  for (let i = 0; i < length; i++) {
    list.push(fakerFunction(overrides, additionalOverrides))
  }
  return list
}

export {
  listFaker,
  randomChoice,
  keysToSnakeCase,
  listFakerAdditionalOverrides,
}
