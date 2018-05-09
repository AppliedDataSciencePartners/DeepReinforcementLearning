# Learning Chess with Machine Learning
## Something Wrong with Stockfish
In chess, some of the most legendary moves have been sacrifices. The Grandmasters would sacrifice their pieces to end up winning a game. Usually these sacrifices leaves these grandmasters down in material but up in a more favorable position (You don’t have as powerful of chess pieces, but the pieces that you do have are going to be a lot more active). These grandmasters would exploit the advantage and end up winning the game. However, many of the top chess programs such as stockfish would comment that these moves were not optimal. While stockfish is great at trying to maximize the material value, the evaluation function is designed by humans, which means that the way that it evaluates the board is limited by how well a human can evaluate a position. This leads for opportunities for exploitation.
 This fact became apparent when the two programs played and Alphazero successfully limited Stockfish moves by pushing his pieces in a corner. However, Stockfish is thoroughly unaware that it is in any danger.

![alt text]( https://github.com/supersteph/DeepReinforcementLearning/blob/master/images/Screenshot%20from%202018-04-25%2023-33-10.png)

Alpha zero (white) traps the knight and rook and effectively renders Stockfish’s (black) pieces useless


 One thing that the original chess engines have a lot of trouble with is sacrificing material. Because chess is a game with a big search tree, it is impossible to explore each node. In an effort to reduce the amount nodes it searches, all the engines will cut off the search prematurely. If the algorithim for cutting off the search is not optimal (like Stockfish is), then the engine is going to miss moves like the following.

![alt text]( https://github.com/supersteph/DeepReinforcementLearning/blob/master/images/Screenshot%20from%202018-05-02%2019-16-06.png)


In this position Stockfish suggest knight takes on f6. While this is a decent move, it misses bishop to h5, which the best move. There are two options: either the king takes the bishop which leads to a forced checkmate in 11 turns, or it runs away which leads to a loss of a knight.

## Alpha Zero

While Stockfish makes errors when in an effort to reduce the search space, the solution isn’t to explore the full search space. Instead of using an handcrafted algorithm to reduce the search tree, alpha zero algorithm uses Monte Carlo Tree Search to choose it’s actions. The general purpose of MCTS is to learn how to choose an action without exploring the entire gamespace.
### Move Choosing
Q+U
We are going to choose our moves based on how big this value is higher. Q is going to be the mean reward for the state and U is how “unknown” this action is. In the beginning, when not much is going to be known about the values of the states, exploration is going to be preferred: so U is set up to have a higher value. However, as time progresses, we understand more about the value of the states through our neural net. In this instance, the winning of the game is more important so we set U to become smaller so that the algorithm makes the best moves.
(this is a derivation of the multi-armed bandit problem)


```python





for idx, (action, edge) in enumerate(currentNode):



	U = self.cpuct * \


		((1-epsilon) * edge.stats['P'] + epsilon * nu[idx] )  * \


		np.sqrt(Nb) / (1 + edge.stats['N'])


		


	Q = edge.stats['Q']




    lg.logger_mcts.info('action: %d (%d)... N = %d, P = %f, nu = %f, adjP = %f, W = %f, Q = %f, U = %f, Q+U = %f'


		, action, action % 7, edge.stats['N'], np.round(edge.stats['P'],6), np.round(nu[idx],6), ((1-epsilon) * edge.stats['P'] + epsilon * nu[idx] )


		, np.round(edge.stats['W'],6), np.round(Q,6), np.round(U,6), np.round(Q+U,6))






	if Q + U > maxQU:


		maxQU = Q + U


		simulationAction = action


		simulationEdge = edge
```

Finds the biggest q+u


After you have chosen a move, execute that move to get to a node and proceed to the evaluation phase.
The board is evaluated by a neural net employing convolutions. The Model is going to take in the game state and return the probability of the actions that you should take, and the value at the current state.


```python
value, probs, allowedActions = self.get_preds(leaf.state)
Get the value and the probability function

You expand on the search tree by adding the allowed actions 			
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
```

(execute the neural net and add the possible nodes the the game tree)
If there is a node that is there before then you add a new edge that returns to the node otherwise you add it to the tree

You use the backfill to get the data you got from the bottom to the top. The intuition being that the moves you made at the very beginning affected the outcome of the game. Based on if you won the game or lost the neural net is going to have a better idea of what to do in the future. For every action you use a backfill process that notes the following things. The number of times you’ve been at each node (which is going to include it’s children), the mean value of the state and the value.

```python
for edge in breadcrumbs:
	playerTurn = edge.playerTurn
	if playerTurn == currentPlayer:
		direction = 1
	else:
		direction = -1

	edge.stats['N'] = edge.stats['N'] + 1
	edge.stats['W'] = edge.stats['W'] + value * direction
	edge.stats['Q'] = edge.stats['W'] / edge.stats['N']

	lg.logger_mcts.info('updating edge with value %f for player %d... N = %d, W = %f, Q = %f'
		, value * direction
		, playerTurn
		, edge.stats['N']
		, edge.stats['W']
		, edge.stats['Q']
		)

	edge.outNode.state.render(lg.logger_mcts)

```

By having two agents running this mcts algorithm and having them playing against each other. If one of them beats each other more than 55% of the time they are declared as the best player. This best player is going to be used for evaluating how good the network is.
