@investment-projects-evaluations-details
Feature: Investment projects evaluations details

  @investment-projects-evaluations-details--value-yes
  Scenario: View investment project evaluations after user selects all yes for value details

    When I navigate to the `companies.Fixture` page using `company` `Lambda plc` fixture
    And I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    When I click the "Add value" link
    And I populate the create investment project value form
      | key                               | value                                          |
      | Total investment radio            | Yes                                            |
      | Total investment                  | 100000                                         |
      | Foreign equity investment radio   | Yes                                            |
      | Foreign equity investment         | 200000                                         |
      | New jobs                          | 100                                            |
      | Safeguarded jobs                  | 200                                            |
      | Government assistance radio       | Yes                                            |
      | R&D budget radio                  | Yes                                            |
      | Non-FDI R&D project radio         | Yes                                            |
      | New-to-world tech radio           | Yes                                            |
      | Export revenue radio              | Yes                                            |
    Then I see the success message
    When I click the Evaluations local nav link
    Then the Project value (Test D) details are displayed
      | key                               | value                                          | formatter                               |
      | Primary sector                    | investmentProject.primarySector                |                                         |
      | Total investment                  | £100,000.00                                    |                                         |
      | New jobs                          | 100 new jobs                                   |                                         |
      | Average salary of new jobs        | investmentProject.value.averageSalary          |                                         |
      | R&D budget                        | Has R&D budget                                 |                                         |
      | Non-FDI R&D project               | Not Known                                      |                                         |
      | New-to-world tech                 | Has new-to-world tech, business model or IP    |                                         |
      | Account tier                      | Not Known                                      |                                         |
      | New GHQ/EHQ                       | investmentProject.businessActivity             | isEuropeanOrGlobalHeadquartersFormatter |
      | Export revenue                    | Yes, will create significant export revenue    |                                         |
    And the FDI (Test A) details are displayed
      | key                               | value                                          |
      | Type of investment                | investmentProject.typeAndSubType               |
      | Foreign investor                  | Lambda plc                                     |
      | Foreign country                   | France                                         |
      | UK company                        | Not Known                                      |
      | Foreign equity investment         | £200,000.00                                    |
      | Investor retains 10% voting power | No                                             |
      | New jobs                          | 100 new jobs                                   |
      | Safeguarded jobs                  | 200 safeguarded jobs                           |
    And the Project Landing (Test C) details are displayed
      | key                               | value                                          |
      | UK company                        | Not Known                                      |
      | Companies House Number            | Not Known                                      |
      | Registered Address                | Not Known                                      |
      | Actual land date                  | investmentProject.actualLandDate               |

  @investment-projects-evaluations-details--value-no
  Scenario: View investment project evaluations after user selects all no for value details

    When I navigate to the `companies.Fixture` page using `company` `Lambda plc` fixture
    And I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    When I click the "Add value" link
    And I populate the create investment project value form
      | key                               | value                                          |
      | Total investment radio            | No                                             |
      | Foreign equity investment radio   | No                                             |
      | New jobs                          | 0                                              |
      | Safeguarded jobs                  | 0                                              |
      | Government assistance radio       | No                                             |
      | R&D budget radio                  | No                                             |
      | Non-FDI R&D project radio         | No                                             |
      | New-to-world tech radio           | No                                             |
      | Export revenue radio              | No                                             |
    Then I see the success message
    When I click the Evaluations local nav link
    Then the Project value (Test D) details are displayed
      | key                               | value                                          | formatter                               |
      | Primary sector                    | investmentProject.primarySector                |                                         |
      | Total investment                  | Client cannot provide this information         |                                         |
      | New jobs                          | 0                                              |                                         |
      | Average salary of new jobs        | investmentProject.value.averageSalary          |                                         |
      | R&D budget                        | No R&D budget                                  |                                         |
      | Non-FDI R&D project               | Not Known                                      |                                         |
      | New-to-world tech                 | No new-to-world tech, business model or IP     |                                         |
      | Account tier                      | Not Known                                      |                                         |
      | New GHQ/EHQ                       | investmentProject.businessActivity             | isEuropeanOrGlobalHeadquartersFormatter |
      | Export revenue                    | No, will not create significant export revenue |                                         |
    And the FDI (Test A) details are displayed
      | key                               | value                                          |
      | Type of investment                | investmentProject.typeAndSubType               |
      | Foreign investor                  | Lambda plc                                     |
      | Foreign country                   | France                                         |
      | UK company                        | Not Known                                      |
      | Foreign equity investment         | Client cannot provide this information         |
      | Investor retains 10% voting power | No                                             |
      | New jobs                          | 0                                              |
      | Safeguarded jobs                  | 0                                              |
    And the Project Landing (Test C) details are displayed
      | key                               | value                                          |
      | UK company                        | Not Known                                      |
      | Companies House Number            | Not Known                                      |
      | Registered Address                | Not Known                                      |
      | Actual land date                  | investmentProject.actualLandDate               |
