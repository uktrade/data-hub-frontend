@interaction-add
Feature: Add a new interaction in Data hub

  @interaction-add--contacts-interaction--standard-interaction-with-feedback-submit
  Scenario: Policy feedback fields from contacts

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select interaction
    Then there are interaction fields
    And interaction fields are pre-populated
    Then I select a policy feedback option
    And there are interaction policy feedback fields
    When an interaction policy feedback is added
      | key                      | value                                    |
    Then I see the success message
    And the key value details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact(s)               | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of interaction      | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Communication channel    | interaction.communicationChannel         |
      | Documents                | There are no files or documents          |
      | Policy issue types       | interaction.policyIssueType1             |
      | Policy area              | interaction.policyArea                   |
      | Policy feedback notes    | interaction.policyFeedbackNotes          |

  @interaction-add--contacts-interaction--service-delivery-interaction-with-feedback-submit
  Scenario: Policy feedback fields from contacts

    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select service delivery
    Then there are service delivery fields
    And interaction fields are pre-populated
    Then I select a policy feedback option
    And there are interaction policy feedback fields
    When a service delivery policy feedback is added
      | key                      | value                                    |
      | Service                  | Tradeshow Access Programme (TAP)         |
    Then I see the success message
    And the key value details are displayed
      | key                      | value                                    |
      | Company                  | Venus Ltd                                |
      | Contact(s)               | interaction.contact                      |
      | Service provider         | interaction.serviceProvider              |
      | Service                  | interaction.service                      |
      | Subject                  | interaction.subject                      |
      | Notes                    | interaction.notes                        |
      | Date of service delivery | interaction.date                         |
      | DIT adviser              | interaction.ditAdviser                   |
      | Event                    | interaction.event                        |
      | Documents                | There are no files or documents          |
      | Policy issue types       | interaction.policyIssueType1             |
      | Policy area              | interaction.policyArea                   |
      | Policy feedback notes    | interaction.policyFeedbackNotes          |
