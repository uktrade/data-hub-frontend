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
      | text         | expected           |
      | Sector       | company.sector     |
      | Country      | company.country    |
      | UK region    | company.ukRegion   |
    And the Contact has badges
      | text         | expected           |
      | Contact type | contact.type       |

  @companies-contact-collection--filter
  Scenario: Filter companies contact list
    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    And a primary contact with new company address is added
    When I submit the form
    Then I see the success message
    Then I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    Then I confirm I am on the Lambda plc page
    And the results summary for a contact collection is present
    When I clear all filters
    Then there are no filters selected
    And I filter the contacts list by contact
    Then the contacts should be filtered by contact name
    When I clear all filters
    Then there are no filters selected
    Then I filter the contacts list by active status
    And the result count should be reset


  @companies-contact-collection--sort
  Scenario: Sort companies contact list
    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    Then I confirm I am on the Lambda plc page
    And the results summary for a contact collection is present
    When the contacts are sorted by Newest
    When the contacts are sorted by Oldest
    Then the contacts should have been correctly sorted by creation date
    And the results are sorted by Recently updated
    Then the results should be sorted by Recently updated
    And the results are sorted by Least recently updated
    Then the results should be sorted by Least recently updated
    # When the contacts are sorted by Last name: A-Z
    # Then the contacts should have been correctly sorted for text fields TODO: potential bug being investigated (contacts dont appear to sort correctly)
    # When the contacts are sorted by Country: A-Z
    # Then the contacts should have been correctly sorted for text fields TODO: All the countries in the test data are identical
