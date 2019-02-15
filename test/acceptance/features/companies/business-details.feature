@companies-business-details
Feature: Company business details

  @companies-business-details--dun-and-bradstreet-ghq-one-list-outside-uk
  Scenario: View business details for a Dun & Bradstreet GHQ company on the One List not in the UK

    When I navigate to the `companies.business-details` page using `company` `One List Corp` fixture
    Then the heading should be "Business details"
    And the "Where does information on this page come from?" details summary should be displayed
    And the Company summary key value details are not displayed
    And the About One List Corp key value details are displayed
      | key                       | value                        |
      | Trading names             | company.tradingName          |
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Headquarter type          | company.headquarterType      |
      | Subsidiaries              | company.subsidiaries         |
    And the DIT sector values are displayed
      | value                     |
      | Retail                    |
    And the DIT region values are not displayed
    And address 1 should have badges
      | value                     |
      | Trading                   |
      | Registered                |
    And address 1 should be
      | value                     |
      | 12 St George's Road       |
      | Paris                     |
      | 75001                     |
      | France                    |
    And the Additional business information key value details are displayed
      | key                       | value                        |
      | Annual turnover           | Not available                |
      | Number of employees       | Not available                |
      | Websites                  | Not available                |
    And the Documents from CDMS key value details are not displayed


  @companies-business-details--data-hub-company-uk
  Scenario: View business details for a Data Hub company in the UK

    When I navigate to the `companies.business-details` page using `company` `Venus Ltd` fixture
    Then the heading should be "Business details"
    And the "Where does information on this page come from?" details summary should not be displayed
    And the About Venus Ltd key value details are displayed
      | key                       | value                        |
      | Trading names             | company.tradingName          |
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Headquarter type          | company.headquarterType      |
      | Subsidiaries              | company.subsidiaries         |
    And the DIT sector values are displayed
      | value                     |
      | Retail                    |
    And the DIT region values are displayed
      | value                     |
      | North West                |
    And address 1 should have badges
      | value                     |
      | Trading                   |
      | Registered                |
    And address 1 should be
      | value                     |
      | 66 Marcham Road           |
      | Bordley                   |
      | BD23 8RZ                  |
      | United Kingdom            |
