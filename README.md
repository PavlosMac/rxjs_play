## Run ts file examples with > 

```bash
> ts-node rxjs-play.ts
```

### What is an Observable?

“ Observables provide support for passing messages between parts of your application. They are used frequently in Angular and are the recommended technique for event handling, asynchronous programming, and handling multiple values”

The ‘Observer’ pattern is a software design pattern in which a subject emits values to its dependents, also known as ‘observers’ - similar to a publisher / subscriber pattern. Imagine an array and you are pushing or pulling values to it.

The Observable handles a stream of events where the callback is called for each event. Promises only handle one event. Promises only work with ‘single’ async value, chained promises leading to the infamous callback hell.

Observables are cancellable, i.e once they are executed, they can be terminated, whereas a Promise always has to resolve or be rejected.

Observables are also termed ‘lazy’, they do not activate unless they are subscribed to by a consumer/observer. Lazy execution allows you to chain operators together e.g map, tap, filter. Another facet of this concept is the ‘hot’ / ‘cold’ observable. Lazy Observables are considered cold until they are activated.

### Composed of 4 core behaviours: 
 1 .Creation ‘new Observable’
 2. subscriptions
 3. executing or pushing
 4. disposing, or destroying

[MIT] [Observer pattern](https://medium.com/datadriveninvestor/design-patterns-a-quick-guide-to-observer-pattern-d0622145d6c2)
[MIT] [Functional Reactive Programming in Angular](https://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/)


## How does it help?

It helps by allowing us to build programmes in terms of streams, rather than holding application state variables in the code - which is a general source of errors. To be clear the application will have state but it will be stored on streams, in the DOM and not on application code itself. This in itself makes Functional Reactive Programming a paradigm of its own.

e.g behaviour subject

```$xslt
import { Observable } from 'rxjs';
 
const obs = interval(300).pipe(
    take(5),
    tap(i => console.log("obs value " + i)
    )
);

obs.subscribe(value => console.log("==========> Stream 1 received =========> " + value));

obs.subscribe(value => console.log("===> Stream 2 received ==> " + value));

```

### 4 main traits of observables -  creation, execution(subscription), destruction
The Subscription and subscriber represents the ongoing execution.

```
const subscriber = (subscriber) => {
    let i = 0;

    setInterval(() => {
        if (i === 10) {
            subscriber.complete();
        }
        subscriber.next('hi');
        i++;

    }, 100);
};

let iterator = 0;

const observable1 = new Observable(subscriber);

let subscription: Subscription;

subscription = observable1.subscribe(res => {

    console.log(res);

    iterator++;

    console.log(iterator);

    if (iterator === 10) {
        console.log('subscription closing..');
        subscription.unsubscribe();
    }
});
```

### Subject - common in the source code

```
const subject = new Subject<string>();

let iterator = 0;

const emitSubjects = () => {


    interval(300)
        .pipe(
            tap(_ => iterator === 10 ? subject.complete() : 'subject completes'),
            tap( _ => iterator++),
            tap(_ => subject.next('emitting once..' + iterator))
        ).subscribe();
};

subject.subscribe(res => console.log(res));

emitSubjects();
```

### Behaviour subject - It stores the latest value and emits this to its consumers
And whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.

```
const behaviourSubject = new BehaviorSubject<number>(0);

behaviourSubject.subscribe(x => {
    console.log('-----------------');
    console.log('observer A : ' + x);  // A receives | 0 | as initial value
});

behaviourSubject.next(1); // A receives | 1 | as latest value
behaviourSubject.next(2); // A receives | 2 | as latest value

/*
*  below is new subscriber, only receives latest value of 2
* */

behaviourSubject.subscribe(x => {
    console.log('-----------------');
    console.log('observer B : ' + x); // B receives | 2 | as latest value
});

behaviourSubject.next(3);

// BOTH receive latest value 3.
// A receives | 3 | as latest value
// B receives | 3 | as latest value
```

### ReplaySubject - returns last values of set number 
```
const subject = new ReplaySubject(2);

// subscriber 1
subject.subscribe((data) => {
    console.log('Subscriber A:', data);
});

subject.next(Math.random())
subject.next(Math.random())
subject.next(Math.random())

// subscriber 2
subject.subscribe((data) => {
    console.log('Subscriber B:', data); // only gets last 2 values that were emitted once its subscribes
});

subject.next(Math.random()); // both observers get emitted values

```

## ConcatMap - order is preserved

```

const series1$ = of('a', 'b');

const series2$ = of('x', 'y');

const result$ = concat(series1$, series2$);

// of operator emits 2 values, then completes, upon completion concat subscribes to series2$

result$.subscribe(console.log);

console.log('------a----b---|-->');
console.log('                   |-----x----y---|-->');
console.log('concat!');
console.log('------a----b---x----y---|-->');
```
* key with concat, DOES wait for source observable to complete

### MergeMap - order is NOT preserved

```
const source1$ = interval(1000).pipe(map(val => val * 10));

const source2$ = interval(1000).pipe(map(val => val * 100));

const sResult$ = merge(source1$, source2$);

sResult$.subscribe(console.log);

console.log('------a-----b----c--|-->');
console.log('---x-----y----z-----|-->');
console.log('merge!');
console.log('---x--a--y--b-z--c--|-->');

```

### SwitchMap - pseudo code - the cancel operator

```
const searchText$: Observable<string> =
    fromEvent<any>(formInput.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            startWith(''),
            debounceTime(400), // gives the user a bit of time to input the whole  query
            distinctUntilChanged() // prevents duplicates
        );

const lessons$: Observable<any[]> = searchText$
    .pipe(
        switchMap(search => loadLessons(search))
    )
    .subscribe();

const loadLessons = (searchValueFinal) => {
    // do api call
    return of(true)
};

* cancels previous request from previous search
```

### Some more examples - hot/cold - share()
```
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
```
