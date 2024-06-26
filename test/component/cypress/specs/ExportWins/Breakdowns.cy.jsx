import React from 'react'

import { Breakdowns } from '../../../../../src/client/modules/ExportWins/Form/Breakdowns'
import { Form } from '../../../../../src/client/components'

describe('Breakdowns', () => {
  context('when rendering an export win - sequential years', () => {
    it('should render all elements of the component', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{}}
          />
        </Form>
      )
      cy.get('[data-test="label"]').should(
        'have.text',
        'Export value over the next 5 years'
      )
      cy.get('[data-test="hint"]').should('have.text', '(round to nearest £)')
      cy.get('input[type="text"]').should('have.length', 5)
      const expected = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
      expected.forEach((year, index) => {
        cy.get(`[data-test="field-export_win_${index}"]`)
          .find('label')
          .should('have.text', year)
      })
    })

    it('should render an export win value over 5 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '1000000',
              export_win_2: '1000000',
              export_win_3: '1000000',
              export_win_4: '1000000',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 5 years: £5,000,000'
      )
    })

    it('should render an export win value over 4 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '1000000',
              export_win_2: '1000000',
              export_win_3: '1000000',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 4 years: £4,000,000'
      )
    })

    it('should render an export win value over 3 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '1000000',
              export_win_2: '1000000',
              export_win_3: '',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 3 years: £3,000,000'
      )
    })

    it('should render an export win value over 2 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '1000000',
              export_win_2: '',
              export_win_3: '',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 2 years: £2,000,000'
      )
    })

    it('should render an export win value over 1 year', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '',
              export_win_2: '',
              export_win_3: '',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 1 year: £1,000,000'
      )
    })

    it('should render an export win value over 0 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '',
              export_win_1: '',
              export_win_2: '',
              export_win_3: '',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 0 years: £0'
      )
    })
  })

  context('when rendering an export win - sporadic years', () => {
    it('should render an export win value over 5 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '',
              export_win_2: '1000000',
              export_win_3: '',
              export_win_4: '1000000',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 5 years: £3,000,000'
      )
    })

    it('should render an export win value over 4 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '',
              export_win_1: '1000000',
              export_win_2: '',
              export_win_3: '1000000',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 4 years: £2,000,000'
      )
    })

    it('should render an export win value over 3 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '1000000',
              export_win_1: '',
              export_win_2: '1000000',
              export_win_3: '',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 3 years: £2,000,000'
      )
    })

    it('should render an export win value over 2 years', () => {
      cy.mountWithProvider(
        <Form id="exportwin-form">
          <Breakdowns
            label="Export value over the next 5 years"
            name="export_win"
            values={{
              export_win_0: '',
              export_win_1: '1000000',
              export_win_2: '',
              export_win_3: '',
              export_win_4: '',
            }}
          />
        </Form>
      )
      cy.get('[data-test="total"]').should(
        'have.text',
        'Totalling over 2 years: £1,000,000'
      )
    })
  })
})
