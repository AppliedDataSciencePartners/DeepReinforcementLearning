import numpy as np
import random

import loggers as lg

from game import Game, GameState
from model import NN, CNN, Residual_CNN, Residual_NN

from agent import Agent, User

import tensorflow as tf
from keras import losses

import config




def playMatchesBetweenVersions(env, player1version, player2version, EPISODES, logger, turns_until_tau0, goes_first = 0):
    
    if player1version == -1:
        player1 = User('player1', env.state_size, env.action_size)
    else:
        #player1_NN = NN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, env.state_size + 1,   env.action_size + 1, config.HIDDEN_NN_LAYERS)
        #player1_NN = CNN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, (2,) + env.grid_shape,   env.action_size + 1, config.HIDDEN_CNN_LAYERS)
        player1_NN = Residual_CNN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, (2,) + env.grid_shape,   env.action_size + 1, config.HIDDEN_CNN_LAYERS)
        #player1_NN = Residual_NN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, env.state_size ,   env.action_size + 1, config.HIDDEN_CNN_LAYERS)

        if player1version > 0:
            player1_network = player1_NN.read(env.name, player1version)
            player1_NN.model.set_weights(player1_network.get_weights())   
        player1 = Agent('player1', env.state_size, env.action_size, config.MCTS_SIMS, config.CPUCT, player1_NN)

    if player2version == -1:
        player2 = User('player2', env.state_size, env.action_size)
    else:
        #player2_NN = NN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, env.state_size + 1,   env.action_size + 1, config.HIDDEN_NN_LAYERS) 
        #player2_NN = CNN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, (2,) + env.grid_shape,   env.action_size + 1, config.HIDDEN_CNN_LAYERS)
        player2_NN = Residual_CNN(config.REG_CONST, config.DROPOUT, config.LEARNING_RATE, (2,) + env.grid_shape,   env.action_size + 1, config.HIDDEN_CNN_LAYERS)
        
        if player2version > 0:
            player2_network = player2_NN.read(env.name, player2version)
            player2_NN.model.set_weights(player2_network.get_weights())
        player2 = Agent('player2', env.state_size, env.action_size, config.MCTS_SIMS, config.CPUCT, player2_NN)

    scores, memory, points, sp_scores = playMatches(player1, player2, EPISODES, logger, turns_until_tau0, None, goes_first)

    return (scores, memory, points, sp_scores)


