import React from 'react'
import { H1 } from '@govuk-react/heading'

import FieldChoice from '../../../../../../src/client/components/Form/elements/FieldChoice'
import { Form } from '../../../../../../src/client/components'

import {
  assertFieldErrorStrict,
  assertFieldRadiosStrict,
  assertFieldRadioSelected,
  assertFieldCheckboxesStrict,
  assertFieldCheckboxesChecked,
  assertFieldRadiosNotSelected,
} from '../../../../../functional/cypress/support/assertions'

const OPTIONS = [
  {
    value: '1',
    label: 'England',
  },
  {
    value: '2',
    label: 'Wales',
  },
  {
    value: '3',
    label: 'Scotland',
  },
  {
    value: '4',
    label: 'Northern Ireland',
  },
]

describe('FieldChoice', () => {
  const FORM_PROPS = {
    id: 'some-form',
    analyticsFormName: 'some-form',
    cancelRedirectTo: () => '/',
    submissionTaskName: 'EMPTY',
  }

  context('Radio buttons', () => {
    it('should render radio buttons', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice type="radio" name="country" options={OPTIONS} />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
      })
      assertFieldRadiosNotSelected({ inputName: 'country' })
    })

    it('should preselect the second radio button (Wales)', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS} initialValues={{ country: [OPTIONS[1]] }}>
          <FieldChoice name="country" type="radio" options={OPTIONS} />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
      })
      assertFieldRadioSelected({
        inputName: 'country',
        selectedIndex: 1,
      })
    })

    it('should render a hint', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice
            type="radio"
            name="country"
            options={OPTIONS}
            hint="My hint"
          />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
        hint: 'My hint',
      })
    })

    it('should render a legend', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice
            name="country"
            type="radio"
            options={OPTIONS}
            legend={<H1>My H1 legend</H1>}
          />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
        legend: 'My H1 legend',
      })
    })

    it('should render an error when saving', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice
            type="radio"
            name="country"
            options={OPTIONS}
            required="Select at least one country"
          />
        </Form>
      )
      cy.get(`[data-test="submit-button"]`).click()
      assertFieldErrorStrict({
        inputName: 'country',
        errorMessage: 'Select at least one country',
      })
    })
  })

  context('Boolean radio buttons', () => {
    it('should render 2 radio buttons "Yes" and "No"', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice.Boolean name="has_changed_name" />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'has_changed_name',
        options: ['Yes', 'No'],
      })
      assertFieldRadiosNotSelected({ inputName: 'has_changed_name' })
    })

    it('should render a label', () => {
      const label = 'Have you changed your name?'
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice.Boolean name="has_changed_name" label={label} />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'has_changed_name',
        options: ['Yes', 'No'],
        label,
      })
    })

    it('should render a label and hint', () => {
      const label = 'Have you changed your name?'
      const hint =
        'This includes changing your last name or spelling your name differently.'
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice.Boolean
            name="has_changed_name"
            label={label}
            hint={hint}
          />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'has_changed_name',
        options: ['Yes', 'No'],
        label,
        hint,
      })
    })

    it('should render custom labels', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice.Boolean
            name="has_changed_name"
            label="Have you changed your name?"
            yesLabel="Agree"
            noLabel="Disagree"
          />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'has_changed_name',
        options: ['Agree', 'Disagree'],
      })
    })

    it('should render a legend', () => {
      const legend = <H1>H1 legend</H1>
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice.Boolean name="has_changed_name" legend={legend} />
        </Form>
      )
      assertFieldRadiosStrict({
        inputName: 'has_changed_name',
        options: ['Yes', 'No'],
        legend: 'H1 legend',
      })
    })

    it('should preselect "Yes"', () => {
      const selectedOption = { value: true, label: 'Yes' }
      cy.mountWithProvider(
        <Form
          {...FORM_PROPS}
          initialValues={{ has_changed_name: selectedOption }}
        >
          <FieldChoice.Boolean name="has_changed_name" />
        </Form>
      )
      assertFieldRadioSelected({
        inputName: 'has_changed_name',
        selectedIndex: 0,
      })
    })
  })

  context('Checkboxes', () => {
    it('should render checkboxes', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice type="checkbox" name="country" options={OPTIONS} />
        </Form>
      )
      assertFieldCheckboxesStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
      })
    })

    it('should check the first and second checkboxes', () => {
      cy.mountWithProvider(
        <Form
          {...FORM_PROPS}
          initialValues={{ country: [OPTIONS[0], OPTIONS[1]] }}
        >
          <FieldChoice type="checkbox" name="country" options={OPTIONS} />
        </Form>
      )
      assertFieldCheckboxesChecked({
        inputName: 'country',
        selectedIndices: [0, 1],
      })
    })

    it('should render a hint', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice
            type="checkbox"
            name="country"
            options={OPTIONS}
            hint="My hint"
          />
        </Form>
      )
      assertFieldCheckboxesStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
        hint: 'My hint',
      })
    })

    it('should render a legend', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice
            type="checkbox"
            name="country"
            options={OPTIONS}
            legend={<H1>My H1 legend</H1>}
          />
        </Form>
      )
      assertFieldCheckboxesStrict({
        inputName: 'country',
        options: OPTIONS.map((x) => x.label),
        legend: 'My H1 legend',
      })
    })

    it('should render an error when saving', () => {
      cy.mountWithProvider(
        <Form {...FORM_PROPS}>
          <FieldChoice
            type="checkbox"
            name="country"
            options={OPTIONS}
            required="Choose one or more countries"
          />
        </Form>
      )
      cy.get(`[data-test="submit-button"]`).click()
      assertFieldErrorStrict({
        inputName: 'country',
        errorMessage: 'Choose one or more countries',
      })
    })
  })
})
