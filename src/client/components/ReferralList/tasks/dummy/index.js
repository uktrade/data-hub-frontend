import { faker } from '../../../../../../test/sandbox/utils'

const randomAdviser = () => ({
  ...faker.helpers.createCard(),
  team: faker.word.words(3),
})

const randomReferral = () => ({
  companyId: faker.string.uuid(),
  id: faker.string.uuid(),
  subject: faker.lorem.sentence(),
  companyName: faker.company.name(),
  date: faker.date.past({ years: 1 }),
  dateAccepted: faker.date.recent(),
  sender: randomAdviser(),
  recipient: randomAdviser(),
  direction: Math.random() > 0.5 ? 'sent' : 'received',
})

const randomReferrals = (length) => Array(length).fill(null).map(randomReferral)

export default (delay = 1000, length = 10) =>
  () =>
    new Promise((resolve) =>
      setTimeout(resolve, delay, randomReferrals(length))
    )
