# TODO archived filters and sort
@companies-contact-collection @collection
Feature: View collection of contacts for a company
  As an existing user
  I would like to view all the Contacts for my company in one place
  And be able to read the contact details as expected

  @companies-contact-collection--view
  Scenario: View companies contact collection

    Given I navigate to company fixture Lambda plc
    When I click the Contacts local nav link
    And I click the "Add contact" link
    And a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    And I confirm I am on the Lambda plc page
    Then I capture the modified on date for the first item
    And the results summary for a contact collection is present
    And I can view the Contact in the collection
      | text          | expected           |
      | Job title     | contact.jobTitle   |
      | Sector        | company.sector     |
      | Country       | company.country    |
      | UK region     | company.ukRegion   |
      | Telephone     | contact.telephone  |
      | Email address | contact.email      |
    And the Contact has badges
      | text         | expected           |
      | Contact type | contact.type       |
    And the Contact displays the modified time

  @companies-contact-collection--filter
  Scenario: Filter companies contact list

    Given I navigate to company fixture Lambda plc
    When I click the Contacts local nav link
    And I click the "Add contact" link
    And a primary contact with new company address is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
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

    Given I navigate to company fixture Lambda plc
    When I click the Contacts local nav link
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then I confirm I am on the Lambda plc page
    And the results summary for a contact collection is present
    When the contacts are sorted by Newest
    When the contacts are sorted by Oldest
    Then the contacts should have been correctly sorted by creation date
    When the contacts are sorted by Recently updated
    When the contacts are sorted by Least recently updated
    Then the contacts should have been correctly sorted for date fields
    When the contacts are sorted by Last name: A-Z
    Then the contacts should have been correctly sorted for text fields
    When the contacts are sorted by Country: A-Z
    Then the contacts should have been correctly sorted for text fields
