@companies-create
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations

  # Disables test due to issue with lack of support for ch search in backend
  # re-enable to prove back end once complete and split into 2 tests
  # One for selecting CH entry and another for selecting existing datahub entry
  @companies-create--uk-private-or-public-ltd-company
  Scenario: Create a UK private or public limited company

    When a "UK private or public limited company" is created
    Then I see the success message
    And the company is in the search results

  @companies-create--uk-non-private-or-non-public-ltd-company
  Scenario: Create a UK non-private or non-public limited company

    When a "UK non-private or non-public limited company" is created
    Then I see the success message
    And the company is in the search results

  @companies-create--foreign
  Scenario: Create a foreign company

    When a new "Foreign company" is created
    Then I see the success message
    And the company is in the search results
