import { faker } from '../../../utils'

const names = [
  'Cleared',
  'Issues identified',
  'Not yet checked',
  'Checks not required - See Investor Screening Report (ISR) guidance',
]

const requiredChecksConductedListFaker = () =>
  names.map((name) => {
    return {
      id: faker.string.uuid(),
      name,
    }
  })

export { requiredChecksConductedListFaker }

export default requiredChecksConductedListFaker
