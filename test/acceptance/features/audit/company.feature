@audit-company @todo
Feature: View Audit history of a Company
  As an existing user
  I would like to track changes to a Company record over time
  So that I can cross-check the validity and accuracy of a given company record

  Scenario: View name of the person who made company record changes
    When I navigate to the `companies.edit` page using `company` `Venus Ltd` fixture
    And I edit the company
    And I navigate to the `companies.audit` page using `company` `Venus Ltd` fixture
    Then I see the name of the person who made the recent company record changes
    And I see the date time stamp when the recent company record changed
