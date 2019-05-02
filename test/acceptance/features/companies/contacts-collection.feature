# TODO archived filters and sort
@companies-contact-collection @collection
Feature: View collection of contacts for a company
  As an existing user
  I would like to view all the Contacts for my company in one place
  And be able to read the contact details as expected

  @companies-contact-collection--view
  Scenario: View companies contact collection
    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And the results summary for a contact collection is present
    And I click the "Add contact" link
    And a primary contact is added
    And I submit the form
    Then I see the success message
    Then I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I can view the Contact in the collection
      | text         | expected                |
      | Sector       | company.sector          |
      | Country      | company.country         |
      | UK region    | company.ukRegion        |
    And the Contact has badges
      | text         | expected                |
      | Contact type | contact.type            |
