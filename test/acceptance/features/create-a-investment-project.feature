@investment-project-create
Feature: Create a new Investment project
  As an existing user
  I would like to create a new Investment project

  @investment-verify-add
  Scenario: Verify Add Investment project option

    Given I am an authenticated user on Data Hub website
    When I navigate to Investments page of any company
    Then I verify an option to add a new Investment project

  @investment-create-foreign-equity
  Scenario: Create a new Investment project as a source of foreign equity investment

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project as a source of foreign equity investment
    Then I see the Investment project creation confirmation message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "Commitment to invest"

  @investment-create-different-client-relation-manager
  Scenario: Create a new Investment project with a different client relation manager

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project with a different client relation manager
    Then I see the Investment project creation confirmation message
    And I verify my newly created Investment project in company profile
    And I verify the client relation manager details shown under Project team

  @investment-create-different-referral-source-adviser
  Scenario: Create a new Investment project with a different referral source adviser

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project with a different referral source adviser
    Then I see the Investment project creation confirmation message
    And I verify my newly created Investment project in company profile
    And I verify the referral source adviser details shown under Project team

  @investment-create-different-client-referral-contacts
  Scenario: Create a new Investment project with different client relation manager and referral source adviser

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project with different client relation manager and referral source adviser
    Then I see the Investment project creation confirmation message
    And I verify my newly created Investment project in company profile
    And I verify the client relation manager and referral source adviser details shown under Project team

  @investment-create-FDItype
  Scenario: Create a new Investment project with FDI as Investment type

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project with FDI as Investment type
    Then I see the Investment project creation confirmation message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "FDI, Acquisition"

  @investment-create-non-FDItype
  Scenario: Create a new Investment project with Non-FDI as Investment type

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project with Non-FDI as Investment type
    Then I see the Investment project creation confirmation message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "Non-FDI, Advanced Engineering Supply Chain"

  @investment-create-non-foreign-equity
  Scenario: Create a new Investment project as not a source of foreign equity investment

    Given I am an authenticated user on Data Hub website
    When I create a new Investment project as not a source of foreign equity investment
    Then I see the Investment project creation confirmation message
    And I verify my newly created foreign equity Investment project in company profile
