@investment-project-create
Feature: Create a new Investment project
  As an existing user
  I would like to create a new Investment project

  Background:
    Given I am an authenticated user on the data hub website

  @investment-verify-add
  Scenario: Verify Add Investment project option

    When I navigate to Investments page of any company
    Then I verify an option to add a new Investment project
    And I logout of Data Hub website

  @investment-create-foreign-equity
  Scenario: Create a new Investment project as a source of foreign equity investment

    When I create a new Investment project as a source of foreign equity investment
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "FDI, Acquisition"

  @investment-create-different-client-relation-manager
  Scenario: Create a new Investment project with a different client relation manager

    When I create a new Investment project with a different client relation manager
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify the client relation manager details shown under Project team

  @investment-create-different-referral-source-adviser
  Scenario: Create a new Investment project with a different referral source adviser

    When I create a new Investment project with a different referral source adviser
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify the referral source adviser details shown under Project team

  @investment-create-different-client-referral-contacts
  Scenario: Create a new Investment project with different client relation manager and referral source adviser

    When I create a new Investment project with different client relation manager and referral source adviser
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify the client relation manager and referral source adviser details shown under Project team

  @investment-create-FDItype
  Scenario: Create a new Investment project with FDI as Investment type

    When I create a new Investment project with FDI as Investment type
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "FDI, Acquisition"

  @investment-create-non-FDItype
  Scenario: Create a new Investment project with Non-FDI as Investment type

    When I create a new Investment project with Non-FDI as Investment type
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "Non-FDI, Advanced Engineering Supply Chain"

  @investment-create-non-foreign-equity
  Scenario: Create a new Investment project as not a source of foreign equity investment

    When I create a new Investment project as not a source of foreign equity investment
    Then I see the success message
    And I verify my newly created foreign equity Investment project in company profile

  @investment-search-FDItype
  Scenario: Search for newly created FDI Investment project

    When I create a new Investment project with FDI as Investment type
    Then I see the success message
    When I search for my newly created Investment project
    Then I verify it is displayed in the search results

  @investment-search-nonFDItype
  Scenario: Search for newly created Non-FDI Investment project

    When I create a new Investment project with Non-FDI as Investment type
    Then I see the success message
    When I search for my newly created Investment project
    Then I verify it is displayed in the search results

  @investment-search-CTItype @ignore
  Scenario: Search for newly created commitment to invest type Investment project

    When I create a new Investment project as a source of foreign equity investment
    And I search for my newly created Investment project
    Then I verify it is displayed in the search results
