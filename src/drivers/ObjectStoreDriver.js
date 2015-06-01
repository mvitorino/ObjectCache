import moment from 'moment';
import ObjectStoreCacheObject from './ObjectStoreCacheObject';

export default class ObjectStoreDriver {
  store = {};
  storeObjectClass = ObjectStoreCacheObject;

  get (key) {

    if (!this.store.hasOwnProperty(key)) {
      return null;
    }

    let object = this.store[key];

    if (this.time < object.expiry) {
      return object.value;
    } else {
      delete this.store[key];
      return null;
    }
  }

  getMultiple (keys = []) {
    let result = {};

    keys.forEach((key) => {
        let value = this.get(key);
        result[key] = value;
    });

    return result;
  }

  setStoreObjectClass (storeObjectClass) {
    this.storeObjectClass = storeObjectClass;
    return true;
  }

  set (key, value, ttl) {
    let expiry = this.time + ttl;
    let object = new this.storeObjectClass(value, expiry);

    this.store[this.makeKey(key)] = object;

    return true;
  }

  setMultiple (keyValuePairs = {}, ttl) {
    let expiry = this.time + ttl;

    Object.keys(keyValuePairs).forEach((key) => {
      this.set(key, keyValuePairs[key], ttl);
    });

    return true;
  }

  purge () {
    this.store = {};
    return true;
  }

  makeKey (key) {
    return key;
  }

  get time () {
    if (typeof this._time !== 'undefined') {
      return this._time;
    }

    return moment().unix();
  }

  set time (time) {
    this._time = time;
  }
}
