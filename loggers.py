
from utils import setup_logger
from settings import run_folder

### SET all LOGGER_DISABLED to True to disable logging
### WARNING: the mcts log file gets big quite quickly

LOGGER_DISABLED = {
'main':False
, 'memory':False
, 'tourney':False
, 'mcts':False
, 'model': False}


logger_mcts = setup_logger('logger_mcts', run_folder + 'logs/logger_mcts.log')
logger_mcts.disabled = LOGGER_DISABLED['mcts']

logger_main = setup_logger('logger_main', run_folder + 'logs/logger_main.log')
logger_main.disabled = LOGGER_DISABLED['main']

logger_tourney = setup_logger('logger_tourney', run_folder + 'logs/logger_tourney.log')
logger_tourney.disabled = LOGGER_DISABLED['tourney']

logger_memory = setup_logger('logger_memory', run_folder + 'logs/logger_memory.log')
logger_memory.disabled = LOGGER_DISABLED['memory']

logger_model = setup_logger('logger_model', run_folder + 'logs/logger_model.log')
logger_model.disabled = LOGGER_DISABLED['model']
 