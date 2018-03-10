import numpy as np
import logging


# import cv2 as cv


class Game:
  def __init__(self):
    self.currentPlayer = 1
    self.gameState = GameState(np.array(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, -1, 1,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ], dtype=np.int), 1)
    self.actionSpace = np.array(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ], dtype=np.int)
    self.pieces = {'1': 'X', '0': '-', '-1': 'O'}
    self.grid_shape = (8, 8)
    self.input_shape = (2, 8, 8)
    self.name = 'reversi'
    self.state_size = len(self.gameState.binary)
    self.action_size = len(self.actionSpace)

  def reset(self):
    self.gameState = GameState(np.array(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, -1, 1,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ], dtype=np.int), 1)
    self.currentPlayer = 1
    return self.gameState

  def step(self, action):
    next_state, value, done = self.gameState.takeAction(action)
    self.gameState = next_state
    self.currentPlayer = -self.currentPlayer
    info = None
    return ((next_state, value, done, info))

  def identities(self, state, actionValues):
    identities = [(state, actionValues)]

    currentBoard = state.board
    currentAV = actionValues

    currentBoard = np.array([
      currentBoard[7], currentBoard[6], currentBoard[5], currentBoard[4], currentBoard[3], currentBoard[2],
      currentBoard[1], currentBoard[0]
      , currentBoard[15], currentBoard[14], currentBoard[13], currentBoard[12], currentBoard[11], currentBoard[10],
      currentBoard[9], currentBoard[8]
      , currentBoard[23], currentBoard[22], currentBoard[21], currentBoard[20], currentBoard[19], currentBoard[18],
      currentBoard[17], currentBoard[16]
      , currentBoard[31], currentBoard[30], currentBoard[29], currentBoard[28], currentBoard[27], currentBoard[26],
      currentBoard[25], currentBoard[24]
      , currentBoard[39], currentBoard[38], currentBoard[37], currentBoard[36], currentBoard[35], currentBoard[34],
      currentBoard[33], currentBoard[32]
      , currentBoard[47], currentBoard[46], currentBoard[45], currentBoard[44], currentBoard[43], currentBoard[42],
      currentBoard[41], currentBoard[40]
      , currentBoard[55], currentBoard[54], currentBoard[53], currentBoard[52], currentBoard[51], currentBoard[50],
      currentBoard[49], currentBoard[48]
      , currentBoard[63], currentBoard[62], currentBoard[61], currentBoard[60], currentBoard[59], currentBoard[58],
      currentBoard[57], currentBoard[56]
    ])

    currentAV = np.array([
      currentAV[7], currentAV[6], currentAV[5], currentAV[4], currentAV[3], currentAV[2], currentAV[1], currentAV[0]
      , currentAV[15], currentAV[14], currentAV[13], currentAV[12], currentAV[11], currentAV[10], currentAV[9],
      currentAV[8]
      , currentAV[23], currentAV[22], currentAV[21], currentAV[20], currentAV[19], currentAV[18], currentAV[17],
      currentAV[16]
      , currentAV[31], currentAV[30], currentAV[29], currentAV[28], currentAV[27], currentAV[26], currentAV[25],
      currentAV[24]
      , currentAV[39], currentAV[38], currentAV[37], currentAV[36], currentAV[35], currentAV[34], currentAV[33],
      currentAV[32]
      , currentAV[47], currentAV[46], currentAV[45], currentAV[44], currentAV[43], currentAV[42], currentAV[41],
      currentAV[40]
      , currentAV[55], currentAV[54], currentAV[53], currentAV[52], currentAV[51], currentAV[50], currentAV[49],
      currentAV[48]
      , currentAV[63], currentAV[62], currentAV[61], currentAV[60], currentAV[59], currentAV[58], currentAV[57],
      currentAV[56]
    ])

    identities.append((GameState(currentBoard, state.playerTurn), currentAV))

    return identities


