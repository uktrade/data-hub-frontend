@investment-projects-evaluations-details
Feature: Investment projects evaluations details

  @investment-projects-evaluations-details--value-yes
  Scenario: View investment project evaluations after user selects all yes for value details

    Given I navigate to company fixture Lambda plc
    When I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    When I click the "Add value" link
    And I populate the create investment project value form all Yes
      | key                               | value                                          |
      | Number of new jobs                | 100                                            |
      | Number of safeguarded jobs        | 200                                            |
      | Total investment                  | 100000                                         |
      | Foreign equity investment         | 200000                                         |
    Then I see the success message
    When I click the Evaluations local nav link
    Then the Project value (Test D) details are displayed
      | key                               | value                                          | format                             |
      | Primary sector                    | investmentProject.primarySector                |                                    |
      | Total investment                  | £100,000                                       |                                    |
      | New jobs                          | 100 new jobs                                   |                                    |
      | Average salary of new jobs        | investmentProject.value.averageSalary          |                                    |
      | R&D budget                        | Has R&D budget                                 |                                    |
      | Non-FDI R&D project               | Not Known                                      |                                    |
      | New-to-world tech                 | Has new-to-world tech, business model or IP    |                                    |
      | Account tier                      | Not Known                                      |                                    |
      | New GHQ/EHQ                       | investmentProject.businessActivity             | formatEuropeanOrGlobalHeadquarters |
      | Export revenue                    | Yes, will create significant export revenue    |                                    |
    And the FDI (Test A) details are displayed
      | key                               | value                                          |
      | Type of investment                | Does not apply                                 |
      | Foreign investor                  | Lambda plc                                     |
      | Foreign country                   | France                                         |
      | UK company                        | Not Known                                      |
      | Foreign equity investment         | £200,000                                       |
      | Investor retains 10% voting power | No                                             |
      | New jobs                          | 100 new jobs                                   |
      | Safeguarded jobs                  | 200 safeguarded jobs                           |

  @investment-projects-evaluations-details--value-no
  Scenario: View investment project evaluations after user selects all no for value details

    Given I navigate to company fixture Lambda plc
    When I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    When I click the "Add value" link
    And I populate the create investment project value form all No
      | key                               | value                                          |
      | Number of new jobs                | 0                                              |
      | Number of safeguarded jobs        | 0                                              |
    Then I see the success message
    When I click the Evaluations local nav link
    Then the Project value (Test D) details are displayed
      | key                               | value                                          | format                             |
      | Primary sector                    | investmentProject.primarySector                |                                    |
      | Total investment                  | Client cannot provide this information         |                                    |
      | New jobs                          | 0                                              |                                    |
      | Average salary of new jobs        | investmentProject.value.averageSalary          |                                    |
      | R&D budget                        | No R&D budget                                  |                                    |
      | Non-FDI R&D project               | Not Known                                      |                                    |
      | New-to-world tech                 | No new-to-world tech, business model or IP     |                                    |
      | Account tier                      | Not Known                                      |                                    |
      | New GHQ/EHQ                       | investmentProject.businessActivity             | formatEuropeanOrGlobalHeadquarters |
      | Export revenue                    | No, will not create significant export revenue |                                    |
    And the FDI (Test A) details are displayed
      | key                               | value                                          |
      | Type of investment                | Does not apply                                 |
      | Foreign investor                  | Lambda plc                                     |
      | Foreign country                   | France                                         |
      | UK company                        | Not Known                                      |
      | Foreign equity investment         | Client cannot provide this information         |
      | Investor retains 10% voting power | No                                             |
      | New jobs                          | 0                                              |
      | Safeguarded jobs                  | 0                                              |
