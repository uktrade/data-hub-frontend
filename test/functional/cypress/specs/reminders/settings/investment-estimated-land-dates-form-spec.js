import { assertBreadcrumbs } from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'

const endpoint = '/api-proxy/v4/reminder/subscription/estimated-land-date'

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

const assertTwoCheckboxes = (
  groupElement,
  thirtyDayCheckBox,
  sixtyDayCheckBox
) => {
  cy.get(groupElement).find('input[type="checkbox"]').should('have.length', 2)
  cy.get(thirtyDayCheckBox)
    .should('exist')
    .should('have.attr', 'aria-label', '30 days before estimated land date')
    .next()
    .should('have.text', '30 days before estimated land date')
  cy.get(sixtyDayCheckBox)
    .should('exist')
    .should('have.attr', 'aria-label', '60 days before estimated land date')
    .next()
    .should('have.text', '60 days before estimated land date')
}

describe('Settings - approaching estimated land dates', () => {
  context('Page breadcrumbs and title', () => {
    before(() => {
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.investments.estimatedLandDate(),
        Settings: `${urls.reminders.settings.index()}?investments_estimated_land_dates=true`,
        'Approaching estimated land dates': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Settings')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Approaching estimated land dates'
      )
    })
  })

  context('Settings - the basics', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [30],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "Investment reminders" legend', () => {
      cy.get('[data-test="field-reminders"]')
        .children()
        .children()
        .first()
        .should('have.text', 'Investment reminders')
    })

    it('should render hint text', () => {
      cy.get('[data-test="field-reminders"]').should(
        'contain',
        'Do you want to get reminders for projects with approaching estimated land dates?'
      )
    })

    it('should render two radio buttons', () => {
      assertTwoRadioButtons(
        '[data-test="field-reminders"]',
        '[data-test="reminders-no"]',
        '[data-test="reminders-yes"]'
      )
    })

    it('should render two checkboxes', () => {
      assertTwoCheckboxes(
        '[data-test="field-reminders"]',
        '[data-test="checkbox-30"]',
        '[data-test="checkbox-60"]'
      )
    })
  })

  context('Settings - disabled', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and be checked', () => {
      cy.get('[data-test="reminders-no"]').should('be.checked')
    })

    it('should render a "Yes" radio button and not be checked', () => {
      cy.get('[data-test="reminders-yes"]').should('not.be.checked')
    })

    it('should not render email notifications', () => {
      cy.get('[data-test="field-emailRemindersEnabled"] legend').should(
        'not.exist'
      )
      cy.get('[data-test="email-reminders-enabled-no"]').should('not.exist')
      cy.get('[data-test="email-reminders-enabled-yes"]').should('not.exist')
    })
  })

  context('Reminders - enabled (30 days)', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [30],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="reminders-no"]').should('be.not.checked')
    })

    it('should render a "Yes" radio button and be checked', () => {
      cy.get('[data-test="reminders-yes"]').should('be.checked')
    })

    it('should render a checkbox (30 days before estimated land date)', () => {
      cy.get('[data-test="checkbox-30"]').should('be.checked')
      cy.get('[data-test="checkbox-60"]').should('be.not.checked')
    })

    it('should render email notifications', () => {
      cy.get('[data-test="field-emailRemindersEnabled"] legend').should('exist')
      cy.get('[data-test="email-reminders-enabled-no"]').should('exist')
      cy.get('[data-test="email-reminders-enabled-yes"]').should('exist')
    })
  })

  context('Reminders - enabled (60 days)', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [60],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="reminders-no"]').should('be.not.checked')
    })

    it('should render a "Yes" radio button and be checked', () => {
      cy.get('[data-test="reminders-yes"]').should('be.checked')
    })

    it('should render a checkbox (60 days before estimated land date)', () => {
      cy.get('[data-test="checkbox-60"]').should('be.checked')
      cy.get('[data-test="checkbox-30"]').should('be.not.checked')
    })
  })

  context('Reminders - enabled (30 and 60 days)', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [30, 60],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="reminders-no"]').should('be.not.checked')
    })

    it('should render a "Yes" radio button and be checked', () => {
      cy.get('[data-test="reminders-yes"]').should('be.checked')
    })

    it('should render two checkboxes (30 and 60 days before estimated land date)', () => {
      cy.get('[data-test="checkbox-30"]').should('be.checked')
      cy.get('[data-test="checkbox-60"]').should('be.checked')
    })
  })

  context('Email notifications - the basics', () => {
    before(() => {
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
    })

    it('should render an "Investment email notifications" legend', () => {
      cy.get('[data-test="field-emailRemindersEnabled"] legend').should(
        'have.text',
        'Investment email notifications'
      )
    })

    it('should render some text', () => {
      cy.get('[data-test="field-emailRemindersEnabled"]').should(
        'contain',
        'Do you want to get emails as well as on-line reminders?'
      )
    })

    it('should render two radio buttons', () => {
      assertTwoRadioButtons(
        '[data-test="field-emailRemindersEnabled"]',
        '[data-test="email-reminders-enabled-no"]',
        '[data-test="email-reminders-enabled-yes"]'
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
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and be checked', () => {
      cy.get('[data-test="email-reminders-enabled-no"]').should('be.checked')
    })

    it('should not render a "Yes" radio button and not be checked', () => {
      cy.get('[data-test="email-reminders-enabled-yes"]').should(
        'not.be.checked'
      )
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
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="email-reminders-enabled-no"]').should(
        'not.be.checked'
      )
    })

    it('should render a "Yes" radio button and should be checked', () => {
      cy.get('[data-test="email-reminders-enabled-yes"]').should('be.checked')
    })
  })

  context('Form validation', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should display error messages when neither the 30 or 60 day checkboxes have been checked', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] h2').should(
        'contain',
        'There is a problem'
      )
      cy.get('[data-test="summary-form-errors"]').should(
        'contain',
        'Select when you want to get reminders'
      )
      cy.get('[data-test="field-reminderDays"]').should(
        'contain',
        'Select when you want to get reminders'
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
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.investments.estimatedLandDate())
      cy.wait('@apiRequest')
    })

    it('should render a "Settings updated" banner', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="checkbox-60"]').check()
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="flash"]').should('have.text', 'Settings updated')
    })
  })
})