def playMatches(player1, player2, EPISODES, logger, turns_until_tau0, memory = None, goes_first = 0):

    env = Game()
    scores = {player1.name:0, "drawn": 0, player2.name:0}
    sp_scores = {'sp':0, "drawn": 0, 'nsp':0}
    points = {player1.name:[], player2.name:[]}

    for e in range(EPISODES):

        logger.info('====================')
        logger.info('EPISODE %d OF %d', e+1, EPISODES)
        logger.info('====================')

        print (str(e+1) + ' '),

        state = env.reset()
        

        done = 0
        turn = 0
        player1.mcts = None
        player2.mcts = None

        if goes_first == 0:
            player1Starts = random.randint(0,1) * 2 - 1
        else:
            player1Starts = goes_first

        if player1Starts == 1:
            players = {1:{"agent": player1, "name":player1.name}
                    , -1: {"agent": player2, "name":player2.name}
                    }
            logger.info(player1.name + ' plays as X')
        else:
            players = {1:{"agent": player2, "name":player2.name}
                    , -1: {"agent": player1, "name":player1.name}
                    }
            logger.info(player2.name + ' plays as X')
            logger.info('--------------')

        env.gameState.render(logger)

        while done == 0:
            turn = turn + 1
            #print('TURN ' + str(turn))

            
            
            #### Run the MCTS algo and return an action
            if turn < turns_until_tau0:
                action, pi, MCTS_value, NN_value = players[state.playerTurn]['agent'].act(state, 1)
            else:
                action, pi, MCTS_value, NN_value = players[state.playerTurn]['agent'].act(state, 0)

            

            if memory != None:
                ####Commit the move to memory
                memory.commit_stmemory(env.identities, state, pi)


            logger.info('action: %d', action)
            #logger.info('pi: %s', np.round(pi,2))
            for r in xrange(6):
                logger.info(['----' if x == 0 else '{0:.2f}'.format(np.round(x,2)) for x in pi[7*r : (7*r + 7)]])
            logger.info('MCTS perceived value for %s: %f', state.pieces[str(state.playerTurn)] ,np.round(MCTS_value,2))
            logger.info('NN perceived value for %s: %f', state.pieces[str(state.playerTurn)] ,np.round(NN_value,2))
            logger.info('====================')

            ### Do the action
            state, value, done, _ = env.step(action) #the value of the newState from the POV of the new playerTurn i.e. -1 if the previous player played a winning move
            
            env.gameState.render(logger)

            if done == 1: 
                if memory != None:
                    #### If the game is finished, assign the values correctly to the game moves

                    for move in memory.stmemory:
                        if move['playerTurn'] == state.playerTurn:
                            move['value'] = value
                        else:
                            move['value'] = -value
                         
                    memory.commit_ltmemory()
             


                if value == 1:
                    logger.info('%s WINS!', players[state.playerTurn]['name'])
                    scores[players[state.playerTurn]['name']] = scores[players[state.playerTurn]['name']] + 1
                    if state.playerTurn == 1: 
                        sp_scores['sp'] = sp_scores['sp'] + 1
                    else:
                        sp_scores['nsp'] = sp_scores['nsp'] + 1

                elif value == -1:
                    logger.info('%s WINS!', players[-state.playerTurn]['name'])
                    scores[players[-state.playerTurn]['name']] = scores[players[-state.playerTurn]['name']] + 1
               
                    if state.playerTurn == 1: 
                        sp_scores['nsp'] = sp_scores['nsp'] + 1
                    else:
                        sp_scores['sp'] = sp_scores['sp'] + 1

                else:
                    logger.info('DRAW...')
                    scores['drawn'] = scores['drawn'] + 1
                    sp_scores['drawn'] = sp_scores['drawn'] + 1



                pts = state.getScore()
                points[players[state.playerTurn]['name']].append(pts[0])
                points[players[-state.playerTurn]['name']].append(pts[1])

    return (scores, memory, points, sp_scores)


def takeExam(agent):

    score = 0
    scorecard = []
    guesses = []

    questions = [

        ( [  1,  1, 0 , 
            -1,  0, -1,
             0,  0, 0], 1, [2, 4])

        ,([ -1,  0,  1,
             1, -1,  0, 
             0,  1,  0], -1, [8])

        ,([  0, -1,  0, 
             1,  0,  0,
             0, -1,  1], 1, [4])

        ,([  0,  0,  0,
             0,  1,  0, 
             0,  1, -1], -1, [1])

        ,([  0,  0,  0, 
             0,  0,  0,
             0,  0,  0], 1, [0,2,4,6,8])

        ,([  1,  0,  0,
             0,  0,  0, 
             0,  0,  0], -1, [4])

        ,([  0,  0,  0, 
             0,  0,  0,
             0, -1,  1], 1, [2,4,5])

        ,([  0,  0,  0,
             0,  1,  0, 
             0,  0,  0], -1, [0,2,6,8])

        ,([  0,  0,  1, 
             0,  0,  0,
             0, -1,  0], 1, [0,4,5,8])

        ,([  0,  0,  1,
             0, -1,  0, 
             1,  0,  0], -1, [1,3,5,7])
    ]

    for q in questions:
        q_result, q_guess = takeQuestion(agent, q[0], q[1], q[2])
        score = score + q_result
        scorecard.append(q_result)
        guesses.append(q_guess)

    return (score, scorecard, guesses)

