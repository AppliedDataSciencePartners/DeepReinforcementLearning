
from utils import setup_logger
import config

# LOGGER_DISABLED = {
# 'main':False
# , 'memory':False
# , 'tourney':False
# , 'mcts':False
# , 'model': False}

LOGGER_DISABLED = {
'main':True
, 'memory':True
, 'tourney':True
, 'mcts':True
, 'model': True}

logger_mcts = setup_logger('logger_mcts', './logs/logger_mcts.log')
logger_mcts.disabled = LOGGER_DISABLED['mcts']

logger_main = setup_logger('logger_main', './logs/logger_main.log')
logger_main.disabled = LOGGER_DISABLED['main']

logger_tourney = setup_logger('logger_tourney', './logs/logger_tourney.log')
logger_tourney.disabled = LOGGER_DISABLED['tourney']

logger_memory = setup_logger('logger_memory', './logs/logger_memory.log')
logger_memory.disabled = LOGGER_DISABLED['memory']

logger_model = setup_logger('logger_model', './logs/logger_model.log')
logger_model.disabled = LOGGER_DISABLED['model']
 