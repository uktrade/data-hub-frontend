@dashboard
Feature: Dashboard

  @dashboard--global-nav
  Scenario: Display global nav

    When I navigate to the dashboard
    Then there should only be DIT staff global nav links present

  @dashboard--support-page
  Scenario: Navigate to the support page

    When I navigate to the dashboard
    Then I navigate to the support page

  # LEP tests
  @dashboard--global-nav-lep @lep
  Scenario: Display global nav for LEP user

    When I navigate to the dashboard
    Then there should only be LEP staff global nav links present

  # DA tests
  @dashboard--global-nav-da @da
  Scenario: Display global nav for DA user

    When I navigate to the dashboard
    Then there should only be DA staff global nav links present
