@support
Feature: Support

  @support--form
  Scenario: Load support form

    When I navigate to the dashboard
    And I navigate to the support page
    Then there are form fields
      | name          | type        | label                   |
      | Title         | Text        | Title                   |
      | Feedback type | Radio list  | Choose one of these     |
      | Description   | Text        | Description (optional)  |
      | Email         | Text        | Email                   |
      | Browser       | Text        | Web browser (optional)  |

  @support--validation
  Scenario: Empty form should show validation errors

    When I navigate to the dashboard
    And I navigate to the support page
    And the support Send button is clicked
    Then the support fields have error messages
    And I see form error summary
