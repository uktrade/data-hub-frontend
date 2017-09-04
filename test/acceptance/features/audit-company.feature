@company-audit
Feature: View Audit history of a Company
  As an existing user
  I would like to track changes to a Company record over time
  So that I can cross-check the validity and accuracy of a given company record

  @company-audit-name
  Scenario: View name of the person who made company record changes
     Given I am an authenticated user on Data Hub website
     And I Amend a existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the name of the person who made the recent company record changes

  @company-audit-timestamp
  Scenario: View time stamp when the company record changes
     Given I am an authenticated user on Data Hub website
     And I Amend a existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the date time stamp when the recent company record changed

  @company-audit-count
  Scenario: View the number of changes occurred on a company record
     Given I am an authenticated user on Data Hub website
     And I Amend a existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the total number of changes occurred recently on this company record

  @company-audit-field-names
  Scenario: View changed field names of a company record
     Given I am an authenticated user on Data Hub website
     And I Amend a existing company record
     When I search for this company record
     And I navigate to Audit History tab
     Then I see the total number of changes occurred recently on this company record
     When I click on the number of changes occurred link/popdown
     Then I see the field names that were recently changed

  @company-audit-search
  Scenario: Changed company name not searchable
     Given I am an authenticated user on Data Hub website
     And I Amend a existing company name to a new one
     When I search for this company record using its old name
     Then I verify the search results should not return the company details
     When I search for the company record using its newly changed name
     Then I verify the search results show the company details
     When I navigate to company Audit history tab
     Then I verify the changed name of the company
