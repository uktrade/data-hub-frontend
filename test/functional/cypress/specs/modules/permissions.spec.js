const links = [
  {
    text: 'Companies',
    href: '/companies?archived[0]=false&sortby=modified_on:desc&page=1&has_name[0]=true',
  },
  {
    text: 'Contacts',
    href: '/contacts?archived[0]=false&sortby=modified_on:desc&page=1',
  },
  {
    text: 'Events',
    href: '/events?page=1&sortby=modified_on:desc',
  },
  {
    text: 'Interactions',
    href: '/interactions?sortby=date:desc&page=1',
  },
  {
    text: 'Investments',
    href: '/investments?page=1&sortby=created_on:desc',
  },
  {
    text: 'Orders',
    href: '/omis?page=1&sortby=created_on:desc',
  },
]

const permissions = [
  'company.view_company',
  'company.view_contact',
  'event.view_event',
  'interaction.view_all_interaction',
  'investment.view_all_investmentproject',
  'order.view_order',
]

const filteredLinks = (link, links) => links.filter((x) => x.text !== link)

const filteredPermissions = (permission, permissions) =>
  permissions.filter((x) => x !== permission)

const assertNavLinks = (links) =>
  links.map((link, index) =>
    cy
      .get('[data-test="primary-navigation"] li a')
      .eq(index)
      .should('have.text', link.text)
      .should('have.attr', 'href', link.href)
  )

const assertNoPermissionsPage = () =>
  cy
    .get('h1')
    .should('have.text', "You don't have permission to view this page")

const assertNoAccess = (permission, link, name) => {
  beforeEach(() => {
    cy.setModulePermissions(filteredPermissions(permission, permissions))
    cy.visit(link)
  })
  after(() => {
    cy.resetUser()
  })
  it('should only show the PERMITTED navigation links', () => {
    assertNavLinks(filteredLinks(name, links))
  })
  it(`should NOT be able to access ${name}`, () => {
    assertNoPermissionsPage()
  })
}

describe('DataHub module access', () => {
  context('Access to all modules', () => {
    beforeEach(() => {
      cy.setModulePermissions(permissions)
      cy.visit('/companies')
    })
    after(() => {
      cy.resetUser()
    })
    it('should show all the navigation links', () => {
      assertNavLinks(links)
    })
    it('should be able to access Companies', () => {
      cy.get('h1').should('have.text', 'Companies')
    })
    it('should be able to access Contacts', () => {
      cy.visit('/contacts')
      cy.get('h1').should('have.text', 'Contacts')
    })
    it('should be able to access Events', () => {
      cy.visit('/events')
      cy.get('h1').should('have.text', 'Events')
    })
    it('should be able to access Interactions', () => {
      cy.visit('/interactions')
      cy.get('h1').should('have.text', 'Interactions')
    })
    it('should be able to access Investments', () => {
      cy.visit('/investments')
      cy.get('h1').should('have.text', 'Projects')
    })
    it('should be able to access Orders', () => {
      cy.visit('/omis')
      cy.get('h1').should('have.text', 'Orders (OMIS)')
    })
  })
  context('No access to Companies', () => {
    assertNoAccess('company.view_company', '/companies', 'Companies')
  })
  context('No access to Contacts', () => {
    assertNoAccess('company.view_contact', '/contacts', 'Contacts')
  })
  context('No access to Events', () => {
    assertNoAccess('event.view_event', '/events', 'Events')
  })
  context('No access to Interactions', () => {
    assertNoAccess(
      'interaction.view_all_interaction',
      '/interactions',
      'Interactions'
    )
  })
  context('No access to Investments', () => {
    assertNoAccess(
      'investment.view_all_investmentproject',
      '/investments',
      'Investments'
    )
  })
  context('No access to Orders', () => {
    assertNoAccess('order.view_order', '/omis', 'Orders')
  })
})
