import numpy as np

AXIS = [0, 1, 2, 3]
_identities = []
_identities.append([_convert(x,y,z) for x in AXIS for y in AXIS for z in AXIS])
_identities.append([_convert(x,y,z) for x in AXIS for y in AXIS[::-1] for z in AXIS])
_identities.append([_convert(x,y,z) for x in AXIS[::-1] for y in AXIS for z in AXIS])
_identities.append([_convert(x,y,z) for x in AXIS[::-1] for y in AXIS[::-1] for z in AXIS])

def _convert(self, x, y, z):
    return x + 4*y + 16*z

class Game:

    def __init__(self):
        self.currentPlayer = 1
        self.gameState = GameState(np.array([0 for _ in range(64)], dtype=np.int), 1)
        self.actionSpace = np.array([0 for _ in range(64)], dtype=np.int)
        self.pieces = {'1':'X', '0': '-', '-1':'O'}
        self.grid_shape = (4,4)
        self.input_shape = (36,4,4)
        self.name = 'line4'
        self.state_size = len(self.gameState.binary)
        self.action_size = len(self.actionSpace)

    def reset(self):
        self.gameState = GameState(np.array([0 for _ in range(64)], dtype=np.int), 1)
        self.currentPlayer = 1
        return self.gameState

    def step(self, action):
        next_state, value, done = self.gameState.takeAction(action)
        self.gameState = next_state
        self.currentPlayer = -self.currentPlayer
        info = None
        return ((next_state, value, done, info))

    def identities(self, state, actionValues):
        identities = []

        for i in range(4):
            currentBoard = np.array([state.board[j] for j in _identities[i]])
            currentAV = np.array([actionValues[j] for j in _identities[i]])
            identities.append((GameState(currentBoard, state.playerTurn), currentAV))

        return identities

_input = []
for z in AXIS:
    _input.append([_convert(x,y,z) for x in AXIS for y in AXIS])
for x in AXIS:
    _input.append([_convert(x,y,z) for y in AXIS for z in AXIS])
for y in AXIS:
    _input.append([_convert(x,y,z) for z in AXIS for x in AXIS])

_input.append([_convert(x,x,z) for x in AXIS for z in AXIS])
_input.append([_convert(x,3-x,z) for x in AXIS for z in AXIS])
_input.append([_convert(x,y,y) for y in AXIS for x in AXIS])
_input.append([_convert(x,y,3-y) for y in AXIS for x in AXIS])
_input.append([_convert(z,y,z) for z in AXIS for y in AXIS])
_input.append([_convert(3-z,y,z) for z in AXIS for y in AXIS])


winners = []

for x in AXIS:
    for y in AXIS:
        winners.append([_convert(x, y, z) for z in AXIS])
for y in AXIS:
    for z in AXIS:
        winners.append([_convert(x, y, z) for x in AXIS])
for z in AXIS:
    for x in AXIS:
        winners.append([_convert(x, y, z) for y in AXIS])

for x in AXIS:
    winners.append([_convert(x, y, y) for y in AXIS])
    winners.append([_convert(x, y, 3-y) for y in AXIS])
for y in AXIS:
    winners.append([_convert(z, y, z) for z in AXIS])
    winners.append([_convert(3-z, y, z) for z in AXIS])
for z in AXIS:
    winners.append([_convert(x, x, z) for x in AXIS])
    winners.append([_convert(x, 3-x, z) for x in AXIS])

winners.append([_convert(x, x, x) for x in AXIS])
winners.append([_convert(x, x, 3-x) for x in AXIS])
winners.append([_convert(x, 3-x, x) for x in AXIS])
winners.append([_convert(x, 3-x, 3-x) for x in AXIS])


class GameState():
    def __init__(self, board, playerTurn):
        self.board = board
        self.pieces = {'1':'X', '0': '-', '-1':'O'}
        self.playerTurn = playerTurn
        self.binary = self._binary()
        self.id = self._convertStateToId()
        self.allowedActions = self._allowedActions()
        self.isEndGame = self._checkForEndGame()
        self.value = self._getValue()
        self.score = self._getScore()

    def _allowedActions(self):
        allowed = []
        for i in range(len(self.board)):
            if i >= len(self.board) - 16:
                if self.board[i] == 0:
                    allowed.append(i)
            else:
                if self.board[i] == 0 and self.board[i+16] != 0:
                    allowed.append(i)

        return allowed

    def _binary(self):
        position = []

        for i in range(18):
            tmp_input = _input[i]
            board = [self.board[j] for j in tmp_input]

            currentplayer_position = np.array([1 if self.board[j]==1 else 0 for j in tmp_input])
            other_position = np.array([1 if self.board[j]==-1 else 0 for j in tmp_input])

            position = np.append(position, currentplayer_position)
            position = np.append(position, other_position)

        return (position)

    def _convertStateToId(self):
        player1_position = np.zeros(len(self.board), dtype=np.int)
        player1_position[self.board==1] = 1

        other_position = np.zeros(len(self.board), dtype=np.int)
        other_position[self.board==-1] = 1

        position = np.append(player1_position,other_position)

        id = ''.join(map(str,position))

        return id

    def _checkForEndGame(self):
        if np.count_nonzero(self.board) == 64:
            return 1

        for a, b, c, d in winners:
            if (self.board[a] + self.board[b] + self.board[c] + self.board[d] == 4 * -self.playerTurn):
                return 1
        return 0

    def _getValue(self):
        # This is the value of the state for the current player
        # i.e. if the previous player played a winning move, you lose
        for a, b, c, d in winners:
            if (self.board[a] + self.board[b] + self.board[c] + self.board[d] == 4 * -self.playerTurn):
                return (-1, -1, 1)
        return (0, 0, 0)

    def _getScore(self):
        tmp = self.value
        return (tmp[1], tmp[2])


    def takeAction(self, action):
        newBoard = np.array(self.board)
        newBoard[action]=self.playerTurn

        newState = GameState(newBoard, -self.playerTurn)

        value = 0
        done = 0

        if newState.isEndGame:
            value = newState.value[0]
            done = 1

        return (newState, value, done)


    def render(self, logger):
        for z in AXIS:
            logger.info('z:%d, x: %s' % (z, ' '.join(map(str, AXIS))))
            for y in AXIS:
                logger.info('   y: %d %s' % (y, ' '.join(self.pieces[str(x)] for x in self.board[_convert(0,y,z) : _convert(3,y,z) + 1])))
        logger.info('--------------')


