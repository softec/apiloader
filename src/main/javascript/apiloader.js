/*
 * Copyright 2010 SOFTEC sa. All rights reserved.
 *
 * This source code is licensed under the Creative Commons
 * Attribution-NonCommercial-NoDerivs 3.0 Luxembourg
 * License.
 *
 * To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-nc-nd/3.0/lu/
 * or send a letter to Creative Commons, 171 Second Street,
 * Suite 300, San Francisco, California, 94105, USA.
 */

var ApiLoader = (function (ApiLoader, window, document)
{
  var apis = {},
  Api = Class.create({
    initialize: function(api, callbacks) {
      var that = this,
          head = document.head || document.getElementsByTagName("head"),
          apicallback = api.callback;

      this.api = api;
      this._isLoaded = false;

      debug.debug('ApiLoader - Loading API',api.namespace,api,callbacks);

      if( Object.isFunction(api.setCallback) ) {
        debug.debug('ApiLoader - Set external callback',api.namespace);
        api.setCallback(function() {
          debug.debug('ApiLoader - External callback called',api.namespace);
          that.onApiLoaded(callbacks);
        })
      }

      // loading code borrowed directly from LABjs, see https://gist.github.com/603980
      this._loadTask = window.setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
          if (!head[0]) { // append_to node not yet ready
              debug.debug('ApiLoader - Waiting for a usable head node',api.namespace);
              setTimeout(arguments.callee, 25);
              return;
          }
          head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }

        var scriptElem = document.createElement("script");
        if( !Object.isFunction(api.setCallback) ) {
          debug.debug('ApiLoader - Set internal callback',api.namespace);
          scriptElem.onload = scriptElem.onreadystatechange = function () {
            if (that._isLoaded || (scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded")) {
              return false;
            }
            debug.debug('ApiLoader - Internal callback called',api.namespace);
            scriptElem.onload = scriptElem.onreadystatechange = null;
            that.onApiLoaded(callbacks);
          };
        }
        scriptElem.src = that.api.url;
        head.insertBefore(scriptElem, head.firstChild);
        that._failTask = window.setTimeout(function () {
          debug.debug('ApiLoader - Internal failure callback called',api.namespace);
          that.onApiFailed(callbacks)
        }, 10000);
      }, 0);
    },

    onApiLoaded: function(callbacks) {
      window.clearTimeout(this._failTask);
      delete this._failTask;
      delete this._loadTask;
      this._isLoaded = true;
      try {
        this.nativeApi = eval(this.api.namespace);
      } catch(e) {}
      if( Object.isUndefined(this.nativeApi) ) {
        delete this.nativeApi;
        delete apis[this.api];
        debug.debug('ApiLoader - Failure to retrieve native API',this.api.namespace);
        if( callbacks && Object.isFunction(callbacks.onFailure) ) {
          callbacks.onFailure(this);
        }
      } else {
        debug.debug('ApiLoader - Library successfully loaded',this.api.namespace,this.api,this.nativeApi);
        if( callbacks && Object.isFunction(callbacks.onSuccess) ) {
          callbacks.onSuccess(this);
        }
      }
    },

    onApiFailed: function(callbacks) {
      window.clearTimeout(this._loadTask);
      delete this._failTask;
      delete this._loadTask;
      delete apis[this.api];
      debug.debug('ApiLoader - Library fails to load',this.api.namespace);          
      if( callbacks && Object.isFunction(callbacks.onFailure) ) {
        callbacks.onFailure(this);
      }
    },

    isLoaded: function() {
      return this._isLoaded;
    }
  });

  ApiLoader.load = function(api, callbacks) {
    var result = null;
    if( !(result = apis[api]) ) {
      result = apis[api] = new Api(api, callbacks);
    }
    return result;
  };

  ApiLoader.get = function(api) {
    var result;
    if( !(result = apis[api]) || !result.isLoaded() ) {
      return void(0);
    }
    return result;
  };

  return ApiLoader;
}(ApiLoader || {}, this, document));
