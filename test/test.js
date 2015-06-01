import assert from 'assert';
import { ObjectCache, ObjectStoreDriver } from '../src/ObjectCache';
import ObjectStoreCacheObject from '../src/drivers/ObjectStoreCacheObject';

import fakeDriver from './fakeDriver';
import fakeObjectStoreCacheObject from './fakeObjectStoreCacheObject';

describe('ObjectCache', () => {
    describe('constructor()', () => {
        it('should throw an error if no driver is provided', () => {
            assert.throws(() => {
                let cache = new ObjectCache();
            }, Error);
        });

        it('should take a config object and override the default ttl with the defaultTtl property from the object', () => {
            let cache = new ObjectCache(fakeDriver, {
                defaultTtl: 900
            });

            assert.equal(cache.defaultTtl, 900);
        });

        it('should create a new instance of the driver provided and store it', () => {
            let cache = new ObjectCache(fakeDriver);
            assert(cache.driver instanceof fakeDriver);
        });
    });

    describe('get()', () => {
        it('should call get on the driver and return its return value', () => {
            let cache = new ObjectCache(fakeDriver);
            var value = cache.get();

            assert.equal(value, 'get');
        });
    });

    describe('getMultiple()', () => {
        it('should call getMultiple on the driver and return its return value', () => {
            let cache = new ObjectCache(fakeDriver);
            var value = cache.getMultiple();

            assert.equal(value, 'getMultiple');
        });
    });

    describe('set()', () => {
        it('should call set on the driver and return its return value', () => {
            let cache = new ObjectCache(fakeDriver);
            var value = cache.set();

            assert.equal(value, 'set900');
        });

        it('should take an array of moment.duration params and convert to seconds before calling set on the driver', () => {
            let cache = new ObjectCache(fakeDriver);
            var value = cache.set('key', 'value', [10, 'minutes']);

            assert.equal(value, 'set600');
        });
    });

    describe('setMultiple()', () => {
        it('should call setMultiple on the driver and return its return value', () => {
            let cache = new ObjectCache(fakeDriver);
            var value = cache.setMultiple();

            assert.equal(value, 'setMultiple900');
        });

        it('should take an array of moment.duration params and convert to seconds before calling setMultiple on the driver', () => {
            let cache = new ObjectCache(fakeDriver);
            var value = cache.setMultiple({
                'key': 'value'
            }, [10, 'minutes']);

            assert.equal(value, 'setMultiple600');
        });
    });
});

describe('ObjectStoreDriver', () => {
    describe('get()', () => {
        it('should return null if the key is not present in the store', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.set('someKey', 'value');

            let value = cache.get('someOtherKey');
            assert.equal(null, value);
        });

        it('should return null if the key is present but the value has expired', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.set('someKey', 'value', [0, 'seconds']);

            let value = cache.get('someKey');
            assert.equal(null, value);
        });

        it('should delete the key from the store if the key is present but expired', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.set('someKey', 'value', [0, 'seconds']);

            let value = cache.get('someKey');
            assert.equal(undefined, cache.driver.store['someKey']);
        });

        it('should return the value if the key is present and not expired', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.set('someKey', 'value', [15, 'seconds']);

            let value = cache.get('someKey');
            assert.equal('value', value);
        });
    });

    describe('getMultiple()', () => {
        it('should take an array of keys and return a key-value pair object of values', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.set('key', 'value');
            cache.set('key2', 'value2', [0, 'seconds']);

            let values = cache.getMultiple(['key', 'key2']);

            assert.deepEqual({
                'key': 'value',
                'key2': null
            }, values);
        });
    });

    describe('set()', () => {
        it('should create a new store object and store it against the key', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.set('someKey', 'value');
            assert(cache.driver.store['someKey'] instanceof cache.driver.storeObjectClass);
        });

        it('should add the ttl to the current time and pass it to the new store object', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.driver.setStoreObjectClass(fakeObjectStoreCacheObject);

            let expiry = Math.floor((new Date().getTime() / 1000)) + 900;
            cache.set('key', 'value', 900);

            assert.equal(expiry, cache.driver.store['key'].expiry);
        });

        it('should pass the value to the new store object', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.driver.setStoreObjectClass(fakeObjectStoreCacheObject);

            cache.set('key', 'value', 900);

            assert.equal('value', cache.driver.store['key'].value);
        });
    });

    describe('setMultiple()', () => {
        it('should take an key-value pair object set each pair', () => {
            let cache = new ObjectCache(ObjectStoreDriver);
            cache.setMultiple({
                'key': 'value',
                'key2': 'value2'
            });

            let keyValue = cache.get('key');
            let key2Value = cache.get('key2');

            assert.equal(keyValue, 'value');
            assert.equal(key2Value, 'value2');
        });
    });
});
