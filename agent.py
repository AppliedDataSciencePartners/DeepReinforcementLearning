# %matplotlib inline

import numpy as np
import logging
import random

import MCTS as mc
from game import GameState
from loss import cemse_loss, _cemse, softmax_cross_entropy_with_logits
from utils import setup_logger
import config
import loggers as lg
import time

import matplotlib.pyplot as plt
from IPython import display
import pylab as pl



# moveToLeaf_time = []
# evaluateLeaf_time = []
# backFill_time = []
# total_time = []


class User():
	def __init__(self, name, state_size, action_size):
		self.name = name
		self.state_size = state_size
		self.action_size = action_size

	def act(self, state, tau):

		action = input('Enter your chosen action: ')
		pi = np.zeros(self.action_size)
		pi[action] = 1
		value = -1
		NN_value = -1
		return (action, pi, value, NN_value)



class Agent():
	def __init__(self, name, state_size, action_size, mcts_simulations, cpuct, model):
		self.name = name

		self.state_size = state_size
		self.action_size = action_size

		self.cpuct = cpuct

		self.MCTSsimulations = mcts_simulations
		self.model = model

		self.mcts = None

		self.train_overall_loss = []
		self.train_value_loss = []
		self.train_policy_loss = []
		self.val_overall_loss = []
		self.val_value_loss = []
		self.val_policy_loss = []

	
	def _buildMCTS(self, state):
		lg.logger_mcts.info('****** BUILDING NEW MCTS TREE FOR AGENT %s ******', self.name)
		self.root = mc.Node(state)
		self.mcts = mc.MCTS(self.root, self.cpuct)

	def _changeRootMCTS(self, state):
		lg.logger_mcts.info('****** CHANGING ROOT OF MCTS TREE TO %s FOR AGENT %s ******', state.id, self.name)
		self.mcts.root = self.mcts.tree[state.id]


	def act(self, state, tau):

		if self.mcts == None or state.id not in self.mcts.tree:
			#print('building root from scratch')
			#lg.logger_mcts.info('building root from scratch')

			self._buildMCTS(state)
		else:
			self._changeRootMCTS(state)

		#### run the simulation
		for sim in range(self.MCTSsimulations):
			lg.logger_mcts.info('***************************')
			lg.logger_mcts.info('****** SIMULATION %d ******', sim + 1)
			lg.logger_mcts.info('***************************')
			#moveToLeaf_time, evaluateLeaf_time, backFill_time, total_time = self.simulate()
			self.simulate()

		# print('move to leaf time: ', np.mean(moveToLeaf_time))
		# print('evaluate leaf time: ', np.mean(evaluateLeaf_time))
		# print('backfill time: ', np.mean(backFill_time))
		# print('total time: ', np.mean(total_time))

		# print('move to leaf length: ', len(moveToLeaf_time))
		# print('----------')

		#### get action values
		pi, values = self.getAV(1)

		####pick the action
		action, value = self.chooseAction(pi, values, tau)

		nextState, _, _ = state.takeAction(action)

		NN_value = -self.get_preds(nextState)[0]

		lg.logger_mcts.info('ACTION VALUES...%s', pi)
		lg.logger_mcts.info('CHOSEN ACTION...%d', action)
		lg.logger_mcts.info('MCTS PERCEIVED VALUE...%f', value)
		lg.logger_mcts.info('NN PERCEIVED VALUE...%f', NN_value)

		# if self.mcts != None:
		# 	print(len(self.mcts.tree))
		# else:
		# 	print(0)

		#print(action)

		return (action, pi, value, NN_value)

	def simulate(self):

		lg.logger_mcts.info('ROOT NODE...%s', self.mcts.root.state.id)
		self.mcts.root.state.render(lg.logger_mcts)
		lg.logger_mcts.info('CURRENT PLAYER...%d', self.mcts.root.state.playerTurn)

		
		t0 = time.time()
		leaf, value, done, breadcrumbs = self.mcts._moveToLeaf() #the value of the position from the POV of the player in the leaf node
		leaf.state.render(lg.logger_mcts)

		t1 = time.time()
		value, breadcrumbs = self._evaluateLeaf(leaf, value, done, breadcrumbs) #the value of the position from the POV of the player in the leaf node
		t2 = time.time()
		self.mcts._backFill(leaf, value, breadcrumbs)
		t3 = time.time()

		# moveToLeaf_time.append(t1-t0)
		# evaluateLeaf_time.append(t2 - t1)
		# backFill_time.append(t3 - t2)
		# total_time.append(t3 - t0)

		# return ((moveToLeaf_time, evaluateLeaf_time, backFill_time, total_time))





	def get_preds(self, state):
		#predict the leaf
		inputToModel = np.array([self.model.convertToModelInput(state)]) #or currentPLayer?

		preds = self.model.predict(inputToModel)
		value_array = preds[0]
		logits_array = preds[1]
		#value = np.tanh(preds[0])
		value = value_array[0]

		logits = logits_array[0]
		#print(value)
		#print(logits)

		allowedActions = state.allowedActions()

		mask = np.ones(logits.shape,dtype=bool) #np.ones_like(a,dtype=bool)
		mask[allowedActions] = False
		logits[mask] = -100

		#SOFTMAX
		odds = np.exp(logits)
		probs = odds / np.sum(odds) ###put this just before the for?
		
		# #SIGMOID
		# probs = 1/(1+np.exp(-logits))

		return ((value, probs, allowedActions))


	def _evaluateLeaf(self, leaf, value, done, breadcrumbs):

		lg.logger_mcts.info('------EVALUATING LEAF------')

		if done == 0:
	
			value, probs, allowedActions = self.get_preds(leaf.state)
			lg.logger_mcts.info('PREDICTED VALUE FOR %d: %f', leaf.state.playerTurn, value)

			probs = probs[allowedActions]

			for idx, action in enumerate(allowedActions):
				newState, _, _ = leaf.state.takeAction(action)
				if newState.id not in self.mcts.tree:
					node = mc.Node(newState)
					self.mcts.addNode(node)
					lg.logger_mcts.info('added node...%s...p = %f', node.id, probs[idx])
				else:
					node = self.mcts.tree[newState.id]
					lg.logger_mcts.info('existing node...%s...', node.id)

				newEdge = mc.Edge(leaf, node, probs[idx], action)
				leaf.edges.append((action, newEdge))
				
				#breadcrumbs.append(newEdge)
		else:
			#if leaf.currentPlayer == -leaf.state.playerTurn:
			#	value = -value
			lg.logger_mcts.info('GAME VALUE FOR %d: %f', leaf.playerTurn, value)

		return ((value, breadcrumbs))


		
	def getAV(self, tau):
		edges = self.mcts.root.edges
		pi = np.zeros(self.action_size, dtype=np.integer)
		values = np.zeros(self.action_size, dtype=np.float32)
		
		for action, edge in edges:
			pi[action] = pow(edge.stats['N'], 1/tau)
			values[action] = edge.stats['Q']

		pi = pi / (np.sum(pi) * 1.0)
		return pi, values

	def chooseAction(self, pi, values, tau):
		if tau == 0:
			#action = np.argmax(pi)
			actions = np.argwhere(pi == max(pi))
			action = random.choice(actions)[0]
		else:
			#print(sum(pi[:-1]))
			action_idx = np.random.multinomial(1, pi)
			action = np.where(action_idx==1)[0][0]

		value = values[action]

		return action, value

	def replay(self, ltmemory):
		lg.logger_mcts.info('******RETRAINING MODEL******')


		for i in xrange(config.TRAINING_LOOPS):
			minibatch = random.sample(ltmemory, min(config.BATCH_SIZE, len(ltmemory)))

			#minibatch[0]['state'].render(lg.logger_memory)
			#minibatch = ltmemory
		
			training_states = np.array([self.model.convertToModelInput(row['state']) for row in minibatch])
			training_targets = {'value_head': np.array([row['value'] for row in minibatch])
								, 'policy_head': np.array([row['AV'] for row in minibatch])} 

			fit = self.model.fit(training_states, training_targets, epochs=config.EPOCHS, verbose=1, validation_split=0, batch_size = 32)
			lg.logger_mcts.info('NEW LOSS %s', fit.history)
			#print(fit.history)


			self.train_overall_loss.append(round(fit.history['loss'][config.EPOCHS - 1],4))
			self.train_value_loss.append(round(fit.history['value_head_loss'][config.EPOCHS - 1],4)) 
			self.train_policy_loss.append(round(fit.history['policy_head_loss'][config.EPOCHS - 1],4)) 

			# self.val_overall_loss.append(round(fit.history['val_loss'][config.EPOCHS - 1],4))
			# self.val_value_loss.append(round(fit.history['val_value_head_loss'][config.EPOCHS - 1],4))
			# self.val_policy_loss.append(round(fit.history['val_policy_head_loss'][config.EPOCHS - 1],4))



		plt.plot(self.train_overall_loss, 'k')
		plt.plot(self.train_value_loss, 'k-')
		plt.plot(self.train_policy_loss, 'k--')
		# plt.plot(self.val_overall_loss, 'r')
		# plt.plot(self.val_value_loss, 'r-')
		# plt.plot(self.val_policy_loss, 'r--')

		plt.legend(['train_overall_loss', 'train_value_loss', 'train_policy_loss'
			#, 'val_overall_loss', 'val_value_loss', 'val_policy_loss'
			], loc='lower left')

		display.clear_output(wait=True)
		display.display(pl.gcf())
		pl.gcf().clear()
		time.sleep(1.0)

		#print('TRAIN OVERALL LOSS: ' + str(self.train_overall_loss))
		#print('TRAIN VALUE LOSS: ' + str(self.train_value_loss))
		#print('TRAIN POLICY LOSS: ' + str(self.train_policy_loss))

		# print('VAL OVERALL LOSS: ' + str(self.val_overall_loss))
		# print('VAL VALUE LOSS: ' + str(self.val_value_loss))
		# print('VAL POLICY LOSS: ' + str(self.val_policy_loss))
		print('\n')

		
		
		self.model.printWeightAverages()
		#self.model.viewLayers()





	def predict(self, inputToModel):
		preds = self.model.predict(inputToModel)
		return preds

