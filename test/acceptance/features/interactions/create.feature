@interactions-create
Feature: Interaction form

  @interactions-create--events-toggle
  Scenario: Toggle service delivery event association

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed
