import numpy as np

class Game:

    def __init__(self):
        self.currentPlayer = 1
        self.gameState = GameState(np.array([0 for _ in range(64)], dtype=np.int), 1)
        self.actionSpace = np.array([0 for _ in range(64)], dtype=np.int)
        self.pieces = {'1':'X', '0': '-', '-1':'O'}
        # self.grid_shape = (6,7)
        # self.input_shape = (2,6,7)
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
        identities = [(state,actionValues)]

        currentBoard = state.board
        currentAV = actionValues

        currentBoard = np.array([
              currentBoard[3], currentBoard[2], currentBoard[1], currentBoard[0]
            , currentBoard[7], currentBoard[6], currentBoard[5], currentBoard[4]
            , currentBoard[11], currentBoard[10], currentBoard[9], currentBoard[8]
            , currentBoard[15], currentBoard[14], currentBoard[13], currentBoard[12]
            , currentBoard[19], currentBoard[18], currentBoard[19], currentBoard[18]
            , currentBoard[23], currentBoard[22], currentBoard[21], currentBoard[20]
            , currentBoard[27], currentBoard[26], currentBoard[25], currentBoard[24]
            , currentBoard[31], currentBoard[30], currentBoard[29], currentBoard[28]
            , currentBoard[35], currentBoard[34], currentBoard[33], currentBoard[32]
            , currentBoard[39], currentBoard[38], currentBoard[37], currentBoard[36]
            , currentBoard[43], currentBoard[42], currentBoard[41], currentBoard[40]
            , currentBoard[47], currentBoard[46], currentBoard[45], currentBoard[44]
            , currentBoard[51], currentBoard[50], currentBoard[49], currentBoard[48]
            , currentBoard[55], currentBoard[54], currentBoard[53], currentBoard[52]
            , currentBoard[59], currentBoard[58], currentBoard[57], currentBoard[56]
            , currentBoard[63], currentBoard[62], currentBoard[61], currentBoard[60]
            ])

        currentAV = np.array([
              currentAV[3], currentAV[2], currentAV[1], currentAV[0]
            , currentAV[7], currentAV[6], currentAV[5], currentAV[4]
            , currentAV[11], currentAV[10], currentAV[9], currentAV[8]
            , currentAV[15], currentAV[14], currentAV[13], currentAV[12]
            , currentAV[19], currentAV[18], currentAV[19], currentAV[18]
            , currentAV[23], currentAV[22], currentAV[21], currentAV[20]
            , currentAV[27], currentAV[26], currentAV[25], currentAV[24]
            , currentAV[31], currentAV[30], currentAV[29], currentAV[28]
            , currentAV[35], currentAV[34], currentAV[33], currentAV[32]
            , currentAV[39], currentAV[38], currentAV[37], currentAV[36]
            , currentAV[43], currentAV[42], currentAV[41], currentAV[40]
            , currentAV[47], currentAV[46], currentAV[45], currentAV[44]
            , currentAV[51], currentAV[50], currentAV[49], currentAV[48]
            , currentAV[55], currentAV[54], currentAV[53], currentAV[52]
            , currentAV[59], currentAV[58], currentAV[57], currentAV[56]
            , currentAV[63], currentAV[62], currentAV[61], currentAV[60]
            ])

        identities.append((GameState(currentBoard, state.playerTurn), currentAV))

        return identities


class GameState():
    def __init__(self, board, playerTurn):
        self.board = board
        self.pieces = {'1':'X', '0': '-', '-1':'O'}
        self.AXIS = range(4)
        self.winners = [
            [0, 16, 32, 48],
            [4, 20, 36, 52],
            [8, 24, 40, 56],
            [12, 28, 44, 60],
            [1, 17, 33, 49],
            [5, 21, 37, 53],
            [9, 25, 41, 57],
            [13, 29, 45, 61],
            [2, 18, 34, 50],
            [6, 22, 38, 54],
            [10, 26, 42, 58],
            [14, 30, 46, 62],
            [3, 19, 35, 51],
            [7, 23, 39, 55],
            [11, 27, 43, 59],
            [15, 31, 47, 63],
            [0, 1, 2, 3],
            [16, 17, 18, 19],
            [32, 33, 34, 35],
            [48, 49, 50, 51],
            [4, 5, 6, 7],
            [20, 21, 22, 23],
            [36, 37, 38, 39],
            [52, 53, 54, 55],
            [8, 9, 10, 11],
            [24, 25, 26, 27],
            [40, 41, 42, 43],
            [56, 57, 58, 59],
            [12, 13, 14, 15],
            [28, 29, 30, 31],
            [44, 45, 46, 47],
            [60, 61, 62, 63],
            [0, 4, 8, 12],
            [1, 5, 9, 13],
            [2, 6, 10, 14],
            [3, 7, 11, 15],
            [16, 20, 24, 28],
            [17, 21, 25, 29],
            [18, 22, 26, 30],
            [19, 23, 27, 31],
            [32, 36, 40, 44],
            [33, 37, 41, 45],
            [34, 38, 42, 46],
            [35, 39, 43, 47],
            [48, 52, 56, 60],
            [49, 53, 57, 61],
            [50, 54, 58, 62],
            [51, 55, 59, 63],
            [0, 20, 40, 60],
            [64, 52, 40, 28],
            [1, 21, 41, 61],
            [65, 53, 41, 29],
            [2, 22, 42, 62],
            [66, 54, 42, 30],
            [3, 23, 43, 63],
            [67, 55, 43, 31],
            [0, 17, 34, 51],
            [4, 19, 34, 49],
            [4, 21, 38, 55],
            [8, 23, 38, 53],
            [8, 25, 42, 59],
            [12, 27, 42, 57],
            [12, 29, 46, 63],
            [16, 31, 46, 61],
            [0, 5, 10, 15],
            [16, 13, 10, 7],
            [16, 21, 26, 31],
            [32, 29, 26, 23],
            [32, 37, 42, 47],
            [48, 45, 42, 39],
            [48, 53, 58, 63],
            [64, 61, 58, 55],
            [0, 21, 42, 63],
            [64, 53, 42, 31],
            [16, 29, 42, 55],
            [80, 61, 42, 23]
            ]
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
        currentplayer_position = np.zeros(len(self.board), dtype=np.int)
        currentplayer_position[self.board==self.playerTurn] = 1

        other_position = np.zeros(len(self.board), dtype=np.int)
        other_position[self.board==-self.playerTurn] = 1

        position = np.append(currentplayer_position,other_position)

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

        for a, b, c, d in self.winners:
            if (self.board[a] + self.board[b] + self.board[c] + self.board[d] == 4 * -self.playerTurn):
                return 1
        return 0

    def _getValue(self):
        # This is the value of the state for the current player
        # i.e. if the previous player played a winning move, you lose
        for a, b, c, d in self.winners:
            if (self.board[a] + self.board[b] + self.board[z] + self.board[d] == 4 * -self.playerTurn):
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
        for z in self.AXIS[::-1]:
            logger.info('z: %d, x:%s' % (z, ' '.join(map(str, self.AXIS))))
            for y in self.AXIS:
                logger.info('   y: %d%s' % (y, ' '.join(self.pieces[str(x)] for x in self.board[y*4 + z*16 : y*4 + z*16 + 4]))
        logger.info('--------------')


