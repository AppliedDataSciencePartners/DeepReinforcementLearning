# %matplotlib inline

import logging
import config
import numpy as np

import matplotlib.pyplot as plt

from keras.models import Sequential, load_model, Model
from keras.layers import Input, Dense, Conv2D, Flatten, MaxPooling2D,BatchNormalization, Activation, Dropout, LeakyReLU, add
from keras.optimizers import SGD, RMSprop, Adam
from keras import regularizers
from keras.initializers import RandomUniform

from loss import cemse_loss, _cemse, softmax_cross_entropy_with_logits

import loggers as lg

import keras.backend as K

#import seaborn as sns; sns.set()

class Gen_Model():
	def __init__(self, reg_const, dropout, learning_rate, input_dim, output_dim):
		self.loss = cemse_loss()
		self.reg_const = reg_const
		self.dropout = dropout
		self.learning_rate = learning_rate
		self.input_dim = input_dim
		self.output_dim = output_dim

	def predict(self, x):
		return self.model.predict(x)

	def fit(self, states, targets, epochs, verbose, validation_split, batch_size):
		return self.model.fit(states, targets, epochs=epochs, verbose=verbose, validation_split = validation_split, batch_size = batch_size)

	def write(self, game, version):
		self.model.save('./models/' + game + '/version' + "{0:0>4}".format(version) + '.h5')

	def read(self, game, version):
		return load_model('./models/' + game + '/version' + "{0:0>4}".format(version) + '.h5', custom_objects={'softmax_cross_entropy_with_logits': softmax_cross_entropy_with_logits})

	def printWeightAverages(self):
		layers = self.model.layers
		for i, l in enumerate(layers):
			try:
				x = l.get_weights()[0]
				lg.logger_model.info('WEIGHT LAYER %d: ABSAV = %f, SD =%f, ABSMAX =%f, ABSMIN =%f', i, np.mean(np.abs(x)), np.std(x), np.max(np.abs(x)), np.min(np.abs(x)))
			except:
				pass
		lg.logger_model.info('------------------')
		for i, l in enumerate(layers):
			try:
				x = l.get_weights()[1]
				lg.logger_model.info('BIAS LAYER %d: ABSAV = %f, SD =%f, ABSMAX =%f, ABSMIN =%f', i, np.mean(np.abs(x)), np.std(x), np.max(np.abs(x)), np.min(np.abs(x)))
			except:
				pass
		lg.logger_model.info('******************')


	def viewLayers(self):
		layers = self.model.layers
		for i, l in enumerate(layers):
			x = l.get_weights()
			print('LAYER ' + str(i))
			# print(len(x))
			# for y in xrange(len(x)):
			# 	print(x[y].shape)

			try:
				weights = x[0]
				s = weights.shape

				fig = plt.figure(figsize=(s[2], s[3]))  # width, height in inches
				channel = 0
				filter = 0
				for i in range(s[2] * s[3]):

					sub = fig.add_subplot(s[3], s[2], i + 1)
					sub.imshow(weights[:,:,channel,filter], cmap='coolwarm', clim=(-1, 1),aspect="auto")
					#sns.heatmap(weights[:,:,channel,filter], annot=True, cmap='coolwarm', clim=(-1, 1), interpolation='nearest')
					channel = (channel + 1) % s[2]
					filter = (filter + 1) % s[3]

				
			except:
	
				try:
					fig = plt.figure(figsize=(3, len(x)))  # width, height in inches
					for i in xrange(len(x)):
						sub = fig.add_subplot(len(x), 1, i + 1)
						if i == 0:
							clim = (0,2)
						else:
							clim = (0, 2)
						sub.imshow([x[i]], cmap='coolwarm', clim=clim,aspect="auto")
						
					plt.show()

				except:
					try:
						fig = plt.figure(figsize=(3, 3))  # width, height in inches
						sub = fig.add_subplot(1, 1, 1)
						sub.imshow(x[0], cmap='coolwarm', clim=(-1, 1),aspect="auto")
						
						plt.show()

					except:
						pass

			plt.show()
				
		lg.logger_model.info('------------------')




