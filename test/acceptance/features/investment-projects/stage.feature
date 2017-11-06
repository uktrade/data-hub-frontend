@investment-projects-stage @ignore
Feature: Investment project stages
  As an existing user
  I would like to view different stages of Investment Project
  And be able to move the project to Won stage

# Prospect stage journeys:

  @investment-projects-stage--requirements-details
  Scenario: Update requirements section under Prospect stage for FDI type

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Requirements section under Details tab
    And I click on Save button
    Then I verify that all fields are populated correctly for Requirements section

  @investment-projects-stage--location-details @ignore
  Scenario: Update location section under Prospect stage

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for location section under Details tab
    And I click on Save button
    Then I verify that all fields are populated correctly for location section

  @investment-projects-stage--value-details
  Scenario: Update Value section under Prospect stage

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Value section under Details tab
    And I click on Save button
    Then I see the Updated investment value confirmation message
    And I verify that all fields are populated correctly for Value section

  @investment-projects-stage--value-no-financial-assistance
  Scenario: Update Value section with Not receiving government financial assistance

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Value section under Details tab
    And I set receiving government financial assistance option to NO
    And I click on Save button
    Then I see the Updated investment value confirmation message
    And I verify that project is not receiving financial assistance under Value section

  @investment-projects-stage--value-no-budget
  Scenario: Update Value section with No budget for a research and development

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Value section under Details tab
    And I set budget for a research and development option to NO
    And I click on Save button
    Then I see the Updated investment value confirmation message
    And I verify that project has no budget for a research and development under Value section

  @investment-projects-stage--value-no-r-and-d-project
  Scenario: Update Value section with Not associated with a non-FDI R&D project

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Value section under Details tab
    And I set project associated with a non-FDI R&D project option to NO
    And I click on Save button
    Then I see the Updated investment value confirmation message
    And I verify that project has no association with a non-FDI R&D project under Value section

  @investment-projects-stage--value-no-world-tech
  Scenario: Update Value section with No new to world technology

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Value section under Details tab
    And I set new to world technology option to NO
    And I click on Save button
    Then I see the Updated investment value confirmation message
    And I verify that project has no new to world technology under Value section

  @investment-projects-stage--value-no-export
  Scenario: Update Value section with No export of their products and services

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Value section under Details tab
    And I set export of their products and services option to NO
    And I click on Save button
    Then I see the Updated investment value confirmation message
    And I verify that project has no export of their products and services under Value section

  @investment-projects-stage--assign-pm-stage @ignore
  Scenario: Move project from Prospect stage to Assign PM stage

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Requirements section under Details tab
    And I enter all required fields for location section under Details tab
    And I enter all required fields for Value section under Details tab
    And I click on Save button
    Then I verify that Assign PM stage button is enabled
    When I click on Assign PM stage button
    Then I verify the stage of the project is updated from Prospect stage to Assign PM stage

  @ignore
  Scenario: Email verification when project moves from Prospect stage to Assign PM stage

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Requirements section under Details tab
    And I enter all required fields for location section under Details tab
    And I enter all required fields for Value section under Details tab
    And I click on Save button
    Then I verify that Assign PM stage button is enabled
    When I click on Assign PM stage button
    Then I verify an Email is sent to Investment services team

  @ignore
  Scenario Outline: Changing the Project states in Prospect stage

    Given I am an authenticated Client relationship manager user on Data Hub website
    When I navigate to my Investment project
    Then I verify the project is in Ongoing state
    When I change the state to <state>
    Then I verify the project state is changed to <state>

    Examples:
      | state     |
      | Delayed   |
      | Dormant   |
      | Abandoned |
      | Lost      |
      | Ongoing   |


#Assign PM stage journeys:

  @ignore
  Scenario: Update Project Manager section under Assign PM stage

    Given I am an authenticated Investment services team user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Project Manager section under Project team tab
    And I click on Save button
    Then I see the Updated investment details confirmation message
    Then I verify that all fields are populated correctly for Project Manager section

  @ignore
  Scenario: Update Project Assurance section under Assign PM stage

    Given I am an authenticated Investment services team user on Data Hub website
    When I navigate to my Investment project
    And I enter all required fields for Project Assurance section under Project team tab
    And I click on Save button
    Then I verify that all fields are populated correctly for Project Assurance section

  @ignore
  Scenario: Move project from Assign PM stage to Active stage

    Given I am an authenticated Investment services team user on Data Hub website
    And I enter all required fields for Project Manager section under Project team tab
    And I enter all required fields for Project Assurance section under Project team tab
    And I click on Save button
    Then I verify that Active stage button is enabled under Project team tab
    When I click on Active stage button
    Then I verify the stage of the project is updated from Assign PM stage to Active stage

  @ignore
  Scenario: Email verification when project moves from Assign PM stage to Active stage

    Given I am an authenticated Investment services team user on Data Hub website
    And I enter all required fields for Project Manager section under Project team tab
    And I enter all required fields for Project Assurance section under Project team tab
    And I click on Save button
    Then I verify that Active stage button is enabled under Project team tab
    When I click on Active stage button
    Then I verify an Email is sent to Allocated project manager
    And I verify an Email is sent to Allocated project assurance manager


#Active stage journeys:

  @ignore
  Scenario: Update Investment project summary section under Active stage

    Given I am an authenticated Allocated Project Manager user on Data Hub website
    When I navigate to my Investment project within Active stage
    And I enter actual landing date under Investment details tab
    And I upload an Evidence under Investment details tab
    And I click on Save button
    Then I verify that all fields are populated correctly for Investment project summary section

  @ignore
  Scenario: Update Requirements and Location section under Active stage

    Given I am an authenticated Allocated Project Manager user on Data Hub website
    When I navigate to my Investment project within Active stage
    And I enter Investment location under Investment details tab
    And I enter UK Company under Investment details tab
    And I upload an Evidence under Investment details tab
    And I click on Save button
    Then I verify that all fields are populated correctly for Requirements and Location section

  @ignore
  Scenario: Update Value section under Active stage

    Given I am an authenticated Allocated Project Manager user on Data Hub website
    When I navigate to my Investment project within Active stage
    And I upload an Evidence for Value section under Investment details tab
    And I click on Save button
    Then I verify that all evidences are populated correctly for Value section

  @ignore
  Scenario: Move project from Active stage to Verify Win stage

    Given I am an authenticated Allocated Project Manager user on Data Hub website
    When I navigate to my Investment project within Active stage
    And I enter actual landing date under Investment details tab
    And I upload an Evidence under Investment details tab
    And I enter Investment location under Investment details tab
    And I enter UK Company under Investment details tab
    And I upload an Evidence under Investment details tab
    And I upload an Evidence for Value section under Investment details tab
    And I click on Save button
    Then I verify that Verify Win stage button is enabled under Investment details tab
    When I click on Verify Win stage button
    Then I verify the stage of the project is updated from Active stage to Verify Win stage

  @ignore
  Scenario: Email verification when project moves from Active stage to Verify Win stage

    Given I am an authenticated Allocated Project Manager user on Data Hub website
    When I navigate to my Investment project within Active stage
    And I enter actual landing date under Investment details tab
    And I upload an Evidence under Investment details tab
    And I enter Investment location under Investment details tab
    And I enter UK Company under Investment details tab
    And I upload an Evidence under Investment details tab
    And I upload an Evidence for Value section under Investment details tab
    And I click on Save button
    Then I verify that Verify Win stage button is enabled under Investment details tab
    When I click on Verify Win stage button
    Then I verify an Email is sent to Allocation Team

  @ignore
  Scenario Outline: Changing the Project states in Active stage

    Given I am an authenticated Allocated Project Manager user on Data Hub website
    When I navigate to my Investment project within Active stage
    Then I verify the project is in Ongoing state
    When I change the state to <state>
    Then I verify the project state is changed to <state>

    Examples:
      | state     |
      | Delayed   |
      | Dormant   |
      | Abandoned |
      | Lost      |
      | Ongoing   |


#Verify Win stage journeys:

  @ignore
  Scenario: Access and Update all sections under Verify Win stage

    Given I am an authenticated Verification Team user on Data Hub website
    When I navigate to my Investment project within Verify Win stage
    And I access all the sections to verify any pending information under Evaluation tab
    And I update any pending information found under Evaluation tab
    And I click on Save button
    Then I verify that all fields are populated correctly under Evaluation tab

  @ignore
  Scenario: Move project from Verify Win stage to Won stage

    Given I am an authenticated Verification Team user on Data Hub website
    When I navigate to my Investment project within Verify Win stage
    And I access all the sections to verify any pending information under Evaluation tab
    And I update any pending information found under Evaluation tab
    And I click on Save button
    Then I verify that Won stage button is enabled under Evaluation tab
    When I click on Won stage button
    Then I verify the stage of the project is updated from Verify Win stage to Won stage

  @ignore
  Scenario: Email verification when project moves from Active stage to Verify Win stage

    Given I am an authenticated Verification Team user on Data Hub website
    When I navigate to my Investment project within Verify Win stage
    And I access all the sections to verify any pending information under Evaluation tab
    And I update any pending information found under Evaluation tab
    And I click on Save button
    Then I verify that Won stage button is enabled under Evaluation tab
    When I click on Won stage button
    Then I verify an Email is sent to Allocated project manager
    And I verify an Email is sent to Allocated project assurance manager

  @ignore
  Scenario: Verify the Project state in Verify win stage

    Given I am an authenticated Verification Team user on Data Hub website
    When I navigate to my Investment project within Verify Win stage
    Then I verify the project is in Ongoing state

  @ignore
  Scenario: Verify the Project state in Won stage

    Given I am an authenticated Allocated project manager user on Data Hub website
    When I navigate to my Investment project within Won stage
    Then I verify the project is in Won state
