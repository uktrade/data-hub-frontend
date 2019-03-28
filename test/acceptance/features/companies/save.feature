@companies-save
Feature: Create a new company

  @companies-save--uk-private-or-public-ltd-company
  Scenario: Create a UK private or public limited company

    When a "UK private or public limited company" is created
    Then I see the success message
    And the company trading name is in the search results

  @companies-save--uk-non-private-or-non-public-ltd-company
  Scenario: Create a UK non-private or non-public limited company

    When a "UK non-private or non-public limited company" is created
    Then I see the success message
    And the company is in the search results

  @companies-save--foreign
  Scenario: Create a foreign company

    When a "Foreign company" is created
    Then I see the success message
    And the company is in the search results

  @companies-save--foreign-uk-branch
  Scenario: Create a UK branch of a foreign company

    When a "UK branch of a foreign company" is created
    Then I see the success message
    And the company is in the search results