class NN(Gen_Model):
	def __init__(self, reg_const, dropout, learning_rate, input_dim,  output_dim, hidden_layers):
		Gen_Model.__init__(self, reg_const, dropout, learning_rate, input_dim, output_dim)
		self.hidden_layers = hidden_layers
		self.num_layers = len(hidden_layers)
		self.model = self._build_model()

		
	def _build_model(self):
		model = Sequential()

		model.add(Dense(
			self.hidden_layers[0]
			, use_bias=False
			#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			#, bias_regularizer =regularizers.l2(self.reg_const)
			, input_dim=self.input_dim
			))
		model.add(BatchNormalization())
		model.add(Activation('relu'))
		model.add(Dropout(self.dropout))


		if (self.num_layers > 1):
			for h in self.hidden_layers[1:]:
				model.add(Dense(
				h
				, use_bias=False
				#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
				, activation='linear'
				, kernel_regularizer=regularizers.l2(self.reg_const)
				#, bias_regularizer =regularizers.l2(self.reg_const)
				))
				model.add(BatchNormalization())
				model.add(Activation('relu'))
				model.add(Dropout(self.dropout))

		model.add(Dense(
			self.output_dim
			, use_bias=False
			#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			#, bias_regularizer =regularizers.l2(self.reg_const)
			))


		
		model.compile(loss=self.loss,
			#optimizer=RMSprop(lr=self.learning_rate, rho=0.9, epsilon=1e-08, decay=0.0)
			optimizer=SGD(lr=self.learning_rate, momentum = config.MOMENTUM)
			)

		return model


	def convertToModelInput(self, state):
		inputToModel =  np.append(state.binary, (state.playerTurn + 1)/2)
		inputToModel = np.reshape(inputToModel, self.input_dim) 
		return (inputToModel)




class CNN(Gen_Model):
	def __init__(self, reg_const, dropout, learning_rate, input_dim,  output_dim, hidden_layers):
		Gen_Model.__init__(self, reg_const, dropout, learning_rate, input_dim, output_dim)
		self.hidden_layers = hidden_layers
		self.num_layers = len(hidden_layers)
		self.model = self._build_model()

		
	def _build_model(self):
		model = Sequential()
		model.add(Conv2D(
		filters = self.hidden_layers[0]['filters']
		, kernel_size = self.hidden_layers[0]['kernel_size']
		, input_shape = self.input_dim
		, data_format="channels_first"
		, padding = 'same'
		, use_bias=False
		#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
		, activation='linear'
		, kernel_regularizer = regularizers.l2(self.reg_const)
		#, bias_regularizer =regularizers.l2(self.reg_const)
		))
		model.add(BatchNormalization(axis=1))
		model.add(Activation('relu'))

		if (self.num_layers > 1):
			for h in self.hidden_layers[1:]:
				model.add(Conv2D(
				filters = h['filters']
				, kernel_size = h['kernel_size']
				, data_format="channels_first"
				, padding = 'same'
				, use_bias=False
				#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
				, activation='linear'
				, kernel_regularizer=regularizers.l2(self.reg_const)
				#, bias_regularizer =regularizers.l2(self.reg_const)
				))
				model.add(BatchNormalization(axis=1))
				model.add(Activation('relu'))
				#model.add(Dropout(self.dropout))

		model.add(Flatten())

		model.add(Dense(
			self.output_dim
			, use_bias=False
			#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			#, bias_regularizer =regularizers.l2(self.reg_const)
			))


		
		model.compile(loss=self.loss,
			#optimizer=RMSprop(lr=self.learning_rate, rho=0.9, epsilon=1e-08, decay=0.0)
			optimizer=SGD(lr=self.learning_rate)
			)

		return model

	def convertToModelInput(self, state):
		inputToModel =  state.binary #np.append(state.binary, [(state.playerTurn + 1)/2] * self.input_dim[1] * self.input_dim[2])
		inputToModel = np.reshape(inputToModel, self.input_dim) 
		return (inputToModel)



