import { faker } from '../../../sandbox/utils/random'

import { addDays } from '../../../../src/client/utils/date'

const relativeDateFaker = ({ minDays, maxDays }) =>
  faker.date.between({
    from: addDays(new Date(), minDays),
    to: addDays(new Date(), maxDays),
  })

export { relativeDateFaker }
