@investment-projects-value-add
Feature: Add value to investment project

  @investment-projects-value-add--all-yes
  Scenario: Select Yes for all answers

    Given I navigate to investment project fixture New hotel (commitment to invest)
    When I click the "Add value" link
    Then I am taken to the "New hotel (commitment to invest)" page
    When I populate the create investment project value form all Yes
      | key                        | value  |
      | Number of new jobs         | 100    |
      | Number of safeguarded jobs | 200    |
      | Total investment           | 100000 |
      | Foreign equity investment  | 200000 |
    Then I see the success message
    And the Value details are displayed
      | key                        | value                                           |
      | Total investment           | £100,000                                        |
      | Foreign equity investment  | £200,000                                        |
      | Government assistance      | Has government assistance                       |
      | New jobs                   | 100 new jobs                                    |
      | Average salary of new jobs | investmentProject.value.averageSalary           |
      | Safeguarded jobs           | 200 safeguarded jobs                            |
      | R&D budget                 | Has R&D budget                                  |
      | Non-FDI R&D project        | Find project                                    |
      | New-to-world tech          | Has new-to-world tech, business model or IP     |
      | Export revenue             | Yes, will create significant export revenue     |


  @investment-projects-value-add--all-no
  Scenario: Select No for all answers

    Given I navigate to investment project fixture New hotel (commitment to invest)
    When I click the "Edit value" link
    Then I am taken to the "New hotel (commitment to invest)" page
    When I populate the create investment project value form all No
      | key                        | value  |
      | Number of new jobs         | 0      |
      | Number of safeguarded jobs | 0      |
    Then I see the success message
    And the Value details are displayed
      | key                        | value                                           |
      | Total investment           | Client cannot provide this information          |
      | Foreign equity investment  | Client cannot provide this information          |
      | Government assistance      | No government assistance                        |
      | New jobs                   | 0                                               |
      | Average salary of new jobs | investmentProject.value.averageSalary           |
      | Safeguarded jobs           | 0                                               |
      | R&D budget                 | No R&D budget                                   |
      | Non-FDI R&D project        | Not linked to a non-FDI R&D project             |
      | New-to-world tech          | No new-to-world tech, business model or IP      |
      | Export revenue             | No, will not create significant export revenue  |
