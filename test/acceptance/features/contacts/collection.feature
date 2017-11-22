@contacts-collection @collection
Feature: View collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @contacts-collection--view
  Scenario: View contact collection

    Given a company is created
    When navigating to the company contacts
    When I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    Then I capture the modified on date for the first item
    When I navigate to the Contacts collection page
    Then I confirm I am on the Contacts page
    And the results count header for contacts is present
    And I can view the Contact in the collection
      | text         | expected           |
      | Company      | company.name       |
      | Sector       | company.sector     |
      | Updated      | collection.updated |
      | Country      | company.country |
      | Uk Region    | company.ukRegion |
    And the Contact has badges
      | text         | expected           |
      | Contact type | contact.type       |

  @contacts-collection--filter
  Scenario: Filter contact list

    Given a company is created
    When navigating to the company contacts
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the Contacts collection page
    When the status filter is cleared
    Then there are no filters selected
    And I filter the contacts list by company
    Then the contacts should be filtered by company name
    When the company filter is cleared
    Then there are no filters selected
    And the result count should be reset
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
    When I filter the contacts list by country
    And I filter the contacts list by UK region
    Then the contacts should be filtered to show badge company country
    When I click on the first contact collection link
    And the contact heading company link is clicked
    Then the company details UK region is displayed


  @contacts-collection--sort
  Scenario: Sort contact list

    Given a company is created
    When navigating to the company contacts
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the Contacts collection page
    When the contacts are sorted by Newest
    When the contacts are sorted by Oldest
    Then the contacts should have been correctly sorted by creation date
    When the contacts are sorted by Recently updated
    When the contacts are sorted by Least recently updated
    Then the contacts should have been correctly sorted for date fields
    When the contacts are sorted by First name: A-Z
    When the contacts are sorted by First name: Z-A
    Then the contacts should have been correctly sorted for text fields
#    When the contacts are sorted by Last name: A-Z
#    When the contacts are sorted by Last name: Z-A
#    Then the contacts should have been correctly sorted for text fields TODO: potential bug being investigated
    When the contacts are sorted by Country: A-Z
    When the contacts are sorted by Country: Z-A
    Then the contacts should have been correctly sorted for text fields
    When the contacts are sorted by Company: A-Z
    When the contacts are sorted by Company: Z-A
    Then the contacts should have been correctly sorted for text fields
    When the contacts are sorted by Sector: A-Z
    When the contacts are sorted by Sector: Z-A
    Then the contacts should have been correctly sorted for text fields
