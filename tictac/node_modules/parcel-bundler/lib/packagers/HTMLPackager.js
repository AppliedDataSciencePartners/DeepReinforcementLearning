'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Packager = require('./Packager');
const posthtml = require('posthtml');
const path = require('path');
const urlJoin = require('../utils/urlJoin');

// https://www.w3.org/TR/html5/dom.html#metadata-content-2
const metadataContent = new Set(['base', 'link', 'meta', 'noscript', 'script', 'style', 'template', 'title']);

class HTMLPackager extends Packager {
  addAsset(asset) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let html = asset.generated.html || '';

      // Find child bundles that have JS or CSS sibling bundles,
      // add them to the head so they are loaded immediately.
      let siblingBundles = Array.from(_this.bundle.childBundles).reduce(function (p, b) {
        return p.concat([...b.siblingBundles.values()]);
      }, []).filter(function (b) {
        return b.type === 'css' || b.type === 'js';
      });

      if (siblingBundles.length > 0) {
        html = posthtml(_this.insertSiblingBundles.bind(_this, siblingBundles)).process(html, { sync: true }).html;
      }

      yield _this.write(html);
    })();
  }

  addBundlesToTree(bundles, tree) {
    const head = find(tree, 'head');
    if (head) {
      const content = head.content || (head.content = []);
      content.push(...bundles);
      return;
    }

    const html = find(tree, 'html');
    const content = html ? html.content || (html.content = []) : tree;
    const index = findBundleInsertIndex(content);

    content.splice(index, 0, ...bundles);
  }

  insertSiblingBundles(siblingBundles, tree) {
    const bundles = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = siblingBundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let bundle = _step.value;

        if (bundle.type === 'css') {
          bundles.push({
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: urlJoin(this.options.publicURL, path.basename(bundle.name))
            }
          });
        } else if (bundle.type === 'js') {
          bundles.push({
            tag: 'script',
            attrs: {
              src: urlJoin(this.options.publicURL, path.basename(bundle.name))
            }
          });
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.addBundlesToTree(bundles, tree);
  }
}

function find(tree, tag) {
  let res;
  tree.match({ tag }, node => {
    res = node;
    return node;
  });

  return res;
}

function findBundleInsertIndex(content) {
  for (let index = 0; index < content.length; index++) {
    const node = content[index];
    if (node && node.tag && !metadataContent.has(node.tag)) {
      return index;
    }
  }

  return 0;
}

module.exports = HTMLPackager;