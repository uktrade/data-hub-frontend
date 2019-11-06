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
      | Dashboards                |
      | Market Access             |

