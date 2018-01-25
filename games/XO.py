import numpy as np
import logging

class Game:

	def __init__(self):
		self.currentPlayer = 1
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.actionSpace = np.array([0,0,0,0,0,0,0,0,0], dtype=np.int)
		self.pieces = {'1':'X', '0': '-', '-1':'O'}
		self.grid_shape = (3,3)
		self.name = 'XO'
		self.state_size = len(self.gameState.binary())
		self.action_size = len(self.actionSpace)

	def reset(self):
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.currentPlayer = 1
		return self.gameState

	def step(self, action):
		next_state, value, done = self.gameState.takeAction(action)
		self.gameState = next_state
		self.currentPlayer = -self.currentPlayer
		info = None
		return ((next_state, value, done, info))

	def render(self, logger):
		for r in range(3):
			logger.info([self.pieces[str(x)] for x in self.gameState.board[3*r : (3*r + 3)]])
		logger.info('--------------')

	def identities(self, state, actionValues):
		identities = []
		currentBoard = state.board
		currentAV = actionValues

		for n in xrange(4):
			currentBoard = np.array([currentBoard[6], currentBoard[3],currentBoard[0]
						, currentBoard[7], currentBoard[4], currentBoard[1]
						, currentBoard[8], currentBoard[5], currentBoard[2]])

			currentAV = np.array([currentAV[6], currentAV[3],currentAV[0]
						, currentAV[7], currentAV[4], currentAV[1]
						, currentAV[8], currentAV[5], currentAV[2]])
			
			identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		currentBoard = np.array([currentBoard[2], currentBoard[1],currentBoard[0]
						, currentBoard[5], currentBoard[4], currentBoard[3]
						, currentBoard[8], currentBoard[7], currentBoard[6]])

		currentAV = np.array([currentAV[2], currentAV[1],currentAV[0]
							, currentAV[5], currentAV[4], currentAV[3]
							, currentAV[8], currentAV[7], currentAV[6]])

		for n in xrange(4):
			currentBoard = np.array([currentBoard[6], currentBoard[3],currentBoard[0]
						, currentBoard[7], currentBoard[4], currentBoard[1]
						, currentBoard[8], currentBoard[5], currentBoard[2]])

			currentAV = np.array([currentAV[6], currentAV[3],currentAV[0]
						, currentAV[7], currentAV[4], currentAV[1]
						, currentAV[8], currentAV[5], currentAV[2]])

			identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		return identities

class GameState():

	def __init__(self, board, playerTurn):
		self.board = board
		self.winners = [(0,3,6),(1,4,7),(2,5,8),(0,1,2), (3,4,5), (6,7,8), (0,4,8), (2,4,6)]
		self.playerTurn = playerTurn

	def allowedActions(self):
		return np.where(self.board == 0)[0]

	def binary(self):

		currentplayer_position = np.zeros(len(self.board), dtype=np.int)
		currentplayer_position[self.board==self.playerTurn] = 1

		other_position = np.zeros(len(self.board), dtype=np.int)
		other_position[self.board==-self.playerTurn] = 1

		position = np.append(currentplayer_position,other_position)

		return (position)

	def convertStateToId(self):
		id = ''.join(map(str,self.binary()))
		return id


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
		if np.count_nonzero(self.board) == 9:
			return 1

		for x,y,z in self.winners:
			if (self.board[x] + self.board[y] + self.board[z] == 3 * -self.playerTurn):
				return 1
		return 0

	def getValue(self):
		# This is the value of the state for the current player
		for x,y,z in self.winners:
			if (self.board[x] + self.board[y] + self.board[z] == 3 * -self.playerTurn):
				return (-1, -1, 1)
		return (0, 0, 0)

	def getScore(self):
		tmp = self.getValue()
		return (tmp[1], tmp[2])



