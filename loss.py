
import numpy as np
import keras.backend as K
import tensorflow as tf
import logging
from keras import losses

def cemse(y_true, y_pred):
	#v = [o[0] for o in y_pred]
	#z = [o[0] for o in y_true]

	#p = [o[1:] for o in y_pred]
	#pi =[o[1:] for o in y_true]

	v = tf.slice(y_pred, [0,0], [-1,1])
	z = tf.slice(y_true, [0,0], [-1,1])


	p = tf.slice(y_pred, [0,1], [-1,-1])
	pi = tf.slice(y_true, [0,1], [-1,-1])

	zero = tf.zeros(shape = tf.shape(pi), dtype=tf.float32)
	where = tf.equal(pi, zero)

	negatives = tf.fill(tf.shape(pi), -10.0) 
	p = tf.where(where, negatives, p)

	#logger.info('v type: %s', type(v))
	#logger.info('z type: %s', type(z))
	#logger.info('p type: %s', type(p))
	#logger.info('pi type: %s', type(pi))

	#logger.info('first half type: %s', type(K.pow(v - z, 2)))


	#logger.info('loss value: %f', K.pow(v - z, 2))
	#logger.info('loss pi: %f', np.sum(pi * K.log(p)))

	#zero = tf.constant(0, dtype=tf.float32)
	#loc = tf.not_equal(pi, zero)

	#elems = (pi, loc)

	loss = losses.mean_squared_error(z, tf.tanh(v)) + tf.nn.softmax_cross_entropy_with_logits(labels = pi, logits = p)

	#K.pow(v - z, 2)

	return loss

def _cemse(y_true, y_pred):
	return cemse(y_true, y_pred)

def cemse_loss():

	return _cemse




def softmax_cross_entropy_with_logits(y_true, y_pred):


	p = y_pred
	pi = y_true

	zero = tf.zeros(shape = tf.shape(pi), dtype=tf.float32)
	where = tf.equal(pi, zero)

	negatives = tf.fill(tf.shape(pi), -100.0) 
	p = tf.where(where, negatives, p)

	loss = tf.nn.softmax_cross_entropy_with_logits(labels = pi, logits = p) #K.categorical_crossentropy(target = pi, output = p, from_logits = True) #

	return loss


