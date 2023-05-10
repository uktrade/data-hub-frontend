import { faker } from '@faker-js/faker'

import { addDays } from '../../../../src/client/utils/date'

const relativeDateFaker = ({ minDays, maxDays }) =>
  faker.date.between(addDays(new Date(), minDays), addDays(new Date(), maxDays))

export { relativeDateFaker }
