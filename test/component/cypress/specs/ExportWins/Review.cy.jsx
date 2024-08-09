import React from 'react'

import {
  assertSummaryTableStrict,
  assertFieldRadiosStrict,
  assertFieldCheckboxes,
  assertFieldTextarea,
  assertErrorSummary,
} from '../../../../functional/cypress/support/assertions'
import Review from '../../../../../src/client/modules/ExportWins/Review'

const assertNoErrorDialog = () =>
  cy.get('[data-test="error-dialog"').should('not.exist')

const DBT_HEADING = 'Department for Business and Trade'
const HEADING = 'Tell us what made a difference'

const assertHeader = () => {
  cy.contains(DBT_HEADING)
  cy.get('header h1').should('have.text', HEADING)
}

const assertReviewed = ({ heading }) => {
  cy.contains(DBT_HEADING)
  cy.get('header h1').should('have.text', heading)
  cy.get('main').should(
    'have.text',
    'Your feedback will help us to improve our support services.'
  )
}

const EXPORT_WIN = {
  id: 'export-win-id',
  name_of_export: 'Rubber chicken',
  lead_officer: {
    name: 'Leo Jacobs',
  },
  country: {
    name: 'Australia',
  },
  comments: 'Lorem ipsum dolor sit amet',
  total_expected_export_value: 2528571,
  date: '2024-03-26T14:29:01.521Z',
  goods_vs_services: {
    name: 'Services',
  },
  is_personally_confirmed: false,
  description: 'Lorem ipsum dolor sit amet',
  export_experience: {
    name: 'My export experience',
  },
  breakdowns: [
    {
      type: {
        name: 'Export',
      },
      value: 123456,
      year: 3,
    },
  ],
}

const REVIEW = {
  win: EXPORT_WIN,
  company_contact: {
    name: 'Andy Pipkin',
  },
}

