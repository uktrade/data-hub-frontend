const { addDays } = require('../../../../src/client/utils/date')

import faker from 'faker'

const relativeDateFaker = ({ minDays, maxDays }) =>
  faker.date.between(addDays(new Date(), minDays), addDays(new Date(), maxDays))

export { relativeDateFaker }
