
#### CONFIG FOR Connect 4 



EPISODES = 75
BATCH_SIZE = 256 #100 #200 #not including validation set, which doubles it

EVAL_EPISODES = 20
MCTS_SIMS = 100

MEMORY_SIZE = 90000  # ~ EPISODES * 16 * 8 * 20      #EPISODES, MOVES PER MATCH, ROTATIONS, TIMES BIGGER

TURNS_UNTIL_TAU0 = 10 # turns on which it starts playing deterministically

CPUCT = 1
EPSILON = 0.2
ALPHA = 0.8
EPOCHS = 1 ######

REG_CONST = 0.0001
LEARNING_RATE = 0.1
MOMENTUM = 0.9
TRAINING_LOOPS = 10 #########

HIDDEN_NN_LAYERS = [100]
DROPOUT = 0

HIDDEN_CNN_LAYERS = [
	{'filters':75, 'kernel_size': (4,4)}
	 , {'filters':75, 'kernel_size': (4,4)}
	 , {'filters':75, 'kernel_size': (4,4)}
	 , {'filters':75, 'kernel_size': (4,4)}
	 , {'filters':75, 'kernel_size': (4,4)}
	 , {'filters':75, 'kernel_size': (4,4)}
	]





SCORING_THRESHOLD = 1.3

TAKE_EXAM = False




##### CONFIG FOR 4 METASQUARES

# EPISODES = 16
# BATCH_SIZE = 2048
# EVAL_EPISODES = 20
# MCTS_SIMS = 50

# MEMORY_SIZE = 2048 * 20 # ~ EPISODES * 16 * 8 * 20      #EPISODES, MOVES PER MATCH, ROTATIONS, TIMES BIGGER

# TURNS_UNTIL_TAU0 = 5 # turns until it starts playing deterministically

# CPUCT = 1
# EPSILON = 0.2
# ALPHA = 0.8
# EPOCHS = 1

# REG_CONST = 0.000001
# HIDDEN_NN_LAYERS = [40]
# HIDDEN_CNN_LAYERS = [
# 	{'filters':10, 'kernel_size': (2,2)}
# 	, {'filters':10, 'kernel_size': (2,2)}
# 	, {'filters':2, 'kernel_size': (1,1)}]
# DROPOUT = 0.5
# LEARNING_RATE = 0.01
# TRAINING_LOOPS = 10

# SCORING_THRESHOLD = 1.3

# TAKE_EXAM = False



##### CONFIG FOR XO 

# EPISODES = 16
# BATCH_SIZE = 2048
# EVAL_EPISODES = 20
# MCTS_SIMS = 30

# MEMORY_SIZE = 2048 * 20 # ~ EPISODES * 16 * 8 * 20      #EPISODES, MOVES PER MATCH, ROTATIONS, TIMES BIGGER

# TURNS_UNTIL_TAU0 = 5 # turns on which it starts playing deterministically

# CPUCT = 1
# EPSILON = 0.2
# ALPHA = 0.8
# EPOCHS = 1

# REG_CONST = 0.000001
# HIDDEN_NN_LAYERS = [40]
# HIDDEN_CNN_LAYERS = [
# 	{'filters':10, 'kernel_size': (2,2)}
# 	, {'filters':10, 'kernel_size': (2,2)}
# 	, {'filters':2, 'kernel_size': (1,1)}]
# DROPOUT = 0.5
# LEARNING_RATE = 0.01
# TRAINING_LOOPS = 10

# SCORING_THRESHOLD = 1.3

# TAKE_EXAM = True

