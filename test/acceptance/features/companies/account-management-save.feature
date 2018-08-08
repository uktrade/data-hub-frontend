# disabled as the one list fields are temporarly locked down until we decide what to do with them
@companies-account-management-save @ignore
Feature: Save account management details for a company

  @companies-account-management-save--update
  Scenario: Save account management details

    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then the Account management key value details are displayed
      | key                       | value                   |
      | One List tier             | None                    |
      | Global account manager    | None                    |
    When the Account management details are updated
    Then the Account management key value details are displayed
      | key                       | value                       |
      | One List tier             | None                        |
      | Global account manager    | company.oneListAccountOwner |
