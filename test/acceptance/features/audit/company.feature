@audit-company @todo
Feature: View Audit history of a Company
  As an existing user
  I would like to track changes to a Company record over time
  So that I can cross-check the validity and accuracy of a given company record

  @audit-company--name
  Scenario: View name of the person who made company record changes

    Given I Amend 1 records of an existing company record
    When I search for this company record
    And I navigate to Audit History tab
    Then I see the name of the person who made the recent company record changes

  @audit-company--timestamp
  Scenario: View time stamp when the company record changes

    Given I Amend 1 records of an existing company record
    When I search for this company record
    And I navigate to Audit History tab
    Then I see the date time stamp when the recent company record changed

  @audit-company--count @ignore
# TODO this work is using fixtures that have changed therefore its asupmtions are wrong
# TODO redo this work to either create a new company or record the changes in Audit before changes are made and compare
  Scenario: View the number of changes occurred on a company record

    Given I Amend 2 records of an existing company record
    When I search for this company record
    And I navigate to Audit History tab
    Then I see the total number of changes occurred recently on this company record

  @audit-company--field-names
  Scenario: View changed field names of a company record

    Given I Amend 1 records of an existing company record
    When I search for this company record
    And I navigate to Audit History tab
    Then I see the field names that were recently changed on this company record
