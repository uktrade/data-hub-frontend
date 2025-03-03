import { faker } from '../../../utils/random.js'
import interactionsFixture from './interactions.json' assert { type: 'json' }

export const interactionByExportProject = (req) => {
  const interactionsByExportProjectList = interactionsFixture.results.map(
    (interaction) => ({
      ...interaction,
      company_export: {
        id: req.query.company_export_id,
        title: faker.word.sample(),
      },
      dit_participants: [
        {
          adviser: {
            name: faker.person.fullName(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            id: faker.string.uuid(),
          },
          team: {
            name: faker.company.name(),
            id: faker.string.uuid(),
          },
        },
      ],
    })
  )

  const limit = parseInt(req.query.limit, 10)
  const offset = parseInt(req.query.offset, 10)

  return Object.assign(
    {},
    {
      ...interactionsFixture,
      results: interactionsByExportProjectList.slice(offset, offset + limit),
    }
  )
}
