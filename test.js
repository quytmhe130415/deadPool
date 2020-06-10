

var localStorage = require('localStorage'), myValue = { foo: 'bar', baz: 'quux' };



localStorage.setItem('myKey', JSON.stringify(myValue));
myValue = localStorage.getItem('myKey');
console.log(myValue[2]);