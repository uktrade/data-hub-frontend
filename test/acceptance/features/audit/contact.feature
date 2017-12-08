@audit-contact @todo
Feature: View Audit history of a contact
  As an existing user
  I would like to track changes to a contact record over time
  So that I can cross-check the validity and accuracy of a given contact record

  @audit-contact--fields
  Scenario: View name of the person who made contact record changes

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the company "Contacts" tab
    And the contact has 1 fields edited for audit
    Then I see the success message
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the name of the person who made the recent contact record changes
    And I see the date time stamp when the recent contact record changed
    And I see the field names that were recently changed

  @audit-contact--count
  Scenario: View the number of changes occurred on a contact record

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    Then a primary contact is added
    When I submit the form
    Then I see the success message
    When I navigate to the company "Contacts" tab
    And the contact has 2 fields edited for audit
    Then I see the success message
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the total number of changes occurred recently on this contact record

  @audit-contact--archived
  Scenario: View audit log for Archived contact

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    Then a primary contact is added
    When I submit the form
    Then I see the success message
    When I search for the contact
    And the Contacts search tab is clicked
    And I click on the first contact collection link
    And I archive this contact record
    And I search for the contact
    And the Contacts search tab is clicked
    And I click on the first contact collection link
    And I navigate to Audit History tab
    Then I see the details who archived the contact

  @audit-contact--unarchived
  Scenario: View audit log for UnArchived contact

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    And I search for the contact
    And the Contacts search tab is clicked
    And I click on the first contact collection link
    And I archive this contact record
    And I unarchive this contact record
    And I search for the contact
    And the Contacts search tab is clicked
    And I click on the first contact collection link
    And I navigate to Audit History tab
    Then I see the details who unarchived the contact
