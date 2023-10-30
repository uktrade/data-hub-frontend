import {
  assertBreadcrumbs,
  assertFieldRadiosWithLegend,
  assertPayload,
} from '../../../support/assertions'
import urls from '../../../../../../src/lib/urls'
import { fillYesNoRadio } from '../../../support/form-fillers'

const endpoint =
  '/api-proxy/v4/reminder/subscription/my-tasks-due-date-approaching'

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

describe('Settings - my tasks', () => {
  context('Page breadcrumbs and title', () => {
    before(() => {
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Reminders: urls.reminders.myTasks.dueDateApproaching(),
        Settings: `${urls.reminders.settings.index()}?my_tasks_due_date_approaching=true`,
        'Due date approaching': null,
      })
    })

    it('should render the headings', () => {
      cy.get('[data-test="heading"]').should('have.text', 'Settings')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        'Due date approaching'
      )
    })
  })

  context('Export email notifications - the basics', () => {
    before(() => {
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
      fillYesNoRadio('[data-test="email-reminders-enabled-yes"]', true)
    })

    it('should render an "Email notifications" legend', () => {
      cy.get('[data-test="field-emailRemindersEnabled"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Due date approaching email notifications',
          optionsCount: 2,
          value: 'Yes',
        })
      })
    })

    it('should render a question', () => {
      cy.get('[data-test="field-emailRemindersEnabled"] label').should(
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
  //TODO tests need to be fixed below here, they have all been copied from another file
  context('Email notifications - disabled', () => {
    before(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [30],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
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
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
      cy.wait('@apiRequest')
    })

    it('should render a "No" radio button and should not be checked', () => {
      cy.get('[data-test="email-notifications-no"]').should('not.be.checked')
    })

    it('should render a "Yes" radio button and should be checked', () => {
      cy.get('[data-test="email-notifications-yes"]').should('be.checked')
    })
  })

  const assertErrorMessage = (value) => {
    cy.get('[data-test="reminders-yes"]').check()
    cy.get('[data-test="reminder_days_0"]').type(value)
    cy.get('[data-test="submit-button"]').click()
    cy.get('[data-test="summary-form-errors"] ul > li').should(
      'contain',
      'Add a number between 1 and 365'
    )
  }

  context('Form validation', () => {
    const indices = [0, 1, 2, 3, 4]
    beforeEach(() => {
      cy.intercept('GET', endpoint, {
        body: {
          reminder_days: [],
          email_reminders_enabled: false,
        },
      }).as('apiRequest')
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
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
          'Add when you want to get company reminders'
        )
      })
      indices.forEach((index) => {
        cy.get(`[data-test="field-reminder_days_${index}"]`).should(
          'contain',
          'Add when you want to get company reminders'
        )
      })
    })

    it('should display an error when the value is negative', () => {
      assertErrorMessage('-1')
    })

    it('should display an error on any non-numerical value', () => {
      assertErrorMessage('t')
    })

    it('should display an error on a floating point value', () => {
      assertErrorMessage('1.5')
    })

    it('should display an error when the value is zero', () => {
      assertErrorMessage('0')
    })

    it('should display an error when the value has breached the limit', () => {
      assertErrorMessage('366')
    })

    it('should display an error when there are duplicate reminder days', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').type(10)
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="reminder_days_1"]').type(10)
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'contain',
        'Add a different number of days for each reminder'
      )
    })

    it('should display an error when there are multiple duplicate reminder days', () => {
      const indices = [0, 1, 2, 3]
      cy.get('[data-test="reminders-yes"]').check()
      cy.get('[data-test="reminder_days_0"]').type(20)
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="reminder_days_1"]').type(30)
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="reminder_days_2"]').type(20)
      cy.get('[data-test="add-another"]').click()
      cy.get('[data-test="reminder_days_3"]').type(30)
      cy.get('[data-test="submit-button"]').click()
      cy.get('[data-test="summary-form-errors"] ul > li').should(
        'have.length',
        4
      )
      cy.get('[data-test="summary-form-errors"] ul > li').each(($li) => {
        expect($li.text()).to.equal(
          'Add a different number of days for each reminder'
        )
      })
      indices.forEach((index) => {
        cy.get(`[data-test="field-reminder_days_${index}"]`).should(
          'contain',
          'Add a different number of days for each reminder'
        )
      })
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
      cy.visit(urls.reminders.settings.myTasks.dueDateApproaching())
      cy.wait('@getNri')
    })

    it('should render a "Settings updated" banner', () => {
      cy.get('[data-test="reminders-yes"]').check()
      cy.get(`[data-test="reminder_days_0"]`).type(1)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_1"]`).type(10)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_2"]`).type(15)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_3"]`).type(20)
      cy.get('[data-test="add-another"]').click()
      cy.get(`[data-test="reminder_days_4"]`).type(365)
      cy.get(`[data-test="submit-button"]`).click()
      assertPayload('@saveNri', {
        reminder_days: [1, 10, 15, 20, 365],
        email_reminders_enabled: true,
      })
      cy.get('[data-test="flash"]').should('have.text', 'Settings updated')
    })
  })
})
