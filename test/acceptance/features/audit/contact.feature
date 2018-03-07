@audit-contact @todo
Feature: View Audit history of a contact
  As an existing user
  I would like to track changes to a contact record over time
  So that I can cross-check the validity and accuracy of a given contact record

  Scenario: View name of the person who made contact record changes
    When I navigate to the `companies.Contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I click the Contacts local nav link
    And the contact has 2 fields edited for audit
    Then I see the success message
    When I search for this Contact record
    And I click the "Audit history" link
    Then I see the name of the person who made the recent contact record changes
    And I see the date time stamp when the recent contact record changed
    And I see the field names that were recently changed
    And I see the total number of changes occurred recently on this contact record
    And I see the details who archived the contact
    And I see the details who unarchived the contact
