@investment-projects-team @collection
Feature: View team for an investment project

  @investment-projects-team--view
  Scenario: View investment project team
    When I navigate to the `investments.team` page using `investment project` `Fancy dress manufacturing` fixture
    Then the Client relationship management data details are displayed
      | Role                        | Adviser       | Team                           |
      | Client Relationship Manager | Puck Head     | CBBC North EAST                |
      | Global Account Manager      | Travis Greene | IST - Sector Advisory Services |

  @investment-projects-team--view--da @da
  Scenario: View investment project team
    When I navigate to the `investments.team` page using `investment project` `New golf course (DA)` fixture
    Then the Client relationship management data details are displayed
      | Role                        | Adviser       | Team                           |
      | Client Relationship Manager | Paula Churing | Marketing - Marketing Team     |

  @investment-projects-team--da @da
  Scenario: Navigate to project team of an unauthorised project as DA
    When I navigate to the `investments.team` page using `investment project` `Fancy dress manufacturing` fixture
    Then I see the 403 error page
