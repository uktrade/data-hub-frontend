@companies-account-management-save
Feature: Save account management details for a company

  @companies-account-management-save--update
  Scenario: Save account management details

    Given a company is created
    Then I see the success message
    And the company is in the search results
    When the first search result is clicked
    Then the Account management details are displayed
      | key                       | value                   |
      | One List tier             | None                    |
      | One List account manager  | None                    |
    When the Account management details are updated
    Then the Account management details are displayed
      | key                       | value                       |
      | One List tier             | None                        |
      | One List account manager  | company.oneListAccountOwner |
