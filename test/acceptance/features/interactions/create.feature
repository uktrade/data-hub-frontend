@interactions-create
Feature: Interaction form

  @interactions-create--events-toggle
  Scenario: Toggle service delivery event association

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    When a primary contact is added
    And I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the company "Interactions" tab
    And I click the "Add interaction" link
    And selecting service delivery
    Then there are service delivery fields
    When the interaction events Yes option is chosen
    Then the interaction events is displayed
    When the interaction events No option is chosen
    Then the interaction events is not displayed