const assertReviewForm = ({ agree }) => {
  const RATING = [
    { id: 'rating-a', name: 'rating-A' },
    { id: 'rating-b', name: 'rating-B' },
    { id: 'rating-c', name: 'rating-C' },
  ]

  const WITHOUT_OUR_SUPPORT = [
    { id: 'without-our-support-a', name: 'without-our-support-A' },
    { id: 'without-our-support-b', name: 'without-our-support-B' },
    { id: 'without-our-support-c', name: 'without-our-support-C' },
  ]

  const EXPERIENCE = [
    { id: 'experience-a', name: 'experience-A' },
    { id: 'experience-b', name: 'experience-B' },
    { id: 'experience-c', name: 'experience-C' },
  ]

  const MARKETING_SOURCE = [
    { id: 'marketing-source-a', name: 'marketing-source-A' },
    {
      id: 'marketing-source-b',
      name: 'marketing-source-B (please specify)',
    },
    { id: 'marketing-source-c', name: 'marketing-source-C' },
  ]

  cy.mountWithProvider(<Review />, {
    tasks: {
      'Export Win Review': () => Promise.resolve(REVIEW),
      WithoutOurSupport: () => Promise.resolve(WITHOUT_OUR_SUPPORT),
      Rating: () => Promise.resolve(RATING),
      Experience: () => Promise.resolve(EXPERIENCE),
      MarketingSource: () => Promise.resolve(MARKETING_SOURCE),
      TASK_PATCH_EXPORT_WIN_REVIEW: () => Promise.resolve({}),
      'load cookie preference': () => 'granted',
    },
    initialPath: '/123',
  })

  assertHeader()
  assertNoErrorDialog()

  cy.contains('p', 'Hi Andy Pipkin,')
    .next()
    .should('match', 'p')
    .should(
      'have.text',
      'Thank you for taking the time to review our record of your recent export success.'
    )
    .next()
    .should('match', 'hr')
    .next()
    .should('match', 'h2')
    .should('have.text', 'Details of your recent success')

  cy.contains(DBT_HEADING + 'Step 1 of 6' + HEADING)

  assertSummaryTableStrict({
    rows: [
      ['Destination country', EXPORT_WIN.country.name],
      ['Total value', '£123,456 over 1 year'],
      ['Date won', '26 Mar 2024'],
      ['Lead officer name', EXPORT_WIN.lead_officer.name],
      ['Summary of support received', EXPORT_WIN.description],
      [
        'Your export experience before this win can be described as',
        EXPORT_WIN.export_experience.name,
      ],
    ],
  })

  assertFieldRadiosStrict({
    inputName: 'agree_with_win',
    options: [
      'I confirm this information is correct',
      'Some of this information needs revising',
    ],
    selectIndex: agree ? 0 : 1,
  })

  cy.contains('button', 'Continue').as('continue').click()

  // Assert that the step info is between the headings
  cy.contains(DBT_HEADING + 'Step 2 of 6' + HEADING)

  assertFieldRadiosStrict({
    inputName: 'expected_portion_without_help',
    legend:
      'What value do you estimate you would have achieved without our support?',
    options: WITHOUT_OUR_SUPPORT.map((x) => x.name),
    selectIndex: 1,
  })

  if (agree) {
    cy.get('#field-comments').then((element) => {
      assertFieldTextarea({
        element,
        label: 'Comments (optional)',
        hint: 'Please provide feedback on the help we have provided. If any of the information is incorrect please provide details.',
      })
    })
  } else {
    cy.get('#field-comments').then((el) =>
      assertFieldTextarea({
        element: el,
        label: 'Comments',
        hint: 'Please let us know what information was incorrect',
      })
    )

    cy.get('@continue').click()

    cy.get('[data-test="textarea-error"]').should(
      'have.text',
      'Please let us know what information was incorrect'
    )

    cy.get('#comments').type('Lorem ipsum dolor sit amet')
  }

  cy.contains('button', 'Back')

  cy.get('@continue').click()

  cy.contains(DBT_HEADING + 'Step 3 of 6' + HEADING)
  cy.contains('h2', 'The extent our support helped')
  ;[
    { inputName: 'our_support', legend: 'Securing the win overall?' },
    {
      inputName: 'access_to_contacts',
      legend: 'Gaining access to contacts?',
    },
    {
      inputName: 'access_to_information',
      legend: 'Getting information or improved understanding of the country?',
    },
    {
      inputName: 'improved_profile',
      legend: 'Improving your profile or credibility in the country?',
    },
    {
      inputName: 'gained_confidence',
      legend: 'Having confidence to explore or expand in the country?',
    },
    {
      inputName: 'developed_relationships',
      legend: 'Developing or nurturing critical relationships?',
    },
    {
      inputName: 'overcame_problem',
      legend:
        'Overcoming a problem in the country (for example legal, regulatory, commercial)',
    },
  ].forEach(({ inputName, legend }) => {
    assertFieldRadiosStrict({
      inputName,
      legend,
      options: RATING.map((x) => x.name),
      selectIndex: 1,
    })
  })

  cy.get('@continue').click()

  cy.contains(DBT_HEADING + 'Step 4 of 6' + HEADING)
  cy.contains('h2', 'About this win')

  assertFieldCheckboxes({
    element: '#field-checkboxes1',
    legend: 'Please tick all that apply to this win:',
    options: [
      {
        label:
          'The win involved a foreign government or state-owned enterprise (for example as an intermediary or facilitator)',
      },
      { label: 'Our support was a prerequisite to generate this value' },
      { label: 'Our support helped you achieve this win more quickly' },
    ],
  })

  assertFieldCheckboxes({
    element: '#field-checkboxes2',
    legend: 'Tick any that apply to this win:',
    options: [
      { label: 'It enabled you to expand into a new market' },
      {
        label: 'It enabled you to maintain or expand in an existing market',
      },
      {
        label:
          'It enabled you to increase exports as a proportion of your turnover',
      },
      {
        label:
          "If you hadn't achieved this win, your company might have stopped exporting",
      },
      {
        label:
          'Apart from this win, you already have plans to export in the next 12 months',
      },
    ],
  })

  cy.get('@continue').click()

  cy.contains(DBT_HEADING + 'Step 5 of 6' + HEADING)
  cy.contains('h2', 'Your export experience')

  assertFieldRadiosStrict({
    inputName: 'last_export',
    legend:
      'Apart from this win, when did your company last export goods or services?',
    options: EXPERIENCE.map((x) => x.name),
    selectIndex: 1,
  })

  cy.get('@continue').click()

  cy.contains(DBT_HEADING + 'Step 6 of 6' + HEADING)
  cy.contains('h2', 'Marketing')

  assertFieldRadiosStrict({
    inputName: 'case_study_willing',
    legend:
      'Would you be willing for DBT/Exporting is GREAT to feature your success in marketing materials?',
    options: ['Yes', 'No'],
    selectIndex: 1,
  })

  assertFieldRadiosStrict({
    inputName: 'marketing_source',
    legend: 'How did you first hear about DBT (or it predecessor, DIT)?',
    options: MARKETING_SOURCE.map((x) => x.name),
    selectIndex: 1,
  })

  // There should appear an input field
  cy.get('input#other_marketing_source')
  cy.get('label[for="other_marketing_source"]').should(
    'have.text',
    'Other way you heard about DBT'
  )

  // The field should be required
  cy.contains('button', 'Confirm and send').click()
  assertErrorSummary([
    'Enter a description of the other way you heard about DBT',
  ])

  // Fill out the field
  cy.get('input#other_marketing_source').type('Blah blah blah')

  cy.contains('button', 'Confirm and send').click()
}

