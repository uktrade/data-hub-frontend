@contacts-collection @collection
Feature: View collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @contacts-collection--view--da @da
  Scenario: View contact collection as DA
    When I navigate to the `contacts.list` page
    Then I confirm I am on the Contacts page
    And the results summary for a contact collection is present
