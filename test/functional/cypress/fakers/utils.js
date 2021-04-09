/**
 * Picks a random item from an array
 */
const randomChoice = (list) => list[Math.floor(Math.random() * list.length)]

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

export { listFaker, randomChoice }
