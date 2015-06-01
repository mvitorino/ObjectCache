export default class fakeDriver {
    get () {
        return 'get';
    }

    getMultiple () {
        return 'getMultiple';
    }

    set (key, value, ttl) {

        return 'set' + (ttl);
    }

    setMultiple (keyValuePairs, ttl) {
        return 'setMultiple'  + (ttl);
    }
}
