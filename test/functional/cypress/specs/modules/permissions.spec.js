// Todo: once all of Investments has all been built on React (including the tabs)
// we can then move it to the modules folder and add the missing test but for now
// its not using React router so there are no tests below.

const links = [
  {
    text: 'Companies',
    href: '/companies?archived[0]=false&sortby=modified_on:desc&page=1',
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

describe('DataHub module access', () => {
  context('Access to all modules', () => {
    before(() => {
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
    it('should be able to access Orders', () => {
      cy.visit('/omis')
      cy.get('h1').should('have.text', 'Orders (OMIS)')
    })
  })
  context('No access to Companies', () => {
    before(() => {
      cy.setModulePermissions(
        filteredPermissions('company.view_company', permissions)
      )
      cy.visit('/companies')
    })
    after(() => {
      cy.resetUser()
    })
    it('should only show the PERMITTED navigation links', () => {
      assertNavLinks(filteredLinks('Companies', links))
    })
    it('should NOT be able to access Companies', () => {
      assertNoPermissionsPage()
    })
  })
  context('No access to Contacts', () => {
    before(() => {
      cy.setModulePermissions(
        filteredPermissions('company.view_contact', permissions)
      )
      cy.visit('/contacts')
    })
    after(() => {
      cy.resetUser()
    })
    it('should only show the PERMITTED navigation links', () => {
      assertNavLinks(filteredLinks('Contacts', links))
    })
    it('should NOT be able to access Contacts', () => {
      assertNoPermissionsPage()
    })
  })
  context('No access to Events', () => {
    before(() => {
      cy.setModulePermissions(
        filteredPermissions('event.view_event', permissions)
      )
      cy.visit('/events')
    })
    after(() => {
      cy.resetUser()
    })
    it('should only show the PERMITTED navigation links', () => {
      assertNavLinks(filteredLinks('Events', links))
    })
    it('should NOT be able to access Events', () => {
      assertNoPermissionsPage()
    })
  })
  context('No access to Interactions', () => {
    before(() => {
      cy.setModulePermissions(
        filteredPermissions('interaction.view_all_interaction', permissions)
      )
      cy.visit('/interactions')
    })
    after(() => {
      cy.resetUser()
    })
    it('should only show the PERMITTED navigation links', () => {
      assertNavLinks(filteredLinks('Interactions', links))
    })
    it('should NOT be able to access Interactions', () => {
      assertNoPermissionsPage()
    })
  })
  context('No access to Orders', () => {
    before(() => {
      cy.setModulePermissions(
        filteredPermissions('order.view_order', permissions)
      )
      cy.visit('/omis')
    })
    after(() => {
      cy.resetUser()
    })
    it('should only show the PERMITTED navigation links', () => {
      assertNavLinks(filteredLinks('Orders', links))
    })
    it('should NOT be able to access Orders', () => {
      assertNoPermissionsPage()
    })
  })
})
