import React from 'react'
import { mount } from '@cypress/react'
import InvestmentEstimatedLandDate from '../../../../src/client/components/MyInvestmentProjects/InvestmentEstimatedLandDate'
import { DATE_DAY_LONG_FORMAT } from '../../../../src/common/constants'
import { BUTTON_COLOUR, GREY_2, RED, YELLOW } from 'govuk-colours'
import { rgba } from '../../../../src/client/utils/colors'

const {
  addDays,
  formatWithoutParsing,
  subtractDays,
} = require('../../../../src/client/utils/date')

const today = new Date()
const futureDate = addDays(today, 100)
const tomorrow = addDays(today, 1)
const twoMonthsAhead = addDays(today, 60)
const pastDate = subtractDays(today, 10)
const yesterday = subtractDays(today, 1)

describe('InvestmentEstimatedLandDate', () => {
  const Component = (props) => <InvestmentEstimatedLandDate {...props} />

  context('When the date is in the future', () => {
    beforeEach(() => {
      mount(<Component estimatedLandDate={futureDate} />)
    })

    it('should format and display the date correctly', () => {
      cy.get('[data-test="estimated-land-date-label"]').should(
        'have.text',
        'Estimated land date'
      )
      cy.get('[data-test="estimated-land-date-countdown"]').should(
        'have.text',
        '100 days'
      )
      cy.get('[data-test="estimated-land-date-date"]').should(
        'have.text',
        formatWithoutParsing(futureDate, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a green background', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'have.backgroundColour',
        rgba(BUTTON_COLOUR, 0.3)
      )
    })
  })

  context('When the date is today', () => {
    beforeEach(() => {
      mount(<Component estimatedLandDate={today} />)
    })

    it('should format and display the date correctly', () => {
      cy.get('[data-test="estimated-land-date-label"]').should(
        'have.text',
        'Estimated land date'
      )
      cy.get('[data-test="estimated-land-date-countdown"]').should(
        'have.text',
        '0 days'
      )
      cy.get('[data-test="estimated-land-date-date"]').should(
        'have.text',
        formatWithoutParsing(today, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a red background', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'have.backgroundColour',
        rgba(RED, 0.4)
      )
    })
  })

  context('When the date is tomorrow', () => {
    beforeEach(() => {
      mount(<Component estimatedLandDate={tomorrow} />)
    })

    it('should format and display the date correctly', () => {
      cy.get('[data-test="estimated-land-date-label"]').should(
        'have.text',
        'Estimated land date'
      )
      cy.get('[data-test="estimated-land-date-countdown"]').should(
        'have.text',
        '1 day'
      )
      cy.get('[data-test="estimated-land-date-date"]').should(
        'have.text',
        formatWithoutParsing(tomorrow, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a red background', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'have.backgroundColour',
        rgba(RED, 0.4)
      )
    })
  })

  context('When the date is two months in the future', () => {
    beforeEach(() => {
      mount(<Component estimatedLandDate={twoMonthsAhead} />)
    })

    it('should format and display the date correctly', () => {
      cy.get('[data-test="estimated-land-date-label"]').should(
        'have.text',
        'Estimated land date'
      )
      cy.get('[data-test="estimated-land-date-countdown"]').should(
        'have.text',
        '60 days'
      )
      cy.get('[data-test="estimated-land-date-date"]').should(
        'have.text',
        formatWithoutParsing(twoMonthsAhead, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a yellow background', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'have.backgroundColour',
        rgba(YELLOW, 0.5)
      )
    })
  })

  context('When the date is in the past', () => {
    beforeEach(() => {
      mount(<Component estimatedLandDate={pastDate} />)
    })

    it('should format and display the date correctly', () => {
      cy.get('[data-test="estimated-land-date-label"]').should(
        'have.text',
        'Estimated land date'
      )
      cy.get('[data-test="estimated-land-date-countdown"]').should(
        'have.text',
        '-10 days'
      )
      cy.get('[data-test="estimated-land-date-date"]').should(
        'have.text',
        formatWithoutParsing(pastDate, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a grey background', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'have.backgroundColour',
        rgba(GREY_2, 0.5)
      )
    })
  })

  context('When the date is yesterday', () => {
    beforeEach(() => {
      mount(<Component estimatedLandDate={yesterday} />)
    })

    it('should format and display the date correctly', () => {
      cy.get('[data-test="estimated-land-date-label"]').should(
        'have.text',
        'Estimated land date'
      )
      cy.get('[data-test="estimated-land-date-countdown"]').should(
        'have.text',
        '-1 day'
      )
      cy.get('[data-test="estimated-land-date-date"]').should(
        'have.text',
        formatWithoutParsing(yesterday, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a grey background', () => {
      cy.get('[data-test="estimated-land-date"]').should(
        'have.backgroundColour',
        rgba(GREY_2, 0.5)
      )
    })
  })
})