class Residual_CNN(Gen_Model):
	def __init__(self, reg_const, dropout, learning_rate, input_dim,  output_dim, hidden_layers):
		Gen_Model.__init__(self, reg_const, dropout, learning_rate, input_dim, output_dim)
		self.hidden_layers = hidden_layers
		self.num_layers = len(hidden_layers)
		self.model = self._build_model()



	def residual_layer(self, input_block, filters, kernel_size):

		x = self.conv_layer(input_block, filters, kernel_size)

		x = Conv2D(
		filters = filters
		, kernel_size = kernel_size
		, data_format="channels_first"
		, padding = 'same'
		, use_bias=False
		, activation='linear'
		, kernel_regularizer = regularizers.l2(self.reg_const)
		)(x)

		x = BatchNormalization(axis=1)(x)

		x = add([input_block, x])

		x = LeakyReLU()(x)

		return (x)

	def conv_layer(self, x, filters, kernel_size):

		x = Conv2D(
		filters = filters
		, kernel_size = kernel_size
		, data_format="channels_first"
		, padding = 'same'
		, use_bias=False
		, activation='linear'
		, kernel_regularizer = regularizers.l2(self.reg_const)
		)(x)

		x = BatchNormalization(axis=1)(x)
		x = LeakyReLU()(x)

		return (x)

	def value_head(self, x):

		x = Conv2D(
		filters = 1
		, kernel_size = (1,1)
		, data_format="channels_first"
		, padding = 'same'
		, use_bias=False
		, activation='linear'
		, kernel_regularizer = regularizers.l2(self.reg_const)
		)(x)


		x = BatchNormalization(axis=1)(x)
		x = LeakyReLU()(x)

		x = Flatten()(x)

		x = Dense(
			20
			, use_bias=False
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			)(x)

		x = LeakyReLU()(x)

		x = Dense(
			1
			, use_bias=False
			, activation='tanh'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			, name = 'value_head'
			)(x)



		return (x)

	def policy_head(self, x):

		x = Conv2D(
		filters = 2
		, kernel_size = (1,1)
		, data_format="channels_first"
		, padding = 'same'
		, use_bias=False
		, activation='linear'
		, kernel_regularizer = regularizers.l2(self.reg_const)
		)(x)

		x = BatchNormalization(axis=1)(x)
		x = LeakyReLU()(x)

		x = Flatten()(x)

		x = Dense(
			self.output_dim - 1
			, use_bias=False
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			, name = 'policy_head'
			)(x)

		return (x)



	def _build_model(self):

		main_input = Input(shape = self.input_dim, name = 'main_input')

		x = self.conv_layer(main_input, self.hidden_layers[0]['filters'], self.hidden_layers[0]['kernel_size'])

		if len(self.hidden_layers) > 1:
			for h in self.hidden_layers[1:]:
				x = self.residual_layer(x, h['filters'], h['kernel_size'])

		vh = self.value_head(x)

		ph = self.policy_head(x)

		model = Model(inputs=[main_input], outputs=[vh, ph])

		model.compile(loss={'value_head': 'mean_squared_error', 'policy_head': softmax_cross_entropy_with_logits},
			optimizer=SGD(lr=self.learning_rate, momentum = config.MOMENTUM),	
			loss_weights={'value_head': 0.5, 'policy_head': 0.5}	
			)

		return model

	def convertToModelInput(self, state):
		inputToModel =  state.binary #np.append(state.binary, [(state.playerTurn + 1)/2] * self.input_dim[1] * self.input_dim[2])
		inputToModel = np.reshape(inputToModel, self.input_dim) 
		return (inputToModel)












class Residual_NN(Gen_Model):
	def __init__(self, reg_const, dropout, learning_rate, input_dim,  output_dim, hidden_layers):
		Gen_Model.__init__(self, reg_const, dropout, learning_rate, input_dim, output_dim)
		self.hidden_layers = hidden_layers
		self.num_layers = len(hidden_layers)
		self.model = self._build_model()

	def residual_layer(self, input_block, filters):

		x = self.conv_layer(input_block, filters)

		x = Dense(
			filters
			, use_bias=False
			#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			#, bias_regularizer =regularizers.l2(self.reg_const)
			, input_dim=self.input_dim
			)(x)

		x = BatchNormalization()(x)

		x = add([input_block, x])

		x = LeakyReLU()(x)

		return (x)

	def conv_layer(self, x, filters):

		x = Dense(
			filters
			, use_bias=False
			#, bias_initializer=RandomUniform(minval=-0.05, maxval=0.05)
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			#, bias_regularizer =regularizers.l2(self.reg_const)
			, input_dim=self.input_dim
			)(x)

		x = BatchNormalization()(x)
		x = LeakyReLU()(x)

		return (x)

	def value_head(self, x):

		x = Dense(
			20
			, use_bias=False
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			)(x)

		x = LeakyReLU()(x)

		x = Dense(
			1
			, use_bias=False
			, activation='tanh'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			, name = 'value_head'
			)(x)



		return (x)

	def policy_head(self, x):


		x = Dense(
			self.output_dim - 1
			, use_bias=False
			, activation='linear'
			, kernel_regularizer=regularizers.l2(self.reg_const)
			, name = 'policy_head'
			)(x)

		return (x)



	def _build_model(self):

		main_input = Input(shape = (self.input_dim,), name = 'main_input')

		x = self.conv_layer(main_input, self.hidden_layers[0])

		if len(self.hidden_layers) > 1:
			for h in self.hidden_layers[1:]:
				x = self.residual_layer(x, h)

		vh = self.value_head(x)

		ph = self.policy_head(x)

		model = Model(inputs=[main_input], outputs=[vh, ph])

		model.compile(loss={'value_head': 'mean_squared_error', 'policy_head': softmax_cross_entropy_with_logits},
			optimizer=Adam(lr=self.learning_rate) #, momentum = config.MOMENTUM, nesterov=True)	
			,loss_weights={'value_head': 0.5, 'policy_head': 0.5}	
			)

		return model

	def convertToModelInput(self, state):
		inputToModel =  state.binary #np.append(state.binary, [(state.playerTurn + 1)/2] * self.input_dim[1] * self.input_dim[2])
		inputToModel = np.reshape(inputToModel, self.input_dim) 
		return (inputToModel)







