Feature: Move Validation

    As a User
    I want that my moves are validated
    So that I cannot make wrong moves

    Background: Initial Game
        Given I initialize a game with the parameters
            | size | 5 |
        And I place a flat stone at a1
        And I place a flat stone at a2

    Scenario: Move out of board
        When I move one stone from a2 left
        Then I should get an error
        And The error message should be "Cannot move out of the board"

    Scenario: Move on a standing stone
        Given I place a standing stone at b1
        When I move one stone from a1 right
        Then I should get an error
        And The error message should be "Can only flatten a wall with a capstone"

    Scenario: Move on a capstone
        Given I place a capstone at b1
        When I move one stone from a1 right
        Then I should get an error
        And The error message should be "Cannot move a stone onto a capstone"

    Scenario Outline: Wrong place of stone
        When I place a <stone> at a1
        Then I should get an error
        And The error message should be "Cannot place a stone on a non empty board"
        Examples:
            | stone          |
            | flat stone     |
            | standing stone |
            | capstone       |

    Scenario: Moving through wall
        Given I place a capstone at b1
        And I place a standing stone at b2
        And I move one stone from b1 left
        And I move one stone from b2 left
        When I move 2 stones from a1 up, dropping one stone at each square
        Then I should get an error
        And The error message should be "Can only flatten a wall with a capstone"

    Scenario: Wrong Flattening
        Given I place a capstone at b1
        And I place a standing stone at b2
        And I move one stone from b1 left
        And I move one stone from b2 left
        When I move 2 stones from a1 up with all stones
        Then I should get an error
        And The error message should be "Can only flatten a wall with one capstone"