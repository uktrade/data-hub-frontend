@support
Feature: Support

  @support--form
  Scenario: Load support form

    When I navigate to the dashboard
    And I navigate to the support page
    Then there are support fields

  @support--validation
  Scenario: Empty form should show validation errors

    When I navigate to the dashboard
    And I navigate to the support page
    And the support Send button is clicked
    Then the support fields have error messages
    And I see form error summary
