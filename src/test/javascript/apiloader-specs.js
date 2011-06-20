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

describe('Lib', function() {
  it('loads Google Map V3', function() {
    var onSuccess = jasmine.createSpy('Api Loaded Callback'),
        onFailure = jasmine.createSpy('Api Failed Callback'),
        lib,
        GOOGLEv3 = {
          namespace: 'google.maps',
          url: 'http://maps.google.com/maps/api/js?sensor=false&callback=gglCallBack',
          setCallback: function(fn) {
            window.gglCallBack = fn;
          }
        };

    runs(function() {
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
      lib = ApiLoader.load(GOOGLEv3, {
                              onSuccess: onSuccess,
                              onFailure: onFailure
                            });
      expect(lib.isLoaded()).toBeFalsy();
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
      expect(lib.api).toEqual(GOOGLEv3);
      expect(lib.nativeApi).not.toBeDefined();
      expect(ApiLoader.load(GOOGLEv3)).toEqual(lib);
    });

    waitsFor(function() {
      return lib.isLoaded();
    }, "Google Map API being loaded", 10500);

    runs(function() {
      expect(lib.isLoaded()).toBeTruthy();
      expect(lib.api).toEqual(GOOGLEv3);
      expect(onSuccess).toHaveBeenCalledWith(lib);
      expect(onFailure).not.toHaveBeenCalledWith(lib);
      expect(lib.nativeApi).toBeDefined();
      expect(lib.nativeApi.Map).toBeDefined();
      expect(ApiLoader.load(GOOGLEv3)).toEqual(lib);
      expect(ApiLoader.load(GOOGLEv3).isLoaded()).toBeTruthy();
      expect(ApiLoader.get(GOOGLEv3)).toEqual(lib);
    });
  });

  xit('fails gracefully', function() {
    var onSuccess = jasmine.createSpy('Api Loaded Callback'),
        onFailure = jasmine.createSpy('Api Failed Callback'),
        lib,
        GOOGLEv3 = {
          package: 'google.maps',
          url: 'http://maps.google.com/maps/api/js?sensor=false&callback=gglCallBack',
          setCallback: function(fn) {}
        };

    runs(function() {
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
      lib = ApiLoader.load(GOOGLEv3, {
                              onSuccess: onSuccess,
                              onFailure: onFailure
                            });
      expect(lib.isLoaded()).toBeFalsy();
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
      expect(lib.api).toEqual(GOOGLEv3);
      expect(lib.nativeApi).not.toBeDefined();
      expect(ApiLoader.load(GOOGLEv3)).toEqual(lib);
    });

    waits(10500);

    runs(function() {
      expect(lib.isLoaded()).toBeFalsy();
      expect(lib.api).toEqual(GOOGLEv3);
      expect(onFailure).toHaveBeenCalledWith(lib);
      expect(onSuccess).not.toHaveBeenCalledWith(lib);
      expect(lib.nativeApi).not.toBeDefined();
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
    });
  });

  xit('ensure native API is loaded', function() {
    var onSuccess = jasmine.createSpy('Api Loaded Callback'),
        onFailure = jasmine.createSpy('Api Failed Callback'),
        lib,
        GOOGLEv3 = {
          package: 'pouet',
          url: 'http://maps.google.com/maps/api/js?sensor=false&callback=gglCallBack',
          setCallback: function(fn) {
            window.gglCallBack = fn;
          }
        };

    runs(function() {
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
      lib = ApiLoader.load(GOOGLEv3, {
                              onSuccess: onSuccess,
                              onFailure: onFailure
                            });
      expect(lib.isLoaded()).toBeFalsy();
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
      expect(lib.api).toEqual(GOOGLEv3);
      expect(lib.nativeApi).not.toBeDefined();
      expect(ApiLoader.load(GOOGLEv3)).toEqual(lib);
    });

    waitsFor(function() {
      return lib.isLoaded();
    }, "Google Map API being loaded", 10500);

    runs(function() {
      expect(lib.isLoaded()).toBeTruthy();
      expect(lib.api).toEqual(GOOGLEv3);
      expect(onFailure).toHaveBeenCalledWith(lib);
      expect(onSuccess).not.toHaveBeenCalledWith(lib);
      expect(lib.nativeApi).not.toBeDefined();
      expect(ApiLoader.get(GOOGLEv3)).not.toBeDefined();
    });
  });
});
