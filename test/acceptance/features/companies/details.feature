@companies-details
Feature: Company details

  @companies-details--ghq-one-list
  Scenario: View details for a Dun & Bradstreet GHQ company on the One List

    When I navigate to the `companies.details` page using `company` `One List Corp` fixture
    Then the heading should be "One List Corp"
    And after the heading should be "12 St George's Road, Paris, 75001, France"
    And the heading description should be
      | paragraph                                                                |
      | This is an account managed company (One List Tier A - Strategic Account) |
      | Global Account Manager: Travis Greene View core team                     |
    And the Company summary key value details are not displayed
    And the Global headquarters summary key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Primary address           | company.primaryAddress       |
      | Headquarter type          | company.headquarterType      |
      | Sector                    | company.sector               |
      | Business description      | company.description          |
      | Number of employees       | company.employeeRange        |
      | Annual turnover           | company.turnoverRange        |
      | Country                   | company.country              |
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And I should see the "See all advisers on the core team" link


  @companies-details--subsidiary-company-parent-one-list
  Scenario: View details for a subsidiary company of a parent on the One List

    When I navigate to the `companies.details` page using `company` `One List Subsidiary Ltd` fixture
    Then the Company summary key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Primary address           | company.primaryAddress       |
      | UK region                 | company.ukRegion             |
      | Headquarter type          | company.headquarterType      |
      | Global HQ                 | company.globalHeadquarters   |
      | Sector                    | company.sector               |
      | Business description      | company.description          |
    And the Global headquarters summary key value details are not displayed
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And I should see the "See all advisers on the core team" link


  @companies-details--subsidiary-company-no-one-list
  Scenario: View details for a company not on the One List

    When I navigate to the `companies.details` page using `company` `Mars Exports Ltd` fixture
    Then the Company summary key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Primary address           | company.primaryAddress       |
      | Headquarter type          | company.headquarterType      |
      | Global HQ                 | company.globalHeadquarters   |
      | Sector                    | company.sector               |
      | Business description      | company.description          |
      | Number of employees       | company.employeeRange        |
      | Annual turnover           | company.turnoverRange        |
      | Country                   | company.country              |
    And the Global headquarters summary key value details are not displayed
    And the Global Account Manager – One List key value details are not displayed
    And I should not see the "See all advisers on the core team" link

@companies-details--dnb-company
  Scenario: Hide Edit company details button for a company containing a DnB number
    When I navigate to the `companies.details` page using `company` `One List Corp` fixture
    Then I should not see the "Edit company details" button
