"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
//
// const observable = new Observable(subscriber => {
//
//     subscriber.next(1);
//     subscriber.next(2);
//     subscriber.next(3);
//
//     subscriber.next('4 - happens synchronously!');
//
//
//     setTimeout(() => {
//         subscriber.next('5 - happens asynchronously!');
//         subscriber.complete();
//     }, 1000);
// });
//
// console.log('just before subscribe');
//
//
// observable.subscribe({
//     next(x) { console.log('got value ' + x); },
//     error(err) { console.error('something wrong occurred: ' + err); },
//     complete() { console.log('done'); }
// });
//
//
// console.log('just after subscribe');
// 4 main traits of observables -  creation, execution(subscription), destruction
// The Subscription represents the ongoing execution
// const subscriber = (subscriber) => {
//     let i = 0;
//
//     setInterval(() => {
//         if (i === 10) {
//             subscriber.complete();
//         }
//
//         subscriber.next('hi');
//         i++;
//
//     }, 1000);
// };
//
// const observable1 = new Observable(subscriber);
//
// const subscription = observable1
//     .subscribe(res => console.log(res),
//         err => console.error('Observer got an error: ' + err));
//
// // Later: to handle the destruction
//
// subscription.unsubscribe();
// common in the source code
var subject = new rxjs_1.Subject();
subject.next('emitting once..1');
subject.next('emitting twice....2');
subject.next('emitting thrice......3');
subject.subscribe(function (res) { return console.log(res); });