class GameState():
  def __init__(self, board, playerTurn):
    self.board = board
    self.pieces = {'1': 'X', '0': '-', '-1': 'O'}
    self.winners = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
       31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
       59, 60, 61, 62, 63],

    ]
    self.playerTurn = playerTurn
    self.binary = self._binary()
    self.id = self._convertStateToId()
    self.allowedActions = self._allowedActions()
    self.isEndGame = self._checkForEndGame()
    self.value = self._getValue()
    self.score = self._getScore()

  def _allowedActions(self):
    # TODO ---
    def varify_position(np_board, x, y):
      available_pattern = [[-1, 1],
                           [-1, -1, 1],
                           [-1, -1, -1, 1],
                           [-1, -1, -1, -1, 1],
                           [-1, -1, -1, -1, -1, 1],
                           [-1, -1, -1, -1, -1, -1, 1],
                           ]  # count can be used for non player count direct sum

      is_allowed_move = False

      # [1:] exclude current box itself
      row_x = np_board[:x, y][::-1]
      row_x_ = np_board[x:, y][1:]
      row_y = np_board[x, :y][::-1]
      row_y_ = np_board[x, y:][1:]

      xy_min = min(x, y)
      xy_min_ = 7 - xy_min
      xy_max = max(x, y)

      # anti_diag = np_board[x-xy_min:x,y-xy_min:y][::-1,::-1].diagonal()
      # anti_diag_ = np_board[x:x+xy_min_, y:y+xy_min_][1:, 1:].diagonal()
      # diag = np_board[x-xy_min:x, y:y+xy_min_][::-1, 1:].diagonal()
      # diag_ = np_board[x:x+xy_min_, y-xy_min:y][1:, ::-1].diagonal()

      anti_diag = np_board[:x, :y][::-1, ::-1].diagonal()
      anti_diag_ = np_board[x:, y:][1:, 1:].diagonal()
      diag = np_board[:x, y:][::-1, 1:].diagonal()
      diag_ = np_board[x:, :y][1:, ::-1].diagonal()
      # print

      for arr in [row_x, row_x_, row_y, row_y_, anti_diag, anti_diag_, diag, diag_]:
        for selection_length in range(1, len(arr)):

          jj_arr = arr[:selection_length + 1] * self.playerTurn
          jj_arr = list(jj_arr)
          if jj_arr in available_pattern:
            is_allowed_move = True
            return is_allowed_move

      return is_allowed_move

    allowed = []
    np_board = np.reshape(self.board, [8, 8])
    for ix in range(8):
      for jy in range(8):
        if np_board[ix, jy] == 0:
          to_varify = False
          if ix < 7:
            if np_board[ix + 1, jy] == -self.playerTurn:
              to_varify = True
          if jy < 7:
            if np_board[ix, jy + 1] == -self.playerTurn:
              to_varify = True
          if ix > 0:
            if np_board[ix - 1, jy] == -self.playerTurn:
              to_varify = True
          if jy > 0:
            if np_board[ix, jy - 1] == -self.playerTurn:
              to_varify = True
          # diag anti diag
          if ix < 7 and jy < 7:
            if np_board[ix + 1, jy + 1] == -self.playerTurn:
              to_varify = True
          if ix < 7 and jy > 0:
            if np_board[ix + 1, jy - 1] == -self.playerTurn:
              to_varify = True
          if ix > 0 and jy < 7:
            if np_board[ix - 1, jy + 1] == -self.playerTurn:
              to_varify = True
          if ix > 0 and jy > 0:
            if np_board[ix - 1, jy - 1] == -self.playerTurn:
              to_varify = True

          if to_varify:
            allowed_move = varify_position(np_board, ix, jy)
            if allowed_move:
              allowed.append(ix * 8 + jy)

              # print

              # for i in xrange(len(self.board)):
              # 	if self.board[i] == 0 or self.board[i] == self.playerTurn:
              # 		allowed.append(i)

              #
              # for i in xrange(len(self.board)):
              #   if i >= len(self.board) - 7:
              #     if self.board[i] == 0:
              #       allowed.append(i)
              #   else:
              #     if self.board[i] == 0 and self.board[i + 7] != 0:
              #       allowed.append(i)
              # if i < len(self.board) - 7:
              # 	if self.board[i+7] == self.playerTurn:
              # 		allowed.append(i)
    # if allowed ==[]:
    #   allowed.append(63)
    return allowed

  def _binary(self):

    currentplayer_position = np.zeros(len(self.board), dtype=np.int)
    currentplayer_position[self.board == self.playerTurn] = 1

    other_position = np.zeros(len(self.board), dtype=np.int)
    other_position[self.board == -self.playerTurn] = 1

    position = np.append(currentplayer_position, other_position)

    return (position)

  def _convertStateToId(self):
    player1_position = np.zeros(len(self.board), dtype=np.int)
    player1_position[self.board == 1] = 1

    other_position = np.zeros(len(self.board), dtype=np.int)
    other_position[self.board == -1] = 1

    position = np.append(player1_position, other_position)

    id = ''.join(map(str, position))

    return id

  def _checkForEndGame(self):
    if np.count_nonzero(self.board) == 64:
      return 1
    if self.allowedActions == []:
      return 1

    # TODO check again
    # for x, y, z, a in self.winners:
    #   if (self.board[x] + self.board[y] + self.board[z] + self.board[a] == 4 * -self.playerTurn):
    #     return 1

    # for pat in self.winners:
    # 	sum = 0
    # 	for pat_i in pat:
    # 		sum +=self.board[pat_i]
    # 	if (sum == 16 * -self.playerTurn):
    # 		return 1

    return 0

  def _getValue(self):
    # This is the value of the state for the current player
    # i.e. if the previous player played a winning move, you lose

    # TODO check value again
    # for x, y, z, a in self.winners:
    #   if (self.board[x] + self.board[y] + self.board[z] + self.board[a] == 4 * -self.playerTurn):
    #     return (-1, -1, 1)
    if np.count_nonzero(self.board) == 64:
      return (-1, -1, 1)
    if list(self.board).count(-self.playerTurn) >= 50:
      return (-1, -1, 1)
    if list(self.board).count(-self.playerTurn) > list(self.board).count(self.playerTurn):
      return (-1, -1, 1)

    # for pat in self.winners:
    # 	sum = 0
    # 	for pat_i in pat:
    # 		sum +=self.board[pat_i]
    # 	if (sum == 16 * -self.playerTurn):
    # 		return (-1, -1, 1)

    return (0, 0, 0)

  def _getScore(self):
    tmp = self.value
    return (tmp[1], tmp[2])

  def fourConnectivity(self, action):
    toChange = []
    if (action + 1) % 7 != 0:
      toChange.append(action + 1)

    if action % 7 != 0:
      toChange.append(action)

    if not (action >= 35):
      toChange.append(action + 7)

    if not (action <= 6):
      toChange.append(action - 7)

    return toChange

  def takeAction(self, action):

    def position_update(np_board, x, y):
      available_pattern = [[-1, 1],
                           [-1, -1, 1],
                           [-1, -1, -1, 1],
                           [-1, -1, -1, -1, 1],
                           [-1, -1, -1, -1, -1, 1],
                           [-1, -1, -1, -1, -1, -1, 1],
                           ]  # count can be used for non player count direct sum

      positions = []

      # [1:] exclude current box itself
      row_x = np_board[:x, y][::-1]
      row_x_ = np_board[x:, y][1:]
      row_y = np_board[x, :y][::-1]
      row_y_ = np_board[x, y:][1:]

      anti_diag = np_board[:x, :y][::-1, ::-1].diagonal()
      anti_diag_ = np_board[x:, y:][1:, 1:].diagonal()
      diag = np_board[:x, y:][::-1, 1:].diagonal()
      diag_ = np_board[x:, :y][1:, ::-1].diagonal()

      for indx, arr in enumerate([row_x, row_x_, row_y, row_y_, anti_diag, anti_diag_, diag, diag_]):
        for selection_length in range(1, len(arr)):

          jj_arr = arr[:selection_length + 1] * self.playerTurn
          jj_arr = list(jj_arr)

          if jj_arr in available_pattern:
            if indx == 0:
              for count in range(len(jj_arr) - 1):
                act = (x - 1 - count) * 8 + y
                positions.append(act)

            if indx == 1:
              for count in range(len(jj_arr) - 1):
                act = (x + 1 + count) * 8 + y
                positions.append(act)

            if indx == 2:
              for count in range(len(jj_arr) - 1):
                act = (x) * 8 + (y - 1 - count)
                positions.append(act)

            if indx == 3:
              for count in range(len(jj_arr) - 1):
                act = (x) * 8 + (y + 1 + count)
                positions.append(act)

            if indx == 4:
              for count in range(len(jj_arr) - 1):
                act = (x - 1 - count) * 8 + (y - 1 - count)
                positions.append(act)

            if indx == 5:
              for count in range(len(jj_arr) - 1):
                act = (x + 1 + count) * 8 + (y + 1 + count)
                positions.append(act)

            if indx == 6:
              for count in range(len(jj_arr) - 1):
                act = (x - 1 - count) * 8 + (y + 1 + count)
                positions.append(act)

            if indx == 7:
              for count in range(len(jj_arr) - 1):
                act = (x + 1 + count) * 8 + (y - 1 - count)
                positions.append(act)

            break

      return positions

    newBoard = np.array(self.board)
    np_board = np.reshape(self.board, [8, 8])
    position_updt = position_update(np_board, action / 8, action % 8)

    # if self.board[action] == self.playerTurn:
    #   toChange = self.fourConnectivity(action)
    #   newBoard[toChange] = self.playerTurn
    #   # newBoard[action] = self.playerTurn
    #   newBoard[action] = 0
    # else:
    #   newBoard[action] = self.playerTurn

    # print self.board,self.playerTurn
    # if action != 63:
    newBoard[action] = self.playerTurn
    newBoard[position_updt] = self.playerTurn

    newState = GameState(newBoard, -self.playerTurn)

    value = 0
    done = 0

    if newState.isEndGame:
      value = newState.value[0]
      done = 1

    return (newState, value, done)

  def render(self, logger):
    for r in range(8):
      logger.info([self.pieces[str(x)] for x in self.board[8 * r: (8 * r + 8)]])
    logger.info('--------------')

    # To display render as image
    # import cv2 as cv
    # img = (np.resize(self.board, [8, 8]) + 1) * 127
    # img = img.astype(np.uint8)
    # cv.imshow('mctc', img)
    # cv.waitKey(1)

  # def render_display(self):
  #   img = (np.resize(self.board, [8, 8]) + 1) * 127
  #   img = img.astype(np.uint8)
  #   cv.imshow('board', img)
  #   cv.waitKey(1)
  #
  # def render_display_pi(self, pi):
  #   img = (np.resize(pi, [8, 8])) * 254
  #   img = img.astype(np.uint8)
  #   cv.imshow('pi', img)
  #   cv.waitKey(1)
