@investment-projects-create
Feature: Create a new Investment project
  As an existing user
  I would like to create a new Investment project

  @investment-projects-create--verify-add
  Scenario: Verify Add Investment project option

    Given I navigate to company fixture Lambda plc
    And I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page

  @investment-projects-create--fdi
  Scenario: Add a Foreign Direct Investment (FDI) Investment project

    Given I navigate to company fixture Lambda plc
    When I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    And Investment project summary has all of the entered information

  @investment-projects-create--fdi-different-source-of-equity
  Scenario: Add a Foreign Direct Investment (FDI) Investment project with a separate company as the source of foreign equity

    Given I navigate to company fixture Lambda plc
    When I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose No for "Will this company be the source of foreign equity investment?"
    And I search for the foreign source of equity Mars Exports Ltd
    Then I can view the Equity Source in the collection
      | text               | expected                               |
      | Primary address    | investmentProject.equitySource.address |
    And the Equity Source has badges
      | text               | expected                               |
      | Country            | investmentProject.equitySource.country |
    Then I choose the first item in the collection
    When I populate the create Investment Project form
    Then I see the success message
    And Investment project summary has all of the entered information

  @investment-projects-create--non-fdi
  Scenario: Add a Non Foreign Direct Investment (Non-FDI) Investment project

    Given I navigate to company fixture Venus Ltd
    When I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select Non FDI as the Investment project type
    And I search for the foreign source of equity Lambda plc
    Then I can view the Equity Source in the collection
      | text               | expected                               |
      | Primary address    | investmentProject.equitySource.address |
    And the Equity Source has badges
      | text               | expected                               |
      | Country            | investmentProject.equitySource.country |
    Then I choose the first item in the collection
    When I populate the create Investment Project form
    Then I see the success message
    And Investment project summary has all of the entered information
