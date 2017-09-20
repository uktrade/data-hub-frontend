@company-audit
Feature: View Audit history of a Company
  As an existing user
  I would like to track changes to a Company record over time
  So that I can cross-check the validity and accuracy of a given company record

  Background:
    Given I am an authenticated user on the data hub website

  @company-audit-name
  Scenario: View name of the person who made company record changes

     And I Amend 1 records of an existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the name of the person who made the recent company record changes

  @company-audit-timestamp
  Scenario: View time stamp when the company record changes

     And I Amend 1 records of an existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the date time stamp when the recent company record changed

  @company-audit-count
  Scenario: View the number of changes occurred on a company record

     And I Amend 2 records of an existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the total number of changes occurred recently on this company record

  @company-audit-field-names
  Scenario: View changed field names of a company record

     And I Amend 1 records of an existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the field names that were recently changed on this company record