def takeQuestion(agent, board, currentPlayer, answers):
    
    state = GameState(np.array(board, dtype=np.int), currentPlayer)
    inputToModel = np.array([agent.model.convertToModelInput(state)])
    preds = agent.model.predict(inputToModel)[0]

    logits = preds[1:]
    odds = np.exp(logits)
    probs = odds / np.sum(odds) ###put this just before the for?

    allowedActions = state.allowedActions()
    probs = probs[allowedActions]

    guess = allowedActions[np.argwhere(probs == max(probs))[0][0]]

    if guess in answers:
        correct = 1
    else:
        correct = 0

    return(correct, guess)



def printLosses(player1, player2, memory):

    sess = tf.Session()

    preds_p1 = player1.predict(np.array([player1.model.convertToModelInput(e['state']) for e in memory.ltmemory]))
    preds_p2 = player2.predict(np.array([player2.model.convertToModelInput(e['state']) for e in memory.ltmemory]))

    y_true = tf.constant(np.array([np.append(m['value'], m['AV']) for m in memory.ltmemory]), dtype='float32')
    y_pred_p1 = tf.constant(preds_p1, dtype='float32')
    y_pred_p2 = tf.constant(preds_p2, dtype='float32')

    z = tf.slice(y_true, [0,0], [-1,1])
    v_p1 = tf.slice(y_pred_p1, [0,0], [-1,1])
    v_p2 = tf.slice(y_pred_p2, [0,0], [-1,1])
    
    pi = tf.slice(y_true, [0,1], [-1,-1])
    p_p1 = tf.slice(y_pred_p1, [0,1], [-1,-1])
    p_p2 = tf.slice(y_pred_p2, [0,1], [-1,-1])
   


    # print('y_true')
    # print(sess.run(y_true))
    # print('y_pred_p1')
    # print(sess.run(y_pred_p1))
    # print('y_pred_p2')
    # print(sess.run(y_pred_p2))
    # print()
    # print('z')
    # print(sess.run(z))
    # print('v_p1')
    # print(sess.run(v_p1))
    # print('v_p2')
    # print(sess.run(v_p2))
    # print()
    # print('pi')
    # print(sess.run(pi))
    # print('p_p1')
    # print(sess.run(p_p1))
    # print('p_p2')
    # print(sess.run(p_p2))


    zero = tf.zeros(shape = tf.shape(pi), dtype=tf.float32)
    where = tf.equal(pi, zero)

    negatives = tf.fill(tf.shape(pi), -100.0) 
    p_p1 = tf.where(where, negatives, p_p1)
    p_p2 = tf.where(where, negatives, p_p2)

    # print()
    # print('pi')
    # print(sess.run(pi))
    # print('p_p1')
    # print(sess.run(p_p1))
    # print('p_p2')
    # print(sess.run(p_p2))



    loss1_p1 = losses.mean_squared_error(z, tf.tanh(v_p1))
    loss2_p1 = tf.nn.softmax_cross_entropy_with_logits(labels = pi, logits = p_p1)
    total_loss1_p1 = tf.reduce_mean(loss1_p1)
    total_loss2_p1 = tf.reduce_mean(loss2_p1)
    print(player1.name + ' LOSSES ', sess.run(total_loss1_p1), ' ', sess.run(total_loss2_p1))

    loss1_p2 = losses.mean_squared_error(z, tf.tanh(v_p2))
    loss2_p2 = tf.nn.softmax_cross_entropy_with_logits(labels = pi, logits = p_p2)
    total_loss1_p2 = tf.reduce_mean(loss1_p2)
    total_loss2_p2 = tf.reduce_mean(loss2_p2)
    print(player2.name + ' LOSSES ', sess.run(total_loss1_p2), ' ', sess.run(total_loss2_p2))

    if config.TAKE_EXAM:

        player1_score, player1_scorecard, player1_guesses = takeExam(player1)
        player2_score, player2_scorecard, player2_guesses = takeExam(player2)

        print(player1.name + ' scores ', player1_score, ' out of 10 ', player1_scorecard, ' ', player1_guesses)
        print(player2.name + ' scores ', player2_score, ' out of 10 ', player2_scorecard, ' ', player2_guesses)