describe('ExportWins/Review', () => {
  // We need to clear local storage after each test so that flash messages won't leak between tests
  // TODO: This should actually be applied globally
  afterEach(() => sessionStorage.clear())

  it('Footer links', () => {
    cy.mountWithProvider(<Review />, {
      tasks: {
        'Export Win Review': () => Promise.resolve(REVIEW),
        WithoutOurSupport: () => Promise.resolve(WITHOUT_OUR_SUPPORT),
        Rating: () => Promise.resolve(RATING),
        Experience: () => Promise.resolve(EXPERIENCE),
        MarketingSource: () => Promise.resolve(MARKETING_SOURCE),
        TASK_PATCH_EXPORT_WIN_REVIEW: () => Promise.resolve({}),
        'load cookie preference': () => 'granted',
      },
      initialPath: '/123',
    })

    cy.get('footer').within(() => {
      // There should be 3 links including the Crown copyright
      cy.get('a').should('have.length', 4)

      // Links should be in a particular order
      cy.contains('Privacy Policy' + 'Accessibility Statement' + 'Cookies')

      cy.contains('a', 'Privacy Policy').should(
        'have.attr',
        'href',
        'https://www.great.gov.uk/privacy-and-cookies/full-privacy-notice/'
      )
      cy.contains('a', 'Accessibility Statement').should(
        'have.attr',
        'href',
        '/exportwins/review/accesibility-statement'
      )
      cy.contains('a', 'Cookies').should(
        'have.attr',
        'href',
        '/exportwins/review/cookies'
      )
    })
  })

  context('If there is a problem loading the review', () => {
    it("should render not found view if token is expired or doesn't exist", () => {
      cy.mountWithProvider(<Review />, {
        tasks: {
          'Export Win Review': () =>
            Promise.reject({
              httpStatusCode: 404,
            }),
          'load cookie preference': () => 'granted',
        },
        initialPath: '/123',
      })

      assertHeader()

      assertNoErrorDialog()

      cy.contains('h2', 'The link you used has expired')
      cy.contains(
        'p',
        'Please get in touch with the Department of Business and Trade contact mentioned in your email, who will be able to send you a new link.'
      )
    })

    it("should render default error view if the review couldn't be loaded for", () => {
      cy.mountWithProvider(<Review />, {
        tasks: {
          'Export Win Review': () => Promise.reject({}),
          'load cookie preference': () => 'granted',
        },
        initialPath: '/123',
      })

      assertHeader()

      cy.contains('h2', 'The link you used has expired').should('not.exist')
      cy.contains(
        'p',
        'Please get in touch with the Department of Business and Trade contact mentioned in your email, who will be able to send you a new link.'
      ).should('not.exist')

      cy.get('[data-test="error-dialog"')
        .should('exist')
        .within(() => {
          cy.contains('h2', 'Could not load Export Win Review')
          cy.contains('button', 'Retry')
          cy.contains('button', 'Dismiss')
        })
    })
  })

  context('If the review loads', () => {
    it('User agrees with win', () => {
      assertReviewForm({ agree: true })

      assertReviewed({ heading: 'Export win reviewed' })

      cy.get('[role="alert"').should(
        'have.text',
        'Thank you for taking time to review this export win.'
      )
    })

    it('User disagrees with win', () => {
      assertReviewForm({ agree: false })

      assertReviewed({ heading: 'Export win reviewed and changes are needed' })

      cy.get('[role="alert"').within(() => {
        cy.contains('p', /^\s*Thank you for reviewing this export win.\s*$/)
        cy.contains(
          'p',
          /^\s*As you have asked for some changes to be made, we will review your comments and may need to contact you if we need more information.*$/
        )
      })
    })
  })
})
