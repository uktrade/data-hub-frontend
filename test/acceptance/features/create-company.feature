@create-company
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations

  Background:
    Given I am an authenticated user on the data hub website

  @create-uk-private-or-public-ltd-company
  Scenario: Create a UK private or public limited company

    When I create a "UK private or public limited company"
    Then I see the "Company record updated" success message
    And The company is present in the search results

  @create-uk-non-private-or-non-public-ltd-company
  Scenario: Create a UK non-private or non-public limited company

    When I create a "UK non-private or non-public limited company"
    Then I see the "Company record updated" success message
    And The company is present in the search results

  @create-company-foreign
  Scenario: Create a foreign company

    When I create a new "Foreign company"
    Then I see the "Company record updated" success message
    And The company is present in the search results
