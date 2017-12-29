@companies-account-management-save
Feature: Save account management details for a company

  @companies-account-management-save--update
  Scenario: Save account management details

    Given I navigate to company fixture Lambda plc
    Then the Account management details are displayed
      | key                       | value                   |
      | One List tier             | None                    |
      | One List account manager  | None                    |
    When the Account management details are updated
    Then the Account management details are displayed
      | key                       | value                       |
      | One List tier             | None                        |
      | One List account manager  | company.oneListAccountOwner |
