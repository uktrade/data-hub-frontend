@investment-projects-value-add
Feature: Add value to investment project

  @investment-projects-value-add--all-yes
  Scenario: Select Yes for all answers

    When I navigate to the `investments.fixture` page using `investment project` `New hotel (commitment to invest)` fixture
    And I click the "Add value" link
    Then I am taken to the "New hotel (commitment to invest)" page
    When I populate the create investment project value form
      | key                               | value                                            |
      | Total investment radio            | Yes                                              |
      | Total investment                  | 100000                                           |
      | Foreign equity investment radio   | Yes                                              |
      | Foreign equity investment         | 200000                                           |
      | New jobs                          | 100                                              |
      | Safeguarded jobs                  | 200                                              |
      | Government assistance radio       | Yes                                              |
      | R&D budget radio                  | Yes                                              |
      | Non-FDI R&D project radio         | Yes                                              |
      | New-to-world tech radio           | Yes                                              |
      | Export revenue radio              | Yes                                              |
    Then I see the success message
    And the Value key value details are displayed
      | key                               | value                                            |
      | Total investment                  | £100,000.00                                      |
      | Capital expenditure value         | £200,000.00                                      |
      | Government assistance             | Has government assistance                        |
      | New jobs                          | 100 new jobs                                     |
      | Average salary of new jobs        | investmentProject.value.averageSalary            |
      | Safeguarded jobs                  | 200 safeguarded jobs                             |
      | R&D budget                        | Has R&D budget                                   |
      | Non-FDI R&D project               | Find project                                     |
      | New-to-world tech                 | Has new-to-world tech, business model or IP      |
      | Export revenue                    | Yes, will create significant export revenue      |


  @investment-projects-value-add--all-no
  Scenario: Select No for all answers

    When I navigate to the `investments.fixture` page using `investment project` `New hotel (commitment to invest)` fixture
    And I click the "Edit value" link
    Then I am taken to the "New hotel (commitment to invest)" page
    When I populate the create investment project value form
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
    And the Value key value details are displayed
      | key                        | value                                           |
      | Total investment           | Client cannot provide this information          |
      | Capital expenditure value  | Client cannot provide this information          |
      | Government assistance      | No government assistance                        |
      | New jobs                   | 0                                               |
      | Average salary of new jobs | investmentProject.value.averageSalary           |
      | Safeguarded jobs           | 0                                               |
      | R&D budget                 | No R&D budget                                   |
      | Non-FDI R&D project        | Not linked to a non-FDI R&D project             |
      | New-to-world tech          | No new-to-world tech, business model or IP      |
      | Export revenue             | No, will not create significant export revenue  |


  @investment-projects-value-add--blank
  Scenario: Save a blank value form in the prospect stage

    When I navigate to the `companies.investments` page using `company` `Lambda plc` fixture
    And I click the "Add investment project" link
    And I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    When I click the "Add value" link
    And I submit the form
    Then I see the success message
