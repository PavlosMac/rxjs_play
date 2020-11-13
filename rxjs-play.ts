import {
    BehaviorSubject,
    concat,
    from, fromEvent,
    interval,
    merge,
    Observable,
    of,
    ReplaySubject,
    Subject,
    Subscription
} from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    scan,
    share,
    startWith,
    switchMap,
    take,
    tap
} from "rxjs/operators";

//  ts-node rxjs-play.ts

// [NEXT] Observable Hot vs Cold

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

// observable.subscribe({
//     next(x) { console.log('got value ' + x); },
//     error(err) { console.error('something wrong occurred: ' + err); },
//     complete() { console.log('done'); }
// });

// console.log('just after subscribe');


// nicer way !

// const obs = interval(300).pipe(
//     take(5),
//     tap(i => console.log("obs value " + i)
//     )
// );
//
// obs.subscribe(value => console.log("==========> Stream 1 received =========> " + value));
//
// obs.subscribe(value => console.log("===> Stream 2 received ==> " + value));
//


// [NEXT] 4 main traits of observables -  creation, execution(subscription), destruction

// { CREATION } The Subscription and subscriber represents the ongoing execution.

// const subscriber = (subscriber) => {
//     let i = 0;
//
//     setInterval(() => {
//         if (i === 10) {
//             subscriber.complete();
//         }
//         subscriber.next('hi');
//         i++;
//
//     }, 100);
// };
//
// let iterator = 0;
//
// const observable1 = new Observable(subscriber);
//
// let subscription: Subscription;
//
// subscription = observable1.subscribe(res => {
//
//     console.log(res);
//
//     iterator++;
//
//     console.log(iterator);
//
//     if (iterator === 10) {
//         console.log('subscription closing..');
//         subscription.unsubscribe();
//     }
// });


// [NEXT] Subject, BehaviourSubject ReplaySubject - common in the source code

// const subject = new Subject<string>();
//
// let iterator = 0;
//
// const emitSubjects = () => {
//
//
//     interval(300)
//         .pipe(
//             tap(_ => iterator === 10 ? subject.complete() : 'subject completes'),
//             tap( _ => iterator++),
//             tap(_ => subject.next('emitting once..' + iterator))
//         ).subscribe();
// };
//
// subject.subscribe(res => console.log(res));
//
// emitSubjects();
//


// [NEXT] Behaviour subject - It stores the latest value emitted to its consumers, and whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject

//
// const behaviourSubject = new BehaviorSubject<number>(0);
//
// behaviourSubject.subscribe(x => {
//     console.log('-----------------');
//     console.log('observer A : ' + x);  // A receives | 0 | as initial value
// });
//
// behaviourSubject.next(1); // A receives | 1 | as latest value
// behaviourSubject.next(2); // A receives | 2 | as latest value
//
// /*
// *  below is new subscriber, only receives latest value of 2
// * */
//
// behaviourSubject.subscribe(x => {
//     console.log('-----------------');
//     console.log('observer B : ' + x); // B receives | 2 | as latest value
// });
//
// behaviourSubject.next(3);
//
// /* BOTH receive latest value 3.
// *  A receives | 3 | as latest value
// *  B receives | 3 | as latest value
// * */


// [NEXT] ReplaySubject

// const subject = new ReplaySubject(2);
//
// // subscriber 1
// subject.subscribe((data) => {
//     console.log('Subscriber A:', data);
// });
//
// subject.next(Math.random())
// subject.next(Math.random())
// subject.next(Math.random())
//
// // subscriber 2
// subject.subscribe((data) => {
//     console.log('Subscriber B:', data); // only gets last 2 values that were emitted once its subscribes
// });
//
// subject.next(Math.random()); // both observers get emitted values



// [NEXT] ConcatMap - order IS preserved

// const series1$ = of('a', 'b');
//
// const series2$ = of('x', 'y');
//
// const result$ = concat(series1$, series2$);

// of operator emits 2 values, then completes, upon completion concat subscribes to series2$

// result$.subscribe(console.log);
//
// console.log('------a----b---|-->');
// console.log('                   |-----x----y---|-->');
// console.log('concat!');
// console.log('------a----b---x----y---|-->');

// key with concat, DOES wait for source observable to complete


// [NEXT] MergeMap - order is NOT preserved

// const source1$ = interval(1000).pipe(map(val => val * 10));
//
// const source2$ = interval(1000).pipe(map(val => val * 100));
//
// const sResult$ = merge(source1$, source2$);
//
// sResult$.subscribe(console.log);
//
// console.log('------a-----b----c--|-->');
// console.log('---x-----y----z-----|-->');
// console.log('merge!');
// console.log('---x--a--y--b-z--c--|-->');

// key with merge, does not wait for source observables to complete


// [NEXT] SwitchMap - psyudocode

// const searchText$: Observable<string> =
//     fromEvent<any>(formInput.nativeElement, 'keyup')
//         .pipe(
//             map(event => event.target.value),
//             startWith(''),
//             debounceTime(400), // gives the user a bit of time to input the whole  query
//             distinctUntilChanged() // prevents duplicates
//         );
//
// const lessons$: Observable<any[]> = searchText$
//     .pipe(
//         switchMap(search => loadLessons(search))
//     )
//     .subscribe();
//
// const loadLessons = (searchValueFinal) => {
//     // do api call
//     return of(true)
// };

/*
* Hot vs Cold Observables
* */

const cold = of( Math.random() );

const hot  = cold.pipe( share() );

hot.subscribe(res => console.log('1: ',res));
hot.subscribe(res => console.log('2: ',res));

const source = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const modified = source.pipe(
    map(n => Math.pow(n, 2)),
    scan((acc, val) => acc + val),
    filter(v => v > 10),
    take(3)
);


modified.subscribe(console.log);
