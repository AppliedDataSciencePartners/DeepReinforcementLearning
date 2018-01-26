
import tensorflow as tf

def softmax_cross_entropy_with_logits(y_true, y_pred):

	p = y_pred
	pi = y_true

	zero = tf.zeros(shape = tf.shape(pi), dtype=tf.float32)
	where = tf.equal(pi, zero)

	negatives = tf.fill(tf.shape(pi), -100.0) 
	p = tf.where(where, negatives, p)

	loss = tf.nn.softmax_cross_entropy_with_logits(labels = pi, logits = p)

	return loss


