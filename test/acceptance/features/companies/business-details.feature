@companies-business-details
Feature: Company business details

  @companies-business-details--dun-and-bradstreet-ghq-one-list-outside-uk
  Scenario: View business details for a Dun & Bradstreet GHQ company on the One List not in the UK

    When I navigate to the `companies.business-details` page using `company` `One List Corp` fixture
    Then the heading should be "Business details"
    And the "Where does information on this page come from?" details summary should be displayed
    And I should not see the "Unarchive" link
    And the About One List Corp key value details are displayed
      | key                       | value                        |
      | Trading names             | Not set                      |
      | Annual turnover           | company.turnoverRange        |
      | Number of employees       | company.employeeRange        |
      | Website                   | Not set                      |
    And the "About One List Corp" Edit link should not be displayed
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And the "Global Account Manager – One List" Edit link should not be displayed
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Headquarter type          | company.headquarterType      |
      | Subsidiaries              | company.subsidiaries         |
    And the "Business hierarchy" Edit link should not be displayed
    And the DIT sector values are displayed
      | value                     |
      | Retail                    |
    And the "DIT sector" Edit link should not be displayed
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
    And the "Addresses" Edit link should not be displayed
    And the Documents from CDMS key value details are not displayed
    And I should not see the "Archive" button


  @companies-business-details--data-hub-company-uk
  Scenario: View business details for a Data Hub company in the UK

    When I navigate to the `companies.business-details` page using `company` `Venus Ltd` fixture
    Then the heading should be "Business details"
    And the "Where does information on this page come from?" details summary should not be displayed
    And I should not see the "Unarchive" link
    And the About Venus Ltd key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Trading names             | Not set                      |
      | Annual turnover           | Not set                      |
      | Number of employees       | Not set                      |
      | Website                   | Not set                      |
    And the "About Venus Ltd" Edit link should be displayed
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And the "Global Account Manager – One List" Edit link should be displayed
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Global HQ                 | company.globalHq             |
    And the DIT sector values are displayed
      | value                     |
      | Retail                    |
    And the "DIT sector" Edit link should be displayed
    And the DIT region values are displayed
      | value                     |
      | North West                |
    And the "DIT region" Edit link should be displayed
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
    And the "Addresses" Edit link should be displayed
    And I should see the "Archive" button


  @companies-business-details--no-one-list
  Scenario: View details for a Dun & Bradstreet company not on the One List

    When I navigate to the `companies.business-details` page using `company` `DnB Corp` fixture
    Then the heading should be "Business details"
    And the "Where does information on this page come from?" details summary should be displayed
    And I should not see the "Unarchive" link
    And the About DnB Corp key value details are displayed
      | key                       | value                        |
      | Trading names             | company.tradingName          |
      | Annual turnover           | company.annualTurnover       |
      | Number of employees       | company.numberOfEmployees    |
      | Website                   | Not set                      |
    And the "About DnB Corp" Edit link should not be displayed
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Global HQ                 | company.globalHq             |
    And the DIT sector values are displayed
      | value                     |
      | Retail                    |
    And the "DIT region" Edit link should not be displayed
    And the DIT region values are not displayed
    And address 1 should have badges
      | value                     |
      | Trading                   |
      | Registered                |
    And address 1 should be
      | value                     |
      | 1 Main Road               |
      | Rome                      |
      | 001122                    |
      | Italy                     |
    And the "Addresses" Edit link should not be displayed
    And the Documents from CDMS key value details are not displayed
    And I should not see the "Archive" button


  @companies-business-details--archived
  Scenario: View details for an archived Data Hub company

    When I navigate to the `companies.business-details` page using `company` `Archived Ltd` fixture
    Then the heading should be "Business details"
    And the "Where does information on this page come from?" details summary should not be displayed
    And I should see the "Unarchive" link
    And the About Archived Ltd key value details are displayed
      | key                       | value                        |
      | Business type             | company.businessType         |
      | Trading names             | Not set                      |
      | Annual turnover           | company.turnoverRange        |
      | Number of employees       | company.employeeRange        |
      | Website                   | Not set                      |
    And the "About Archived Ltd" Edit link should not be displayed
    And the Global Account Manager – One List key value details are displayed
      | key                       | value                        |
      | One List tier             | company.oneListTier          |
      | Global Account Manager    | company.globalAccountManager |
    And the "Global Account Manager – One List" Edit link should not be displayed
    And the Business hierarchy key value details are displayed
      | key                       | value                        |
      | Headquarter type          | company.headquarterType      |
      | Subsidiaries              | company.subsidiaries         |
    And the "Business hierarchy" Edit link should not be displayed
    And the DIT sector values are displayed
      | value                     |
      | Retail                    |
    And the "DIT sector" Edit link should not be displayed
    And the DIT region values are not displayed
    And address 1 should have badges
      | value                     |
      | Trading                   |
      | Registered                |
    And address 1 should be
      | value                     |
      | 16 Getabergsvagen         |
      | Geta                      |
      | 22340                     |
      | Malta                     |
    And the "Addresses" Edit link should not be displayed
    And the Documents from CDMS key value details are not displayed
    And I should not see the "Archive" button
