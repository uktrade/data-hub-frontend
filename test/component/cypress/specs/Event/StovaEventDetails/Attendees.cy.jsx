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
import { assertMetadataItems } from '../../../support/activity-assertions'

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
      assertMetadataItem('[data-test=collection-item]', 'Not available')
    })

    it('should render values from interaction', () => {
      interactions[0].contacts[0].job_title = 'Worker'
      interactions[0].contacts[0].name = 'Ima Contact'
      cy.mountWithProvider(<AttendeeList interactions={[interactions[0]]} />)

      assertTitle('Ima Contact')
      assertMetadataItems([
        { label: 'Company', value: `${interactions[0].companies[0].name}` },
        {
          label: 'Job title',
          value: `${interactions[0].contacts[0].job_title}`,
        },
        {
          label: 'Date attended',
          value: `${formatDate(interactions[0].date, DATE_FORMAT_FULL)}`,
        },
        { label: 'Service delivery', value: `${interactions[0].service.name}` },
      ])
    })
  })
})
