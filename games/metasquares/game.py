import numpy as np
import logging

class Game:

	def __init__(self):		
		self.currentPlayer = 1
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.actionSpace = np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=np.int)
		self.pieces = {'1':'X', '0': '-', '-1':'O'}
		self.grid_shape = (5,5)
		self.input_shape = (2,5,5)
		self.name = 'metaSquares'
		self.state_size = len(self.gameState.binary)
		self.action_size = len(self.actionSpace)

	def reset(self):
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
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
		currentBoard = state.board
		currentAV = actionValues

		for n in xrange(5):
			currentBoard = np.array([
						  currentBoard[20], currentBoard[15],currentBoard[10], currentBoard[5],currentBoard[0]
						, currentBoard[21], currentBoard[16],currentBoard[11], currentBoard[6],currentBoard[1]
						, currentBoard[22], currentBoard[17],currentBoard[12], currentBoard[7],currentBoard[2]
						, currentBoard[23], currentBoard[18],currentBoard[13], currentBoard[8],currentBoard[3]
						, currentBoard[24], currentBoard[19],currentBoard[14], currentBoard[9],currentBoard[4]
						])

			currentAV = np.array([
						  currentAV[20], currentAV[15],currentAV[10], currentAV[5],currentAV[0]
						, currentAV[21], currentAV[16],currentAV[11], currentAV[6],currentAV[1]
						, currentAV[22], currentAV[17],currentAV[12], currentAV[7],currentAV[2]
						, currentAV[23], currentAV[18],currentAV[13], currentAV[8],currentAV[3]
						, currentAV[24], currentAV[19],currentAV[14], currentAV[9],currentAV[4]

						])
			
			identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		currentBoard = np.array([
					  currentBoard[4], currentBoard[3],currentBoard[2], currentBoard[1],currentBoard[0]
					, currentBoard[9], currentBoard[8],currentBoard[7], currentBoard[6],currentBoard[5]
					, currentBoard[14], currentBoard[13],currentBoard[12], currentBoard[11],currentBoard[10]
					, currentBoard[19], currentBoard[18],currentBoard[17], currentBoard[16],currentBoard[15]
					, currentBoard[24], currentBoard[23],currentBoard[22], currentBoard[21],currentBoard[20]
					])

		currentAV = np.array([
					  currentAV[4], currentAV[3],currentAV[2], currentAV[1],currentAV[0]
					, currentAV[9], currentAV[8],currentAV[7], currentAV[6],currentAV[5]
					, currentAV[14], currentAV[13],currentAV[12], currentAV[11],currentAV[10]
					, currentAV[19], currentAV[18],currentAV[17], currentAV[16],currentAV[15]
					, currentAV[24], currentAV[23],currentAV[22], currentAV[21],currentAV[20]

					])

		for n in xrange(5):
			currentBoard = np.array([
						  currentBoard[20], currentBoard[15],currentBoard[10], currentBoard[5],currentBoard[0]
						, currentBoard[21], currentBoard[16],currentBoard[11], currentBoard[6],currentBoard[1]
						, currentBoard[22], currentBoard[17],currentBoard[12], currentBoard[7],currentBoard[2]
						, currentBoard[23], currentBoard[18],currentBoard[13], currentBoard[8],currentBoard[3]
						, currentBoard[24], currentBoard[19],currentBoard[14], currentBoard[9],currentBoard[4]
						])

			currentAV = np.array([
						  currentAV[20], currentAV[15],currentAV[10], currentAV[5],currentAV[0]
						, currentAV[21], currentAV[16],currentAV[11], currentAV[6],currentAV[1]
						, currentAV[22], currentAV[17],currentAV[12], currentAV[7],currentAV[2]
						, currentAV[23], currentAV[18],currentAV[13], currentAV[8],currentAV[3]
						, currentAV[24], currentAV[19],currentAV[14], currentAV[9],currentAV[4]

						])

			identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		return identities




