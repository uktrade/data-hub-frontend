@audit-contact @todo
Feature: View Audit history of a contact
  As an existing user
  I would like to track changes to a contact record over time
  So that I can cross-check the validity and accuracy of a given contact record

  Background:
    Given I am an authenticated user on the data hub website

  @audit-contact--name
  Scenario: View name of the person who made contact record changes

    When I add a new Primary Contact
    Then I see the success message
    And I Amend 1 records of an existing contact record
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the name of the person who made the recent contact record changes

  @audit-contact--timestamp
  Scenario: View time stamp when the contact record changes

    When I add a new Primary Contact
    Then I see the success message
    And I Amend 1 records of an existing contact record
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the date time stamp when the recent contact record changed

  @audit-contact--count
  Scenario: View the number of changes occurred on a contact record

    When I add a new Primary Contact
    Then I see the success message
    And I Amend 2 records of an existing contact record
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the total number of changes occurred recently on this contact record

  @audit-contact--field-names
  Scenario: View changed field names of a contact record

    When I add a new Primary Contact
    Then I see the success message
    And I Amend 1 records of an existing contact record
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the field names that were recently changed

  @audit-contact--archived @ignore
  Scenario: View audit log for Archived contact

    And I create a new contact
    When I search for this Contact name
    When I click on contacts tab
    When I click on the first contact collection link
    And I archive this contact record
    And I search for this Contact name
    And I click on contacts tab
    And I click on the first contact collection link
    And I navigate to Audit History tab
    Then I see the details who archived the contact

  @audit-contact--unarchived @ignore
  Scenario: View audit log for UnArchived contact

    And I create a new contact
    When I search for this Contact name
    When I click on contacts tab
    When I click on the first contact collection link
    And I archive this contact record
    Then I unarchive this contact record
    And I search for this Contact name
    And I click on contacts tab
    And I click on the first contact collection link
    And I navigate to Audit History tab
    Then I see the details who unarchived the contact
