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
  let wrapper

  context('When the date is in the future', () => {
    beforeEach(() => {
      wrapper = mount(
        <InvestmentEstimatedLandDate estimatedLandDate={futureDate} />
      )
    })

    it('should format and display the date correctly', () => {
      wrapper.should('have.text', 'Estimated land date')
      wrapper.should('have.text', '100 days')
      wrapper.should(
        'have.text',
        formatWithoutParsing(futureDate, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a green background', () => {
      wrapper.should('have.backgroundColour', rgba(BUTTON_COLOUR, 0.3))
    })
  })

  context('When the date is today', () => {
    beforeEach(() => {
      wrapper = mount(<InvestmentEstimatedLandDate estimatedLandDate={today} />)
    })

    it('should format and display the date correctly', () => {
      wrapper.should('have.text', 'Estimated land date')
      wrapper.should('have.text', '0 days')
      wrapper.should(
        'have.text',
        formatWithoutParsing(today, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a red background', () => {
      wrapper.should('have.backgroundColour', rgba(RED, 0.4))
    })
  })

  context('When the date is tomorrow', () => {
    beforeEach(() => {
      wrapper = mount(
        <InvestmentEstimatedLandDate estimatedLandDate={tomorrow} />
      )
    })

    it('should format and display the date correctly', () => {
      wrapper.should('have.text', 'Estimated land date')
      wrapper.should('have.text', '1 day')
      wrapper.should(
        'have.text',
        formatWithoutParsing(tomorrow, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a red background', () => {
      wrapper.should('have.backgroundColour', rgba(RED, 0.4))
    })
  })

  context('When the date is two months in the future', () => {
    beforeEach(() => {
      wrapper = mount(
        <InvestmentEstimatedLandDate estimatedLandDate={twoMonthsAhead} />
      )
    })

    it('should format and display the date correctly', () => {
      wrapper.should('have.text', 'Estimated land date')
      wrapper.should('have.text', '1 day')
      wrapper.should(
        'have.text',
        formatWithoutParsing(twoMonthsAhead, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a yellow background', () => {
      wrapper.should('have.backgroundColour', rgba(YELLOW, 0.5))
    })
  })

  context('When the date is in the past', () => {
    beforeEach(() => {
      wrapper = mount(
        <InvestmentEstimatedLandDate estimatedLandDate={pastDate} />
      )
    })

    it('should format and display the date correctly', () => {
      wrapper.should('have.text', 'Estimated land date')
      wrapper.should('have.text', '-10 days')
      wrapper.should(
        'have.text',
        formatWithoutParsing(pastDate, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a grey background', () => {
      wrapper.should('have.backgroundColour', rgba(GREY_2, 0.5))
    })
  })

  context('When the date is yesterday', () => {
    beforeEach(() => {
      wrapper = mount(
        <InvestmentEstimatedLandDate estimatedLandDate={yesterday} />
      )
    })

    it('should format and display the date correctly', () => {
      wrapper.should('have.text', 'Estimated land date')
      wrapper.should('have.text', '-1 day')
      wrapper.should(
        'have.text',
        formatWithoutParsing(yesterday, DATE_DAY_LONG_FORMAT)
      )
    })

    it('should render with a grey background', () => {
      wrapper.should('have.backgroundColour', rgba(GREY_2, 0.5))
    })
  })
})