class GameState():
	def __init__(self, board, playerTurn):
		self.board = board
		self.pieces = {'1':'X', '0': '-', '-1':'O'}
		self.winners = [
			{'points': 1, 'tiles' : [
			[0,1,5,6]
			,[1,2,6,7]
			,[2,3,7,8]
			,[3,4,8,9]
			,[5,6,10,11]
			,[6,7,11,12]
			,[7,8,12,13]
			,[8,9,13,14]
			,[10,11,15,16]
			,[11,12,16,17]
			,[12,13,17,18]
			,[13,14,18,19]
			,[15,16,20,21]
			,[16,17,21,22]
			,[17,18,22,23]
			,[18,19,23,24]
			]},
			{'points': 2, 'tiles' : [
			[1,5,7,11]
			,[2,6,8,12]
			,[3,7,9,13]
			,[6,10,12,16]
			,[7,11,13,17]
			,[8,12,14,18]
			,[11,15,17,21]
			,[12,16,18,22]
			,[13,17,19,23]
			]},
			{'points': 4, 'tiles' : [
			[0,2,10,12]
			,[1,3,11,13]
			,[2,4,12,14]
			,[5,7,15,17]
			,[6,8,16,18]
			,[7,9,17,19]
			,[10,12,20,22]
			,[11,13,21,23]
			,[12,14,22,24]
			]},
			{'points': 5, 'tiles' : [
			[1,10,8,17]
			,[6,15,13,22]
			,[2,11,9,18]
			,[7,16,14,23]
			,[2,5,13,16]
			,[7,10,18,21]
			,[3,6,14,17]
			,[8,11,19,22]
			]},
			{'points': 8, 'tiles' : [
			[2,10,14,22]
			]},
			{'points': 9, 'tiles' : [
			[0,3,15,18]
			,[1,4,16,19]
			,[5,8,20,23]
			,[6,9,21,24]
			]},
			{'points': 10, 'tiles' : [
			[1,9,23,15]
			,[5,3,19,21]
			]},
			{'points': 16, 'tiles' : [
			[0,4,20,24]
			]},
			]
		self.playerTurn = playerTurn
		self.binary = self._binary()
		self.id = self._convertStateToId()
		self.allowedActions = self._allowedActions()
		self.isEndGame = self._checkForEndGame()
		self.value = self._getValue()
		self.score = self._getScore()

	def _allowedActions(self):
		return np.where(self.board == 0)[0]

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
		if np.count_nonzero(self.board) == 24:
			return 1
		return 0

	def _getValue(self):
		currentPlayerPoints = 0
		for squareType in self.winners:
			points = squareType['points']
			for tiles in squareType['tiles']:
				checkFlag = 0
				tilenum = 0
				while tilenum < 4 and checkFlag == 0:
					if self.board[tiles[tilenum]] != self.playerTurn:
						checkFlag = 1
					tilenum = tilenum + 1
				if checkFlag == 0:
					currentPlayerPoints = currentPlayerPoints + points
					
		opponentPlayerPoints = 0
		for squareType in self.winners:
			points = squareType['points']
			for tiles in squareType['tiles']:
				checkFlag = 0
				tilenum = 0
				while tilenum < 4 and checkFlag == 0:
					if self.board[tiles[tilenum]] != -self.playerTurn:
						checkFlag = 1
					tilenum = tilenum + 1
				if checkFlag == 0:
					opponentPlayerPoints = opponentPlayerPoints + points

		if currentPlayerPoints > opponentPlayerPoints:
			return (1, currentPlayerPoints, opponentPlayerPoints)
		elif currentPlayerPoints < opponentPlayerPoints:
			return (-1, currentPlayerPoints, opponentPlayerPoints)
		else:
			return (0, currentPlayerPoints, opponentPlayerPoints)


	def _getScore(self):
		tmp = self.value
		return (tmp[1], tmp[2])

	def takeAction(self, action):
		newBoard = np.array(self.board)
		newBoard[action] = self.playerTurn
		newState = GameState(newBoard, -self.playerTurn)

		value = 0
		done = 0

		if newState.isEndGame:
			value = newState.value[0]
			done = 1

		return (newState, value, done) 

	def render(self, logger):
		for r in range(5):
			logger.info([self.pieces[str(x)] for x in self.board[5*r : (5*r + 5)]])
		logger.info('--------------')



