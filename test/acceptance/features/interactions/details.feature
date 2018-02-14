@interactions-details @details
Feature: Interactions details

  @interactions-details--status
  Scenario: Interaction does not have a status

    Given I navigate to interaction fixture TAP grant
    Then the details are displayed
      | key                      | value                         |
      | Company                  | interaction.company           |
      | Contact                  | interaction.contact           |
      | Service provider         | interaction.serviceProvider   |
      | Service                  | interaction.service           |
      | Service status           | interaction.serviceStatus     |
      | Grant offered            | interaction.grantOffered      |
      | Subject                  | interaction.subject           |
      | Notes                    | interaction.notes             |
      | Date of service delivery | interaction.date              |
      | DIT adviser              | interaction.ditAdviser        |
      | Event                    | interaction.event             |
      | Documents                | interaction.documents         |

  @interactions-details--no-status
  Scenario: Interaction does not have a status

    Given I navigate to interaction fixture Attended gamma event
    Then the details are displayed
      | key                      | value                         |
      | Company                  | interaction.company           |
      | Contact                  | interaction.contact           |
      | Service provider         | interaction.serviceProvider   |
      | Service                  | interaction.service           |
      | Subject                  | interaction.subject           |
      | Notes                    | interaction.notes             |
      | Date of service delivery | interaction.date              |
      | DIT adviser              | interaction.ditAdviser        |
      | Event                    | interaction.event             |
      | Documents                | interaction.documents         |
