import React from 'react'

import { AttendeeList } from '../../../../../../src/client/modules/Events/StovaEventDetails/Attendees'
import {
  formatDate,
  DATE_FORMAT_FULL,
} from '../../../../../../src/client/utils/date-utils'
import { interactionsListFaker } from '../../../../../functional/cypress/fakers/interactions'
import {
  assertMetadataItem,
  assertTitle,
} from '../../../../../functional/cypress/support/collection-list-assertions'

describe('AttendeeList', () => {
  let interactions

  context('When component loads the collection list', () => {
    beforeEach(() => {
      interactions = interactionsListFaker(2, {
        date: '2018-12-10T13:45:00.000Z',
      })
    })

    it('should render default values when values are not found', () => {
      interactions[0].contacts[0].job_title = ''
      interactions[0].contacts[0].name = ''

      cy.mountWithProvider(<AttendeeList interactions={interactions} />)

      assertTitle('Not Available')
      assertMetadataItem(
        '[data-test=collection-item]',
        'Job title Not available'
      )
    })

    it('should render values from interaction', () => {
      interactions[0].contacts[0].job_title = 'Worker'
      interactions[0].contacts[0].name = 'Ima Contact'
      cy.mountWithProvider(<AttendeeList interactions={[interactions[0]]} />)

      assertTitle('Ima Contact')
      assertMetadataItem(
        '[data-test=collection-item]',
        `Company ${interactions[0].companies[0].name}`
      )
      assertMetadataItem(
        '[data-test=collection-item]',
        `Job title ${interactions[0].contacts[0].job_title}`
      )
      assertMetadataItem(
        '[data-test=collection-item]',
        `Date attended ${formatDate(interactions[0].date, DATE_FORMAT_FULL)}`
      )
      assertMetadataItem(
        '[data-test=collection-item]',
        `Service delivery ${interactions[0].service.name}`
      )
    })
  })
})
