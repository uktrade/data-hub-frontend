import { addDays } from 'date-fns'

import { faker } from '../../../sandbox/utils/random'

const relativeDateFaker = ({ minDays, maxDays }) =>
  faker.date.between({
    from: addDays(new Date(), minDays),
    to: addDays(new Date(), maxDays),
  })

export { relativeDateFaker }
