/**
 * Picks a random item from an array
 */
export const randomChoice = (list) =>
  list[Math.floor(Math.random() * list.length)]
