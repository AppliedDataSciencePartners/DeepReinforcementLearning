import numpy as np
import logging

class Game:

	def __init__(self):
		self.playerTurn = 1
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.actionSpace = np.array([0,0,0,0,0,0,0,0,0], dtype=np.int)
		self.pieces = {'1':'X', '0': '-', '-1':'O'}
		self.grid_shape = (3,3)
		self.name = 'easySquares'

	def reset(self):
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.playerTurn = 1
		return self.gameState

	def step(self, action):
		next_state, value, done = self.gameState.takeAction(action)
		self.gameState = next_state
		info = None
		return ((next_state, value, done, info))

	def render(self, logger):
		for r in range(3):
			logger.info([self.pieces[str(x)] for x in self.gameState.board[3*r : (3*r + 3)]])
		logger.info('--------------')

	def renderToGrid(self, obj,logger):
		for r in range(3):
			logger.info([x for x in obj[3*r : (3*r + 3)]])
		logger.info('--------------')

	def identities(self, state, actionValues):
		identities = [(state,actionValues)]
		return identities

class GameState():

	def __init__(self, board, playerTurn):
		self.board = board
		#self.winners = [(0,3,6),(1,4,7),(2,5,8),(0,1,2), (3,4,5), (6,7,8), (0,4,8), (2,4,6)]
		self.playerTurn = playerTurn

	def allowedActions(self):
		return np.where(self.board == 0)[0]

	def binary(self):
		white_position = np.zeros(len(self.board), dtype=np.int)
		white_position[self.board==1] = 1

		black_position = np.zeros(len(self.board), dtype=np.int)
		black_position[self.board==-1] = 1

		position = np.append(white_position,black_position)

		return (position)

	def takeAction(self, action):
		newBoard = np.array(self.board)
		newBoard[action] = self.playerTurn
		newState = GameState(newBoard, -self.playerTurn)

		value = 0
		done = 0

		if newState.checkForEndGame():
			value = newState.getValue()[0]
			done = 1

		return (newState, value, done) 

	def checkForEndGame(self):
		if np.count_nonzero(self.board) == 8:
			return 1
		return 0

	def getValue(self):
		# This is the value of the state for the current player
		cp_score = 0 #current player
		op_score = 0 #other player

		for tile in xrange(9):
			if self.board[tile] == self.playerTurn:
				cp_score += tile
			elif self.board[tile] == -self.playerTurn:
				op_score += tile

		if cp_score > op_score:
			return (1, cp_score, op_score)
		elif cp_score < op_score:
			return (-1, cp_score, op_score)
		else:
			return (0, cp_score, op_score)

	def getScore(self):
		tmp = self.getValue()
		return (tmp[1], tmp[2])

	def convertStateToId(self):
		id = ''.join(map(str,self.binary()))
		return id

