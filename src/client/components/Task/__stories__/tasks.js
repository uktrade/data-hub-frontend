import _ from 'lodash'
import faker from 'faker'

const OPTIONS = Array(1000)
  .fill()
  .map(() => faker.name.findName())

export const fakerOptions = ({ query = '', delay = 1000 }) =>
  new Promise((resolve, reject) =>
    query === 'reject'
      ? setTimeout(reject, delay, 'Something went horribly wrong')
      : setTimeout(
          resolve,
          delay,
          OPTIONS.filter((x) => x.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10)
            .map((x) => ({ value: _.snakeCase(x), label: x }))
        )
  )

export default {
  'Task typeahead example options': _.memoize(fakerOptions, ({ query = '' }) =>
    query.toLowerCase()
  ),
  'Task typeahead example label': (values) =>
    new Promise((resolve) =>
      setTimeout(
        resolve,
        1000,
        values.map((value) => `Label for ${value}`)
      )
    ),
  'Task cancellation demo': () => new Promise((r) => setTimeout(r, 5000)),
}
