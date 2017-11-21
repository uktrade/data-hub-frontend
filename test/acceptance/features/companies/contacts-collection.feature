# TODO archived filters and sort
@companies-contact-collection @collection
Feature: View collection of contacts for a company
  As an existing user
  I would like to view all the Contacts for my company in one place
  And be able to read the contact details as expected

  @companies-contact-collection--view
  Scenario: View companies contact collection

    Given I navigate to the Company Lambda plc
    When I navigate to the companies contacts page
    And I click the "Add contact" link
    And a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    And I confirm I am on the Lambda plc page
    Then I capture the modified on date for the first item
    And the results count header for contacts is present
    And I can view the Contact in the collection
      | text         | expected           |
      | Sector       | company.sector     |
      | Updated      | collection.updated |
      | Country      | company.country    |
      | Uk Region    | company.ukRegion   |
    And the Contact has badges
      | text         | expected           |
      | Contact type | contact.type       |

  @companies-contact-collection--filter
  Scenario: Filter companies contact list

    Given I navigate to the Company Lambda plc
    When I navigate to the companies contacts page
    And I click the "Add contact" link
    And a primary contact with new company address is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then I confirm I am on the Lambda plc page
    And the results count header for contacts is present
    When I filter the contacts list by sector
    Then the contacts should be filtered by company sector
    When the sector filter is cleared
    Then there are no filters selected
    And the result count should be reset
    When I filter the contacts list by country
    Then the contacts should be filtered to show badge company country
    When the country filter is cleared
    Then there are no filters selected
    And the result count should be reset


  @companies-contact-collection--sort
  Scenario: Sort companies contact list

    Given I navigate to the Company Lambda plc
    When I navigate to the companies contacts page
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then I confirm I am on the Lambda plc page
    And the results count header for contacts is present
    When the contacts are sorted by Newest
    When the contacts are sorted by Oldest
    Then the contacts should have been correctly sorted by creation date
    When the contacts are sorted by Recently updated
    When the contacts are sorted by Least recently updated
    Then the contacts should have been correctly sorted for date fields
    When the contacts are sorted by First name: A-Z
    When the contacts are sorted by First name: Z-A
    Then the contacts should have been correctly sorted for text fields
    When the contacts are sorted by Country: A-Z
    When the contacts are sorted by Country: Z-A
    Then the contacts should have been correctly sorted for text fields

