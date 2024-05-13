import React from 'react'

import FieldTextarea from '../../../../../../src/client/components/Form/elements/FieldTextarea'
import { ERROR_COLOUR, BLACK } from '../../../../../../src/client/utils/colours'
import { Form } from '../../../../../../src/client/components'

describe('FieldTextArea', () => {
  context('When providing default props', () => {
    it('should display a label', () => {
      cy.mountWithProvider(
        <Form
          id="any-form"
          analyticsFormName="any-form"
          cancelRedirectTo={() => '/'}
          submissionTaskName="TASK_SAVE"
        >
          <FieldTextarea name="notes" label="Summary of the support given" />
        </Form>
      )
      cy.get('[data-test=field-notes] label').should(
        'have.text',
        'Summary of the support given'
      )
    })
    it('should display a hint text', () => {
      cy.mountWithProvider(
        <Form
          id="any-form"
          analyticsFormName="any-form"
          cancelRedirectTo={() => '/'}
          submissionTaskName="TASK_SAVE"
        >
          <FieldTextarea name="notes" hint="Outline something in 100 words" />
        </Form>
      )
      cy.get('[data-test=hint-text]').should(
        'have.text',
        'Outline something in 100 words'
      )
    })
    it('should display a textarea without a word count', () => {
      cy.mountWithProvider(
        <Form
          id="any-form"
          analyticsFormName="any-form"
          cancelRedirectTo={() => '/'}
          submissionTaskName="TASK_SAVE"
        >
          <FieldTextarea name="notes" />
        </Form>
      )
      cy.get('[data-test=textarea]').should('exist')
      cy.get('[data-test=textarea]').should('be.visible')
      cy.get('[data-test=word-count]').should('not.exist')
      cy.get('[data-test=submit-button]').click()
    })
  })

  context('When setting the maxWords prop', () => {
    beforeEach(() => {
      const MAX_WORDS = 3
      cy.mountWithProvider(
        <Form
          id="any-form"
          analyticsFormName="any-form"
          cancelRedirectTo={() => '/'}
          submissionTaskName="TASK_SAVE"
        >
          <FieldTextarea name="notes" maxWords={MAX_WORDS} />
        </Form>
      )
    })
    it('should display a small paragraph of text', () => {
      cy.get('[data-test=word-count]').should('exist')
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 3 words remaining.'
      )
    })
    it('should update the paragraph of text after typing one word', () => {
      cy.get('[data-test=textarea]').type('foo')
      cy.get('[data-test=word-count]').should('have.colour', BLACK)
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 2 words remaining.'
      )
    })
    it('should update the paragraph of text after typing two words', () => {
      cy.get('[data-test=textarea]').type('foo bar')
      cy.get('[data-test=word-count]').should('have.colour', BLACK)
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 1 word remaining.'
      )
    })
    it('should update the paragraph of text after typing three words', () => {
      cy.get('[data-test=textarea]').type('foo bar baz')
      cy.get('[data-test=word-count]').should('have.colour', BLACK)
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 0 words remaining.'
      )
    })
    it('should update the paragraph of text after typing four words', () => {
      cy.get('[data-test=textarea]').type('foo bar baz foo')
      cy.get('[data-test=word-count]').should('have.colour', ERROR_COLOUR)
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 1 word too many.'
      )
    })
    it('should update the paragraph of text after typing five words', () => {
      cy.get('[data-test=textarea]').type('foo bar baz foo bar')
      cy.get('[data-test=word-count]').should('have.colour', ERROR_COLOUR)
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 2 words too many.'
      )
    })
    it('should update the paragraph of text after typing six words', () => {
      cy.get('[data-test=textarea]').type('foo bar baz foo bar baz')
      cy.get('[data-test=word-count]').should('have.colour', ERROR_COLOUR)
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 3 words too many.'
      )
    })
    it('should count hyphenated words as a single word', () => {
      cy.get('[data-test=textarea]').type('editor-in-chief')
      cy.get('[data-test=word-count]').should(
        'have.text',
        'You have 2 words remaining.'
      )
    })
  })

  context('When setting the maxWords prop and error handling', () => {
    beforeEach(() => {
      const MAX_WORDS = 3
      cy.mountWithProvider(
        <Form
          id="any-form"
          analyticsFormName="any-form"
          cancelRedirectTo={() => '/'}
          submissionTaskName="TASK_SAVE"
        >
          <FieldTextarea
            name="notes"
            maxWords={MAX_WORDS}
            required="Enter a summary"
            invalid={`Summary must be ${MAX_WORDS} words or less`}
          />
        </Form>
      )
    })
    it('should display an error when the user submits without entering a word', () => {
      cy.get('[data-test=submit-button]').click()
      cy.get('[data-test=textarea-error]').should(
        'have.text',
        'Enter a summary'
      )
    })
    it('should display an error when the user submits with too many words', () => {
      cy.get('[data-test=textarea]').type('foo bar baz foo')
      cy.get('[data-test=submit-button]').click()
      cy.get('[data-test=textarea-error]').should(
        'have.text',
        'Summary must be 3 words or less'
      )
    })
  })
})
