// https://www.npmjs.com/package/mock-promise

'use strict';

var mockPromise = function(resolveProbability, minTime, maxTime, mockData) {
  if (resolveProbability === undefined || resolveProbability === null) {
    resolveProbability = 1;
  }

  if (minTime > maxTime) {
    console.error('minTime cannot be greater than maxTime');
  }

  // Creating mock data in case none is passed in
  var data = mockData || 'Resolved Value';

  // Picks a random time between minTime and maxTime
  var timeOut = Math.floor(Math.random()*((maxTime||1000)-(minTime||1)+1))+(minTime||1);

  // Creates a new promise. If the resolve probability is higher than
  // Math.random(), the promise will resolve. If not, it will be rejected.
  return new Promise(function(resolve, reject) {
    if (Math.random() < resolveProbability) {
      setTimeout(function() {
        var toBeResolved = { data: data, timeOut: timeOut + 'ms' };
        resolve(toBeResolved);
      }, timeOut);

    } else {
      setTimeout(function() {
        reject('Promise failed to resolve. ' + timeOut + 'ms');
      }, timeOut);
    }
  });
};

module.exports = mockPromise;
