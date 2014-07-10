System.register("../../../js/libs/es6-module-loader", [], function() {
  "use strict";
  var __moduleName = "../../../js/libs/es6-module-loader";
  !function(e) {
    "object" == (typeof exports === 'undefined' ? 'undefined' : $traceurRuntime.typeof(exports)) ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : "undefined" != typeof window ? window.Promise = e() : "undefined" != typeof global ? global.Promise = e() : "undefined" != typeof self && (self.Promise = e());
  }(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
      function s(o, u) {
        if (!n[$traceurRuntime.toProperty(o)]) {
          if (!t[$traceurRuntime.toProperty(o)]) {
            var a = typeof require == "function" && require;
            if (!u && a)
              return a(o, !0);
            if (i)
              return i(o, !0);
            throw new Error("Cannot find module '" + o + "'");
          }
          var f = $traceurRuntime.setProperty(n, o, {exports: {}});
          t[$traceurRuntime.toProperty(o)][0].call(f.exports, function(e) {
            var n = t[$traceurRuntime.toProperty(o)][1][$traceurRuntime.toProperty(e)];
            return s(n ? n : e);
          }, f, f.exports, e, t, n, r);
        }
        return n[$traceurRuntime.toProperty(o)].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++)
        s(r[$traceurRuntime.toProperty(o)]);
      return s;
    })({
      1: [function(require, module, exports) {
        var unhandledRejections = require('../lib/decorators/unhandledRejection');
        var PromiseConstructor = module.exports = unhandledRejections(require('../lib/Promise'));
        var g = typeof global !== 'undefined' && global || typeof self !== 'undefined' && self;
        if (typeof g !== 'undefined' && typeof g.Promise === 'undefined') {
          $traceurRuntime.setProperty(g, 'Promise', PromiseConstructor);
        }
      }, {
        "../lib/Promise": 2,
        "../lib/decorators/unhandledRejection": 5
      }],
      2: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var makePromise = require('./makePromise');
            var Scheduler = require('./scheduler');
            var async = require('./async');
            return makePromise({scheduler: new Scheduler(async)});
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./async": 4,
        "./makePromise": 6,
        "./scheduler": 7
      }],
      3: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            function Queue(capacityPow2) {
              this.head = this.tail = this.length = 0;
              this.buffer = new Array(1 << capacityPow2);
            }
            Queue.prototype.push = function(x) {
              if (this.length === this.buffer.length) {
                this._ensureCapacity(this.length * 2);
              }
              $traceurRuntime.setProperty(this.buffer, this.tail, x);
              this.tail = (this.tail + 1) & (this.buffer.length - 1);
              ++this.length;
              return this.length;
            };
            Queue.prototype.shift = function() {
              var x = this.buffer[$traceurRuntime.toProperty(this.head)];
              $traceurRuntime.setProperty(this.buffer, this.head, void 0);
              this.head = (this.head + 1) & (this.buffer.length - 1);
              --this.length;
              return x;
            };
            Queue.prototype._ensureCapacity = function(capacity) {
              var head = this.head;
              var buffer = this.buffer;
              var newBuffer = new Array(capacity);
              var i = 0;
              var len;
              if (head === 0) {
                len = this.length;
                for (; i < len; ++i) {
                  $traceurRuntime.setProperty(newBuffer, i, buffer[$traceurRuntime.toProperty(i)]);
                }
              } else {
                capacity = buffer.length;
                len = this.tail;
                for (; head < capacity; ++i, ++head) {
                  $traceurRuntime.setProperty(newBuffer, i, buffer[$traceurRuntime.toProperty(head)]);
                }
                for (head = 0; head < len; ++i, ++head) {
                  $traceurRuntime.setProperty(newBuffer, i, buffer[$traceurRuntime.toProperty(head)]);
                }
              }
              this.buffer = newBuffer;
              this.head = 0;
              this.tail = this.length;
            };
            return Queue;
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      4: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var nextTick,
                MutationObs;
            if (typeof process !== 'undefined' && process !== null && typeof process.nextTick === 'function') {
              nextTick = function(f) {
                process.nextTick(f);
              };
            } else if (MutationObs = (typeof MutationObserver === 'function' && MutationObserver) || (typeof WebKitMutationObserver === 'function' && WebKitMutationObserver)) {
              nextTick = (function(document, MutationObserver) {
                var scheduled;
                var el = document.createElement('div');
                var o = new MutationObserver(run);
                o.observe(el, {attributes: true});
                function run() {
                  var f = scheduled;
                  scheduled = void 0;
                  f();
                }
                return function(f) {
                  scheduled = f;
                  el.setAttribute('class', 'x');
                };
              }(document, MutationObs));
            } else {
              nextTick = (function(cjsRequire) {
                try {
                  return cjsRequire('vertx').runOnLoop || cjsRequire('vertx').runOnContext;
                } catch (ignore) {}
                var capturedSetTimeout = setTimeout;
                return function(t) {
                  capturedSetTimeout(t, 0);
                };
              }(require));
            }
            return nextTick;
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {}],
      5: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var timer = require('../timer');
            return function unhandledRejection(Promise) {
              var logError = noop;
              var logInfo = noop;
              if (typeof console !== 'undefined') {
                logError = typeof console.error !== 'undefined' ? function(e) {
                  console.error(e);
                } : function(e) {
                  console.log(e);
                };
                logInfo = typeof console.info !== 'undefined' ? function(e) {
                  console.info(e);
                } : function(e) {
                  console.log(e);
                };
              }
              Promise.onPotentiallyUnhandledRejection = function(rejection) {
                enqueue(report, rejection);
              };
              Promise.onPotentiallyUnhandledRejectionHandled = function(rejection) {
                enqueue(unreport, rejection);
              };
              Promise.onFatalRejection = function(rejection) {
                enqueue(throwit, rejection.value);
              };
              var tasks = [];
              var reported = [];
              var running = false;
              function report(r) {
                if (!r.handled) {
                  reported.push(r);
                  logError('Potentially unhandled rejection [' + r.id + '] ' + formatError(r.value));
                }
              }
              function unreport(r) {
                var i = reported.indexOf(r);
                if (i >= 0) {
                  reported.splice(i, 1);
                  logInfo('Handled previous rejection [' + r.id + '] ' + formatObject(r.value));
                }
              }
              function enqueue(f, x) {
                tasks.push(f, x);
                if (!running) {
                  running = true;
                  running = timer.set(flush, 0);
                }
              }
              function flush() {
                running = false;
                while (tasks.length > 0) {
                  tasks.shift()(tasks.shift());
                }
              }
              return Promise;
            };
            function formatError(e) {
              var s = (typeof e === 'undefined' ? 'undefined' : $traceurRuntime.typeof(e)) === 'object' && e.stack ? e.stack : formatObject(e);
              return e instanceof Error ? s : s + ' (WARNING: non-Error used)';
            }
            function formatObject(o) {
              var s = String(o);
              if (s === '[object Object]' && typeof JSON !== 'undefined') {
                s = tryStringify(o, s);
              }
              return s;
            }
            function tryStringify(e, defaultValue) {
              try {
                return JSON.stringify(e);
              } catch (e) {
                return defaultValue;
              }
            }
            function throwit(e) {
              throw e;
            }
            function noop() {}
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {"../timer": 8}],
      6: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function makePromise(environment) {
              var tasks = environment.scheduler;
              var objectCreate = Object.create || function(proto) {
                function Child() {}
                Child.prototype = proto;
                return new Child();
              };
              function Promise(resolver, handler) {
                this._handler = resolver === Handler ? handler : init(resolver);
              }
              function init(resolver) {
                var handler = new DeferredHandler();
                try {
                  resolver(promiseResolve, promiseReject, promiseNotify);
                } catch (e) {
                  promiseReject(e);
                }
                return handler;
                function promiseResolve(x) {
                  handler.resolve(x);
                }
                function promiseReject(reason) {
                  handler.reject(reason);
                }
                function promiseNotify(x) {
                  handler.notify(x);
                }
              }
              Promise.resolve = resolve;
              Promise.reject = reject;
              Promise.never = never;
              Promise._defer = defer;
              function resolve(x) {
                return isPromise(x) ? x : new Promise(Handler, new AsyncHandler(getHandler(x)));
              }
              function reject(x) {
                return new Promise(Handler, new AsyncHandler(new RejectedHandler(x)));
              }
              function never() {
                return foreverPendingPromise;
              }
              function defer() {
                return new Promise(Handler, new DeferredHandler());
              }
              Promise.prototype.then = function(onFulfilled, onRejected) {
                var parent = this._handler;
                if (typeof onFulfilled !== 'function' && parent.join().state() > 0) {
                  return new Promise(Handler, parent);
                }
                var p = this._beget();
                var child = p._handler;
                parent.when({
                  resolve: child.resolve,
                  notify: child.notify,
                  context: child,
                  receiver: parent.receiver,
                  fulfilled: onFulfilled,
                  rejected: onRejected,
                  progress: arguments.length > 2 ? arguments[2] : void 0
                });
                return p;
              };
              $traceurRuntime.setProperty(Promise.prototype, 'catch', function(onRejected) {
                return this.then(void 0, onRejected);
              });
              Promise.prototype._bindContext = function(thisArg) {
                return new Promise(Handler, new BoundHandler(this._handler, thisArg));
              };
              Promise.prototype._beget = function() {
                var parent = this._handler;
                var child = new DeferredHandler(parent.receiver, parent.join().context);
                return new this.constructor(Handler, child);
              };
              Promise.prototype._maybeFatal = function(x) {
                if (!maybeThenable(x)) {
                  return;
                }
                var handler = getHandler(x);
                var context = this._handler.context;
                handler.catchError(function() {
                  this._fatal(context);
                }, handler);
              };
              Promise.all = all;
              Promise.race = race;
              function all(promises) {
                var resolver = new DeferredHandler();
                var pending = promises.length >>> 0;
                var results = new Array(pending);
                var i,
                    h,
                    x,
                    s;
                for (i = 0; i < promises.length; ++i) {
                  x = promises[$traceurRuntime.toProperty(i)];
                  if (x === void 0 && !($traceurRuntime.toProperty(i) in promises)) {
                    --pending;
                    continue;
                  }
                  if (maybeThenable(x)) {
                    h = isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);
                    s = h.state();
                    if (s === 0) {
                      resolveOne(resolver, results, h, i);
                    } else if (s > 0) {
                      $traceurRuntime.setProperty(results, i, h.value);
                      --pending;
                    } else {
                      resolver.become(h);
                      break;
                    }
                  } else {
                    $traceurRuntime.setProperty(results, i, x);
                    --pending;
                  }
                }
                if (pending === 0) {
                  resolver.become(new FulfilledHandler(results));
                }
                return new Promise(Handler, resolver);
                function resolveOne(resolver, results, handler, i) {
                  handler.map(function(x) {
                    $traceurRuntime.setProperty(results, i, x);
                    if (--pending === 0) {
                      this.become(new FulfilledHandler(results));
                    }
                  }, resolver);
                }
              }
              function race(promises) {
                if (Object(promises) === promises && promises.length === 0) {
                  return never();
                }
                var h = new DeferredHandler();
                var i,
                    x;
                for (i = 0; i < promises.length; ++i) {
                  x = promises[$traceurRuntime.toProperty(i)];
                  if (x !== void 0 && $traceurRuntime.toProperty(i) in promises) {
                    getHandler(x).chain(h, h.resolve, h.reject);
                  }
                }
                return new Promise(Handler, h);
              }
              function getHandler(x) {
                if (isPromise(x)) {
                  return x._handler.join();
                }
                return maybeThenable(x) ? getHandlerUntrusted(x) : new FulfilledHandler(x);
              }
              function isPromise(x) {
                return x instanceof Promise;
              }
              function getHandlerUntrusted(x) {
                try {
                  var untrustedThen = x.then;
                  return typeof untrustedThen === 'function' ? new ThenableHandler(untrustedThen, x) : new FulfilledHandler(x);
                } catch (e) {
                  return new RejectedHandler(e);
                }
              }
              function Handler() {}
              Handler.prototype.when = Handler.prototype.resolve = Handler.prototype.reject = Handler.prototype.notify = Handler.prototype._fatal = Handler.prototype._unreport = Handler.prototype._report = noop;
              Handler.prototype.inspect = toPendingState;
              Handler.prototype._state = 0;
              Handler.prototype.state = function() {
                return this._state;
              };
              Handler.prototype.join = function() {
                var h = this;
                while (h.handler !== void 0) {
                  h = h.handler;
                }
                return h;
              };
              Handler.prototype.chain = function(to, fulfilled, rejected, progress) {
                this.when({
                  resolve: noop,
                  notify: noop,
                  context: void 0,
                  receiver: to,
                  fulfilled: fulfilled,
                  rejected: rejected,
                  progress: progress
                });
              };
              Handler.prototype.map = function(f, to) {
                this.chain(to, f, to.reject, to.notify);
              };
              Handler.prototype.catchError = function(f, to) {
                this.chain(to, to.resolve, f, to.notify);
              };
              Handler.prototype.fold = function(to, f, z) {
                this.join().map(function(x) {
                  getHandler(z).map(function(z) {
                    this.resolve(tryCatchReject2(f, z, x, this.receiver));
                  }, this);
                }, to);
              };
              function DeferredHandler(receiver, inheritedContext) {
                Promise.createContext(this, inheritedContext);
                this.consumers = void 0;
                this.receiver = receiver;
                this.handler = void 0;
                this.resolved = false;
              }
              inherit(Handler, DeferredHandler);
              DeferredHandler.prototype._state = 0;
              DeferredHandler.prototype.inspect = function() {
                return this.resolved ? this.join().inspect() : toPendingState();
              };
              DeferredHandler.prototype.resolve = function(x) {
                if (!this.resolved) {
                  this.become(getHandler(x));
                }
              };
              DeferredHandler.prototype.reject = function(x) {
                if (!this.resolved) {
                  this.become(new RejectedHandler(x));
                }
              };
              DeferredHandler.prototype.join = function() {
                if (this.resolved) {
                  var h = this;
                  while (h.handler !== void 0) {
                    h = h.handler;
                    if (h === this) {
                      return this.handler = new Cycle();
                    }
                  }
                  return h;
                } else {
                  return this;
                }
              };
              DeferredHandler.prototype.run = function() {
                var q = this.consumers;
                var handler = this.join();
                this.consumers = void 0;
                for (var i = 0; i < q.length; ++i) {
                  handler.when(q[$traceurRuntime.toProperty(i)]);
                }
              };
              DeferredHandler.prototype.become = function(handler) {
                this.resolved = true;
                this.handler = handler;
                if (this.consumers !== void 0) {
                  tasks.enqueue(this);
                }
                if (this.context !== void 0) {
                  handler._report(this.context);
                }
              };
              DeferredHandler.prototype.when = function(continuation) {
                if (this.resolved) {
                  tasks.enqueue(new ContinuationTask(continuation, this.handler));
                } else {
                  if (this.consumers === void 0) {
                    this.consumers = [continuation];
                  } else {
                    this.consumers.push(continuation);
                  }
                }
              };
              DeferredHandler.prototype.notify = function(x) {
                if (!this.resolved) {
                  tasks.enqueue(new ProgressTask(this, x));
                }
              };
              DeferredHandler.prototype._report = function(context) {
                this.resolved && this.handler.join()._report(context);
              };
              DeferredHandler.prototype._unreport = function() {
                this.resolved && this.handler.join()._unreport();
              };
              DeferredHandler.prototype._fatal = function(context) {
                var c = typeof context === 'undefined' ? this.context : context;
                this.resolved && this.handler.join()._fatal(c);
              };
              function DelegateHandler(handler) {
                this.handler = handler;
              }
              inherit(Handler, DelegateHandler);
              DelegateHandler.prototype.inspect = function() {
                return this.join().inspect();
              };
              DelegateHandler.prototype._report = function(context) {
                this.join()._report(context);
              };
              DelegateHandler.prototype._unreport = function() {
                this.join()._unreport();
              };
              function AsyncHandler(handler) {
                DelegateHandler.call(this, handler);
              }
              inherit(DelegateHandler, AsyncHandler);
              AsyncHandler.prototype.when = function(continuation) {
                tasks.enqueue(new ContinuationTask(continuation, this.join()));
              };
              function BoundHandler(handler, receiver) {
                DelegateHandler.call(this, handler);
                this.receiver = receiver;
              }
              inherit(DelegateHandler, BoundHandler);
              BoundHandler.prototype.when = function(continuation) {
                if (this.receiver !== void 0) {
                  continuation.receiver = this.receiver;
                }
                this.join().when(continuation);
              };
              function ThenableHandler(then, thenable) {
                DeferredHandler.call(this);
                tasks.enqueue(new AssimilateTask(then, thenable, this));
              }
              inherit(DeferredHandler, ThenableHandler);
              function FulfilledHandler(x) {
                Promise.createContext(this);
                this.value = x;
              }
              inherit(Handler, FulfilledHandler);
              FulfilledHandler.prototype._state = 1;
              FulfilledHandler.prototype.inspect = function() {
                return {
                  state: 'fulfilled',
                  value: this.value
                };
              };
              FulfilledHandler.prototype.when = function(cont) {
                var x;
                if (typeof cont.fulfilled === 'function') {
                  Promise.enterContext(this);
                  x = tryCatchReject(cont.fulfilled, this.value, cont.receiver);
                  Promise.exitContext();
                } else {
                  x = this.value;
                }
                cont.resolve.call(cont.context, x);
              };
              var id = 0;
              function RejectedHandler(x) {
                Promise.createContext(this);
                this.id = ++id;
                this.value = x;
                this.handled = false;
                this.reported = false;
                this._report();
              }
              inherit(Handler, RejectedHandler);
              RejectedHandler.prototype._state = -1;
              RejectedHandler.prototype.inspect = function() {
                return {
                  state: 'rejected',
                  reason: this.value
                };
              };
              RejectedHandler.prototype.when = function(cont) {
                var x;
                if (typeof cont.rejected === 'function') {
                  this._unreport();
                  Promise.enterContext(this);
                  x = tryCatchReject(cont.rejected, this.value, cont.receiver);
                  Promise.exitContext();
                } else {
                  x = new Promise(Handler, this);
                }
                cont.resolve.call(cont.context, x);
              };
              RejectedHandler.prototype._report = function(context) {
                tasks.afterQueue(reportUnhandled, this, context);
              };
              RejectedHandler.prototype._unreport = function() {
                this.handled = true;
                tasks.afterQueue(reportHandled, this);
              };
              RejectedHandler.prototype._fatal = function(context) {
                Promise.onFatalRejection(this, context);
              };
              function reportUnhandled(rejection, context) {
                if (!rejection.handled) {
                  rejection.reported = true;
                  Promise.onPotentiallyUnhandledRejection(rejection, context);
                }
              }
              function reportHandled(rejection) {
                if (rejection.reported) {
                  Promise.onPotentiallyUnhandledRejectionHandled(rejection);
                }
              }
              Promise.createContext = Promise.enterContext = Promise.exitContext = Promise.onPotentiallyUnhandledRejection = Promise.onPotentiallyUnhandledRejectionHandled = Promise.onFatalRejection = noop;
              var foreverPendingHandler = new Handler();
              var foreverPendingPromise = new Promise(Handler, foreverPendingHandler);
              function Cycle() {
                RejectedHandler.call(this, new TypeError('Promise cycle'));
              }
              inherit(RejectedHandler, Cycle);
              function toPendingState() {
                return {state: 'pending'};
              }
              function ContinuationTask(continuation, handler) {
                this.continuation = continuation;
                this.handler = handler;
              }
              ContinuationTask.prototype.run = function() {
                this.handler.join().when(this.continuation);
              };
              function ProgressTask(handler, value) {
                this.handler = handler;
                this.value = value;
              }
              ProgressTask.prototype.run = function() {
                var q = this.handler.consumers;
                if (q === void 0) {
                  return;
                }
                for (var i = 0; i < q.length; ++i) {
                  this._notify(q[$traceurRuntime.toProperty(i)]);
                }
              };
              ProgressTask.prototype._notify = function(continuation) {
                var x = typeof continuation.progress === 'function' ? tryCatchReturn(continuation.progress, this.value, continuation.receiver) : this.value;
                continuation.notify.call(continuation.context, x);
              };
              function AssimilateTask(then, thenable, resolver) {
                this._then = then;
                this.thenable = thenable;
                this.resolver = resolver;
              }
              AssimilateTask.prototype.run = function() {
                var h = this.resolver;
                tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);
                function _resolve(x) {
                  h.resolve(x);
                }
                function _reject(x) {
                  h.reject(x);
                }
                function _notify(x) {
                  h.notify(x);
                }
              };
              function tryAssimilate(then, thenable, resolve, reject, notify) {
                try {
                  then.call(thenable, resolve, reject, notify);
                } catch (e) {
                  reject(e);
                }
              }
              function maybeThenable(x) {
                return ((typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x)) === 'object' || typeof x === 'function') && x !== null;
              }
              function tryCatchReject(f, x, thisArg) {
                try {
                  return f.call(thisArg, x);
                } catch (e) {
                  return reject(e);
                }
              }
              function tryCatchReject2(f, x, y, thisArg) {
                try {
                  return f.call(thisArg, x, y);
                } catch (e) {
                  return reject(e);
                }
              }
              function tryCatchReturn(f, x, thisArg) {
                try {
                  return f.call(thisArg, x);
                } catch (e) {
                  return e;
                }
              }
              function inherit(Parent, Child) {
                Child.prototype = objectCreate(Parent.prototype);
                Child.prototype.constructor = Child;
              }
              function noop() {}
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      7: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var Queue = require('./Queue');
            function Scheduler(enqueue) {
              this._enqueue = enqueue;
              this._handlerQueue = new Queue(15);
              this._afterQueue = new Queue(5);
              this._running = false;
              var self = this;
              this.drain = function() {
                self._drain();
              };
            }
            Scheduler.prototype.enqueue = function(task) {
              this._handlerQueue.push(task);
              if (!this._running) {
                this._running = true;
                this._enqueue(this.drain);
              }
            };
            Scheduler.prototype.afterQueue = function(f, x, y) {
              this._afterQueue.push(f);
              this._afterQueue.push(x);
              this._afterQueue.push(y);
              if (!this._running) {
                this._running = true;
                this._enqueue(this.drain);
              }
            };
            Scheduler.prototype._drain = function() {
              var q = this._handlerQueue;
              while (q.length > 0) {
                q.shift().run();
              }
              this._running = false;
              q = this._afterQueue;
              while (q.length > 0) {
                q.shift()(q.shift(), q.shift());
              }
            };
            return Scheduler;
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {"./Queue": 3}],
      8: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var cjsRequire,
                vertx,
                setTimer,
                clearTimer;
            cjsRequire = require;
            try {
              vertx = cjsRequire('vertx');
              setTimer = function(f, ms) {
                return vertx.setTimer(ms, f);
              };
              clearTimer = vertx.cancelTimer;
            } catch (e) {
              setTimer = function(f, ms) {
                return setTimeout(f, ms);
              };
              clearTimer = function(t) {
                return clearTimeout(t);
              };
            }
            return {
              set: setTimer,
              clear: clearTimer
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {}]
    }, {}, [1])(1);
  });
  ;
  (function(__global) {
    (function() {
      var Promise = __global.Promise || require('when/es6-shim/Promise');
      var traceur;
      var defineProperty;
      (function() {
        try {
          if (!!Object.defineProperty({}, 'a', {})) {
            defineProperty = Object.defineProperty;
          }
        } catch (e) {
          defineProperty = function(obj, prop, opt) {
            try {
              $traceurRuntime.setProperty(obj, prop, opt.value || opt.get.call(obj));
            } catch (e) {}
          };
        }
      }());
      console.assert = console.assert || function() {};
      var indexOf = Array.prototype.indexOf || function(item) {
        for (var i = 0,
            thisLen = this.length; i < thisLen; i++) {
          if (this[$traceurRuntime.toProperty(i)] === item) {
            return i;
          }
        }
        return -1;
      };
      function traverse(object, iterator, parent, parentProperty) {
        var key,
            child;
        if (iterator(object, parent, parentProperty) === false)
          return;
        for (key in object) {
          if (!object.hasOwnProperty(key))
            continue;
          if (key == 'location' || key == 'type')
            continue;
          child = object[$traceurRuntime.toProperty(key)];
          if ((typeof child === 'undefined' ? 'undefined' : $traceurRuntime.typeof(child)) == 'object' && child !== null)
            traverse(child, iterator, object, key);
        }
      }
      function getImports(moduleTree) {
        var imports = [];
        function addImport(name) {
          if (indexOf.call(imports, name) == -1)
            imports.push(name);
        }
        traverse(moduleTree, function(node) {
          if (node.type == 'EXPORT_DECLARATION') {
            if (node.declaration.moduleSpecifier)
              addImport(node.declaration.moduleSpecifier.token.processedValue);
          } else if (node.type == 'IMPORT_DECLARATION')
            addImport(node.moduleSpecifier.token.processedValue);
          else if (node.type == 'MODULE_DECLARATION')
            addImport(node.expression.token.processedValue);
        });
        return imports;
      }
      function parse(load) {
        if (!traceur) {
          if (typeof window == 'undefined')
            traceur = require('traceur');
          else if (__global.traceur)
            traceur = __global.traceur;
          else
            throw new TypeError('Include Traceur for module syntax support');
        }
        console.assert(load.source, 'Non-empty source');
        var depsList,
            curRegister,
            curSystem,
            oldSourceMaps,
            oldModules;
        (function() {
          try {
            var parser = new traceur.syntax.Parser(new traceur.syntax.SourceFile(load.address, load.source));
            var body = parser.parseModule();
            load.kind = 'declarative';
            depsList = getImports(body);
            oldSourceMaps = traceur.options.sourceMaps;
            oldModules = traceur.options.modules;
            traceur.options.sourceMaps = true;
            traceur.options.modules = 'instantiate';
            var reporter = new traceur.util.ErrorReporter();
            reporter.reportMessageInternal = function(location, kind, format, args) {
              throw new SyntaxError(kind, location.start && location.start.line_, location.start && location.start.column_);
            };
            curSystem = __global.System;
            __global.System = __global.traceurSystem;
            var tree = (new traceur.codegeneration.module.AttachModuleNameTransformer(load.name)).transformAny(body);
            tree = (new traceur.codegeneration.FromOptionsTransformer(reporter)).transform(tree);
            var sourceMapGenerator = new traceur.outputgeneration.SourceMapGenerator({file: load.address});
            var options = {sourceMapGenerator: sourceMapGenerator};
            var source = traceur.outputgeneration.TreeWriter.write(tree, options);
            if (__global.btoa)
              source += '\n//# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(options.sourceMap))) + '\n';
            curRegister = System.register;
            System.register = function(name, deps, declare) {
              load.declare = typeof name == 'string' ? declare : deps;
            };
            __eval(source, __global, load.name);
          } catch (e) {
            if (e.name == 'SyntaxError' || e.name == 'TypeError')
              e.message = 'Evaluating ' + (load.name || load.address) + '\n\t' + e.message;
            if (curRegister)
              System.register = curRegister;
            if (curSystem)
              __global.System = curSystem;
            if (oldSourceMaps)
              traceur.options.sourceMaps = oldSourceMaps;
            if (oldModules)
              traceur.options.modules = oldModules;
            throw e;
          }
        }());
        System.register = curRegister;
        __global.System = curSystem;
        traceur.options.sourceMaps = oldSourceMaps;
        traceur.options.modules = oldModules;
        return depsList;
      }
      function createLoaderLoad(object) {
        return {
          modules: {},
          loads: [],
          loaderObj: object
        };
      }
      function createLoad(name) {
        return {
          status: 'loading',
          name: name,
          linkSets: [],
          dependencies: [],
          metadata: {}
        };
      }
      function loadModule(loader, name, options) {
        return new Promise(asyncStartLoadPartwayThrough({
          step: options.address ? 'fetch' : 'locate',
          loader: loader,
          moduleName: name,
          moduleMetadata: {},
          moduleSource: options.source,
          moduleAddress: options.address
        }));
      }
      function requestLoad(loader, request, refererName, refererAddress) {
        return new Promise(function(resolve, reject) {
          resolve(loader.loaderObj.normalize(request, refererName, refererAddress));
        }).then(function(name) {
          var load;
          if (loader.modules[$traceurRuntime.toProperty(name)]) {
            load = createLoad(name);
            load.status = 'linked';
            return load;
          }
          for (var i = 0,
              l = loader.loads.length; i < l; i++) {
            load = loader.loads[$traceurRuntime.toProperty(i)];
            if (load.name != name)
              continue;
            console.assert(load.status == 'loading' || load.status == 'loaded', 'loading or loaded');
            return load;
          }
          load = createLoad(name);
          loader.loads.push(load);
          proceedToLocate(loader, load);
          return load;
        });
      }
      function proceedToLocate(loader, load) {
        proceedToFetch(loader, load, Promise.resolve().then(function() {
          return loader.loaderObj.locate({
            name: load.name,
            metadata: load.metadata
          });
        }));
      }
      function proceedToFetch(loader, load, p) {
        proceedToTranslate(loader, load, p.then(function(address) {
          if (load.status != 'loading')
            return;
          load.address = address;
          return loader.loaderObj.fetch({
            name: load.name,
            metadata: load.metadata,
            address: address
          });
        }));
      }
      var anonCnt = 0;
      function proceedToTranslate(loader, load, p) {
        p.then(function(source) {
          if (load.status != 'loading')
            return;
          return loader.loaderObj.translate({
            name: load.name,
            metadata: load.metadata,
            address: load.address,
            source: source
          });
        }).then(function(source) {
          if (load.status != 'loading')
            return;
          load.source = source;
          return loader.loaderObj.instantiate({
            name: load.name,
            metadata: load.metadata,
            address: load.address,
            source: source
          });
        }).then(function(instantiateResult) {
          if (load.status != 'loading')
            return;
          var depsList;
          if (instantiateResult === undefined) {
            load.address = load.address || 'anon' + ++anonCnt;
            depsList = parse(load);
          } else if ((typeof instantiateResult === 'undefined' ? 'undefined' : $traceurRuntime.typeof(instantiateResult)) == 'object') {
            depsList = instantiateResult.deps || [];
            load.execute = instantiateResult.execute;
            load.kind = 'dynamic';
          } else
            throw TypeError('Invalid instantiate return value');
          load.dependencies = [];
          load.depsList = depsList;
          var loadPromises = [];
          for (var i = 0,
              l = depsList.length; i < l; i++)
            (function(request, index) {
              loadPromises.push(requestLoad(loader, request, load.name, load.address).then(function(depLoad) {
                console.assert(!load.dependencies.some(function(dep) {
                  return dep.key == request;
                }), 'not already a dependency');
                $traceurRuntime.setProperty(load.dependencies, index, {
                  key: request,
                  value: depLoad.name
                });
                if (depLoad.status != 'linked') {
                  var linkSets = load.linkSets.concat([]);
                  for (var i = 0,
                      l = linkSets.length; i < l; i++)
                    addLoadToLinkSet(linkSets[$traceurRuntime.toProperty(i)], depLoad);
                }
              }));
            })(depsList[$traceurRuntime.toProperty(i)], i);
          return Promise.all(loadPromises);
        }).then(function() {
          console.assert(load.status == 'loading', 'is loading');
          load.status = 'loaded';
          var linkSets = load.linkSets.concat([]);
          for (var i = 0,
              l = linkSets.length; i < l; i++)
            updateLinkSetOnLoad(linkSets[$traceurRuntime.toProperty(i)], load);
        })[$traceurRuntime.toProperty('catch')](function(exc) {
          console.assert(load.status == 'loading', 'is loading on fail');
          load.status = 'failed';
          load.exception = exc;
          var linkSets = load.linkSets.concat([]);
          for (var i = 0,
              l = linkSets.length; i < l; i++)
            linkSetFailed(linkSets[$traceurRuntime.toProperty(i)], exc);
          console.assert(load.linkSets.length == 0, 'linkSets not removed');
        });
      }
      function asyncStartLoadPartwayThrough(stepState) {
        return function(resolve, reject) {
          var loader = stepState.loader;
          var name = stepState.moduleName;
          var step = stepState.step;
          if (loader.modules[$traceurRuntime.toProperty(name)])
            throw new TypeError('"' + name + '" already exists in the module table');
          for (var i = 0,
              l = loader.loads.length; i < l; i++)
            if (loader.loads[$traceurRuntime.toProperty(i)].name == name)
              throw new TypeError('"' + name + '" already loading');
          var load = createLoad(name);
          load.metadata = stepState.moduleMetadata;
          var linkSet = createLinkSet(loader, load);
          loader.loads.push(load);
          resolve(linkSet.done);
          if (step == 'locate')
            proceedToLocate(loader, load);
          else if (step == 'fetch')
            proceedToFetch(loader, load, Promise.resolve(stepState.moduleAddress));
          else {
            console.assert(step == 'translate', 'translate step');
            load.address = stepState.moduleAddress;
            proceedToTranslate(loader, load, Promise.resolve(stepState.moduleSource));
          }
        };
      }
      function createLinkSet(loader, startingLoad) {
        var linkSet = {
          loader: loader,
          loads: [],
          startingLoad: startingLoad,
          loadingCount: 0
        };
        linkSet.done = new Promise(function(resolve, reject) {
          linkSet.resolve = resolve;
          linkSet.reject = reject;
        });
        addLoadToLinkSet(linkSet, startingLoad);
        return linkSet;
      }
      function addLoadToLinkSet(linkSet, load) {
        console.assert(load.status == 'loading' || load.status == 'loaded', 'loading or loaded on link set');
        for (var i = 0,
            l = linkSet.loads.length; i < l; i++)
          if (linkSet.loads[$traceurRuntime.toProperty(i)] == load)
            return;
        linkSet.loads.push(load);
        load.linkSets.push(linkSet);
        if (load.status != 'loaded') {
          linkSet.loadingCount++;
        }
        var loader = linkSet.loader;
        for (var i = 0,
            l = load.dependencies.length; i < l; i++) {
          var name = load.dependencies[$traceurRuntime.toProperty(i)].value;
          if (loader.modules[$traceurRuntime.toProperty(name)])
            continue;
          for (var j = 0,
              d = loader.loads.length; j < d; j++) {
            if (loader.loads[$traceurRuntime.toProperty(j)].name != name)
              continue;
            addLoadToLinkSet(linkSet, loader.loads[$traceurRuntime.toProperty(j)]);
            break;
          }
        }
      }
      function doLink(linkSet) {
        try {
          link(linkSet);
        } catch (exc) {
          linkSetFailed(linkSet, exc);
          return true;
        }
      }
      function updateLinkSetOnLoad(linkSet, load) {
        console.assert(load.status == 'loaded' || load.status == 'linked', 'loaded or linked');
        linkSet.loadingCount--;
        if (linkSet.loadingCount > 0)
          return;
        var startingLoad = linkSet.startingLoad;
        if (linkSet.loader.loaderObj.execute === false) {
          var loads = [].concat(linkSet.loads);
          for (var i = 0; i < loads.length; i++) {
            var load = loads[$traceurRuntime.toProperty(i)];
            load.module = load.kind == 'dynamic' ? {module: _newModule({})} : {
              name: load.name,
              module: _newModule({}),
              evaluated: true
            };
            load.status = 'linked';
            finishLoad(linkSet.loader, load);
          }
          return linkSet.resolve(startingLoad);
        }
        var abrupt = doLink(linkSet);
        if (abrupt)
          return;
        console.assert(linkSet.loads.length == 0, 'loads cleared');
        linkSet.resolve(startingLoad);
      }
      function linkSetFailed(linkSet, exc) {
        var loader = linkSet.loader;
        var loads = linkSet.loads.concat([]);
        for (var i = 0,
            l = loads.length; i < l; i++) {
          var load = loads[$traceurRuntime.toProperty(i)];
          loader.loaderObj.failed = loader.loaderObj.failed || [];
          if (indexOf.call(loader.loaderObj.failed, load) == -1)
            loader.loaderObj.failed.push(load);
          var linkIndex = indexOf.call(load.linkSets, linkSet);
          console.assert(linkIndex != -1, 'link not present');
          load.linkSets.splice(linkIndex, 1);
          if (load.linkSets.length == 0) {
            var globalLoadsIndex = indexOf.call(linkSet.loader.loads, load);
            if (globalLoadsIndex != -1)
              linkSet.loader.loads.splice(globalLoadsIndex, 1);
          }
        }
        linkSet.reject(exc);
      }
      function finishLoad(loader, load) {
        if (loader.loaderObj.trace) {
          if (!loader.loaderObj.loads)
            loader.loaderObj.loads = {};
          var depMap = {};
          load.dependencies.forEach(function(dep) {
            $traceurRuntime.setProperty(depMap, dep.key, dep.value);
          });
          $traceurRuntime.setProperty(loader.loaderObj.loads, load.name, {
            name: load.name,
            deps: load.dependencies.map(function(dep) {
              return dep.key;
            }),
            depMap: depMap,
            address: load.address,
            metadata: load.metadata,
            source: load.source,
            kind: load.kind
          });
        }
        if (load.name) {
          console.assert(!loader.modules[$traceurRuntime.toProperty(load.name)], 'load not in module table');
          $traceurRuntime.setProperty(loader.modules, load.name, load.module);
        }
        var loadIndex = indexOf.call(loader.loads, load);
        if (loadIndex != -1)
          loader.loads.splice(loadIndex, 1);
        for (var i = 0,
            l = load.linkSets.length; i < l; i++) {
          loadIndex = indexOf.call(load.linkSets[$traceurRuntime.toProperty(i)].loads, load);
          if (loadIndex != -1)
            load.linkSets[$traceurRuntime.toProperty(i)].loads.splice(loadIndex, 1);
        }
        load.linkSets.splice(0, load.linkSets.length);
      }
      function buildLinkageGroups(load, loads, groups, loader) {
        $traceurRuntime.setProperty(groups, load.groupIndex, groups[$traceurRuntime.toProperty(load.groupIndex)] || []);
        if (indexOf.call(groups[$traceurRuntime.toProperty(load.groupIndex)], load) != -1)
          return;
        groups[$traceurRuntime.toProperty(load.groupIndex)].push(load);
        for (var i = 0; i < loads.length; i++) {
          var loadDep = loads[$traceurRuntime.toProperty(i)];
          for (var j = 0; j < load.dependencies.length; j++) {
            if (loadDep.name == load.dependencies[$traceurRuntime.toProperty(j)].value) {
              console.assert(loadDep.status == 'loaded', 'Load in linkSet not loaded!');
              var loadDepGroupIndex = load.groupIndex + (loadDep.kind != load.kind);
              if (loadDep.groupIndex === undefined || loadDep.groupIndex < loadDepGroupIndex) {
                if (loadDep.groupIndex) {
                  groups[$traceurRuntime.toProperty(loadDep.groupIndex)].splice(indexOf.call(groups[$traceurRuntime.toProperty(loadDep.groupIndex)], loadDep), 1);
                  if (groups[$traceurRuntime.toProperty(loadDep.groupIndex)].length == 0)
                    throw new TypeError("Mixed dependency cycle detected");
                }
                loadDep.groupIndex = loadDepGroupIndex;
              }
              buildLinkageGroups(loadDep, loads, groups, loader);
            }
          }
        }
      }
      function link(linkSet) {
        var loader = linkSet.loader;
        if (!linkSet.loads.length)
          return;
        var groups = [];
        var startingLoad = linkSet.loads[0];
        startingLoad.groupIndex = 0;
        buildLinkageGroups(startingLoad, linkSet.loads, groups, loader);
        var curGroupDeclarative = (startingLoad.kind == 'declarative') == groups.length % 2;
        for (var i = groups.length - 1; i >= 0; i--) {
          var group = groups[$traceurRuntime.toProperty(i)];
          for (var j = 0; j < group.length; j++) {
            var load = group[$traceurRuntime.toProperty(j)];
            if (curGroupDeclarative) {
              linkDeclarativeModule(load, linkSet.loads, loader);
            } else {
              var module = load.execute();
              if (!module || !(module instanceof Module))
                throw new TypeError('Execution must define a Module instance');
              load.module = {module: module};
              load.status = 'linked';
            }
            finishLoad(loader, load);
          }
          curGroupDeclarative = !curGroupDeclarative;
        }
      }
      function linkDeclarativeModule(load, loads, loader) {
        if (load.module)
          return;
        var depMap = [];
        var registryEntry = load.declare.call(__global, depMap);
        var moduleDependencies = [];
        var module = registryEntry.exports;
        console.assert(!load.module, 'Load module already declared!');
        load.module = {
          name: load.name,
          dependencies: moduleDependencies,
          execute: registryEntry.execute,
          exports: module,
          evaluated: false
        };
        for (var i = 0; i < load.dependencies.length; i++) {
          var depName = load.dependencies[$traceurRuntime.toProperty(i)].value;
          var depModule;
          if (loader.modules[$traceurRuntime.toProperty(depName)]) {
            depModule = loader.modules[$traceurRuntime.toProperty(depName)];
          } else {
            for (var j = 0; j < loads.length; j++) {
              if (loads[$traceurRuntime.toProperty(j)].name != depName)
                continue;
              if (!loads[$traceurRuntime.toProperty(j)].module)
                linkDeclarativeModule(loads[$traceurRuntime.toProperty(j)], loads, loader);
              depModule = loads[$traceurRuntime.toProperty(j)].module;
            }
          }
          var depModuleModule = depModule.exports || depModule.module;
          console.assert(depModule, 'Dependency module not found!');
          if (registryEntry.exportStar && indexOf.call(registryEntry.exportStar, load.dependencies[$traceurRuntime.toProperty(i)].key) != -1) {
            (function(depModuleModule) {
              for (var p in depModuleModule)
                (function(p) {
                  defineProperty(module, p, {
                    enumerable: true,
                    get: function() {
                      return depModuleModule[$traceurRuntime.toProperty(p)];
                    },
                    set: function(value) {
                      $traceurRuntime.setProperty(depModuleModule, p, value);
                    }
                  });
                })(p);
            })(depModuleModule);
          }
          moduleDependencies.push(depModule);
          $traceurRuntime.setProperty(depMap, i, depModuleModule);
        }
        load.status = 'linked';
      }
      function evaluateLoadedModule(loader, load) {
        console.assert(load.status == 'linked', 'is linked ' + load.name);
        doEnsureEvaluated(load.module, [], loader);
        return load.module.module;
      }
      function doExecute(module) {
        try {
          module.execute.call(__global);
        } catch (e) {
          return e;
        }
      }
      function doEnsureEvaluated(module, seen, loader) {
        var err = ensureEvaluated(module, seen, loader);
        if (err)
          throw err;
      }
      function ensureEvaluated(module, seen, loader) {
        if (module.evaluated || !module.dependencies)
          return;
        seen.push(module);
        var deps = module.dependencies;
        var err;
        for (var i = 0; i < deps.length; i++) {
          var dep = deps[$traceurRuntime.toProperty(i)];
          if (indexOf.call(seen, dep) == -1) {
            err = ensureEvaluated(dep, seen, loader);
            if (err)
              return err + '\n  in module ' + dep.name;
          }
        }
        if (module.failed)
          return new Error('Module failed execution.');
        if (module.evaluated)
          return;
        module.evaluated = true;
        err = doExecute(module);
        if (err)
          module.failed = true;
        module.module = _newModule(module.exports);
        module.execute = undefined;
        return err;
      }
      function Loader(options) {
        if ((typeof options === 'undefined' ? 'undefined' : $traceurRuntime.typeof(options)) != 'object')
          throw new TypeError('Options must be an object');
        if (options.normalize)
          this.normalize = options.normalize;
        if (options.locate)
          this.locate = options.locate;
        if (options.fetch)
          this.fetch = options.fetch;
        if (options.translate)
          this.translate = options.translate;
        if (options.instantiate)
          this.instantiate = options.instantiate;
        this._loader = {
          loaderObj: this,
          loads: [],
          modules: {}
        };
        defineProperty(this, 'global', {get: function() {
            return __global;
          }});
      }
      function Module() {}
      var importPromises = {};
      function createImportPromise(name, promise) {
        $traceurRuntime.setProperty(importPromises, name, promise);
        promise.then(function() {
          $traceurRuntime.setProperty(importPromises, name, undefined);
        });
        promise[$traceurRuntime.toProperty('catch')](function() {
          $traceurRuntime.setProperty(importPromises, name, undefined);
        });
        return promise;
      }
      Loader.prototype = {
        constructor: Loader,
        define: function(name, source, options) {
          if (importPromises[$traceurRuntime.toProperty(name)])
            throw new TypeError('Module is already loading.');
          return createImportPromise(name, new Promise(asyncStartLoadPartwayThrough({
            step: 'translate',
            loader: this._loader,
            moduleName: name,
            moduleMetadata: options && options.metadata || {},
            moduleSource: source,
            moduleAddress: options && options.address
          })));
        },
        'delete': function(name) {
          return this._loader.modules[$traceurRuntime.toProperty(name)] ? delete this._loader.modules[$traceurRuntime.toProperty(name)] : false;
        },
        get: function(key) {
          if (!this._loader.modules[$traceurRuntime.toProperty(key)])
            return;
          doEnsureEvaluated(this._loader.modules[$traceurRuntime.toProperty(key)], [], this);
          return this._loader.modules[$traceurRuntime.toProperty(key)].module;
        },
        has: function(name) {
          return !!this._loader.modules[$traceurRuntime.toProperty(name)];
        },
        'import': function(name, options) {
          var loaderObj = this;
          return Promise.resolve(loaderObj.normalize(name, options && options.name, options && options.address)).then(function(name) {
            var loader = loaderObj._loader;
            if (loader.modules[$traceurRuntime.toProperty(name)]) {
              doEnsureEvaluated(loader.modules[$traceurRuntime.toProperty(name)], [], loader._loader);
              return loader.modules[$traceurRuntime.toProperty(name)].module;
            }
            return importPromises[$traceurRuntime.toProperty(name)] || createImportPromise(name, loadModule(loader, name, options || {}).then(function(load) {
              delete importPromises[$traceurRuntime.toProperty(name)];
              return evaluateLoadedModule(loader, load);
            }));
          });
        },
        load: function(name, options) {
          if (this._loader.modules[$traceurRuntime.toProperty(name)]) {
            doEnsureEvaluated(this._loader.modules[$traceurRuntime.toProperty(name)], [], this._loader);
            return Promise.resolve(this._loader.modules[$traceurRuntime.toProperty(name)].module);
          }
          return importPromises[$traceurRuntime.toProperty(name)] || createImportPromise(name, loadModule(this._loader, name, {}));
        },
        module: function(source, options) {
          var load = createLoad();
          load.address = options && options.address;
          var linkSet = createLinkSet(this._loader, load);
          var sourcePromise = Promise.resolve(source);
          var loader = this._loader;
          var p = linkSet.done.then(function() {
            return evaluateLoadedModule(loader, load);
          });
          proceedToTranslate(loader, load, sourcePromise);
          return p;
        },
        newModule: function(obj) {
          if ((typeof obj === 'undefined' ? 'undefined' : $traceurRuntime.typeof(obj)) != 'object')
            throw new TypeError('Expected object');
          var m = new Module();
          for (var key in obj) {
            (function(key) {
              defineProperty(m, key, {
                configurable: false,
                enumerable: true,
                get: function() {
                  return obj[$traceurRuntime.toProperty(key)];
                }
              });
            })(key);
          }
          if (Object.preventExtensions)
            Object.preventExtensions(m);
          return m;
        },
        set: function(name, module) {
          if (!(module instanceof Module))
            throw new TypeError('Set must be a module');
          $traceurRuntime.setProperty(this._loader.modules, name, {module: module});
        },
        normalize: function(name, referrerName, referrerAddress) {
          return name;
        },
        locate: function(load) {
          return load.name;
        },
        fetch: function(load) {
          throw new TypeError('Fetch not implemented');
        },
        translate: function(load) {
          return load.source;
        },
        instantiate: function(load) {}
      };
      var _newModule = Loader.prototype.newModule;
      if ((typeof exports === 'undefined' ? 'undefined' : $traceurRuntime.typeof(exports)) === 'object')
        module.exports = Loader;
      __global.Reflect = __global.Reflect || {};
      __global.Reflect.Loader = __global.Reflect.Loader || Loader;
      __global.LoaderPolyfill = Loader;
    })();
    function __eval(__source, __global, __moduleName) {
      eval('var __moduleName = "' + (__moduleName || '').replace('"', '\"') + '"; (function() { ' + __source + ' \n }).call(__global);');
    }
  })(typeof global !== 'undefined' ? global : this);
  (function(global) {
    var isBrowser = typeof window != 'undefined';
    var Loader = global.Reflect && global.Reflect.Loader || require('./loader');
    var Promise = global.Promise || require('es6-promise').Promise;
    function parseURI(url) {
      var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
      return (m ? {
        href: m[0] || '',
        protocol: m[1] || '',
        authority: m[2] || '',
        host: m[3] || '',
        hostname: m[4] || '',
        port: m[5] || '',
        pathname: m[6] || '',
        search: m[7] || '',
        hash: m[8] || ''
      } : null);
    }
    function removeDotSegments(input) {
      var output = [];
      input.replace(/^(\.\.?(\/|$))+/, '').replace(/\/(\.(\/|$))+/g, '/').replace(/\/\.\.$/, '/../').replace(/\/?[^\/]*/g, function(p) {
        if (p === '/..')
          output.pop();
        else
          output.push(p);
      });
      return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
    }
    function toAbsoluteURL(base, href) {
      href = parseURI(href || '');
      base = parseURI(base || '');
      return !href || !base ? null : (href.protocol || base.protocol) + (href.protocol || href.authority ? href.authority : base.authority) + removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) + (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) + href.hash;
    }
    var fetchTextFromURL;
    if (isBrowser) {
      fetchTextFromURL = function(url, fulfill, reject) {
        var xhr = new XMLHttpRequest();
        var sameDomain = true;
        if (!('withCredentials' in xhr)) {
          var domainCheck = /^(\w+:)?\/\/([^\/]+)/.exec(url);
          if (domainCheck) {
            sameDomain = domainCheck[2] === window.location.host;
            if (domainCheck[1])
              sameDomain &= domainCheck[1] === window.location.protocol;
          }
        }
        if (!sameDomain) {
          xhr = new XDomainRequest();
          xhr.onload = load;
          xhr.onerror = error;
          xhr.ontimeout = error;
        }
        function load() {
          fulfill(xhr.responseText);
        }
        function error() {
          reject(xhr.statusText + ': ' + url || 'XHR error');
        }
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || (xhr.status == 0 && xhr.responseText)) {
              load();
            } else {
              error();
            }
          }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
      };
    } else {
      var fs;
      fetchTextFromURL = function(url, fulfill, reject) {
        fs = fs || require('fs');
        return fs.readFile(url, function(err, data) {
          if (err)
            return reject(err);
          else
            fulfill(data + '');
        });
      };
    }
    var System = new Loader({
      global: isBrowser ? window : global,
      strict: true,
      normalize: function(name, parentName, parentAddress) {
        if (typeof name != 'string')
          throw new TypeError('Module name must be a string');
        var segments = name.split('/');
        if (segments.length == 0)
          throw new TypeError('No module name provided');
        var i = 0;
        var rel = false;
        var dotdots = 0;
        if (segments[0] == '.') {
          i++;
          if (i == segments.length)
            throw new TypeError('Illegal module name "' + name + '"');
          rel = true;
        } else {
          while (segments[$traceurRuntime.toProperty(i)] == '..') {
            i++;
            if (i == segments.length)
              throw new TypeError('Illegal module name "' + name + '"');
          }
          if (i)
            rel = true;
          dotdots = i;
        }
        for (var j = i; j < segments.length; j++) {
          var segment = segments[$traceurRuntime.toProperty(j)];
          if (segment == '' || segment == '.' || segment == '..')
            throw new TypeError('Illegal module name "' + name + '"');
        }
        if (!rel)
          return name;
        var normalizedParts = [];
        var parentParts = (parentName || '').split('/');
        var normalizedLen = parentParts.length - 1 - dotdots;
        normalizedParts = normalizedParts.concat(parentParts.splice(0, parentParts.length - 1 - dotdots));
        normalizedParts = normalizedParts.concat(segments.splice(i, segments.length - i));
        return normalizedParts.join('/');
      },
      locate: function(load) {
        var name = load.name;
        var pathMatch = '',
            wildcard;
        for (var p in this.paths) {
          var pathParts = p.split('*');
          if (pathParts.length > 2)
            throw new TypeError('Only one wildcard in a path is permitted');
          if (pathParts.length == 1) {
            if (name == p && p.length > pathMatch.length)
              pathMatch = p;
          } else {
            if (name.substr(0, pathParts[0].length) == pathParts[0] && name.substr(name.length - pathParts[1].length) == pathParts[1]) {
              pathMatch = p;
              wildcard = name.substr(pathParts[0].length, name.length - pathParts[1].length - pathParts[0].length);
            }
          }
        }
        var outPath = this.paths[$traceurRuntime.toProperty(pathMatch)];
        if (wildcard)
          outPath = outPath.replace('*', wildcard);
        return toAbsoluteURL(this.baseURL, outPath);
      },
      fetch: function(load) {
        return new Promise(function(resolve, reject) {
          fetchTextFromURL(toAbsoluteURL(this.baseURL, load.address), function(source) {
            resolve(source);
          }, reject);
        });
      }
    });
    if (isBrowser) {
      var href = window.location.href.split('#')[0].split('?')[0];
      System.baseURL = href.substring(0, href.lastIndexOf('/') + 1);
    } else {
      System.baseURL = './';
    }
    System.paths = {'*': '*.js'};
    if (global.System && global.traceur)
      global.traceurSystem = global.System;
    if (isBrowser)
      global.System = System;
    if (isBrowser) {
      try {
        throw undefined;
      } catch (ready) {
        try {
          throw undefined;
        } catch (completed) {
          {
            var curScript = document.getElementsByTagName('script');
            curScript = curScript[$traceurRuntime.toProperty(curScript.length - 1)];
            completed = function() {
              document.removeEventListener("DOMContentLoaded", completed, false);
              window.removeEventListener("load", completed, false);
              ready();
            };
            ready = function() {
              var scripts = document.getElementsByTagName('script');
              for (var i = 0; i < scripts.length; i++) {
                var script = scripts[$traceurRuntime.toProperty(i)];
                if (script.type == 'module') {
                  var source = script.innerHTML;
                  System.module(source)[$traceurRuntime.toProperty('catch')](function(err) {
                    setTimeout(function() {
                      throw err;
                    });
                  });
                }
              }
            };
            if (document.readyState === 'complete') {
              setTimeout(ready);
            } else if (document.addEventListener) {
              document.addEventListener('DOMContentLoaded', completed, false);
              window.addEventListener('load', completed, false);
            }
            if (curScript.getAttribute('data-init'))
              window[$traceurRuntime.toProperty(curScript.getAttribute('data-init'))]();
          }
        }
      }
    }
    if ((typeof exports === 'undefined' ? 'undefined' : $traceurRuntime.typeof(exports)) === 'object')
      module.exports = System;
  })(typeof global !== 'undefined' ? global : this);
  return {};
});
System.get("../../../js/libs/es6-module-loader" + '');
