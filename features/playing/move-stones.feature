Feature: Move handling

    As a User
    I want to excecute different Moves
    in order to play the game

    Background: Initial Game
        Given I initialize a game with the parameters
            | size | 5 |
        And I place a flat stone at a1
        And I place a flat stone at c3

    Scenario Outline: move into any direction
        When I move one stone from c3 <direction>
        Then On <position> is a flat white stone
        Examples:
            | direction | position |
            | up        | c4       |
            | down      | c2       |
            | right     | d3       |
            | left      | b3       |

    Scenario: Move Stack
        Given I place a flat stone at c2
        And I place a flat stone at c1
        And I move one stone from c3 down
        And I move one stone from c1 up
        When I move 3 stones from c2 up, dropping one stone at each square
        Then On c3 is a flat white stone
        And On c4 is a flat white stone
        And On c5 is a flat black stone

    Scenario: Wall flattening
        Given I place a capstone at e3
        And I place a standing stone at d3
        When I move one stone from e3 left
        Then On d3 should be a stack with a flat black stone and a white capstone