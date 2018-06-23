import './indexed_db';
import './local_storage';
import { browserFiles } from './browser_files';
import { browserHTTPRequest } from './browser_http';
import { decodeWeights, encodeWeights } from './io_utils';
import { copyModel, listModels, moveModel, removeModel } from './model_management';
import { IORouterRegistry } from './router_registry';
import { loadWeights } from './weights_loader';
var registerSaveRouter = IORouterRegistry.registerSaveRouter;
var registerLoadRouter = IORouterRegistry.registerLoadRouter;
var getSaveHandlers = IORouterRegistry.getSaveHandlers;
var getLoadHandlers = IORouterRegistry.getLoadHandlers;
export { browserFiles, browserHTTPRequest, copyModel, decodeWeights, encodeWeights, getLoadHandlers, getSaveHandlers, listModels, loadWeights, moveModel, registerLoadRouter, registerSaveRouter, removeModel };
//# sourceMappingURL=io.js.map