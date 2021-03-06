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
      getNativeApi = function(name) { 
        try {
          return eval(name); 
        } catch(e) {}
      },
  Api = Class.create({
    initialize: function(api, callbacks) {
      var that = this,
          head = document.head || document.getElementsByTagName("head"),
          apicallback = api.callback;

      this.api = api;
      if( this.api.spacename && !this.api.name ) {
        this.api.name = this.api.namespace;
      }
      this._isLoaded = false;

      debug.debug('ApiLoader - Loading API',api.name,api,callbacks);

      if( Object.isFunction(api.setCallback) ) {
        debug.debug('ApiLoader - Set external callback',api.name);
        api.setCallback(function() {
          debug.debug('ApiLoader - External callback called',api.name);
          that.onApiLoaded(callbacks);
        })
      }

      // loading code borrowed directly from LABjs, see https://gist.github.com/603980
      this._loadTask = window.setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
          if (!head[0]) { // append_to node not yet ready
              debug.debug('ApiLoader - Waiting for a usable head node',api.name);
              setTimeout(arguments.callee, 25);
              return;
          }
          head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }

        var scriptElem = document.createElement("script");
        if( !Object.isFunction(api.setCallback) ) {
          debug.debug('ApiLoader - Set internal callback',api.name);
          scriptElem.onload = scriptElem.onreadystatechange = function () {
            if (that._isLoaded || (scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded")) {
              return false;
            }
            that._isLoaded = true;
            scriptElem.onload = scriptElem.onreadystatechange = null;
            debug.debug('ApiLoader - Internal callback called',api.name);
            that.onApiLoaded(callbacks);
          };
        }
        scriptElem.src = that.api.url;
        head.insertBefore(scriptElem, head.firstChild);
        that._failTask = window.setTimeout(function () {
          debug.debug('ApiLoader - Internal failure callback called',api.name);
          that.onApiFailed(callbacks)
        }, 10000);
      }, 0);
    },

    onApiLoaded: function(callbacks) {
      window.clearTimeout(this._failTask);
      delete this._failTask;
      delete this._loadTask;
      this._isLoaded = true;
      if( this.api.namespace ) {
        this.nativeApi = getNativeApi(this.api.namespace);
      }
      if( this.api.namespace && Object.isUndefined(this.nativeApi) ) {
        delete apis[this.api.url];
        debug.debug('ApiLoader - Failure to retrieve native API',this.api.name);
        if( callbacks && Object.isFunction(callbacks.onFailure) ) {
          callbacks.onFailure(this);
        }
      } else {
        debug.debug('ApiLoader - Library successfully loaded',this.api.namespace,this.api,this.nativeApi);
        if( callbacks && Object.isFunction(callbacks.onSuccess) ) {
          callbacks.onSuccess(this);
        }
        if( !this.api.namespace ) {
          delete apis[this.api.url]; // Do not keep the API if it has no global namespace
        }
      }
    },

    onApiFailed: function(callbacks) {
      window.clearTimeout(this._loadTask);
      delete this._failTask;
      delete this._loadTask;
      delete apis[this.api.url];
      debug.debug('ApiLoader - Library fails to load',this.api.name);          
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
    if( !(result = apis[api.url]) ) {
      result = apis[api.url] = new Api(api, callbacks);
    } else if( callbacks && Object.isFunction(callbacks.onSuccess) ) {
      window.setTimeout(function() { callbacks.onSuccess(result) },0);
    }
    return result;
  };

  ApiLoader.get = function(api) {
    var result;
    if( !(result = apis[api.url]) || !result.isLoaded() ) {
      return void(0);
    }
    return result;
  };

  return ApiLoader;
}(ApiLoader || {}, this, document));
