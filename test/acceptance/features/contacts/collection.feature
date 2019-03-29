@contacts-collection @collection
Feature: View collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @contacts-collection--view--lep @lep
  Scenario: View contact collection as LEP

    When I navigate to the `contacts.list` page
    Then I confirm I am on the Contacts page
    And the results summary for a contact collection is present

  @contacts-collection--view--da @da
  Scenario: View contact collection as DA

    When I navigate to the `contacts.list` page
    Then I confirm I am on the Contacts page
    And the results summary for a contact collection is present

  @contacts-collection--filter
  Scenario: Filter contact list

    When I navigate to the `companies.contacts` page using `company` `Venus Ltd` fixture
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the `contacts.list` page
    When I clear all filters
    Then there are no filters selected
    Given I store the result count in state
    And I filter the contacts list by contact
    Then the contacts should be filtered by contact name
    And the result count should be 1
    And there is a Download button in the collection header
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the contacts list by active status
    Then the result count should be 0 less than the total
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the contacts list by inactive status
    Then the result count should be 0
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the contacts list by company
    Then the contacts should be filtered by company name
    And the result count should be less than the total
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the contacts list by country
    Then the contacts should be filtered to show badge company country
    When I clear all filters
    Then there are no filters selected
    And the result count should be reset
    Given I store the result count in state
    When I filter the contacts list by country
    And I filter the contacts list by UK region
    Then the contacts should be filtered to show badge company country
    When I click on the first contact collection link
    And I click the local header link
    And I click the "View full business details" link
    Then the company details UK region is displayed

   @contacts-collection--sort
   Scenario: Sort contact list

     When a "Foreign company" is created
     And the company is in the search results
     When the first search result is clicked
     When I click the "Company contacts" link
     And I click the "Add contact" link
     And a primary contact is added
     When I submit the form
     Then I see the success message
     Then I wait and then refresh the page
     When I navigate to the `contacts.list` page
     When the contacts are sorted by Newest
     When the contacts are sorted by Oldest
     Then the contacts should have been correctly sorted by creation date
     And the results are sorted by Recently updated
     Then the results should be sorted by Recently updated
     And the results are sorted by Least recently updated
     Then the results should be sorted by Least recently updated
  #    When the contacts are sorted by Last name: A-Z
  #    Then the contacts should have been correctly sorted for text fields TODO: potential bug being investigated (contacts dont appear to sort correctly)
     When the contacts are sorted by Country: A-Z
     Then I see the list in A-Z alphabetical order
     When the contacts are sorted by Company: A-Z
     Then I see the list in A-Z alphabetical order
