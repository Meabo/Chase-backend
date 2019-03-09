const { of, from, Subject } = require("rxjs");

var arraySubject = new Subject();

var pushToArray = function(item) {
  arraySubject.next(item);
};

// Subscribe to the subject to react to changes
arraySubject.subscribe(item => console.log(item));
pushToArray(1);
