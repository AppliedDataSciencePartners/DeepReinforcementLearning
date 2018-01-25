import numpy as np
import logging
import config



def setup_logger(name, log_file, level=logging.INFO):
    """Function setup as many loggers as you want"""

    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

    handler = logging.FileHandler(log_file)        
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    if not logger.handlers:
        logger.addHandler(handler)

    return logger



def make(name):
    if(name == 'XO'):
        game_env = XO()
    else:
        game_env = None

    return game_env
