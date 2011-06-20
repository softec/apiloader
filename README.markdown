ApiLoader
=========

#### A Javascript Dynamic Loader ####

ApiLoader is a small and efficient Javascript Library that aims to ease
the dynamic loading of Javascript Libraries. It offers a simple API to
control the loading and the availability of the newly loaded code.
It works with any library that do not use document.write. It could load
libraries that provide a callback for signaling their availability (like
the Google APIs), or any single file libraries that create a given namespace,
or even that just execute some code.

### Targeted platforms ###

ApiLoader is expected to work on any Javascript 1.2 compliant browser and
has been tested on the following platforms:

 * Chrome 6 and higher
 * Apple Safari 3 and higher
 * Mozilla Firefox 2 and higher
 * Microsoft Internet Explorer for Windows, version 6 and higher
 * Opera 10 and higher

Using ApiLoader
---------------

To use ApiLoader in your application, you may download the latest release
from our [Maven Repository](http://nexus.softec.lu:8081/service/local/repositories/opensource/content/lu/softec/js/apiloader/1.0/apiloader-1.0-compressed.jar)
and extract apiloader.js to a suitable location. Then include it
early in your HTML like so:

    <script type="text/javascript" src="/path/to/apiloader.js"></script>

You may also reference it directly in your maven build, when using
maven-javascript-plugin, using the following dependency:

    <dependency>
      <groupId>lu.softec.js</groupId>
      <artifactId>apiloader</artifactId>
      <version>1.0</version>
      <type>javascript</type>
      <scope>runtime</scope>
    </dependency>

### Building ApiLoader from source ###

The build is based on Maven, using our modified maven-javascript-plugin.

Contributing to ApiLoader
-------------------------

Fork our repository on GitHub and submit your pull request.

Documentation
-------------

The documentation has yet to be written

License
-------

Currently, ApiLoader by [SOFTEC sa](http://softec.lu) is license under
a [Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Luxembourg License](http://creativecommons.org/licenses/by-nc-nd/3.0/lu/)
The license will be relaxed to a more common open-source license allowing
derivative works and commercial usages in the future.
If you need such license right now, please [contact us](mailto:support@softec.lu)
with an description of your expect usage, and we will propose you an
appropriate agreement on a case by case basis.
