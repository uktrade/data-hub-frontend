@contacts-collection
Feature: View Collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @contacts-collection--view
  Scenario: View contact collection

    Given a company is created for contacts
    When navigating to the company contacts
    And a primary contact is added
    Then I see the success message
    When I navigate to the Contacts collection page
    Then there are Contacts headings
    And I can view the Contact in the collection
      | label   | statePath      |
      | Company | company.name   |
      | Sector  | company.sector |
      | Updated |                |
    And the Contact has badges
      | text           |
      | Primary        |
      | United Kingdom |
