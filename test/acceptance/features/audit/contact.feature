@audit-contact @todo
Feature: View Audit history of a contact
  As an existing user
  I would like to track changes to a contact record over time
  So that I can cross-check the validity and accuracy of a given contact record

  @audit-contact--fields
  Scenario: View name of the person who made contact record changes

    Given a company is created for audit
    When navigating to the company contacts
    And a primary contact is added
    Then I see the success message
    When navigating to the company contacts for audit
    And the contact has 1 fields edited for audit
    Then I see the success message
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the name of the person who made the recent contact record changes
    And I see the date time stamp when the recent contact record changed
    And I see the field names that were recently changed

  @audit-contact--count
  Scenario: View the number of changes occurred on a contact record

    Given a company is created for audit
    When navigating to the company contacts
    And a primary contact is added
    Then I see the success message
    When navigating to the company contacts for audit
    And the contact has 2 fields edited for audit
    Then I see the success message
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the total number of changes occurred recently on this contact record

  @audit-contact--archived @ignore
  Scenario: View audit log for Archived contact

    Given I create a new contact
    When I search for this Contact name
    And I click on contacts tab
    And I click on the first contact collection link
    And I archive this contact record
    And I search for this Contact name
    And I click on contacts tab
    And I click on the first contact collection link
    And I navigate to Audit History tab
    Then I see the details who archived the contact

  @audit-contact--unarchived @ignore
  Scenario: View audit log for UnArchived contact

    Given I create a new contact
    When I search for this Contact name
    And I click on contacts tab
    And I click on the first contact collection link
    And I archive this contact record
    And I unarchive this contact record
    And I search for this Contact name
    And I click on contacts tab
    And I click on the first contact collection link
    And I navigate to Audit History tab
    Then I see the details who unarchived the contact
