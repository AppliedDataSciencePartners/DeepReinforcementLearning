import numpy as np
import logging

class Game:

	def __init__(self):		
		self.currentPlayer = 1
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.actionSpace = np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=np.int)
		self.pieces = {'1':'X', '0': '-', '-1':'O'}
		self.grid_shape = (4,4)
		self.name = 'metaSquares'
		self.state_size = len(self.gameState.binary())
		self.action_size = len(self.actionSpace)

	def reset(self):
		self.gameState = GameState(np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=np.int), 1)
		self.currentPlayer = 1
		return self.gameState

	def step(self, action):
		next_state, value, done = self.gameState.takeAction(action)
		self.gameState = next_state
		self.currentPlayer = -self.currentPlayer
		info = None
		return ((next_state, value, done, info))

	def render(self, logger):
		for r in range(4):
			logger.info([self.pieces[str(x)] for x in self.gameState.board[4*r : (4*r + 4)]])
		logger.info('--------------')

	def identities(self, state, actionValues):
		identities = []
		currentBoard = state.board
		currentAV = actionValues

		for n in xrange(4):
			currentBoard = np.array([
						  currentBoard[3], currentBoard[7],currentBoard[11], currentBoard[15]
						, currentBoard[2], currentBoard[6],currentBoard[10], currentBoard[14]
						, currentBoard[1], currentBoard[5],currentBoard[9], currentBoard[13]
						, currentBoard[0], currentBoard[4],currentBoard[8], currentBoard[12]

						])

			currentAV = np.array([
						  currentAV[3], currentAV[7],currentAV[11], currentAV[15]
						, currentAV[2], currentAV[6],currentAV[10], currentAV[14]
						, currentAV[1], currentAV[5],currentAV[9], currentAV[13]
						, currentAV[0], currentAV[4],currentAV[8], currentAV[12]
						])
			
			identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		currentBoard = np.array([
					  currentBoard[3], currentBoard[2],currentBoard[1], currentBoard[0]
					, currentBoard[7], currentBoard[6],currentBoard[5], currentBoard[4]
					, currentBoard[11], currentBoard[10],currentBoard[9], currentBoard[8]
					, currentBoard[15], currentBoard[14],currentBoard[13], currentBoard[12]
					])

		currentAV = np.array([
					  currentAV[3], currentAV[2],currentAV[1], currentAV[0]
					, currentAV[7], currentAV[6],currentAV[5], currentAV[4]
					, currentAV[11], currentAV[10],currentAV[9], currentAV[8]
					, currentAV[15], currentAV[14],currentAV[13], currentAV[12]

					])

		for n in xrange(4):
			currentBoard = np.array([
						  currentBoard[3], currentBoard[7],currentBoard[11], currentBoard[15]
						, currentBoard[2], currentBoard[6],currentBoard[10], currentBoard[14]
						, currentBoard[1], currentBoard[5],currentBoard[9], currentBoard[13]
						, currentBoard[0], currentBoard[4],currentBoard[8], currentBoard[12]

						])

			currentAV = np.array([
						  currentAV[3], currentAV[7],currentAV[11], currentAV[15]
						, currentAV[2], currentAV[6],currentAV[10], currentAV[14]
						, currentAV[1], currentAV[5],currentAV[9], currentAV[13]
						, currentAV[0], currentAV[4],currentAV[8], currentAV[12]
						])

			identities.append((GameState(currentBoard, state.playerTurn), currentAV))

		return identities




class GameState():
	def __init__(self, board, playerTurn):
		self.board = board
		self.winners = [
			{'points': 1, 'tiles' : [
			[0,1,4,5]
			,[1,2,5,6]
			,[2,3,6,7]
			,[4,5,8,9]
			,[5,6,9,10]
			,[6,7,10,11]
			,[8,9,12,13]
			,[9,10,13,14]
			,[10,11,14,15]
			]},
			{'points': 2, 'tiles' : [
			[1,4,6,9]
			,[2,5,7,10]
			,[5,8,10,13]
			,[6,9,11,14]
			]},
			{'points': 4, 'tiles' : [
			[0,2,8,10]
			,[1,3,9,11]
			,[4,6,12,14]
			,[5,7,13,15]
			]},
			{'points': 5, 'tiles' : [
			[1,7,8,14]
			,[2,4,11,13]
			]},
			{'points': 9, 'tiles' : [
			[0,3,12,15]
			]},
			]
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
		if np.count_nonzero(self.board) == 16:
			return 1
		return 0

	def getValue(self):
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


	def getScore(self):
		tmp = self.getValue()
		return (tmp[1], tmp[2])



