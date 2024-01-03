import React from 'react'

import ContactTable from '../../../../../../src/client/modules/Omis/WorkOrderTables/ContactTable'
import {
  assertLink,
  assertSummaryTable,
} from '../../../../../functional/cypress/support/assertions'
import { STATUS } from '../../../../../../src/client/modules/Omis/constants'
import urls from '../../../../../../src/lib/urls'

const order = {
  id: '123',
  status: STATUS.DRAFT,
}

const inactiveOrder = {
  status: STATUS.COMPLETE,
}

const extraOrderFields = {
  contactPhone: '1-800-OMIS-ORDER',
  contactEmail: 'omisContact@example.com',
}

const contact = {
  id: '987',
  name: 'Andreas Test',
}

const extraContactFields = {
  jobTitle: 'Test job title',
  email: 'andreas.test@example.com',
  fullTelephoneNumber: '07372894094',
}

const orderAllFields = { ...order, ...extraOrderFields }
const contactAllFields = { ...contact, ...extraContactFields }

const assertEditLink = (id) => {
  it('should render the edit link', () => {
    assertLink('edit-contact-link', urls.omis.edit.contact(id))
  })
}

const assertContactLink = (id) => {
  it('should render the contact link', () => {
    assertLink('contact-link', urls.contacts.contact(id))
  })
}

const assertEmailLink = (email) => {
  it('should render the email link', () => {
    assertLink('email-link', `mailto:${email}`)
  })
}

describe('ContactTable', () => {
  context('When viewing a contact with all fields', () => {
    beforeEach(() => {
      cy.mount(<ContactTable order={order} contact={contactAllFields} />)
    })

    it('should render the contact details', () => {
      assertSummaryTable({
        dataTest: 'contact-table',
        heading: 'Contact',
        showEditLink: true,
        content: {
          Name: `${contactAllFields.name}, ${contactAllFields.jobTitle}`,
          Phone: contactAllFields.fullTelephoneNumber,
          Email: contactAllFields.email,
        },
      })
    })

    assertEditLink(order.id)
    assertContactLink(contact.id)
    assertEmailLink(contactAllFields.email)
  })

  context('When viewing a contact with missing fields', () => {
    beforeEach(() => {
      cy.mount(<ContactTable order={order} contact={contact} />)
    })

    it('should render the contact details', () => {
      assertSummaryTable({
        dataTest: 'contact-table',
        heading: 'Contact',
        showEditLink: true,
        content: {
          Name: contact.name,
          Phone: '',
          Email: '',
        },
      })
    })

    assertEditLink(order.id)
    assertContactLink(contact.id)

    it('should not render the email link', () => {
      cy.get('[data-test="email-link"]').should('not.exist')
    })
  })

  context('When viewing an order containning legacy contact details', () => {
    beforeEach(() => {
      cy.mount(<ContactTable order={orderAllFields} contact={contact} />)
    })

    it('should take the details from the order instead of the contact', () => {
      assertSummaryTable({
        dataTest: 'contact-table',
        heading: 'Contact',
        showEditLink: true,
        content: {
          Name: contact.name,
          Phone: orderAllFields.contactPhone,
          Email: orderAllFields.contactEmail,
        },
      })
    })

    assertEditLink(order.id)
    assertContactLink(contact.id)
    assertEmailLink(orderAllFields.contactEmail)
  })

  context('When viewing a complete order', () => {
    beforeEach(() => {
      cy.mount(
        <ContactTable order={inactiveOrder} contact={contactAllFields} />
      )
    })

    it('should render the contact details and no edit link', () => {
      assertSummaryTable({
        dataTest: 'contact-table',
        heading: 'Contact',
        showEditLink: false,
        content: {
          Name: `${contactAllFields.name}, ${contactAllFields.jobTitle}`,
          Phone: contactAllFields.fullTelephoneNumber,
          Email: contactAllFields.email,
        },
      })
    })

    assertContactLink(contact.id)
    assertEmailLink(contactAllFields.email)
  })
})
