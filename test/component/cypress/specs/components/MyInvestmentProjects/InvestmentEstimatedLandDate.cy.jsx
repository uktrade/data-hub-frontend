import React from 'react'
import { addDays, subDays } from 'date-fns'

import InvestmentEstimatedLandDate from '../../../../../../src/client/components/MyInvestmentProjects/InvestmentEstimatedLandDate'
import {
  BUTTON_COLOUR,
  GREY_2,
  RED,
  YELLOW,
  rgba,
} from '../../../../../../src/client/utils/colours'

const {
  formatDate,
  DATE_FORMAT_FULL_DAY,
} = require('../../../../../../src/client/utils/date-utils')

const today = new Date()
const futureDate = addDays(today, 100)
const tomorrow = addDays(today, 1)
const twoMonthsAhead = addDays(today, 60)
const pastDate = subDays(today, 10)
const yesterday = subDays(today, 1)

describe('InvestmentEstimatedLandDate', () => {
  const Component = (props) => <InvestmentEstimatedLandDate {...props} />

  context('When the date is in the future', () => {
    beforeEach(() => {
      cy.mount(<Component estimatedLandDate={futureDate} />)
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
        formatDate(futureDate, DATE_FORMAT_FULL_DAY)
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
      cy.mount(<Component estimatedLandDate={today} />)
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
        formatDate(today, DATE_FORMAT_FULL_DAY)
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
      cy.mount(<Component estimatedLandDate={tomorrow} />)
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
        formatDate(tomorrow, DATE_FORMAT_FULL_DAY)
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
      cy.mount(<Component estimatedLandDate={twoMonthsAhead} />)
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
        formatDate(twoMonthsAhead, DATE_FORMAT_FULL_DAY)
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
      cy.mount(<Component estimatedLandDate={pastDate} />)
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
        formatDate(pastDate, DATE_FORMAT_FULL_DAY)
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
      cy.mount(<Component estimatedLandDate={yesterday} />)
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
        formatDate(yesterday, DATE_FORMAT_FULL_DAY)
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
