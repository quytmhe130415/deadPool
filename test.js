// var promise1 = new Promise(function(resolve, reject) {
//     setTimeout(function() {
//         resolve(2);
//     }, 1000);
// });

// promise1.then(function(data) {

//     return new Promise(resolve => setTimeout(() => resolve(data * 3), 3000));

// }).then(function(data2) {
//     console.log(data2);
//     if (data2 > 6) {
//         console.log("TRUE");
//     } else {
//         console.log(data2);
//         console.log("FALSE");
//     }
// })








var promise1 = new Promise(resolve => setTimeout(() => resolve(3), 2000));

var promise2 = new Promise(resolve => setTimeout(() => resolve(7), 5000));

Promise.all([promise1, promise2]).then(value => {
    var sum = 0;
    value.forEach(x => sum += x);
    console.log(sum);
});