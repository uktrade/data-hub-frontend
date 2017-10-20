@companies-create @ignore
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations

  Background:
    Given I am an authenticated user on the data hub website

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
