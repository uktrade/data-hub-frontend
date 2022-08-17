import React from 'react'
import { mount } from '@cypress/react'
import ArchivePanel from '../../../../src/client/components/ArchivePanel'

const archiveDate = '2019-12-10T18:07:27.864590Z'

const archivist = {
  first_name: 'Example',
  last_name: 'Archivist',
}

const unarchiveUrl = 'https://www.example.com'
const archiveReason = 'No longer needed'
const prefixedArchiveReason = 'Reason: ' + archiveReason

describe('ArchivePanel', () => {
  const Component = (props) => (
    <ArchivePanel
      isArchived={true}
      archivedOn={archiveDate}
      archiveReason={archiveReason}
      unarchiveUrl={unarchiveUrl}
      {...props}
    />
  )

  context('When the record is not archived', () => {
    beforeEach(() => {
      mount(
        <Component isArchived={false} type="company" archivedBy={archivist} />
      )
    })

    it('should not render the panel', () => {
      cy.get('[data-test-archive-panel]').should('not.exist')
    })
  })

  context('When the record has been archived normally', () => {
    beforeEach(() => {
      mount(<Component type="company" archivedBy={archivist} />)
    })

    it('should render the panel with the archivist name visible', () => {
      assertArchiveMessage(
        'This company was archived on 10 Dec 2019 by Example Archivist.'
      )
    })

    it('should render the archive reason', () => {
      assertArchiveReason()
    })

    it('should render the unarchive link', () => {
      assertUnarchiveLink()
    })
  })

  context('When the record has been archived automatically', () => {
    beforeEach(() => {
      mount(<Component type="contact" />)
    })

    it('should render the panel with the automatically archived text', () => {
      assertArchiveMessage(
        'This contact was automatically archived on 10 Dec 2019.'
      )
    })

    it('should render the archive reason', () => {
      assertArchiveReason()
    })

    it('should render the unarchive link', () => {
      assertUnarchiveLink()
    })
  })
})

const assertArchiveMessage = (message) => {
  cy.get('[data-test="archive-message"]')
    .should('exist')
    .should('have.text', message)
}

const assertArchiveReason = () => {
  cy.get('[data-test=archive-reason]')
    .should('exist')
    .should('have.text', prefixedArchiveReason)
}

const assertUnarchiveLink = () => {
  cy.get('[data-test=unarchive-link]')
    .should('exist')
    .should('have.attr', 'href', unarchiveUrl)
}
