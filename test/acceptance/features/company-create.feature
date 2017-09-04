@company-create
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations

  @company-create-ltd
  Scenario: Create a new UK private or public limited company

    Given I am an authenticated user on Data Hub website
    When I create a new “UK private or public limited company”
    Then I see the Updated company record confirmation message
    And I verify that my newly created company is present in search results
    And I logout of Data Hub website

  @company-create-ukother
  Scenario: Create a New Other type of UK organisation

    Given I am an authenticated user on Data Hub website
    When I create a new “Other type of UK Organisation”
    Then I see the Updated company record confirmation message
    And I verify that my newly created company is present in search results
    And I logout of Data Hub website

  @company-create-foreign
  Scenario: Create a New Foreign Organisation

    Given I am an authenticated user on Data Hub website
    When I create a new “Foreign organisation”
    Then I see the Updated company record confirmation message
    And I verify that my newly created company is present in search results
    And I logout of Data Hub website
