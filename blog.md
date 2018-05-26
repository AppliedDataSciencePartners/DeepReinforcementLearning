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
				else:
					node = self.mcts.tree[newState.id]

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

	edge.outNode.state.render(lg.logger_mcts)

```

By having two agents running this mcts algorithm and having them playing against each other. If one of them beats each other more than 55% of the time they are declared as the best player. This best player is going to be used for evaluating how good the network is.

<br>


<p>: <script language="JavaScript">
var x = "krestik.gif";
var o = "nolik.gif";
var blank = "blank.jpg";
var pause = 0;
var all = 0;
var a = 0;
var b = 0;
var c = 0;
var d = 0;
var e = 0;
var f = 0;
var g = 0;
var h = 0;
var i = 0;
var temp="";
var ok = 0;
var cf = 0;
var choice=9;
var aRandomNumber = 0;
var comp = 0; 
var t = 0;
var wn = 0;
var ls = 0;
var ts = 0;
function logicOne() {
	if ((a==1)&&(b==1)&&(c==1)) all=1;
	if ((a==1)&&(d==1)&&(g==1)) all=1;
	if ((a==1)&&(e==1)&&(i==1)) all=1;
	if ((b==1)&&(e==1)&&(h==1)) all=1;
	if ((d==1)&&(e==1)&&(f==1)) all=1;
	if ((g==1)&&(h==1)&&(i==1)) all=1;
	if ((c==1)&&(f==1)&&(i==1)) all=1;
	if ((g==1)&&(e==1)&&(c==1)) all=1;
	if ((a==2)&&(b==2)&&(c==2)) all=2;
	if ((a==2)&&(d==2)&&(g==2)) all=2;
	if ((a==2)&&(e==2)&&(i==2)) all=2;
	if ((b==2)&&(e==2)&&(h==2)) all=2;
	if ((d==2)&&(e==2)&&(f==2)) all=2;
	if ((g==2)&&(h==2)&&(i==2)) all=2;
	if ((c==2)&&(f==2)&&(i==2)) all=2;
	if ((g==2)&&(e==2)&&(c==2)) all=2;
	if ((a != 0)&&(b != 0)&&(c != 0)&&(d != 0)&&(e != 0)&&(f != 0)&&(g != 0)&&(h != 0)&&(i != 0)&&(all == 0)) all = 3;
} 

function clearOut() {
	document.game.you.value="0";
	document.game.computer.value="0";
	document.game.ties.value="0";
}
function checkSpace() {
	if ((temp=="A")&&(a==0)) {
		ok=1;
		if (cf==0) a=1;
		if (cf==1) a=2;
	}
	if ((temp=="B")&&(b==0)) {
		ok=1;
		if (cf==0) b=1;
		if (cf==1) b=2;
	}
	if ((temp=="C")&&(c==0)) {
		ok=1;
		if (cf==0) c=1;
		if (cf==1) c=2;
	}
	if ((temp=="D")&&(d==0)) {
		ok=1;
		if (cf==0) d=1;
		if (cf==1) d=2;
	}
	if ((temp=="E")&&(e==0)) {
		ok=1;
		if (cf==0) e=1;
		if (cf==1) e=2;
	}
	if ((temp=="F")&&(f==0)) {
		ok=1
		if (cf==0) f=1;
		if (cf==1) f=2;
	}
	if ((temp=="G")&&(g==0)) {
		ok=1
		if (cf==0) g=1;
		if (cf==1) g=2;
	}
	if ((temp=="H")&&(h==0)) {
		ok=1;
		if (cf==0) h=1;
		if (cf==1) h=2;
	}
	if ((temp=="I")&&(i==0)) {
		ok=1;
		if (cf==0) i=1; 
		if (cf==1) i=2; 
	}
}
function yourChoice(chName) {
	pause = 0;
	if (all!=0) ended();
	if (all==0) {
		cf = 0;
		ok = 0;
		temp=chName;
		checkSpace();
		if (ok==1) {
			document.images[chName].src = x;
		}
		if (ok==0)taken();
		process();
		if ((all==0)&&(pause==0)) myChoice();
	}
}
function taken() {
	alert("This cell in not empty! Try another")
	pause=1;
}
function myChoice() {
	temp="";
	ok = 0;
	cf=1;
	logicTwo();
	logicThree();
	checkSpace();
	while(ok==0) {
		aRandomNumber=Math.random()
		comp=Math.round((choice-1)*aRandomNumber)+1;
		if (comp==1) temp="A";
		if (comp==2) temp="B";
		if (comp==3) temp="C";
		if (comp==4) temp="D";
		if (comp==5) temp="E";
		if (comp==6) temp="F";
		if (comp==7) temp="G";
		if (comp==8) temp="H";
		if (comp==9) temp="I";
		checkSpace();
	}
	document.images[temp].src= o;
	process();
}
function ended() {
	alert("Game over! To play once more press a button 'New Game'")
}
function process() {
	logicOne();
	if (all==1){ alert("You win!"); wn++; }
	if (all==2){ alert("You lose!"); ls++; }
	if (all==3){ alert("Draw!"); ts++; }
	if (all!=0) {
		document.game.you.value = wn;
		document.game.computer.value = ls;
		document.game.ties.value = ts;
	}
}
function playAgain() {
	if (all==0) {
		if(confirm("Âû óâåðåíû ?")) reset();
	}
	if (all>0) reset();
}
function reset() {
	all = 0;
	a = 0;
	b = 0;
	c = 0;
	d = 0;
	e = 0;
	f = 0;
	g = 0;
	h = 0;
	i = 0;
	temp="";
	ok = 0;
	cf = 0;
	choice=9;
	aRandomNumber = 0;
	comp = 0;
	document.images.A.src= blank;
	document.images.B.src= blank;
	document.images.C.src= blank;
	document.images.D.src= blank;
	document.images.E.src= blank;
	document.images.F.src= blank;
	document.images.G.src= blank;
	document.images.H.src= blank;
	document.images.I.src= blank;
	if (t==0) { t=2; myChoice(); }
	t--;
}
var ie4 = (document.all) ? true : false;
var nn4 = (document.layers) ? true : false;
</script> </p>

<p><br>
</p>

<form name="game">
<div align="center"><center><table border="0">
<TBODY>
<tr>
<td><table border="1" borderColor="#000000" cellPadding="0" cellSpacing="0">
<TBODY>
<tr>
<td><a href="javascript:yourChoice('A')"><img border="0" height="61" name="A"
src="blank.jpg" width="56"></a></td>
<td><a href="javascript:yourChoice('B')"><img border="0" height="61" name="B"
src="blank.jpg" width="56"></a></td>
<td><a href="javascript:yourChoice('C')"><img border="0" height="61" name="C"
src="blank.jpg" width="56"></a></td>
</tr>
<tr>
<td><a href="javascript:yourChoice('D')"><img border="0" height="61" name="D"
src="blank.jpg" width="56"></a></td>
<td><a href="javascript:yourChoice('E')"><img border="0" height="61" name="E"
src="blank.jpg" width="56"></a></td>
<td><a href="javascript:yourChoice('F')"><img border="0" height="61" name="F"
src="blank.jpg" width="56"></a></td>
</tr>
<tr>
<td><a href="javascript:yourChoice('G')"><img border="0" height="61" name="G"
src="blank.jpg" width="56"></a></td>
<td><a href="javascript:yourChoice('H')"><img border="0" height="61" name="H"
src="blank.jpg" width="56"></a></td>
<td><a href="javascript:yourChoice('I')"><img border="0" height="61" name="I"
src="blank.jpg" width="56"></a></td>
</tr>
</TBODY>
</table>
</td>
<td><table>
<TBODY>
<tr colspan="2">
<td><font face="MS Sans Serif" size="1"><b>Score:</b></font></td>
</tr>
<tr>
<td><font face="MS Sans Serif" size="1"><input name="you" size="5"
style="font-family: MS Sans Serif; font-size: 1"></font></td>
<td><font face="MS Sans Serif" size="1">You</font></td>
</tr>
<tr>
<td><font face="MS Sans Serif" size="1"><input name="computer" size="5"
style="font-family: MS Sans Serif; font-size: 1"></font></td>
<td><font face="MS Sans Serif" size="1">Computer</font></td>
</tr>
<tr>
<td><font face="MS Sans Serif" size="1"><input name="ties" size="5"
style="font-family: MS Sans Serif; font-size: 1"></font></td>
<td><font face="MS Sans Serif" size="1">Draw</font></td>
</tr>
</TBODY>
</table>
</td>
</tr>
</TBODY>
</table>
</center></div><div align="center"><center><p><input onclick="playAgain();" type="button"
value="New Game"
style="font-family: MS Sans Serif; font-size: 1; font-weight: bold"> </p>
</center></div>
</form>
