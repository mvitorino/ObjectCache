import { ObjectCache, ObjectStoreDriver } from '../ObjectCache';
import fetch from 'node-fetch';

let cache = new ObjectCache(ObjectStoreDriver);
let apiHits = 0;
let cacheHits = 0;

function getData (url) {
  let cached = cache.get(url);

  return (cached)
    ? Promise.resolve(cached).then((obj) => { cacheHits++; return obj; })
    : fetch(url)
        .then((response) => response.json())
        .then((obj) => {
          apiHits++;
          cache.set(url, obj, [10, 'seconds']);
          return obj;
        });
}

export default function APICacheCLIDemo () {
  console.log('This demo makes an api call to JSONPlaceholder and caches the response for 10 seconds. Any invokations of the getData() function that occur before the cache has expired will be given the data from memory, avoiding extra network requests.');
  console.log('Endpoint: http://jsonplaceholder.typicode.com/posts/1');

  let count = 0;

  setInterval(function () {
    count++;
    getData('http://jsonplaceholder.typicode.com/posts/1').then((obj) => {
      console.log(`Request #${count}`, '|',`API hits: ${apiHits}`, '|', `Cache hits: ${cacheHits}`);
      console.log(obj);
    });
  }, 1000);
}

