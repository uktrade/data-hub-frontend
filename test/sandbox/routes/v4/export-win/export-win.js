import { faker } from '../../../utils.js'

const fakeBreakdown = () => ({
  id: faker.string.uuid(),
  type: {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'Export',
      'Business success',
      'Outward Direct Investment',
    ]),
  },
  value: faker.number.int({
    min: 1_000,
    max: 10_000_000,
  }),
  year: faker.number.int({
    min: 1,
    max: 5,
  }),
})

const fakeExportWin = () => ({
  id: faker.string.uuid(),
  adviser: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  },
  lead_officer: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  },
  company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  country: {
    id: faker.string.uuid(),
    name: faker.location.country(),
  },
  company_contacts: [
    {
      id: faker.string.uuid(),
      name: faker.company.name(),
      email: faker.internet.email(),
    },
  ],
  name_of_export: faker.commerce.productName(),
  customer_name: faker.person.fullName(),
  customer_job_title: faker.person.jobTitle(),
  customer_email_address: faker.internet.email(),
  total_expected_export_value: faker.number.int({
    min: 10_000,
    max: 10_000_000,
  }),
  date: faker.date.anytime(),
  goods_vs_services: {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Goods', 'Services']),
  },
  breakdowns: faker.helpers.multiple(fakeBreakdown),
  description: faker.lorem.lines(),
  export_experience: {
    id: faker.string.uuid(),
    name: faker.lorem.paragraph(),
  },
  customer_response: {
    id: faker.string.uuid(),
    our_support: {
      name: 'Very little',
      id: faker.string.uuid(),
    },
    access_to_contacts: {
      name: 'Great extent',
      id: faker.string.uuid(),
    },
    access_to_information: {
      name: 'Great extent',
      id: faker.string.uuid(),
    },
    improved_profile: {
      name: 'Completely',
      id: faker.string.uuid(),
    },
    gained_confidence: {
      name: "Didn't help",
      id: faker.string.uuid(),
    },
    developed_relationships: {
      name: 'Completely',
      id: faker.string.uuid(),
    },
    overcame_problem: {
      name: 'N/A',
      id: faker.string.uuid(),
    },
    involved_state_enterprise: true,
    support_improved_speed: true,
    expected_portion_without_help: {
      name: 'Up to 40%',
      id: faker.string.uuid(),
    },
    last_export: {
      name: 'Apart from this win, we have exported in the last 12 months',
      id: faker.string.uuid(),
    },
    has_enabled_expansion_into_new_market: false,
    has_enabled_expansion_into_existing_market: true,
    has_increased_exports_as_percent_of_turnover: false,
    company_was_at_risk_of_not_exporting: true,
    has_explicit_export_plans: false,
    agree_with_win: true,
    case_study_willing: false,
    comments: faker.lorem.paragraph(),
    name: '',
    marketing_source: {
      name: 'Advertisements I saw or read about the Exporting is GREAT campaign',
      id: faker.string.uuid(),
    },
    other_marketing_source: '',
    responded_on: null,
  },
})

const WON_EXPORT_WINS = Array(123).fill().map(fakeExportWin)
const SENT_EXPORT_WINS = Array(123).fill().map(fakeExportWin)

export const getExportWinCollection = (req, res) => {
  const exportWins =
    req.query.filter === 'sent' ? SENT_EXPORT_WINS : WON_EXPORT_WINS

  const limit = parseInt(req.query.limit, 10)
  const offset = parseInt(req.query.offset, 10)

  res.json({
    count: exportWins.length,
    results: exportWins.slice(offset, offset + limit),
  })
}

export const getExportWin = (req, res) => {
  res.json(fakeExportWin())
}

export const getExportWinReview = (req, res) => {
  if (req.params.token === 'non-existent') {
    return res.status(404).json({ detail: 'Not found' })
  }
  if (req.params.token === 'server-error') {
    return res.status(500).json({ detail: 'Server error' })
  }
  res.json({
    win: fakeExportWin(),
    company_contact: {
      name: faker.person.fullName(),
    },
    agree_with_win: false,
    name: 'John Doe',
    comments: 'Comments',
    our_support: {
      id: faker.string.uuid(),
      name: 'Our support',
    },
    access_to_contacts: {
      id: faker.string.uuid(),
      name: 'Access to contacts',
    },
    access_to_information: {
      id: faker.string.uuid(),
      name: 'Access to informaiton',
    },
    improved_profile: {
      id: faker.string.uuid(),
      name: 'Improved profile',
    },
    gained_confidence: {
      id: faker.string.uuid(),
      name: 'Gained confidence',
    },
    developed_relationships: {
      id: faker.string.uuid(),
      name: 'Developer relationship',
    },
    overcame_problem: {
      id: faker.string.uuid(),
      name: 'Overcame problem',
    },
    involved_state_enterprise: 'Involved state enterprise',
    interventions_were_prerequisite: 'Interventions were prerequisite',
    support_improved_speed: 'Support improved speed',
    expected_portion_without_help: {
      id: faker.string.uuid(),
      name: 'Expected portion without help',
    },
    last_export: {
      id: faker.string.uuid(),
      name: 'Last export',
    },
    company_was_at_risk_of_not_exporting: false,
    has_explicit_export_plans: false,
    has_enabled_expansion_into_new_market: false,
    has_increased_exports_as_percent_of_turnover: false,
    has_enabled_expansion_into_existing_market: false,
    case_study_willing: false,
    marketing_source: {
      id: faker.string.uuid(),
      name: 'Marketing source',
    },
    other_marketing_source: 'Other marketing source',
  })
}

export const patchExportWinReview = (req, res) =>
  // TODO: Update this to correct response
  res.json({ foo: 'bar' })
