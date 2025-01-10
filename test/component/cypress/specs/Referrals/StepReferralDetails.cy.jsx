import React from 'react'

import StepReferralDetails from '../../../../../src/client/modules/Companies/Referrals/SendReferralForm/StepReferralDetails'

import { companyFaker } from '../../../../functional/cypress/fakers/companies'
import { contactFaker } from '../../../../functional/cypress/fakers/contacts'
import { taskFaker } from '../../../../functional/cypress/fakers/task'

import { Form } from '../../../../../src/client/components'

const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../../test/selectors')
const {
  assertFieldTypeahead,
  assertFieldTextarea,
  assertLink,
} = require('../../../../functional/cypress/support/assertions')

const enterSubjectDefault = () =>
  cy.get(selectors.sendReferral.subjectField).click().type('Example subject')

const enterNotesDefault = () =>
  cy.get(selectors.sendReferral.notesField).click().type('Example notes')

describe('StepReferralDetails component', () => {
  const company = companyFaker()
  const companyContacts = [contactFaker()]
  const task = taskFaker()
  const cancelUrl = urls.companies.detail(company.id)

  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <div>
          <Form id="export-form">
            <StepReferralDetails
              companyId={company.id}
              companyContacts={companyContacts}
              openContactFormTask={task}
            />
          </Form>
        </div>
      )
    })

    context('when viewing the "send referral" form', () => {
      it('should display guidance on sending a referral', () => {
        cy.get('h2')
          .contains('When to send a referral')
          .next()
          .should(
            'have.text',
            'Referrals are for when you want to ask another DBT advisor to help out an account you are working on.Read more guidance here (opens in new tab)'
          )

        assertLink('referral-guidance', urls.external.helpCentre.referrals)
      })

      it('should display the headings and four fields', () => {
        cy.contains('Who do you want to refer this company to?').should(
          'be.visible'
        )

        cy.get(selectors.sendReferral.adviserField).then((element) => {
          return assertFieldTypeahead({
            element,
            label: 'Adviser',
            placeholder: 'Search for an adviser',
            hint: "This can be an adviser at post, a sector specialist or an international trade advisor. If you're not sure, you can find the right team and person on the Intranet (opens in new tab).",
          })
        })

        cy.contains('Referral notes').should('be.visible')

        enterSubjectDefault()

        cy.get(selectors.sendReferral.notesField).then((element) => {
          return assertFieldTextarea({
            element,
            label: 'Notes',
            hint: "Include reasons you're referring this company and any specific opportunities.",
          })
        })

        cy.get(selectors.sendReferral.contactField).then((element) => {
          return assertFieldTypeahead({
            element,
            label: 'Company contact (optional)',
            placeholder: 'Select a contact',
            hint: 'Who should the recipient of the referral talk to? If the contact you are looking for is not listed you can add a new contact.',
          })
        })
      })

      it('should display "Continue" button', () => {
        cy.contains('button', 'Continue').should('be.visible')
      })

      it('should display "Cancel" link', () => {
        cy.contains('a', 'Cancel').should('be.visible')
      })
    })

    context('the "Cancel" button link', () => {
      it('should contain the correct link', () => {
        assertLink('referral-details-cancel', cancelUrl)
      })
    })

    context(
      'when "Continue" button is clicked without filling in mandatory fields',
      () => {
        it('should display two error messages', () => {
          cy.contains('button', 'Continue').click()
          cy.get('form')
            .should('contain', 'Select an adviser for the referral')
            .and('contain', 'Enter a subject for the referral')
            .and('contain', 'Enter notes for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without chosing an adviser',
      () => {
        it('should display error message', () => {
          enterSubjectDefault()
          enterNotesDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should('contain', 'Select an adviser for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying a subject',
      () => {
        it('should display error message', () => {
          enterNotesDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should(
            'contain',
            'Enter a subject for the referral (Max 255 characters)'
          )
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying notes',
      () => {
        it('should display error message', () => {
          enterSubjectDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should('contain', 'Enter notes for the referral')
        })
      }
    )

    context(
      'when more than 255 characters are entered in the subject field',
      () => {
        it('should display error message', () => {
          cy.get(selectors.sendReferral.subjectField)
            .click()
            .type(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec interdum velit. Nulla facilisi. In ultricies sed ex at malesuada. Proin quis faucibus felis, iaculis malesuada sem. Maecenas semper elit magna, tincidunt consectetur risus volutpat at. Sed'
            )
          cy.contains('button', 'Continue').click()
          cy.get('form').should(
            'contain',
            'Enter a subject for the referral (Max 255 characters)'
          )
        })
      }
    )
  })
})
