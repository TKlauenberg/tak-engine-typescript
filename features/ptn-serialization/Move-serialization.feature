Feature: Move serialization

    As a User
    I want to get the PTN move representation of any Move
    so that I can share it

    Scenario Outline: Place Move
        Given a place move with a <stone> at a1
        When I serialize the move
        Then the string matches "<type>a1"
        Examples:
            | stone          | type |
            | flat stone     |      |
            | standing stone | S    |
            | capstone       | C    |

    Scenario Outline: Move Action
        Given a move Action on <pos> with <amount> stones into <direction> and "<drops>"
        When I serialize the move
        Then the string matches "<amount><pos><direction><drops>"
        Examples:
            | amount | pos | direction | drops |
            | 1      | a1  | >         | 1     |
            | 2      | b2  | <         | 2     |
            | 3      | c1  | +         | 111   |
            | 4      | e5  | -         | 211   |