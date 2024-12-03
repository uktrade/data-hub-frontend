import _ from 'lodash'

import { faker } from '../../../../../test/sandbox/utils'

const OPTIONS = Array(1000)
  .fill()
  .map(() => faker.person.fullName())

export const fakerOptions = (query = '') =>
  new Promise((resolve, reject) =>
    query === 'reject'
      ? setTimeout(reject, 1000, 'Something went horribly wrong')
      : setTimeout(
          resolve,
          1000,
          OPTIONS.filter((x) => x.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10)
            .map((x) => ({ value: _.snakeCase(x), label: x }))
        )
  )

export default {
  'Task typeahead example options': fakerOptions,
}
