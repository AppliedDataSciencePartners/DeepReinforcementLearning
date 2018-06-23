"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var adadelta_optimizer_1 = require("./optimizers/adadelta_optimizer");
var adagrad_optimizer_1 = require("./optimizers/adagrad_optimizer");
var adam_optimizer_1 = require("./optimizers/adam_optimizer");
var adamax_optimizer_1 = require("./optimizers/adamax_optimizer");
var momentum_optimizer_1 = require("./optimizers/momentum_optimizer");
var optimizer_constructors_1 = require("./optimizers/optimizer_constructors");
var rmsprop_optimizer_1 = require("./optimizers/rmsprop_optimizer");
var sgd_optimizer_1 = require("./optimizers/sgd_optimizer");
[momentum_optimizer_1.MomentumOptimizer, sgd_optimizer_1.SGDOptimizer, adadelta_optimizer_1.AdadeltaOptimizer, adagrad_optimizer_1.AdagradOptimizer,
    rmsprop_optimizer_1.RMSPropOptimizer, adamax_optimizer_1.AdamaxOptimizer, adam_optimizer_1.AdamOptimizer];
exports.train = {
    sgd: optimizer_constructors_1.OptimizerConstructors.sgd,
    momentum: optimizer_constructors_1.OptimizerConstructors.momentum,
    adadelta: optimizer_constructors_1.OptimizerConstructors.adadelta,
    adagrad: optimizer_constructors_1.OptimizerConstructors.adagrad,
    rmsprop: optimizer_constructors_1.OptimizerConstructors.rmsprop,
    adamax: optimizer_constructors_1.OptimizerConstructors.adamax,
    adam: optimizer_constructors_1.OptimizerConstructors.adam
};
//# sourceMappingURL=train.js.map