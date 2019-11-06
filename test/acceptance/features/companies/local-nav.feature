@companies-local-nav  @details
Feature: Companies local nav

  @companies-local-nav--staff
  Scenario: Companies local nav as DIT staff

    When I navigate to the `companies.fixture` page using `company` `One List Corp` fixture
    Then there should be a tabbed local nav
      | text                      |
      | Activity                  |
      | Company contacts          |
      | Core team                 |
      | Investment                |
      | Export                    |
      | Orders                    |

