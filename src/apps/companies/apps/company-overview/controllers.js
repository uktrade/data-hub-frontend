const urls = require('../../../../lib/urls')
// const { getProjects } = require('../../../investments/client/projects/tasks')

const investmentList = [
  {
    id: '716c146b-5ecc-40cb-b41d-14c376aa9da2',
    headingUrl:
      '/investments/projects/716c146b-5ecc-40cb-b41d-14c376aa9da2/details',
    headingText: '7th',
    subheading: 'Project code DHP-00000193',
    badges: [
      {
        text: 'Active',
      },
      {
        text: 'FDI',
      },
      {
        text: 'lost',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
    ],
  },
  {
    id: '145ad2e8-c059-41c1-a923-ef3eab881e01',
    headingUrl:
      '/investments/projects/145ad2e8-c059-41c1-a923-ef3eab881e01/details',
    headingText: '6th',
    subheading: 'Project code DHP-00000192',
    badges: [
      {
        text: 'Verify win',
      },
      {
        text: 'FDI',
      },
      {
        text: 'abandoned',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
    ],
  },
  {
    id: '59778355-5a01-48bc-94f4-dabc55bfc12f',
    headingUrl:
      '/investments/projects/59778355-5a01-48bc-94f4-dabc55bfc12f/details',
    headingText: '5th',
    subheading: 'Project code DHP-00000191',
    badges: [
      {
        text: 'Won',
      },
      {
        text: 'FDI',
      },
      {
        text: 'won',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
      {
        label: 'Estimated land date',
        value: 'March 2023',
      },
    ],
  },
  {
    id: 'feaa3fa8-854f-4d35-95c8-afebf54af0be',
    headingUrl:
      '/investments/projects/feaa3fa8-854f-4d35-95c8-afebf54af0be/details',
    headingText: '4th',
    subheading: 'Project code DHP-00000190',
    badges: [
      {
        text: 'Prospect',
      },
      {
        text: 'FDI',
      },
      {
        text: 'ongoing',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
      {
        label: 'Sector',
        value: 'Advanced Engineering',
      },
      {
        label: 'Estimated land date',
        value: 'November 2017',
      },
    ],
  },
  {
    id: 'e5fd2694-8343-4de8-b106-ebb922853f49',
    headingUrl:
      '/investments/projects/e5fd2694-8343-4de8-b106-ebb922853f49/details',
    headingText: 'Unicorn Test',
    subheading: 'Project code DHP-00000189',
    badges: [
      {
        text: 'Prospect',
      },
      {
        text: 'FDI',
      },
      {
        text: 'ongoing',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
      {
        label: 'Sector',
        value: 'Advanced Engineering',
      },
      {
        label: 'Estimated land date',
        value: 'January 2024',
      },
    ],
  },
  {
    id: 'e4b7c9d1-28fe-471a-a88f-e3593e78c3b7',
    headingUrl:
      '/investments/projects/e4b7c9d1-28fe-471a-a88f-e3593e78c3b7/details',
    headingText: 'CH Testing',
    subheading: 'Project code DHP-00000188',
    badges: [
      {
        text: 'Prospect',
      },
      {
        text: 'Commitment to invest',
      },
      {
        text: 'ongoing',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
      {
        label: 'Sector',
        value: 'Advanced Engineering',
      },
      {
        label: 'Estimated land date',
        value: 'March 2025',
      },
    ],
  },
  {
    id: 'b30dee70-b2d6-48cf-9ce4-b9264854470c',
    headingUrl:
      '/investments/projects/b30dee70-b2d6-48cf-9ce4-b9264854470c/details',
    headingText: 'Fancy dress manufacturing',
    subheading: 'Project code DHP-00000005',
    badges: [
      {
        text: 'Prospect',
      },
      {
        text: 'FDI',
      },
      {
        text: 'ongoing',
      },
    ],
    metadata: [
      {
        label: 'Investor',
        value: 'One List Corp',
      },
      {
        label: 'Sector',
        value: 'Renewable Energy : Wind : Onshore',
      },
      {
        label: 'Estimated land date',
        value: 'January 2020',
      },
    ],
  },
]
async function renderOverview(req, res) {
  const { company } = res.locals

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    { link: urls.companies.detail(company.id), text: company.name },
    { text: 'Overview' },
  ]

  const companiesHouseLink = urls.external.companiesHouse(
    company.company_number
  )

  // const project = {
  //   companyId: company.id,
  //   page: 1,
  // }
  // const investmentList = getProjects({ project })
  // const props = {
  //   breadcrumbs,
  //   company,
  //   localNavItems: res.locals.localNavItems,
  //   urls,
  //   companiesHouseLink,
  // }

  res.render('companies/apps/company-overview/views/client-container', {
    props: {
      breadcrumbs,
      company,
      localNavItems: res.locals.localNavItems,
      urls,
      companiesHouseLink,
      investment: investmentList,
    },
  })
}

module.exports = {
  renderOverview,
  // setCompanyInvestmentProjects,
}
