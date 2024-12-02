import { faker } from '../../../../../../test/utils'

const randomLists = ({ length, max = 10 }) =>
  Array(length || faker.number.int(max))
    .fill(null)
    .reduce((a) => ({ ...a, [faker.string.uuid()]: faker.word.words(3) }), {})

const randomList = ({ length, max = 10, id }) =>
  Array(length || faker.number.int(max))
    .fill()
    .map(() => ({
      id: id || faker.string.uuid(),
      name: faker.word.words(3),
      interactionId: faker.string.uuid(),
      date: faker.date.past(),
      subject: faker.word.words(3),
      ditParticipants: Array(faker.number.int(2))
        .fill()
        .map(() => ({
          name: faker.person.fullName(),
          team: faker.word.words(3),
        })),
    }))

export const listsTaskFactory =
  ({ delay, lists, length }) =>
  () =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, lists || randomLists(length))
    )

export const listTaskFactory =
  ({ delay, ...rest } = {}) =>
  (id) =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, randomList({ id, ...rest }))
    )
