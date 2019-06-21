@dashboard
Feature: Dashboard

  @dashboard--global-nav
  Scenario: Display global nav

    When I navigate to the `dashboard` page
    Then there should be a global nav
      | text                      |
      | Companies                 |
      | Contacts                  |
      | Events                    |
      | Interactions              |
      | Investments               |
      | Orders                    |
      | MI dashboards             |

  @dashboard--global-nav-lep @lep
  Scenario: Display global nav for LEP user

    When I navigate to the `dashboard` page
    Then there should be a global nav
      | text                      |
      | Companies                 |
      | Contacts                  |
      | Investments               |
      | MI dashboards             |

  @dashboard--global-nav-da @da
  Scenario: Display global nav for DA user

    When I navigate to the `dashboard` page
    Then there should be a global nav
      | text                      |
      | Companies                 |
      | Contacts                  |
      | Investments               |
      | Orders                    |
      | MI dashboards             |
