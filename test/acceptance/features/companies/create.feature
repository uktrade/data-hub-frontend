@companies-create
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations

  Background:
    Given I am an authenticated user on the data hub website

  @companies-create--uk-private-or-public-ltd-company
  Scenario: Create a UK private or public limited company

    When I create a "UK private or public limited company"
    Then I see the success message
    And The company is present in the search results

  @companies-create--uk-non-private-or-non-public-ltd-company
  Scenario: Create a UK non-private or non-public limited company

    When I create a "UK non-private or non-public limited company"
    Then I see the success message
    And The company is present in the search results

  @companies-create--foreign
  Scenario: Create a foreign company

    When I create a new "Foreign company"
    Then I see the success message
    And The company is present in the search results
