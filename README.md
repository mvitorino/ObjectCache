# ObjectCache for Javascript

A library for storing objects with expiration dates in Javascript (ES6/7).

As the library employs language features from the ECMAScript 6 specification, and proposed features from the ECMAScript 7 specification, it is neccessary to compile the source to ECMAScript 5 in order to run it in most (all) environments.

The original source is preserved in this package for inclusion in other ES6+ projects, and a seperate package by the name of [objectcache-es5](https://www.npmjs.com/package/objectcache-es5) is available containing a pre-compiled ES5 version suitable for use in Node applications or in browsers through Browserify.

##Overview

The main ObjectCache class is simply a proxy to the driver provided upon instantiation. In order to be a valid ObjectCache driver, a class should implement the methods `get(key)`, `getMultiple(keys)`, `set(key, value, ttl)` and `setMultiple(keyValuePairs, ttl)`. All other implementation details are up to the driver, including the choice of storage backend.

One simple driver, ObjectStoreDriver, is bundled with ObjectCache, and provides storage in the form of a simple Javascript object kept in memory. As the cache will not persist through navigation actions, this driver is mainly suitable for Single Page Applications or where you don't mind losing your cached data when navigating away or reloading. This driver is also suitable for Node applications and will remain in memory until the process is terminated.

There is potential to write a driver that would store the cache in memory and persist to disk, in order to survive process termination. Similarly, one could implement a driver that stores cache in SessionStorage/LocalStorage in the browser.


##Install

    $ npm install objectcache --save

## Usage

See [examples](https://github.com/Soutar/ObjectCache/tree/master/src/examples).

```js
// Import the ObjectCache library and a basic driver for storing in memory
import { ObjectCache, ObjectStoreDriver } from 'objectcache';

// Create a new cache instance using the basic object store driver
let cache = new ObjectCache(ObjectStoreDriver);

// Store 'someValue' under the key 'someCacheKey' for 900 seconds (15 minutes)
cache.set('someCacheKey', 'someValue', 900);

// Attempt to retreive the value stored under 'someCacheKey' after 5 minutes
setTimeout(() => {
  let cached = cache.get('someCacheKey');
  console.log(cached); // 'someValue'
}, 300000);

// After 15 minutes
setTimeout(() => {
  let cached = cache.get('someCacheKey');
  console.log(cached); // null (expired)
}, 600000);

```
