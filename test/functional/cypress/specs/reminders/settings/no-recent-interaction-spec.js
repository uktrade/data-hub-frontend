import { assertBreadcrumbs, assertPayload } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const endpoint =
  '/api-proxy/v4/reminder/subscription/no-recent-investment-interaction'

const assertTwoRadioButtons = (groupElement, noRadioBtn, yesRadioBtn) => {
  cy.get(groupElement).find('input[type="radio"]').should('have.length', 2)
  cy.get(noRadioBtn)
    .should('exist')
    .should('have.value', 'no')
    .should('have.attr', 'aria-label', 'No')
    .next()
    .should('have.text', 'No')
  cy.get(yesRadioBtn)
    .should('exist')
    .should('have.value', 'yes')
    .should('have.attr', 'aria-label', 'Yes')
    .next()
    .should('have.text', 'Yes')
}

const assertInputFields = (days) => {
  it(`should render ${days.length} input fields`, () => {
    cy.get('[data-test^="reminder_days_"]').should('have.length', days.length)
  })

  days.forEach((day, index) => {
    it(`should render an input field (${day} days with no interaction)`, () => {
      cy.get(`[data-test="reminder_days_${index}"]`).should('have.value', day)
    })
  })
}

describe('Edit no recent interaction', () => {
  context('Page breadcrumbs and title', () => {
    before(() => {
      cy.visit(urls.reminders.settings.noRecentInteraction())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        'Reminders and email notifications settings':
          urls.reminders.settings.index(),
        'Settings for projects with no recent interaction': null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'contain',
        'Settings for projects with no recent interaction'
      )
    })
  })

  context('Reminders - the default', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    it('should render a "Reminders" legend', () => {
      cy.get('[data-test="field-reminders"] legend').should(
        'have.text',
        'Reminders'
      )
    })

    it('should render a question', () => {
      cy.get('[data-test="field-reminders"] label').should(
        'contain',
        'Do you want to get reminders for projects with no recent interaction?'
      )
    })

    it('should render hint text', () => {
      cy.get('[data-test="field-reminders"] span').should(
        'contain',
        "Selecting 'no' deletes current settings so you'll get no reminders or emails."
      )
    })

    it('should render two radio buttons', () => {
      assertTwoRadioButtons(
        '[data-test="field-reminders"]',
        '[data-test="reminders-no"]',
        '[data-test="reminders-yes"]'
      )
    })
  })

  context('Reminders - disabled', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and be checked', () => {
      cy.get('[data-test="reminders-no"]').should('be.checked')
    })

    it('should render a "Yes" radio button and not be checked', () => {
      cy.get('[data-test="reminders-yes"]').should('not.be.checked')
    })

    it('should not render email notifications', () => {
      cy.get('[data-test="field-emailNotifications"] legend').should(
        'not.exist'
      )
      cy.get('[data-test="email-notifications-no"]').should('not.exist')
      cy.get('[data-test="email-notifications-yes"]').should('not.exist')
    })
  })

  context('Reminders - 5 days no interaction)', () => {
    const reminder_days = [5]
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days,
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="reminders-no"]').should('be.not.checked')
    })

    it('should render a "Yes" radio button and should be checked', () => {
      cy.get('[data-test="reminders-yes"]').should('be.checked')
    })

    assertInputFields(reminder_days)

    it('should render an "Add another" button', () => {
      cy.get('[data-test="add-another"]').should('exist')
    })

    it('should render email notifications', () => {
      cy.get('[data-test="field-emailNotifications"] legend').should('exist')
      cy.get('[data-test="email-notifications-no"]').should('exist')
      cy.get('[data-test="email-notifications-yes"]').should('exist')
    })
  })

  context('Reminders - 5 and 10 days no interaction)', () => {
    const reminder_days = [5, 10]
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days,
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    assertInputFields(reminder_days)

    it('should render an "Add another" button', () => {
      cy.get('[data-test="add-another"]').should('exist')
    })
  })

  context('Reminders - 5, 10 and 15 days no interaction)', () => {
    const reminder_days = [5, 10, 15]
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days,
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    assertInputFields(reminder_days)

    it('should render an "Add another" button', () => {
      cy.get('[data-test="add-another"]').should('exist')
    })
  })

  context('Reminders - 5, 10, 15 and 20 days no interaction)', () => {
    const reminder_days = [5, 10, 15, 20]
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days,
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    assertInputFields(reminder_days)

    it('should render an "Add another" button', () => {
      cy.get('[data-test="add-another"]').should('exist')
    })
  })

  context('Reminders - 5, 10, 15, 20 and 25 days no interaction)', () => {
    const reminder_days = [5, 10, 15, 20, 25]
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days,
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    assertInputFields(reminder_days)

    it('should not render an "Add another" button', () => {
      cy.get('[data-test="add-another"]').should('not.exist')
    })
  })

  context('Email notifications - the basics', () => {
    before(() => {
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.get('[data-test="reminders-yes"]').click()
    })

    it('should render an "Email notifications" legend', () => {
      cy.get('[data-test="field-emailNotifications"] legend').should(
        'have.text',
        'Email notifications'
      )
    })

    it('should render a question', () => {
      cy.get('[data-test="field-emailNotifications"] label').should(
        'contain',
        'Do you want to get emails at the same time as reminders?'
      )
    })

    it('should render two radio buttons', () => {
      assertTwoRadioButtons(
        '[data-test="field-emailNotifications"]',
        '[data-test="email-notifications-no"]',
        '[data-test="email-notifications-yes"]'
      )
    })
  })

  context('Email notifications - disabled', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [30],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and be checked', () => {
      cy.get('[data-test="email-notifications-no"]').should('be.checked')
    })

    it('should render a "Yes" radio button and not be checked', () => {
      cy.get('[data-test="email-notifications-yes"]').should('not.be.checked')
    })
  })

  context('Email notifications - enabled', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [30],
          email_reminders_enabled: true,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="email-notifications-no"]').should('not.be.checked')
    })

    it('should render a "Yes" radio button and should be checked', () => {
      cy.get('[data-test="email-notifications-yes"]').should('be.checked')
    })
  })

  context('Form validation', () => {
    const indices = [0, 1, 2, 3, 4]
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@apiRequest')
    })

    it('should display error messages when the user has not entered any days', () => {
      // Click 'Yes' to render the email reminders radio buttons
      cy.get('[data-test="reminders-yes"]').check()
      // Add four blank input fields totalling 5 as you get one by default
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="add-another"]').click()
      // Submit without populating any of the 5 fields
      cy.get('[data-test="submit-button"]').click()

      // Now assert the 5 errors
      cy.get('[data-test="summary-form-errors"] h2').should(
        'contain',
        'There is a problem'
      )
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'have.length',
        5
      )
      cy.get('[data-test="summary-form-errors"] ul > li').each(($li) => {
        expect($li.text()).to.equal(
          'Enter when you want to get reminders for your projects'
        )
      })
      indices.forEach((index) => {
        cy.get(`[data-test="field-reminder_days_${index}"]`).should(
          'contain',
          'Enter when you want to get reminders for your projects'
        )
      })
    })

    it('should display an error when the value is negative', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').clear()
      cy.get('[data-test="reminder_days_0"]').type('-1')
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'contain',
        'Enter a whole number that’s 1 or higher, like 25'
      )
    })

    it('should display an error on any non-numerical value', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').clear()
      cy.get('[data-test="reminder_days_0"]').type('t')
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'contain',
        'Enter a whole number that’s 1 or higher, like 25'
      )
    })

    it('should display an error on a floating point values', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').clear()
      cy.get('[data-test="reminder_days_0"]').type('1.5')
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'contain',
        'Enter a whole number that’s 1 or higher, like 25'
      )
    })

    it('should display an error when the value is zero', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').clear()
      cy.get('[data-test="reminder_days_0"]').type('0')
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'contain',
        'Enter a whole number that’s 1 or higher, like 25'
      )
    })

    it('should display an error when the value has breached the limit', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').clear()
      cy.get('[data-test="reminder_days_0"]').type('32768')
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'contain',
        'Enter a whole number that’s less than or equal to 32767'
      )
    })
  })

  context('Form submission', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: true,
        },
      }).as('getNri')
      cy.intercept('PATCH', endpoint).as('saveNri')
      cy.visit(urls.reminders.settings.noRecentInteraction())
      cy.wait('@getNri')
    })

    it('should render a "Settings updated" banner', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get(`[data-test="reminder_days_0"]`).type(5)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_1"]`).type(10)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_2"]`).type(15)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_3"]`).type(20)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_4"]`).type(25)
      cy.get(`[data-test="submit-button"]`).click()
      assertPayload('@saveNri', {
        reminder_days: ['5', '10', '15', '20', '25'],
        email_reminders_enabled: true,
      })
      cy.get('[data-test="flash"]').should('have.text', 'Settings updated')
    })
  })
})
