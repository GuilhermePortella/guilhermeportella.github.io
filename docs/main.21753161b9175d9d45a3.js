(self.webpackChunkguilherme_portella = self.webpackChunkguilherme_portella || []).push([
  [179], {
    255: Vs => {
      function cr(Bs) {
        return Promise.resolve().then(() => {
          var En = new Error("Cannot find module '" + Bs + "'");
          throw En.code = "MODULE_NOT_FOUND", En
        })
      }
      cr.keys = () => [], cr.resolve = cr, cr.id = 255, Vs.exports = cr
    },
    414: (Vs, cr, Bs) => {
      "use strict";

      function En(n) {
        return "function" == typeof n
      }
      let fu = !1;
      const nn = {
        Promise: void 0,
        set useDeprecatedSynchronousErrorHandling(n) {
          if (n) {
            const e = new Error;
            console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" + e.stack)
          } else fu && console.log("RxJS: Back to a better error behavior. Thank you. <3");
          fu = n
        },
        get useDeprecatedSynchronousErrorHandling() {
          return fu
        }
      };

      function Ci(n) {
        setTimeout(() => {
          throw n
        }, 0)
      }
      const Da = {
          closed: !0,
          next(n) {},
          error(n) {
            if (nn.useDeprecatedSynchronousErrorHandling) throw n;
            Ci(n)
          },
          complete() {}
        },
        Sa = Array.isArray || (n => n && "number" == typeof n.length);

      function og(n) {
        return null !== n && "object" == typeof n
      }
      const Ta = (() => {
        function n(e) {
          return Error.call(this), this.message = e ? `${e.length} errors occurred during unsubscription:\n${e.map((t,r)=>`${r+1}) ${t.toString()}`).join("\n  ")}` : "", this.name = "UnsubscriptionError", this.errors = e, this
        }
        return n.prototype = Object.create(Error.prototype), n
      })();
      class ie {
        constructor(e) {
          this.closed = !1, this._parentOrParents = null, this._subscriptions = null, e && (this._ctorUnsubscribe = !0, this._unsubscribe = e)
        }
        unsubscribe() {
          let e;
          if (this.closed) return;
          let {
            _parentOrParents: t,
            _ctorUnsubscribe: r,
            _unsubscribe: i,
            _subscriptions: s
          } = this;
          if (this.closed = !0, this._parentOrParents = null, this._subscriptions = null, t instanceof ie) t.remove(this);
          else if (null !== t)
            for (let o = 0; o < t.length; ++o) t[o].remove(this);
          if (En(i)) {
            r && (this._unsubscribe = void 0);
            try {
              i.call(this)
            } catch (o) {
              e = o instanceof Ta ? ag(o.errors) : [o]
            }
          }
          if (Sa(s)) {
            let o = -1,
              a = s.length;
            for (; ++o < a;) {
              const l = s[o];
              if (og(l)) try {
                l.unsubscribe()
              } catch (c) {
                e = e || [], c instanceof Ta ? e = e.concat(ag(c.errors)) : e.push(c)
              }
            }
          }
          if (e) throw new Ta(e)
        }
        add(e) {
          let t = e;
          if (!e) return ie.EMPTY;
          switch (typeof e) {
            case "function":
              t = new ie(e);
            case "object":
              if (t === this || t.closed || "function" != typeof t.unsubscribe) return t;
              if (this.closed) return t.unsubscribe(), t;
              if (!(t instanceof ie)) {
                const s = t;
                t = new ie, t._subscriptions = [s]
              }
              break;
            default:
              throw new Error("unrecognized teardown " + e + " added to Subscription.")
          }
          let {
            _parentOrParents: r
          } = t;
          if (null === r) t._parentOrParents = this;
          else if (r instanceof ie) {
            if (r === this) return t;
            t._parentOrParents = [r, this]
          } else {
            if (-1 !== r.indexOf(this)) return t;
            r.push(this)
          }
          const i = this._subscriptions;
          return null === i ? this._subscriptions = [t] : i.push(t), t
        }
        remove(e) {
          const t = this._subscriptions;
          if (t) {
            const r = t.indexOf(e); - 1 !== r && t.splice(r, 1)
          }
        }
      }
      var n;

      function ag(n) {
        return n.reduce((e, t) => e.concat(t instanceof Ta ? t.errors : t), [])
      }
      ie.EMPTY = ((n = new ie).closed = !0, n);
      const Ma = "function" == typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random();
      class ue extends ie {
        constructor(e, t, r) {
          switch (super(), this.syncErrorValue = null, this.syncErrorThrown = !1, this.syncErrorThrowable = !1, this.isStopped = !1, arguments.length) {
            case 0:
              this.destination = Da;
              break;
            case 1:
              if (!e) {
                this.destination = Da;
                break
              }
              if ("object" == typeof e) {
                e instanceof ue ? (this.syncErrorThrowable = e.syncErrorThrowable, this.destination = e, e.add(this)) : (this.syncErrorThrowable = !0, this.destination = new lg(this, e));
                break
              }
              default:
                this.syncErrorThrowable = !0, this.destination = new lg(this, e, t, r)
          }
        } [Ma]() {
          return this
        }
        static create(e, t, r) {
          const i = new ue(e, t, r);
          return i.syncErrorThrowable = !1, i
        }
        next(e) {
          this.isStopped || this._next(e)
        }
        error(e) {
          this.isStopped || (this.isStopped = !0, this._error(e))
        }
        complete() {
          this.isStopped || (this.isStopped = !0, this._complete())
        }
        unsubscribe() {
          this.closed || (this.isStopped = !0, super.unsubscribe())
        }
        _next(e) {
          this.destination.next(e)
        }
        _error(e) {
          this.destination.error(e), this.unsubscribe()
        }
        _complete() {
          this.destination.complete(), this.unsubscribe()
        }
        _unsubscribeAndRecycle() {
          const {
            _parentOrParents: e
          } = this;
          return this._parentOrParents = null, this.unsubscribe(), this.closed = !1, this.isStopped = !1, this._parentOrParents = e, this
        }
      }
      class lg extends ue {
        constructor(e, t, r, i) {
          super(), this._parentSubscriber = e;
          let s, o = this;
          En(t) ? s = t : t && (s = t.next, r = t.error, i = t.complete, t !== Da && (o = Object.create(t), En(o.unsubscribe) && this.add(o.unsubscribe.bind(o)), o.unsubscribe = this.unsubscribe.bind(this))), this._context = o, this._next = s, this._error = r, this._complete = i
        }
        next(e) {
          if (!this.isStopped && this._next) {
            const {
              _parentSubscriber: t
            } = this;
            nn.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable ? this.__tryOrSetError(t, this._next, e) && this.unsubscribe() : this.__tryOrUnsub(this._next, e)
          }
        }
        error(e) {
          if (!this.isStopped) {
            const {
              _parentSubscriber: t
            } = this, {
              useDeprecatedSynchronousErrorHandling: r
            } = nn;
            if (this._error) r && t.syncErrorThrowable ? (this.__tryOrSetError(t, this._error, e), this.unsubscribe()) : (this.__tryOrUnsub(this._error, e), this.unsubscribe());
            else if (t.syncErrorThrowable) r ? (t.syncErrorValue = e, t.syncErrorThrown = !0) : Ci(e), this.unsubscribe();
            else {
              if (this.unsubscribe(), r) throw e;
              Ci(e)
            }
          }
        }
        complete() {
          if (!this.isStopped) {
            const {
              _parentSubscriber: e
            } = this;
            if (this._complete) {
              const t = () => this._complete.call(this._context);
              nn.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable ? (this.__tryOrSetError(e, t), this.unsubscribe()) : (this.__tryOrUnsub(t), this.unsubscribe())
            } else this.unsubscribe()
          }
        }
        __tryOrUnsub(e, t) {
          try {
            e.call(this._context, t)
          } catch (r) {
            if (this.unsubscribe(), nn.useDeprecatedSynchronousErrorHandling) throw r;
            Ci(r)
          }
        }
        __tryOrSetError(e, t, r) {
          if (!nn.useDeprecatedSynchronousErrorHandling) throw new Error("bad call");
          try {
            t.call(this._context, r)
          } catch (i) {
            return nn.useDeprecatedSynchronousErrorHandling ? (e.syncErrorValue = i, e.syncErrorThrown = !0, !0) : (Ci(i), !0)
          }
          return !1
        }
        _unsubscribe() {
          const {
            _parentSubscriber: e
          } = this;
          this._context = null, this._parentSubscriber = null, e.unsubscribe()
        }
      }
      const js = "function" == typeof Symbol && Symbol.observable || "@@observable";

      function Aa(n) {
        return n
      }
      let re = (() => {
        class n {
          constructor(t) {
            this._isScalar = !1, t && (this._subscribe = t)
          }
          lift(t) {
            const r = new n;
            return r.source = this, r.operator = t, r
          }
          subscribe(t, r, i) {
            const {
              operator: s
            } = this, o = function (n, e, t) {
              if (n) {
                if (n instanceof ue) return n;
                if (n[Ma]) return n[Ma]()
              }
              return n || e || t ? new ue(n, e, t) : new ue(Da)
            }(t, r, i);
            if (o.add(s ? s.call(o, this.source) : this.source || nn.useDeprecatedSynchronousErrorHandling && !o.syncErrorThrowable ? this._subscribe(o) : this._trySubscribe(o)), nn.useDeprecatedSynchronousErrorHandling && o.syncErrorThrowable && (o.syncErrorThrowable = !1, o.syncErrorThrown)) throw o.syncErrorValue;
            return o
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t)
            } catch (r) {
              nn.useDeprecatedSynchronousErrorHandling && (t.syncErrorThrown = !0, t.syncErrorValue = r),
                function (n) {
                  for (; n;) {
                    const {
                      closed: e,
                      destination: t,
                      isStopped: r
                    } = n;
                    if (e || r) return !1;
                    n = t && t instanceof ue ? t : null
                  }
                  return !0
                }(t) ? t.error(r) : console.warn(r)
            }
          }
          forEach(t, r) {
            return new(r = ug(r))((i, s) => {
              let o;
              o = this.subscribe(a => {
                try {
                  t(a)
                } catch (l) {
                  s(l), o && o.unsubscribe()
                }
              }, s, i)
            })
          }
          _subscribe(t) {
            const {
              source: r
            } = this;
            return r && r.subscribe(t)
          } [js]() {
            return this
          }
          pipe(...t) {
            return 0 === t.length ? this : function (n) {
              return 0 === n.length ? Aa : 1 === n.length ? n[0] : function (t) {
                return n.reduce((r, i) => i(r), t)
              }
            }(t)(this)
          }
          toPromise(t) {
            return new(t = ug(t))((r, i) => {
              let s;
              this.subscribe(o => s = o, o => i(o), () => r(s))
            })
          }
        }
        return n.create = e => new n(e), n
      })();

      function ug(n) {
        if (n || (n = nn.Promise || Promise), !n) throw new Error("no Promise impl found");
        return n
      }
      const Rr = (() => {
        function n() {
          return Error.call(this), this.message = "object unsubscribed", this.name = "ObjectUnsubscribedError", this
        }
        return n.prototype = Object.create(Error.prototype), n
      })();
      class dg extends ie {
        constructor(e, t) {
          super(), this.subject = e, this.subscriber = t, this.closed = !1
        }
        unsubscribe() {
          if (this.closed) return;
          this.closed = !0;
          const e = this.subject,
            t = e.observers;
          if (this.subject = null, !t || 0 === t.length || e.isStopped || e.closed) return;
          const r = t.indexOf(this.subscriber); - 1 !== r && t.splice(r, 1)
        }
      }
      class hg extends ue {
        constructor(e) {
          super(e), this.destination = e
        }
      }
      let X = (() => {
        class n extends re {
          constructor() {
            super(), this.observers = [], this.closed = !1, this.isStopped = !1, this.hasError = !1, this.thrownError = null
          } [Ma]() {
            return new hg(this)
          }
          lift(t) {
            const r = new fg(this, this);
            return r.operator = t, r
          }
          next(t) {
            if (this.closed) throw new Rr;
            if (!this.isStopped) {
              const {
                observers: r
              } = this, i = r.length, s = r.slice();
              for (let o = 0; o < i; o++) s[o].next(t)
            }
          }
          error(t) {
            if (this.closed) throw new Rr;
            this.hasError = !0, this.thrownError = t, this.isStopped = !0;
            const {
              observers: r
            } = this, i = r.length, s = r.slice();
            for (let o = 0; o < i; o++) s[o].error(t);
            this.observers.length = 0
          }
          complete() {
            if (this.closed) throw new Rr;
            this.isStopped = !0;
            const {
              observers: t
            } = this, r = t.length, i = t.slice();
            for (let s = 0; s < r; s++) i[s].complete();
            this.observers.length = 0
          }
          unsubscribe() {
            this.isStopped = !0, this.closed = !0, this.observers = null
          }
          _trySubscribe(t) {
            if (this.closed) throw new Rr;
            return super._trySubscribe(t)
          }
          _subscribe(t) {
            if (this.closed) throw new Rr;
            return this.hasError ? (t.error(this.thrownError), ie.EMPTY) : this.isStopped ? (t.complete(), ie.EMPTY) : (this.observers.push(t), new dg(this, t))
          }
          asObservable() {
            const t = new re;
            return t.source = this, t
          }
        }
        return n.create = (e, t) => new fg(e, t), n
      })();
      class fg extends X {
        constructor(e, t) {
          super(), this.destination = e, this.source = t
        }
        next(e) {
          const {
            destination: t
          } = this;
          t && t.next && t.next(e)
        }
        error(e) {
          const {
            destination: t
          } = this;
          t && t.error && this.destination.error(e)
        }
        complete() {
          const {
            destination: e
          } = this;
          e && e.complete && this.destination.complete()
        }
        _subscribe(e) {
          const {
            source: t
          } = this;
          return t ? this.source.subscribe(e) : ie.EMPTY
        }
      }

      function Ei(n) {
        return n && "function" == typeof n.schedule
      }

      function _e(n, e) {
        return function (r) {
          if ("function" != typeof n) throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
          return r.lift(new ZS(n, e))
        }
      }
      class ZS {
        constructor(e, t) {
          this.project = e, this.thisArg = t
        }
        call(e, t) {
          return t.subscribe(new XS(e, this.project, this.thisArg))
        }
      }
      class XS extends ue {
        constructor(e, t, r) {
          super(e), this.project = t, this.count = 0, this.thisArg = r || this
        }
        _next(e) {
          let t;
          try {
            t = this.project.call(this.thisArg, e, this.count++)
          } catch (r) {
            return void this.destination.error(r)
          }
          this.destination.next(t)
        }
      }
      const pg = n => e => {
          for (let t = 0, r = n.length; t < r && !e.closed; t++) e.next(n[t]);
          e.complete()
        },
        Ia = "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator",
        gg = n => n && "number" == typeof n.length && "function" != typeof n;

      function mg(n) {
        return !!n && "function" != typeof n.subscribe && "function" == typeof n.then
      }
      const pu = n => {
        if (n && "function" == typeof n[js]) return (n => e => {
          const t = n[js]();
          if ("function" != typeof t.subscribe) throw new TypeError("Provided object does not correctly implement Symbol.observable");
          return t.subscribe(e)
        })(n);
        if (gg(n)) return pg(n);
        if (mg(n)) return (n => e => (n.then(t => {
          e.closed || (e.next(t), e.complete())
        }, t => e.error(t)).then(null, Ci), e))(n);
        if (n && "function" == typeof n[Ia]) return (n => e => {
          const t = n[Ia]();
          for (;;) {
            let r;
            try {
              r = t.next()
            } catch (i) {
              return e.error(i), e
            }
            if (r.done) {
              e.complete();
              break
            }
            if (e.next(r.value), e.closed) break
          }
          return "function" == typeof t.return && e.add(() => {
            t.return && t.return()
          }), e
        })(n); {
          const t = `You provided ${og(n)?"an invalid object":`'${n}'`} where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.`;
          throw new TypeError(t)
        }
      };

      function gu(n, e) {
        return new re(t => {
          const r = new ie;
          let i = 0;
          return r.add(e.schedule(function () {
            i !== n.length ? (t.next(n[i++]), t.closed || r.add(this.schedule())) : t.complete()
          })), r
        })
      }

      function rt(n, e) {
        return e ? function (n, e) {
          if (null != n) {
            if (function (n) {
                return n && "function" == typeof n[js]
              }(n)) return function (n, e) {
              return new re(t => {
                const r = new ie;
                return r.add(e.schedule(() => {
                  const i = n[js]();
                  r.add(i.subscribe({
                    next(s) {
                      r.add(e.schedule(() => t.next(s)))
                    },
                    error(s) {
                      r.add(e.schedule(() => t.error(s)))
                    },
                    complete() {
                      r.add(e.schedule(() => t.complete()))
                    }
                  }))
                })), r
              })
            }(n, e);
            if (mg(n)) return function (n, e) {
              return new re(t => {
                const r = new ie;
                return r.add(e.schedule(() => n.then(i => {
                  r.add(e.schedule(() => {
                    t.next(i), r.add(e.schedule(() => t.complete()))
                  }))
                }, i => {
                  r.add(e.schedule(() => t.error(i)))
                }))), r
              })
            }(n, e);
            if (gg(n)) return gu(n, e);
            if (function (n) {
                return n && "function" == typeof n[Ia]
              }(n) || "string" == typeof n) return function (n, e) {
              if (!n) throw new Error("Iterable cannot be null");
              return new re(t => {
                const r = new ie;
                let i;
                return r.add(() => {
                  i && "function" == typeof i.return && i.return()
                }), r.add(e.schedule(() => {
                  i = n[Ia](), r.add(e.schedule(function () {
                    if (t.closed) return;
                    let s, o;
                    try {
                      const a = i.next();
                      s = a.value, o = a.done
                    } catch (a) {
                      return void t.error(a)
                    }
                    o ? t.complete() : (t.next(s), this.schedule())
                  }))
                })), r
              })
            }(n, e)
          }
          throw new TypeError((null !== n && typeof n || n) + " is not observable")
        }(n, e) : n instanceof re ? n : new re(pu(n))
      }
      class Hs extends ue {
        constructor(e) {
          super(), this.parent = e
        }
        _next(e) {
          this.parent.notifyNext(e)
        }
        _error(e) {
          this.parent.notifyError(e), this.unsubscribe()
        }
        _complete() {
          this.parent.notifyComplete(), this.unsubscribe()
        }
      }
      class Us extends ue {
        notifyNext(e) {
          this.destination.next(e)
        }
        notifyError(e) {
          this.destination.error(e)
        }
        notifyComplete() {
          this.destination.complete()
        }
      }

      function $s(n, e) {
        if (e.closed) return;
        if (n instanceof re) return n.subscribe(e);
        let t;
        try {
          t = pu(n)(e)
        } catch (r) {
          e.error(r)
        }
        return t
      }

      function Ke(n, e, t = Number.POSITIVE_INFINITY) {
        return "function" == typeof e ? r => r.pipe(Ke((i, s) => rt(n(i, s)).pipe(_e((o, a) => e(i, o, s, a))), t)) : ("number" == typeof e && (t = e), r => r.lift(new u0(n, t)))
      }
      class u0 {
        constructor(e, t = Number.POSITIVE_INFINITY) {
          this.project = e, this.concurrent = t
        }
        call(e, t) {
          return t.subscribe(new d0(e, this.project, this.concurrent))
        }
      }
      class d0 extends Us {
        constructor(e, t, r = Number.POSITIVE_INFINITY) {
          super(e), this.project = t, this.concurrent = r, this.hasCompleted = !1, this.buffer = [], this.active = 0, this.index = 0
        }
        _next(e) {
          this.active < this.concurrent ? this._tryNext(e) : this.buffer.push(e)
        }
        _tryNext(e) {
          let t;
          const r = this.index++;
          try {
            t = this.project(e, r)
          } catch (i) {
            return void this.destination.error(i)
          }
          this.active++, this._innerSub(t)
        }
        _innerSub(e) {
          const t = new Hs(this),
            r = this.destination;
          r.add(t);
          const i = $s(e, t);
          i !== t && r.add(i)
        }
        _complete() {
          this.hasCompleted = !0, 0 === this.active && 0 === this.buffer.length && this.destination.complete(), this.unsubscribe()
        }
        notifyNext(e) {
          this.destination.next(e)
        }
        notifyComplete() {
          const e = this.buffer;
          this.active--, e.length > 0 ? this._next(e.shift()) : 0 === this.active && this.hasCompleted && this.destination.complete()
        }
      }

      function zs(n = Number.POSITIVE_INFINITY) {
        return Ke(Aa, n)
      }

      function mu(n, e) {
        return e ? gu(n, e) : new re(pg(n))
      }

      function _g(...n) {
        let e = Number.POSITIVE_INFINITY,
          t = null,
          r = n[n.length - 1];
        return Ei(r) ? (t = n.pop(), n.length > 1 && "number" == typeof n[n.length - 1] && (e = n.pop())) : "number" == typeof r && (e = n.pop()), null === t && 1 === n.length && n[0] instanceof re ? n[0] : zs(e)(mu(n, t))
      }

      function _u() {
        return function (e) {
          return e.lift(new h0(e))
        }
      }
      class h0 {
        constructor(e) {
          this.connectable = e
        }
        call(e, t) {
          const {
            connectable: r
          } = this;
          r._refCount++;
          const i = new f0(e, r),
            s = t.subscribe(i);
          return i.closed || (i.connection = r.connect()), s
        }
      }
      class f0 extends ue {
        constructor(e, t) {
          super(e), this.connectable = t
        }
        _unsubscribe() {
          const {
            connectable: e
          } = this;
          if (!e) return void(this.connection = null);
          this.connectable = null;
          const t = e._refCount;
          if (t <= 0) return void(this.connection = null);
          if (e._refCount = t - 1, t > 1) return void(this.connection = null);
          const {
            connection: r
          } = this, i = e._connection;
          this.connection = null, i && (!r || i === r) && i.unsubscribe()
        }
      }
      class yg extends re {
        constructor(e, t) {
          super(), this.source = e, this.subjectFactory = t, this._refCount = 0, this._isComplete = !1
        }
        _subscribe(e) {
          return this.getSubject().subscribe(e)
        }
        getSubject() {
          const e = this._subject;
          return (!e || e.isStopped) && (this._subject = this.subjectFactory()), this._subject
        }
        connect() {
          let e = this._connection;
          return e || (this._isComplete = !1, e = this._connection = new ie, e.add(this.source.subscribe(new g0(this.getSubject(), this))), e.closed && (this._connection = null, e = ie.EMPTY)), e
        }
        refCount() {
          return _u()(this)
        }
      }
      const p0 = (() => {
        const n = yg.prototype;
        return {
          operator: {
            value: null
          },
          _refCount: {
            value: 0,
            writable: !0
          },
          _subject: {
            value: null,
            writable: !0
          },
          _connection: {
            value: null,
            writable: !0
          },
          _subscribe: {
            value: n._subscribe
          },
          _isComplete: {
            value: n._isComplete,
            writable: !0
          },
          getSubject: {
            value: n.getSubject
          },
          connect: {
            value: n.connect
          },
          refCount: {
            value: n.refCount
          }
        }
      })();
      class g0 extends hg {
        constructor(e, t) {
          super(e), this.connectable = t
        }
        _error(e) {
          this._unsubscribe(), super._error(e)
        }
        _complete() {
          this.connectable._isComplete = !0, this._unsubscribe(), super._complete()
        }
        _unsubscribe() {
          const e = this.connectable;
          if (e) {
            this.connectable = null;
            const t = e._connection;
            e._refCount = 0, e._subject = null, e._connection = null, t && t.unsubscribe()
          }
        }
      }

      function v0() {
        return new X
      }

      function se(n) {
        for (let e in n)
          if (n[e] === se) return e;
        throw Error("Could not find renamed property on target object.")
      }

      function yu(n, e) {
        for (const t in e) e.hasOwnProperty(t) && !n.hasOwnProperty(t) && (n[t] = e[t])
      }

      function G(n) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) return "[" + n.map(G).join(", ") + "]";
        if (null == n) return "" + n;
        if (n.overriddenName) return `${n.overriddenName}`;
        if (n.name) return `${n.name}`;
        const e = n.toString();
        if (null == e) return "" + e;
        const t = e.indexOf("\n");
        return -1 === t ? e : e.substring(0, t)
      }

      function vu(n, e) {
        return null == n || "" === n ? null === e ? "" : e : null == e || "" === e ? n : n + " " + e
      }
      const C0 = se({
        __forward_ref__: se
      });

      function Ra(n) {
        return n.__forward_ref__ = Ra, n.toString = function () {
          return G(this())
        }, n
      }

      function I(n) {
        return function (n) {
          return "function" == typeof n && n.hasOwnProperty(C0) && n.__forward_ref__ === Ra
        }(n) ? n() : n
      }
      class xr extends Error {
        constructor(e, t) {
          super(function (n, e) {
            return `${n?`NG0${n}: `:""}${e}`
          }(e, t)), this.code = e
        }
      }

      function it(n) {
        return "function" == typeof n ? n.name || n.toString() : "object" == typeof n && null != n && "function" == typeof n.type ? n.type.name || n.type.toString() : function (n) {
          return "string" == typeof n ? n : null == n ? "" : String(n)
        }(n)
      }

      function xa(n, e) {
        const t = e ? ` in ${e}` : "";
        throw new xr("201", `No provider for ${it(n)} found${t}`)
      }

      function Ct(n, e) {
        null == n && function (n, e, t, r) {
          throw new Error(`ASSERTION ERROR: ${n}` + (null == r ? "" : ` [Expected=> ${t} ${r} ${e} <=Actual]`))
        }(e, n, null, "!=")
      }

      function M(n) {
        return {
          token: n.token,
          providedIn: n.providedIn || null,
          factory: n.factory,
          value: void 0
        }
      }

      function de(n) {
        return {
          providers: n.providers || [],
          imports: n.imports || []
        }
      }

      function $n(n) {
        return bg(n, Oa) || bg(n, Eg)
      }

      function bg(n, e) {
        return n.hasOwnProperty(e) ? n[e] : null
      }

      function Cg(n) {
        return n && (n.hasOwnProperty(Cu) || n.hasOwnProperty(A0)) ? n[Cu] : null
      }
      const Oa = se({
          \u0275prov: se
        }),
        Cu = se({
          \u0275inj: se
        }),
        Eg = se({
          ngInjectableDef: se
        }),
        A0 = se({
          ngInjectorDef: se
        });
      var x = (() => ((x = x || {})[x.Default = 0] = "Default", x[x.Host = 1] = "Host", x[x.Self = 2] = "Self", x[x.SkipSelf = 4] = "SkipSelf", x[x.Optional = 8] = "Optional", x))();
      let Eu;

      function ur(n) {
        const e = Eu;
        return Eu = n, e
      }

      function wg(n, e, t) {
        const r = $n(n);
        return r && "root" == r.providedIn ? void 0 === r.value ? r.value = r.factory() : r.value : t & x.Optional ? null : void 0 !== e ? e : void xa(G(n), "Injector")
      }

      function dr(n) {
        return {
          toString: n
        }.toString()
      }
      var Ot = (() => ((Ot = Ot || {})[Ot.OnPush = 0] = "OnPush", Ot[Ot.Default = 1] = "Default", Ot))(),
        Oe = (() => ((Oe = Oe || {})[Oe.Emulated = 0] = "Emulated", Oe[Oe.None = 2] = "None", Oe[Oe.ShadowDom = 3] = "ShadowDom", Oe))();
      const R0 = "undefined" != typeof globalThis && globalThis,
        x0 = "undefined" != typeof window && window,
        O0 = "undefined" != typeof self && "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && self,
        oe = R0 || "undefined" != typeof global && global || x0 || O0,
        wi = {},
        fe = [],
        ka = se({
          \u0275cmp: se
        }),
        wu = se({
          \u0275dir: se
        }),
        Du = se({
          \u0275pipe: se
        }),
        Dg = se({
          \u0275mod: se
        }),
        k0 = se({
          \u0275loc: se
        }),
        zn = se({
          \u0275fac: se
        }),
        Ws = se({
          __NG_ELEMENT_ID__: se
        });
      let P0 = 0;

      function ke(n) {
        return dr(() => {
          const t = {},
            r = {
              type: n.type,
              providersResolver: null,
              decls: n.decls,
              vars: n.vars,
              factory: null,
              template: n.template || null,
              consts: n.consts || null,
              ngContentSelectors: n.ngContentSelectors,
              hostBindings: n.hostBindings || null,
              hostVars: n.hostVars || 0,
              hostAttrs: n.hostAttrs || null,
              contentQueries: n.contentQueries || null,
              declaredInputs: t,
              inputs: null,
              outputs: null,
              exportAs: n.exportAs || null,
              onPush: n.changeDetection === Ot.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: n.selectors || fe,
              viewQuery: n.viewQuery || null,
              features: n.features || null,
              data: n.data || {},
              encapsulation: n.encapsulation || Oe.Emulated,
              id: "c",
              styles: n.styles || fe,
              _: null,
              setInput: null,
              schemas: n.schemas || null,
              tView: null
            },
            i = n.directives,
            s = n.features,
            o = n.pipes;
          return r.id += P0++, r.inputs = Ag(n.inputs, t), r.outputs = Ag(n.outputs), s && s.forEach(a => a(r)), r.directiveDefs = i ? () => ("function" == typeof i ? i() : i).map(Sg) : null, r.pipeDefs = o ? () => ("function" == typeof o ? o() : o).map(Tg) : null, r
        })
      }

      function Sg(n) {
        return st(n) || function (n) {
          return n[wu] || null
        }(n)
      }

      function Tg(n) {
        return function (n) {
          return n[Du] || null
        }(n)
      }
      const Mg = {};

      function ge(n) {
        return dr(() => {
          const e = {
            type: n.type,
            bootstrap: n.bootstrap || fe,
            declarations: n.declarations || fe,
            imports: n.imports || fe,
            exports: n.exports || fe,
            transitiveCompileScopes: null,
            schemas: n.schemas || null,
            id: n.id || null
          };
          return null != n.id && (Mg[n.id] = n.type), e
        })
      }

      function Ag(n, e) {
        if (null == n) return wi;
        const t = {};
        for (const r in n)
          if (n.hasOwnProperty(r)) {
            let i = n[r],
              s = i;
            Array.isArray(i) && (s = i[1], i = i[0]), t[i] = r, e && (e[i] = s)
          } return t
      }
      const ee = ke;

      function st(n) {
        return n[ka] || null
      }

      function kt(n, e) {
        const t = n[Dg] || null;
        if (!t && !0 === e) throw new Error(`Type ${G(n)} does not have '\u0275mod' property.`);
        return t
      }
      const W = 11;

      function wn(n) {
        return Array.isArray(n) && "object" == typeof n[1]
      }

      function sn(n) {
        return Array.isArray(n) && !0 === n[1]
      }

      function Mu(n) {
        return 0 != (8 & n.flags)
      }

      function La(n) {
        return 2 == (2 & n.flags)
      }

      function on(n) {
        return null !== n.template
      }

      function H0(n) {
        return 0 != (512 & n[2])
      }

      function Fr(n, e) {
        return n.hasOwnProperty(zn) ? n[zn] : null
      }
      class Rg {
        constructor(e, t, r) {
          this.previousValue = e, this.currentValue = t, this.firstChange = r
        }
        isFirstChange() {
          return this.firstChange
        }
      }

      function xg(n) {
        return n.type.prototype.ngOnChanges && (n.setInput = W0), z0
      }

      function z0() {
        const n = kg(this),
          e = null == n ? void 0 : n.current;
        if (e) {
          const t = n.previous;
          if (t === wi) n.previous = e;
          else
            for (let r in e) t[r] = e[r];
          n.current = null, this.ngOnChanges(e)
        }
      }

      function W0(n, e, t, r) {
        const i = kg(n) || function (n, e) {
            return n[Og] = e
          }(n, {
            previous: wi,
            current: null
          }),
          s = i.current || (i.current = {}),
          o = i.previous,
          a = this.declaredInputs[t],
          l = o[a];
        s[a] = new Rg(l && l.currentValue, e, o === wi), n[r] = e
      }
      const Og = "__ngSimpleChanges__";

      function kg(n) {
        return n[Og] || null
      }
      let Ru;

      function Se(n) {
        return !!n.listen
      }
      const Fg = {
        createRenderer: (n, e) => void 0 !== Ru ? Ru : "undefined" != typeof document ? document : void 0
      };

      function Pe(n) {
        for (; Array.isArray(n);) n = n[0];
        return n
      }

      function Ft(n, e) {
        return Pe(e[n.index])
      }

      function wt(n, e) {
        const t = e[n];
        return wn(t) ? t : t[0]
      }

      function Lg(n) {
        return 4 == (4 & n[2])
      }

      function ku(n) {
        return 128 == (128 & n[2])
      }

      function fr(n, e) {
        return null == e ? null : n[e]
      }

      function Vg(n) {
        n[18] = 0
      }

      function Pu(n, e) {
        n[5] += e;
        let t = n,
          r = n[3];
        for (; null !== r && (1 === e && 1 === t[5] || -1 === e && 0 === t[5]);) r[5] += e, t = r, r = r[3]
      }
      const V = {
        lFrame: Gg(null),
        bindingsEnabled: !0,
        isInCheckNoChangesMode: !1
      };

      function Bg() {
        return V.bindingsEnabled
      }

      function C() {
        return V.lFrame.lView
      }

      function te() {
        return V.lFrame.tView
      }

      function Ve() {
        let n = Hg();
        for (; null !== n && 64 === n.type;) n = n.parent;
        return n
      }

      function Hg() {
        return V.lFrame.currentTNode
      }

      function Sn(n, e) {
        const t = V.lFrame;
        t.currentTNode = n, t.isParent = e
      }

      function Nu() {
        return V.lFrame.isParent
      }

      function Fu() {
        V.lFrame.isParent = !1
      }

      function ja() {
        return V.isInCheckNoChangesMode
      }

      function Ha(n) {
        V.isInCheckNoChangesMode = n
      }

      function oT(n, e) {
        const t = V.lFrame;
        t.bindingIndex = t.bindingRootIndex = n, Lu(e)
      }

      function Lu(n) {
        V.lFrame.currentDirectiveIndex = n
      }

      function zg() {
        return V.lFrame.currentQueryIndex
      }

      function Bu(n) {
        V.lFrame.currentQueryIndex = n
      }

      function lT(n) {
        const e = n[1];
        return 2 === e.type ? e.declTNode : 1 === e.type ? n[6] : null
      }

      function Wg(n, e, t) {
        if (t & x.SkipSelf) {
          let i = e,
            s = n;
          for (; !(i = i.parent, null !== i || t & x.Host || (i = lT(s), null === i || (s = s[15], 10 & i.type))););
          if (null === i) return !1;
          e = i, n = s
        }
        const r = V.lFrame = qg();
        return r.currentTNode = e, r.lView = n, !0
      }

      function Ua(n) {
        const e = qg(),
          t = n[1];
        V.lFrame = e, e.currentTNode = t.firstChild, e.lView = n, e.tView = t, e.contextLView = n, e.bindingIndex = t.bindingStartIndex, e.inI18n = !1
      }

      function qg() {
        const n = V.lFrame,
          e = null === n ? null : n.child;
        return null === e ? Gg(n) : e
      }

      function Gg(n) {
        const e = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: n,
          child: null,
          inI18n: !1
        };
        return null !== n && (n.child = e), e
      }

      function Kg() {
        const n = V.lFrame;
        return V.lFrame = n.parent, n.currentTNode = null, n.lView = null, n
      }
      const Qg = Kg;

      function $a() {
        const n = Kg();
        n.isParent = !0, n.tView = null, n.selectedIndex = -1, n.contextLView = null, n.elementDepthCount = 0, n.currentDirectiveIndex = -1, n.currentNamespace = null, n.bindingRootIndex = -1, n.bindingIndex = -1, n.currentQueryIndex = 0
      }

      function at() {
        return V.lFrame.selectedIndex
      }

      function pr(n) {
        V.lFrame.selectedIndex = n
      }

      function za(n, e) {
        for (let t = e.directiveStart, r = e.directiveEnd; t < r; t++) {
          const s = n.data[t].type.prototype,
            {
              ngAfterContentInit: o,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: c,
              ngOnDestroy: u
            } = s;
          o && (n.contentHooks || (n.contentHooks = [])).push(-t, o), a && ((n.contentHooks || (n.contentHooks = [])).push(t, a), (n.contentCheckHooks || (n.contentCheckHooks = [])).push(t, a)), l && (n.viewHooks || (n.viewHooks = [])).push(-t, l), c && ((n.viewHooks || (n.viewHooks = [])).push(t, c), (n.viewCheckHooks || (n.viewCheckHooks = [])).push(t, c)), null != u && (n.destroyHooks || (n.destroyHooks = [])).push(t, u)
        }
      }

      function Wa(n, e, t) {
        Yg(n, e, 3, t)
      }

      function qa(n, e, t, r) {
        (3 & n[2]) === t && Yg(n, e, t, r)
      }

      function ju(n, e) {
        let t = n[2];
        (3 & t) === e && (t &= 2047, t += 1, n[2] = t)
      }

      function Yg(n, e, t, r) {
        const s = null != r ? r : -1,
          o = e.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & n[18] : 0; l < o; l++)
          if ("number" == typeof e[l + 1]) {
            if (a = e[l], null != r && a >= r) break
          } else e[l] < 0 && (n[18] += 65536), (a < s || -1 == s) && (_T(n, t, e, l), n[18] = (4294901760 & n[18]) + l + 2), l++
      }

      function _T(n, e, t, r) {
        const i = t[r] < 0,
          s = t[r + 1],
          a = n[i ? -t[r] : t[r]];
        if (i) {
          if (n[2] >> 11 < n[18] >> 16 && (3 & n[2]) === e) {
            n[2] += 2048;
            try {
              s.call(a)
            } finally {}
          }
        } else try {
          s.call(a)
        } finally {}
      }
      class Ys {
        constructor(e, t, r) {
          this.factory = e, this.resolving = !1, this.canSeeViewProviders = t, this.injectImpl = r
        }
      }

      function Ga(n, e, t) {
        const r = Se(n);
        let i = 0;
        for (; i < t.length;) {
          const s = t[i];
          if ("number" == typeof s) {
            if (0 !== s) break;
            i++;
            const o = t[i++],
              a = t[i++],
              l = t[i++];
            r ? n.setAttribute(e, a, l, o) : e.setAttributeNS(o, a, l)
          } else {
            const o = s,
              a = t[++i];
            Uu(o) ? r && n.setProperty(e, o, a) : r ? n.setAttribute(e, o, a) : e.setAttribute(o, a), i++
          }
        }
        return i
      }

      function Zg(n) {
        return 3 === n || 4 === n || 6 === n
      }

      function Uu(n) {
        return 64 === n.charCodeAt(0)
      }

      function Ka(n, e) {
        if (null !== e && 0 !== e.length)
          if (null === n || 0 === n.length) n = e.slice();
          else {
            let t = -1;
            for (let r = 0; r < e.length; r++) {
              const i = e[r];
              "number" == typeof i ? t = i : 0 === t || Xg(n, t, i, null, -1 === t || 2 === t ? e[++r] : null)
            }
          } return n
      }

      function Xg(n, e, t, r, i) {
        let s = 0,
          o = n.length;
        if (-1 === e) o = -1;
        else
          for (; s < n.length;) {
            const a = n[s++];
            if ("number" == typeof a) {
              if (a === e) {
                o = -1;
                break
              }
              if (a > e) {
                o = s - 1;
                break
              }
            }
          }
        for (; s < n.length;) {
          const a = n[s];
          if ("number" == typeof a) break;
          if (a === t) {
            if (null === r) return void(null !== i && (n[s + 1] = i));
            if (r === n[s + 1]) return void(n[s + 2] = i)
          }
          s++, null !== r && s++, null !== i && s++
        } - 1 !== o && (n.splice(o, 0, e), s = o + 1), n.splice(s++, 0, t), null !== r && n.splice(s++, 0, r), null !== i && n.splice(s++, 0, i)
      }

      function Jg(n) {
        return -1 !== n
      }

      function Ri(n) {
        return 32767 & n
      }

      function xi(n, e) {
        let t = function (n) {
            return n >> 16
          }(n),
          r = e;
        for (; t > 0;) r = r[15], t--;
        return r
      }
      let $u = !0;

      function Qa(n) {
        const e = $u;
        return $u = n, e
      }
      let wT = 0;

      function Xs(n, e) {
        const t = Wu(n, e);
        if (-1 !== t) return t;
        const r = e[1];
        r.firstCreatePass && (n.injectorIndex = e.length, zu(r.data, n), zu(e, null), zu(r.blueprint, null));
        const i = Ya(n, e),
          s = n.injectorIndex;
        if (Jg(i)) {
          const o = Ri(i),
            a = xi(i, e),
            l = a[1].data;
          for (let c = 0; c < 8; c++) e[s + c] = a[o + c] | l[o + c]
        }
        return e[s + 8] = i, s
      }

      function zu(n, e) {
        n.push(0, 0, 0, 0, 0, 0, 0, 0, e)
      }

      function Wu(n, e) {
        return -1 === n.injectorIndex || n.parent && n.parent.injectorIndex === n.injectorIndex || null === e[n.injectorIndex + 8] ? -1 : n.injectorIndex
      }

      function Ya(n, e) {
        if (n.parent && -1 !== n.parent.injectorIndex) return n.parent.injectorIndex;
        let t = 0,
          r = null,
          i = e;
        for (; null !== i;) {
          const s = i[1],
            o = s.type;
          if (r = 2 === o ? s.declTNode : 1 === o ? i[6] : null, null === r) return -1;
          if (t++, i = i[15], -1 !== r.injectorIndex) return r.injectorIndex | t << 16
        }
        return -1
      }

      function Za(n, e, t) {
        ! function (n, e, t) {
          let r;
          "string" == typeof t ? r = t.charCodeAt(0) || 0 : t.hasOwnProperty(Ws) && (r = t[Ws]), null == r && (r = t[Ws] = wT++);
          const i = 255 & r;
          e.data[n + (i >> 5)] |= 1 << i
        }(n, e, t)
      }

      function nm(n, e, t) {
        if (t & x.Optional) return n;
        xa(e, "NodeInjector")
      }

      function rm(n, e, t, r) {
        if (t & x.Optional && void 0 === r && (r = null), 0 == (t & (x.Self | x.Host))) {
          const i = n[9],
            s = ur(void 0);
          try {
            return i ? i.get(e, r, t & x.Optional) : wg(e, r, t & x.Optional)
          } finally {
            ur(s)
          }
        }
        return nm(r, e, t)
      }

      function im(n, e, t, r = x.Default, i) {
        if (null !== n) {
          const s = function (n) {
            if ("string" == typeof n) return n.charCodeAt(0) || 0;
            const e = n.hasOwnProperty(Ws) ? n[Ws] : void 0;
            return "number" == typeof e ? e >= 0 ? 255 & e : TT : e
          }(t);
          if ("function" == typeof s) {
            if (!Wg(e, n, r)) return r & x.Host ? nm(i, t, r) : rm(e, t, r, i);
            try {
              const o = s(r);
              if (null != o || r & x.Optional) return o;
              xa(t)
            } finally {
              Qg()
            }
          } else if ("number" == typeof s) {
            let o = null,
              a = Wu(n, e),
              l = -1,
              c = r & x.Host ? e[16][6] : null;
            for ((-1 === a || r & x.SkipSelf) && (l = -1 === a ? Ya(n, e) : e[a + 8], -1 !== l && am(r, !1) ? (o = e[1], a = Ri(l), e = xi(l, e)) : a = -1); - 1 !== a;) {
              const u = e[1];
              if (om(s, a, u.data)) {
                const d = MT(a, e, t, o, r, c);
                if (d !== sm) return d
              }
              l = e[a + 8], -1 !== l && am(r, e[1].data[a + 8] === c) && om(s, a, e) ? (o = u, a = Ri(l), e = xi(l, e)) : a = -1
            }
          }
        }
        return rm(e, t, r, i)
      }
      const sm = {};

      function TT() {
        return new Oi(Ve(), C())
      }

      function MT(n, e, t, r, i, s) {
        const o = e[1],
          a = o.data[n + 8],
          u = Xa(a, o, t, null == r ? La(a) && $u : r != o && 0 != (3 & a.type), i & x.Host && s === a);
        return null !== u ? Js(e, o, u, a) : sm
      }

      function Xa(n, e, t, r, i) {
        const s = n.providerIndexes,
          o = e.data,
          a = 1048575 & s,
          l = n.directiveStart,
          u = s >> 20,
          h = i ? a + u : n.directiveEnd;
        for (let f = r ? a : a + u; f < h; f++) {
          const p = o[f];
          if (f < l && t === p || f >= l && p.type === t) return f
        }
        if (i) {
          const f = o[l];
          if (f && on(f) && f.type === t) return l
        }
        return null
      }

      function Js(n, e, t, r) {
        let i = n[t];
        const s = e.data;
        if (function (n) {
            return n instanceof Ys
          }(i)) {
          const o = i;
          o.resolving && function (n, e) {
            throw new xr("200", `Circular dependency in DI detected for ${n}`)
          }(it(s[t]));
          const a = Qa(o.canSeeViewProviders);
          o.resolving = !0;
          const l = o.injectImpl ? ur(o.injectImpl) : null;
          Wg(n, r, x.Default);
          try {
            i = n[t] = o.factory(void 0, s, n, r), e.firstCreatePass && t >= r.directiveStart && function (n, e, t) {
              const {
                ngOnChanges: r,
                ngOnInit: i,
                ngDoCheck: s
              } = e.type.prototype;
              if (r) {
                const o = xg(e);
                (t.preOrderHooks || (t.preOrderHooks = [])).push(n, o), (t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(n, o)
              }
              i && (t.preOrderHooks || (t.preOrderHooks = [])).push(0 - n, i), s && ((t.preOrderHooks || (t.preOrderHooks = [])).push(n, s), (t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(n, s))
            }(t, s[t], e)
          } finally {
            null !== l && ur(l), Qa(a), o.resolving = !1, Qg()
          }
        }
        return i
      }

      function om(n, e, t) {
        return !!(t[e + (n >> 5)] & 1 << n)
      }

      function am(n, e) {
        return !(n & x.Self || n & x.Host && e)
      }
      class Oi {
        constructor(e, t) {
          this._tNode = e, this._lView = t
        }
        get(e, t, r) {
          return im(this._tNode, this._lView, e, r, t)
        }
      }
      const Pi = "__parameters__";

      function Lr(n, e, t) {
        return dr(() => {
          const r = function (n) {
            return function (...t) {
              if (n) {
                const r = n(...t);
                for (const i in r) this[i] = r[i]
              }
            }
          }(e);

          function i(...s) {
            if (this instanceof i) return r.apply(this, s), this;
            const o = new i(...s);
            return a.annotation = o, a;

            function a(l, c, u) {
              const d = l.hasOwnProperty(Pi) ? l[Pi] : Object.defineProperty(l, Pi, {
                value: []
              })[Pi];
              for (; d.length <= u;) d.push(null);
              return (d[u] = d[u] || []).push(o), l
            }
          }
          return t && (i.prototype = Object.create(t.prototype)), i.prototype.ngMetadataName = n, i.annotationCls = i, i
        })
      }
      class P {
        constructor(e, t) {
          this._desc = e, this.ngMetadataName = "InjectionToken", this.\u0275prov = void 0, "number" == typeof t ? this.__NG_ELEMENT_ID__ = t : void 0 !== t && (this.\u0275prov = M({
            token: this,
            providedIn: t.providedIn || "root",
            factory: t.factory
          }))
        }
        toString() {
          return `InjectionToken ${this._desc}`
        }
      }
      const xT = new P("AnalyzeForEntryComponents"),
        el = Function;

      function Lt(n, e) {
        void 0 === e && (e = n);
        for (let t = 0; t < n.length; t++) {
          let r = n[t];
          Array.isArray(r) ? (e === n && (e = n.slice(0, t)), Lt(r, e)) : e !== n && e.push(r)
        }
        return e
      }

      function Mn(n, e) {
        n.forEach(t => Array.isArray(t) ? Mn(t, e) : e(t))
      }

      function nl(n, e, t) {
        e >= n.length ? n.push(t) : n.splice(e, 0, t)
      }

      function Vr(n, e) {
        return e >= n.length - 1 ? n.pop() : n.splice(e, 1)[0]
      }

      function mr(n, e) {
        const t = [];
        for (let r = 0; r < n; r++) t.push(e);
        return t
      }

      function Dt(n, e, t) {
        let r = Fi(n, e);
        return r >= 0 ? n[1 | r] = t : (r = ~r, function (n, e, t, r) {
          let i = n.length;
          if (i == e) n.push(t, r);
          else if (1 === i) n.push(r, n[0]), n[0] = t;
          else {
            for (i--, n.push(n[i - 1], n[i]); i > e;) n[i] = n[i - 2], i--;
            n[e] = t, n[e + 1] = r
          }
        }(n, r, e, t)), r
      }

      function Ku(n, e) {
        const t = Fi(n, e);
        if (t >= 0) return n[1 | t]
      }

      function Fi(n, e) {
        return function (n, e, t) {
          let r = 0,
            i = n.length >> t;
          for (; i !== r;) {
            const s = r + (i - r >> 1),
              o = n[s << t];
            if (e === o) return s << t;
            o > e ? i = s : r = s + 1
          }
          return ~(i << t)
        }(n, e, 1)
      }
      const io = {},
        Yu = "__NG_DI_FLAG__",
        Li = "ngTempTokenPath",
        HT = /\n/gm,
        Zu = "__source",
        Xu = se({
          provide: String,
          useValue: se
        });
      let so;

      function Vi(n) {
        const e = so;
        return so = n, e
      }

      function $T(n, e = x.Default) {
        if (void 0 === so) throw new Error("inject() must be called from an injection context");
        return null === so ? wg(n, void 0, e) : so.get(n, e & x.Optional ? null : void 0, e)
      }

      function _(n, e = x.Default) {
        return (Eu || $T)(I(n), e)
      }
      const fm = _;

      function Br(n) {
        const e = [];
        for (let t = 0; t < n.length; t++) {
          const r = I(n[t]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new Error("Arguments array must have arguments.");
            let i, s = x.Default;
            for (let o = 0; o < r.length; o++) {
              const a = r[o],
                l = zT(a);
              "number" == typeof l ? -1 === l ? i = a.token : s |= l : i = a
            }
            e.push(_(i, s))
          } else e.push(_(r))
        }
        return e
      }

      function oo(n, e) {
        return n[Yu] = e, n.prototype[Yu] = e, n
      }

      function zT(n) {
        return n[Yu]
      }

      function pm(n, e, t, r) {
        const i = n[Li];
        throw e[Zu] && i.unshift(e[Zu]), n.message = function (n, e, t, r = null) {
          n = n && "\n" === n.charAt(0) && "\u0275" == n.charAt(1) ? n.substr(2) : n;
          let i = G(e);
          if (Array.isArray(e)) i = e.map(G).join(" -> ");
          else if ("object" == typeof e) {
            let s = [];
            for (let o in e)
              if (e.hasOwnProperty(o)) {
                let a = e[o];
                s.push(o + ":" + ("string" == typeof a ? JSON.stringify(a) : G(a)))
              } i = `{${s.join(", ")}}`
          }
          return `${t}${r?"("+r+")":""}[${i}]: ${n.replace(HT,"\n  ")}`
        }("\n" + n.message, i, t, r), n.ngTokenPath = i, n[Li] = null, n
      }
      const Bi = oo(Lr("Inject", n => ({
          token: n
        })), -1),
        mt = oo(Lr("Optional"), 8),
        _r = oo(Lr("SkipSelf"), 4);
      const km = "__ngContext__";

      function Ze(n, e) {
        n[km] = e
      }

      function ld(n) {
        const e = function (n) {
          return n[km] || null
        }(n);
        return e ? Array.isArray(e) ? e : e.lView : null
      }

      function cl(n) {
        return n.ngOriginalError
      }

      function LM(n, ...e) {
        n.error(...e)
      }
      class Hr {
        constructor() {
          this._console = console
        }
        handleError(e) {
          const t = this._findOriginalError(e),
            r = this._findContext(e),
            i = function (n) {
              return n && n.ngErrorLogger || LM
            }(e);
          i(this._console, "ERROR", e), t && i(this._console, "ORIGINAL ERROR", t), r && i(this._console, "ERROR CONTEXT", r)
        }
        _findContext(e) {
          return e ? function (n) {
            return n.ngDebugContext
          }(e) || this._findContext(cl(e)) : null
        }
        _findOriginalError(e) {
          let t = e && cl(e);
          for (; t && cl(t);) t = cl(t);
          return t || null
        }
      }
      const Um = (() => ("undefined" != typeof requestAnimationFrame && requestAnimationFrame || setTimeout).bind(oe))();

      function Rn(n) {
        return n instanceof Function ? n() : n
      }
      var Tt = (() => ((Tt = Tt || {})[Tt.Important = 1] = "Important", Tt[Tt.DashCase = 2] = "DashCase", Tt))();

      function dd(n, e) {
        return undefined(n, e)
      }

      function fo(n) {
        const e = n[3];
        return sn(e) ? e[3] : e
      }

      function hd(n) {
        return Gm(n[13])
      }

      function fd(n) {
        return Gm(n[4])
      }

      function Gm(n) {
        for (; null !== n && !sn(n);) n = n[4];
        return n
      }

      function $i(n, e, t, r, i) {
        if (null != r) {
          let s, o = !1;
          sn(r) ? s = r : wn(r) && (o = !0, r = r[0]);
          const a = Pe(r);
          0 === n && null !== t ? null == i ? Jm(e, t, a) : Ur(e, t, a, i || null, !0) : 1 === n && null !== t ? Ur(e, t, a, i || null, !0) : 2 === n ? function (n, e, t) {
            const r = dl(n, e);
            r && function (n, e, t, r) {
              Se(n) ? n.removeChild(e, t, r) : e.removeChild(t)
            }(n, r, e, t)
          }(e, a, o) : 3 === n && e.destroyNode(a), null != s && function (n, e, t, r, i) {
            const s = t[7];
            s !== Pe(t) && $i(e, n, r, s, i);
            for (let a = 10; a < t.length; a++) {
              const l = t[a];
              po(l[1], l, n, e, r, s)
            }
          }(e, n, s, t, i)
        }
      }

      function gd(n, e, t) {
        return Se(n) ? n.createElement(e, t) : null === t ? n.createElement(e) : n.createElementNS(t, e)
      }

      function Qm(n, e) {
        const t = n[9],
          r = t.indexOf(e),
          i = e[3];
        1024 & e[2] && (e[2] &= -1025, Pu(i, -1)), t.splice(r, 1)
      }

      function md(n, e) {
        if (n.length <= 10) return;
        const t = 10 + e,
          r = n[t];
        if (r) {
          const i = r[17];
          null !== i && i !== n && Qm(i, r), e > 0 && (n[t - 1][4] = r[4]);
          const s = Vr(n, 10 + e);
          ! function (n, e) {
            po(n, e, e[W], 2, null, null), e[0] = null, e[6] = null
          }(r[1], r);
          const o = s[19];
          null !== o && o.detachView(s[1]), r[3] = null, r[4] = null, r[2] &= -129
        }
        return r
      }

      function Ym(n, e) {
        if (!(256 & e[2])) {
          const t = e[W];
          Se(t) && t.destroyNode && po(n, e, t, 3, null, null),
            function (n) {
              let e = n[13];
              if (!e) return _d(n[1], n);
              for (; e;) {
                let t = null;
                if (wn(e)) t = e[13];
                else {
                  const r = e[10];
                  r && (t = r)
                }
                if (!t) {
                  for (; e && !e[4] && e !== n;) wn(e) && _d(e[1], e), e = e[3];
                  null === e && (e = n), wn(e) && _d(e[1], e), t = e && e[4]
                }
                e = t
              }
            }(e)
        }
      }

      function _d(n, e) {
        if (!(256 & e[2])) {
          e[2] &= -129, e[2] |= 256,
            function (n, e) {
              let t;
              if (null != n && null != (t = n.destroyHooks))
                for (let r = 0; r < t.length; r += 2) {
                  const i = e[t[r]];
                  if (!(i instanceof Ys)) {
                    const s = t[r + 1];
                    if (Array.isArray(s))
                      for (let o = 0; o < s.length; o += 2) {
                        const a = i[s[o]],
                          l = s[o + 1];
                        try {
                          l.call(a)
                        } finally {}
                      } else try {
                        s.call(i)
                      } finally {}
                  }
                }
            }(n, e),
            function (n, e) {
              const t = n.cleanup,
                r = e[7];
              let i = -1;
              if (null !== t)
                for (let s = 0; s < t.length - 1; s += 2)
                  if ("string" == typeof t[s]) {
                    const o = t[s + 1],
                      a = "function" == typeof o ? o(e) : Pe(e[o]),
                      l = r[i = t[s + 2]],
                      c = t[s + 3];
                    "boolean" == typeof c ? a.removeEventListener(t[s], l, c) : c >= 0 ? r[i = c]() : r[i = -c].unsubscribe(), s += 2
                  } else {
                    const o = r[i = t[s + 1]];
                    t[s].call(o)
                  } if (null !== r) {
                for (let s = i + 1; s < r.length; s++) r[s]();
                e[7] = null
              }
            }(n, e), 1 === e[1].type && Se(e[W]) && e[W].destroy();
          const t = e[17];
          if (null !== t && sn(e[3])) {
            t !== e[3] && Qm(t, e);
            const r = e[19];
            null !== r && r.detachView(n)
          }
        }
      }

      function Zm(n, e, t) {
        return function (n, e, t) {
          let r = e;
          for (; null !== r && 40 & r.type;) r = (e = r).parent;
          if (null === r) return t[0];
          if (2 & r.flags) {
            const i = n.data[r.directiveStart].encapsulation;
            if (i === Oe.None || i === Oe.Emulated) return null
          }
          return Ft(r, t)
        }(n, e.parent, t)
      }

      function Ur(n, e, t, r, i) {
        Se(n) ? n.insertBefore(e, t, r, i) : e.insertBefore(t, r, i)
      }

      function Jm(n, e, t) {
        Se(n) ? n.appendChild(e, t) : e.appendChild(t)
      }

      function e_(n, e, t, r, i) {
        null !== r ? Ur(n, e, t, r, i) : Jm(n, e, t)
      }

      function dl(n, e) {
        return Se(n) ? n.parentNode(e) : e.parentNode
      }

      function t_(n, e, t) {
        return r_(n, e, t)
      }
      let r_ = function (n, e, t) {
        return 40 & n.type ? Ft(n, t) : null
      };

      function hl(n, e, t, r) {
        const i = Zm(n, r, e),
          s = e[W],
          a = t_(r.parent || e[6], r, e);
        if (null != i)
          if (Array.isArray(t))
            for (let l = 0; l < t.length; l++) e_(s, i, t[l], a, !1);
          else e_(s, i, t, a, !1)
      }

      function fl(n, e) {
        if (null !== e) {
          const t = e.type;
          if (3 & t) return Ft(e, n);
          if (4 & t) return vd(-1, n[e.index]);
          if (8 & t) {
            const r = e.child;
            if (null !== r) return fl(n, r); {
              const i = n[e.index];
              return sn(i) ? vd(-1, i) : Pe(i)
            }
          }
          if (32 & t) return dd(e, n)() || Pe(n[e.index]); {
            const r = s_(n, e);
            return null !== r ? Array.isArray(r) ? r[0] : fl(fo(n[16]), r) : fl(n, e.next)
          }
        }
        return null
      }

      function s_(n, e) {
        return null !== e ? n[16][6].projection[e.projection] : null
      }

      function vd(n, e) {
        const t = 10 + n + 1;
        if (t < e.length) {
          const r = e[t],
            i = r[1].firstChild;
          if (null !== i) return fl(r, i)
        }
        return e[7]
      }

      function bd(n, e, t, r, i, s, o) {
        for (; null != t;) {
          const a = r[t.index],
            l = t.type;
          if (o && 0 === e && (a && Ze(Pe(a), r), t.flags |= 4), 64 != (64 & t.flags))
            if (8 & l) bd(n, e, t.child, r, i, s, !1), $i(e, n, i, a, s);
            else if (32 & l) {
            const c = dd(t, r);
            let u;
            for (; u = c();) $i(e, n, i, u, s);
            $i(e, n, i, a, s)
          } else 16 & l ? a_(n, e, r, t, i, s) : $i(e, n, i, a, s);
          t = o ? t.projectionNext : t.next
        }
      }

      function po(n, e, t, r, i, s) {
        bd(t, r, n.firstChild, e, i, s, !1)
      }

      function a_(n, e, t, r, i, s) {
        const o = t[16],
          l = o[6].projection[r.projection];
        if (Array.isArray(l))
          for (let c = 0; c < l.length; c++) $i(e, n, i, l[c], s);
        else bd(n, e, l, o[3], i, s, !0)
      }

      function l_(n, e, t) {
        Se(n) ? n.setAttribute(e, "style", t) : e.style.cssText = t
      }

      function Cd(n, e, t) {
        Se(n) ? "" === t ? n.removeAttribute(e, "class") : n.setAttribute(e, "class", t) : e.className = t
      }

      function c_(n, e, t) {
        let r = n.length;
        for (;;) {
          const i = n.indexOf(e, t);
          if (-1 === i) return i;
          if (0 === i || n.charCodeAt(i - 1) <= 32) {
            const s = e.length;
            if (i + s === r || n.charCodeAt(i + s) <= 32) return i
          }
          t = i + 1
        }
      }
      const u_ = "ng-template";

      function cA(n, e, t) {
        let r = 0;
        for (; r < n.length;) {
          let i = n[r++];
          if (t && "class" === i) {
            if (i = n[r], -1 !== c_(i.toLowerCase(), e, 0)) return !0
          } else if (1 === i) {
            for (; r < n.length && "string" == typeof (i = n[r++]);)
              if (i.toLowerCase() === e) return !0;
            return !1
          }
        }
        return !1
      }

      function d_(n) {
        return 4 === n.type && n.value !== u_
      }

      function uA(n, e, t) {
        return e === (4 !== n.type || t ? n.value : u_)
      }

      function dA(n, e, t) {
        let r = 4;
        const i = n.attrs || [],
          s = function (n) {
            for (let e = 0; e < n.length; e++)
              if (Zg(n[e])) return e;
            return n.length
          }(i);
        let o = !1;
        for (let a = 0; a < e.length; a++) {
          const l = e[a];
          if ("number" != typeof l) {
            if (!o)
              if (4 & r) {
                if (r = 2 | 1 & r, "" !== l && !uA(n, l, t) || "" === l && 1 === e.length) {
                  if (an(r)) return !1;
                  o = !0
                }
              } else {
                const c = 8 & r ? l : e[++a];
                if (8 & r && null !== n.attrs) {
                  if (!cA(n.attrs, c, t)) {
                    if (an(r)) return !1;
                    o = !0
                  }
                  continue
                }
                const d = hA(8 & r ? "class" : l, i, d_(n), t);
                if (-1 === d) {
                  if (an(r)) return !1;
                  o = !0;
                  continue
                }
                if ("" !== c) {
                  let h;
                  h = d > s ? "" : i[d + 1].toLowerCase();
                  const f = 8 & r ? h : null;
                  if (f && -1 !== c_(f, c, 0) || 2 & r && c !== h) {
                    if (an(r)) return !1;
                    o = !0
                  }
                }
              }
          } else {
            if (!o && !an(r) && !an(l)) return !1;
            if (o && an(l)) continue;
            o = !1, r = l | 1 & r
          }
        }
        return an(r) || o
      }

      function an(n) {
        return 0 == (1 & n)
      }

      function hA(n, e, t, r) {
        if (null === e) return -1;
        let i = 0;
        if (r || !t) {
          let s = !1;
          for (; i < e.length;) {
            const o = e[i];
            if (o === n) return i;
            if (3 === o || 6 === o) s = !0;
            else {
              if (1 === o || 2 === o) {
                let a = e[++i];
                for (;
                  "string" == typeof a;) a = e[++i];
                continue
              }
              if (4 === o) break;
              if (0 === o) {
                i += 4;
                continue
              }
            }
            i += s ? 1 : 2
          }
          return -1
        }
        return function (n, e) {
          let t = n.indexOf(4);
          if (t > -1)
            for (t++; t < n.length;) {
              const r = n[t];
              if ("number" == typeof r) return -1;
              if (r === e) return t;
              t++
            }
          return -1
        }(e, n)
      }

      function h_(n, e, t = !1) {
        for (let r = 0; r < e.length; r++)
          if (dA(n, e[r], t)) return !0;
        return !1
      }

      function mA(n, e) {
        e: for (let t = 0; t < e.length; t++) {
          const r = e[t];
          if (n.length === r.length) {
            for (let i = 0; i < n.length; i++)
              if (n[i] !== r[i]) continue e;
            return !0
          }
        }
        return !1
      }

      function f_(n, e) {
        return n ? ":not(" + e.trim() + ")" : e
      }

      function _A(n) {
        let e = n[0],
          t = 1,
          r = 2,
          i = "",
          s = !1;
        for (; t < n.length;) {
          let o = n[t];
          if ("string" == typeof o)
            if (2 & r) {
              const a = n[++t];
              i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else 8 & r ? i += "." + o : 4 & r && (i += " " + o);
          else "" !== i && !an(o) && (e += f_(s, i), i = ""), r = o, s = s || !an(r);
          t++
        }
        return "" !== i && (e += f_(s, i)), e
      }
      const j = {};

      function pl(n, e) {
        return n << 17 | e << 2
      }

      function ln(n) {
        return n >> 17 & 32767
      }

      function Ed(n) {
        return 2 | n
      }

      function qn(n) {
        return (131068 & n) >> 2
      }

      function wd(n, e) {
        return -131069 & n | e << 2
      }

      function Dd(n) {
        return 1 | n
      }

      function D_(n, e) {
        const t = n.contentQueries;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) {
            const i = t[r],
              s = t[r + 1];
            if (-1 !== s) {
              const o = n.data[s];
              Bu(i), o.contentQueries(2, e[s], s)
            }
          }
      }

      function go(n, e, t, r, i, s, o, a, l, c) {
        const u = e.blueprint.slice();
        return u[0] = i, u[2] = 140 | r, Vg(u), u[3] = u[15] = n, u[8] = t, u[10] = o || n && n[10], u[W] = a || n && n[W], u[12] = l || n && n[12] || null, u[9] = c || n && n[9] || null, u[6] = s, u[16] = 2 == e.type ? n[16] : u, u
      }

      function zi(n, e, t, r, i) {
        let s = n.data[e];
        if (null === s) s = function (n, e, t, r, i) {
          const s = Hg(),
            o = Nu(),
            l = n.data[e] = function (n, e, t, r, i, s) {
              return {
                type: t,
                index: r,
                insertBeforeIndex: null,
                injectorIndex: e ? e.injectorIndex : -1,
                directiveStart: -1,
                directiveEnd: -1,
                directiveStylingLast: -1,
                propertyBindings: null,
                flags: 0,
                providerIndexes: 0,
                value: i,
                attrs: s,
                mergedAttrs: null,
                localNames: null,
                initialInputs: void 0,
                inputs: null,
                outputs: null,
                tViews: null,
                next: null,
                projectionNext: null,
                child: null,
                parent: e,
                projection: null,
                styles: null,
                stylesWithoutHost: null,
                residualStyles: void 0,
                classes: null,
                classesWithoutHost: null,
                residualClasses: void 0,
                classBindings: 0,
                styleBindings: 0
              }
            }(0, o ? s : s && s.parent, t, e, r, i);
          return null === n.firstChild && (n.firstChild = l), null !== s && (o ? null == s.child && null !== l.parent && (s.child = l) : null === s.next && (s.next = l)), l
        }(n, e, t, r, i), V.lFrame.inI18n && (s.flags |= 64);
        else if (64 & s.type) {
          s.type = t, s.value = r, s.attrs = i;
          const o = function () {
            const n = V.lFrame,
              e = n.currentTNode;
            return n.isParent ? e : e.parent
          }();
          s.injectorIndex = null === o ? -1 : o.injectorIndex
        }
        return Sn(s, !0), s
      }

      function Wi(n, e, t, r) {
        if (0 === t) return -1;
        const i = e.length;
        for (let s = 0; s < t; s++) e.push(r), n.blueprint.push(r), n.data.push(null);
        return i
      }

      function mo(n, e, t) {
        Ua(e);
        try {
          const r = n.viewQuery;
          null !== r && jd(1, r, t);
          const i = n.template;
          null !== i && S_(n, e, i, 1, t), n.firstCreatePass && (n.firstCreatePass = !1), n.staticContentQueries && D_(n, e), n.staticViewQueries && jd(2, n.viewQuery, t);
          const s = n.components;
          null !== s && function (n, e) {
            for (let t = 0; t < e.length; t++) YA(n, e[t])
          }(e, s)
        } catch (r) {
          throw n.firstCreatePass && (n.incompleteFirstPass = !0, n.firstCreatePass = !1), r
        } finally {
          e[2] &= -5, $a()
        }
      }

      function qi(n, e, t, r) {
        const i = e[2];
        if (256 == (256 & i)) return;
        Ua(e);
        const s = ja();
        try {
          Vg(e),
            function (n) {
              V.lFrame.bindingIndex = n
            }(n.bindingStartIndex), null !== t && S_(n, e, t, 2, r);
          const o = 3 == (3 & i);
          if (!s)
            if (o) {
              const c = n.preOrderCheckHooks;
              null !== c && Wa(e, c, null)
            } else {
              const c = n.preOrderHooks;
              null !== c && qa(e, c, 0, null), ju(e, 0)
            } if (function (n) {
              for (let e = hd(n); null !== e; e = fd(e)) {
                if (!e[2]) continue;
                const t = e[9];
                for (let r = 0; r < t.length; r++) {
                  const i = t[r],
                    s = i[3];
                  0 == (1024 & i[2]) && Pu(s, 1), i[2] |= 1024
                }
              }
            }(e), function (n) {
              for (let e = hd(n); null !== e; e = fd(e))
                for (let t = 10; t < e.length; t++) {
                  const r = e[t],
                    i = r[1];
                  ku(r) && qi(i, r, i.template, r[8])
                }
            }(e), null !== n.contentQueries && D_(n, e), !s)
            if (o) {
              const c = n.contentCheckHooks;
              null !== c && Wa(e, c)
            } else {
              const c = n.contentHooks;
              null !== c && qa(e, c, 1), ju(e, 1)
            }!
          function (n, e) {
            const t = n.hostBindingOpCodes;
            if (null !== t) try {
              for (let r = 0; r < t.length; r++) {
                const i = t[r];
                if (i < 0) pr(~i);
                else {
                  const s = i,
                    o = t[++r],
                    a = t[++r];
                  oT(o, s), a(2, e[s])
                }
              }
            } finally {
              pr(-1)
            }
          }(n, e);
          const a = n.components;
          null !== a && function (n, e) {
            for (let t = 0; t < e.length; t++) QA(n, e[t])
          }(e, a);
          const l = n.viewQuery;
          if (null !== l && jd(2, l, r), !s)
            if (o) {
              const c = n.viewCheckHooks;
              null !== c && Wa(e, c)
            } else {
              const c = n.viewHooks;
              null !== c && qa(e, c, 2), ju(e, 2)
            }! 0 === n.firstUpdatePass && (n.firstUpdatePass = !1), s || (e[2] &= -73), 1024 & e[2] && (e[2] &= -1025, Pu(e[3], -1))
        } finally {
          $a()
        }
      }

      function RA(n, e, t, r) {
        const i = e[10],
          s = !ja(),
          o = Lg(e);
        try {
          s && !o && i.begin && i.begin(), o && mo(n, e, r), qi(n, e, t, r)
        } finally {
          s && !o && i.end && i.end()
        }
      }

      function S_(n, e, t, r, i) {
        const s = at(),
          o = 2 & r;
        try {
          pr(-1), o && e.length > 20 && function (n, e, t, r) {
            if (!r)
              if (3 == (3 & e[2])) {
                const s = n.preOrderCheckHooks;
                null !== s && Wa(e, s, t)
              } else {
                const s = n.preOrderHooks;
                null !== s && qa(e, s, 0, t)
              } pr(t)
          }(n, e, 20, ja()), t(r, i)
        } finally {
          pr(s)
        }
      }

      function M_(n) {
        const e = n.tView;
        return null === e || e.incompleteFirstPass ? n.tView = _l(1, null, n.template, n.decls, n.vars, n.directiveDefs, n.pipeDefs, n.viewQuery, n.schemas, n.consts) : e
      }

      function _l(n, e, t, r, i, s, o, a, l, c) {
        const u = 20 + r,
          d = u + i,
          h = function (n, e) {
            const t = [];
            for (let r = 0; r < e; r++) t.push(r < n ? null : j);
            return t
          }(u, d),
          f = "function" == typeof c ? c() : c;
        return h[1] = {
          type: n,
          blueprint: h,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: e,
          data: h.slice().fill(null, u),
          bindingStartIndex: u,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof s ? s() : s,
          pipeRegistry: "function" == typeof o ? o() : o,
          firstChild: null,
          schemas: l,
          consts: f,
          incompleteFirstPass: !1
        }
      }

      function R_(n, e, t, r) {
        const i = function (n) {
          return n[7] || (n[7] = [])
        }(e);
        null === t ? i.push(r) : (i.push(t), n.firstCreatePass && function (n) {
          return n.cleanup || (n.cleanup = [])
        }(n).push(r, i.length - 1))
      }

      function x_(n, e, t) {
        for (let r in n)
          if (n.hasOwnProperty(r)) {
            const i = n[r];
            (t = null === t ? {} : t).hasOwnProperty(r) ? t[r].push(e, i) : t[r] = [e, i]
          } return t
      }

      function k_(n, e, t, r, i, s) {
        const o = s.hostBindings;
        if (o) {
          let a = n.hostBindingOpCodes;
          null === a && (a = n.hostBindingOpCodes = []);
          const l = ~e.index;
          (function (n) {
            let e = n.length;
            for (; e > 0;) {
              const t = n[--e];
              if ("number" == typeof t && t < 0) return t
            }
            return 0
          })(a) != l && a.push(l), a.push(r, i, o)
        }
      }

      function P_(n, e) {
        null !== n.hostBindings && n.hostBindings(1, e)
      }

      function N_(n, e) {
        e.flags |= 2, (n.components || (n.components = [])).push(e.index)
      }

      function $A(n, e, t) {
        if (t) {
          if (e.exportAs)
            for (let r = 0; r < e.exportAs.length; r++) t[e.exportAs[r]] = n;
          on(e) && (t[""] = n)
        }
      }

      function F_(n, e, t) {
        n.flags |= 1, n.directiveStart = e, n.directiveEnd = e + t, n.providerIndexes = e
      }

      function L_(n, e, t, r, i) {
        n.data[r] = i;
        const s = i.factory || (i.factory = Fr(i.type)),
          o = new Ys(s, on(i), null);
        n.blueprint[r] = o, t[r] = o, k_(n, e, 0, r, Wi(n, t, i.hostVars, j), i)
      }

      function zA(n, e, t) {
        const r = Ft(e, n),
          i = M_(t),
          s = n[10],
          o = yl(n, go(n, i, null, t.onPush ? 64 : 16, r, e, s, s.createRenderer(r, t), null, null));
        n[e.index] = o
      }

      function WA(n, e, t, r, i, s) {
        const o = s[e];
        if (null !== o) {
          const a = r.setInput;
          for (let l = 0; l < o.length;) {
            const c = o[l++],
              u = o[l++],
              d = o[l++];
            null !== a ? r.setInput(t, d, c, u) : t[u] = d
          }
        }
      }

      function qA(n, e) {
        let t = null,
          r = 0;
        for (; r < e.length;) {
          const i = e[r];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              n.hasOwnProperty(i) && (null === t && (t = []), t.push(i, n[i], e[r + 1])), r += 2
            } else r += 2;
          else r += 4
        }
        return t
      }

      function QA(n, e) {
        const t = wt(e, n);
        if (ku(t)) {
          const r = t[1];
          80 & t[2] ? qi(r, t, r.template, t[8]) : t[5] > 0 && Fd(t)
        }
      }

      function Fd(n) {
        for (let r = hd(n); null !== r; r = fd(r))
          for (let i = 10; i < r.length; i++) {
            const s = r[i];
            if (1024 & s[2]) {
              const o = s[1];
              qi(o, s, o.template, s[8])
            } else s[5] > 0 && Fd(s)
          }
        const t = n[1].components;
        if (null !== t)
          for (let r = 0; r < t.length; r++) {
            const i = wt(t[r], n);
            ku(i) && i[5] > 0 && Fd(i)
          }
      }

      function YA(n, e) {
        const t = wt(e, n),
          r = t[1];
        (function (n, e) {
          for (let t = e.length; t < n.blueprint.length; t++) e.push(n.blueprint[t])
        })(r, t), mo(r, t, t[8])
      }

      function yl(n, e) {
        return n[13] ? n[14][4] = e : n[13] = e, n[14] = e, e
      }

      function Bd(n, e, t) {
        const r = e[10];
        r.begin && r.begin();
        try {
          qi(n, e, n.template, t)
        } catch (i) {
          throw function (n, e) {
            const t = n[9],
              r = t ? t.get(Hr, null) : null;
            r && r.handleError(e)
          }(e, i), i
        } finally {
          r.end && r.end()
        }
      }

      function B_(n) {
        ! function (n) {
          for (let e = 0; e < n.components.length; e++) {
            const t = n.components[e],
              r = ld(t),
              i = r[1];
            RA(i, r, i.template, t)
          }
        }(n[8])
      }

      function jd(n, e, t) {
        Bu(0), e(n, t)
      }
      const tI = (() => Promise.resolve(null))();

      function vl(n, e, t) {
        let r = t ? n.styles : null,
          i = t ? n.classes : null,
          s = 0;
        if (null !== e)
          for (let o = 0; o < e.length; o++) {
            const a = e[o];
            "number" == typeof a ? s = a : 1 == s ? i = vu(i, a) : 2 == s && (r = vu(r, a + ": " + e[++o] + ";"))
          }
        t ? n.styles = r : n.stylesWithoutHost = r, t ? n.classes = i : n.classesWithoutHost = i
      }
      const Gi = new P("INJECTOR", -1);
      class W_ {
        get(e, t = io) {
          if (t === io) {
            const r = new Error(`NullInjectorError: No provider for ${G(e)}!`);
            throw r.name = "NullInjectorError", r
          }
          return t
        }
      }
      const _o = new P("Set Injector scope."),
        yo = {},
        iI = {};
      let Hd;

      function q_() {
        return void 0 === Hd && (Hd = new W_), Hd
      }

      function G_(n, e = null, t = null, r) {
        return new oI(n, t, e || q_(), r)
      }
      class oI {
        constructor(e, t, r, i = null) {
          this.parent = r, this.records = new Map, this.injectorDefTypes = new Set, this.onDestroy = new Set, this._destroyed = !1;
          const s = [];
          t && Mn(t, a => this.processProvider(a, e, t)), Mn([e], a => this.processInjectorType(a, [], s)), this.records.set(Gi, Ki(void 0, this));
          const o = this.records.get(_o);
          this.scope = null != o ? o.value : null, this.source = i || ("object" == typeof e ? null : G(e))
        }
        get destroyed() {
          return this._destroyed
        }
        destroy() {
          this.assertNotDestroyed(), this._destroyed = !0;
          try {
            this.onDestroy.forEach(e => e.ngOnDestroy())
          } finally {
            this.records.clear(), this.onDestroy.clear(), this.injectorDefTypes.clear()
          }
        }
        get(e, t = io, r = x.Default) {
          this.assertNotDestroyed();
          const i = Vi(this),
            s = ur(void 0);
          try {
            if (!(r & x.SkipSelf)) {
              let a = this.records.get(e);
              if (void 0 === a) {
                const l = function (n) {
                  return "function" == typeof n || "object" == typeof n && n instanceof P
                }(e) && $n(e);
                a = l && this.injectableDefInScope(l) ? Ki(Ud(e), yo) : null, this.records.set(e, a)
              }
              if (null != a) return this.hydrate(e, a)
            }
            return (r & x.Self ? q_() : this.parent).get(e, t = r & x.Optional && t === io ? null : t)
          } catch (o) {
            if ("NullInjectorError" === o.name) {
              if ((o[Li] = o[Li] || []).unshift(G(e)), i) throw o;
              return pm(o, e, "R3InjectorError", this.source)
            }
            throw o
          } finally {
            ur(s), Vi(i)
          }
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach(e => this.get(e))
        }
        toString() {
          const e = [];
          return this.records.forEach((r, i) => e.push(G(i))), `R3Injector[${e.join(", ")}]`
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new Error("Injector has already been destroyed.")
        }
        processInjectorType(e, t, r) {
          if (!(e = I(e))) return !1;
          let i = Cg(e);
          const s = null == i && e.ngModule || void 0,
            o = void 0 === s ? e : s,
            a = -1 !== r.indexOf(o);
          if (void 0 !== s && (i = Cg(s)), null == i) return !1;
          if (null != i.imports && !a) {
            let u;
            r.push(o);
            try {
              Mn(i.imports, d => {
                this.processInjectorType(d, t, r) && (void 0 === u && (u = []), u.push(d))
              })
            } finally {}
            if (void 0 !== u)
              for (let d = 0; d < u.length; d++) {
                const {
                  ngModule: h,
                  providers: f
                } = u[d];
                Mn(f, p => this.processProvider(p, h, f || fe))
              }
          }
          this.injectorDefTypes.add(o);
          const l = Fr(o) || (() => new o);
          this.records.set(o, Ki(l, yo));
          const c = i.providers;
          if (null != c && !a) {
            const u = e;
            Mn(c, d => this.processProvider(d, u, c))
          }
          return void 0 !== s && void 0 !== e.providers
        }
        processProvider(e, t, r) {
          let i = Qi(e = I(e)) ? e : I(e && e.provide);
          const s = function (n, e, t) {
            return Q_(n) ? Ki(void 0, n.useValue) : Ki(function (n, e, t) {
              let r;
              if (Qi(n)) {
                const i = I(n);
                return Fr(i) || Ud(i)
              }
              if (Q_(n)) r = () => I(n.useValue);
              else if (function (n) {
                  return !(!n || !n.useFactory)
                }(n)) r = () => n.useFactory(...Br(n.deps || []));
              else if (function (n) {
                  return !(!n || !n.useExisting)
                }(n)) r = () => _(I(n.useExisting));
              else {
                const i = I(n && (n.useClass || n.provide));
                if (! function (n) {
                    return !!n.deps
                  }(n)) return Fr(i) || Ud(i);
                r = () => new i(...Br(n.deps))
              }
              return r
            }(n), yo)
          }(e);
          if (Qi(e) || !0 !== e.multi) this.records.get(i);
          else {
            let o = this.records.get(i);
            o || (o = Ki(void 0, yo, !0), o.factory = () => Br(o.multi), this.records.set(i, o)), i = e, o.multi.push(e)
          }
          this.records.set(i, s)
        }
        hydrate(e, t) {
          return t.value === yo && (t.value = iI, t.value = t.factory()), "object" == typeof t.value && t.value && function (n) {
            return null !== n && "object" == typeof n && "function" == typeof n.ngOnDestroy
          }(t.value) && this.onDestroy.add(t.value), t.value
        }
        injectableDefInScope(e) {
          if (!e.providedIn) return !1;
          const t = I(e.providedIn);
          return "string" == typeof t ? "any" === t || t === this.scope : this.injectorDefTypes.has(t)
        }
      }

      function Ud(n) {
        const e = $n(n),
          t = null !== e ? e.factory : Fr(n);
        if (null !== t) return t;
        if (n instanceof P) throw new Error(`Token ${G(n)} is missing a \u0275prov definition.`);
        if (n instanceof Function) return function (n) {
          const e = n.length;
          if (e > 0) {
            const r = mr(e, "?");
            throw new Error(`Can't resolve all parameters for ${G(n)}: (${r.join(", ")}).`)
          }
          const t = function (n) {
            const e = n && (n[Oa] || n[Eg]);
            if (e) {
              const t = function (n) {
                if (n.hasOwnProperty("name")) return n.name;
                const e = ("" + n).match(/^function\s*([^\s(]+)/);
                return null === e ? "" : e[1]
              }(n);
              return console.warn(`DEPRECATED: DI is instantiating a token "${t}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${t}" class.`), e
            }
            return null
          }(n);
          return null !== t ? () => t.factory(n) : () => new n
        }(n);
        throw new Error("unreachable")
      }

      function Ki(n, e, t = !1) {
        return {
          factory: n,
          value: e,
          multi: t ? [] : void 0
        }
      }

      function Q_(n) {
        return null !== n && "object" == typeof n && Xu in n
      }

      function Qi(n) {
        return "function" == typeof n
      }
      const Y_ = function (n, e, t) {
        return function (n, e = null, t = null, r) {
          const i = G_(n, e, t, r);
          return i._resolveInjectorDefTypes(), i
        }({
          name: t
        }, e, n, t)
      };
      let he = (() => {
        class n {
          static create(t, r) {
            return Array.isArray(t) ? Y_(t, r, "") : Y_(t.providers, t.parent, t.name || "")
          }
        }
        return n.THROW_IF_NOT_FOUND = io, n.NULL = new W_, n.\u0275prov = M({
          token: n,
          providedIn: "any",
          factory: () => _(Gi)
        }), n.__NG_ELEMENT_ID__ = -1, n
      })();

      function MI(n, e) {
        za(ld(n)[1], Ve())
      }

      function _t(n) {
        let e = function (n) {
            return Object.getPrototypeOf(n.prototype).constructor
          }(n.type),
          t = !0;
        const r = [n];
        for (; e;) {
          let i;
          if (on(n)) i = e.\u0275cmp || e.\u0275dir;
          else {
            if (e.\u0275cmp) throw new Error("Directives cannot inherit Components");
            i = e.\u0275dir
          }
          if (i) {
            if (t) {
              r.push(i);
              const o = n;
              o.inputs = Kd(n.inputs), o.declaredInputs = Kd(n.declaredInputs), o.outputs = Kd(n.outputs);
              const a = i.hostBindings;
              a && xI(n, a);
              const l = i.viewQuery,
                c = i.contentQueries;
              if (l && II(n, l), c && RI(n, c), yu(n.inputs, i.inputs), yu(n.declaredInputs, i.declaredInputs), yu(n.outputs, i.outputs), on(i) && i.data.animation) {
                const u = n.data;
                u.animation = (u.animation || []).concat(i.data.animation)
              }
            }
            const s = i.features;
            if (s)
              for (let o = 0; o < s.length; o++) {
                const a = s[o];
                a && a.ngInherit && a(n), a === _t && (t = !1)
              }
          }
          e = Object.getPrototypeOf(e)
        }! function (n) {
          let e = 0,
            t = null;
          for (let r = n.length - 1; r >= 0; r--) {
            const i = n[r];
            i.hostVars = e += i.hostVars, i.hostAttrs = Ka(i.hostAttrs, t = Ka(t, i.hostAttrs))
          }
        }(r)
      }

      function Kd(n) {
        return n === wi ? {} : n === fe ? [] : n
      }

      function II(n, e) {
        const t = n.viewQuery;
        n.viewQuery = t ? (r, i) => {
          e(r, i), t(r, i)
        } : e
      }

      function RI(n, e) {
        const t = n.contentQueries;
        n.contentQueries = t ? (r, i, s) => {
          e(r, i, s), t(r, i, s)
        } : e
      }

      function xI(n, e) {
        const t = n.hostBindings;
        n.hostBindings = t ? (r, i) => {
          e(r, i), t(r, i)
        } : e
      }
      let bl = null;

      function Yi() {
        if (!bl) {
          const n = oe.Symbol;
          if (n && n.iterator) bl = n.iterator;
          else {
            const e = Object.getOwnPropertyNames(Map.prototype);
            for (let t = 0; t < e.length; ++t) {
              const r = e[t];
              "entries" !== r && "size" !== r && Map.prototype[r] === Map.prototype.entries && (bl = r)
            }
          }
        }
        return bl
      }

      function bo(n) {
        return !!Qd(n) && (Array.isArray(n) || !(n instanceof Map) && Yi() in n)
      }

      function Qd(n) {
        return null !== n && ("function" == typeof n || "object" == typeof n)
      }

      function b(n, e = x.Default) {
        const t = C();
        return null === t ? _(n, e) : im(Ve(), t, I(n), e)
      }

      function eh(n, e, t, r, i) {
        const o = i ? "class" : "style";
        ! function (n, e, t, r, i) {
          for (let s = 0; s < t.length;) {
            const o = t[s++],
              a = t[s++],
              l = e[o],
              c = n.data[o];
            null !== c.setInput ? c.setInput(l, i, r, a) : l[a] = i
          }
        }(n, t, e.inputs[o], o, r)
      }

      function je(n, e, t, r) {
        const i = C(),
          s = te(),
          o = 20 + n,
          a = i[W],
          l = i[o] = gd(a, e, V.lFrame.currentNamespace),
          c = s.firstCreatePass ? function (n, e, t, r, i, s, o) {
            const a = e.consts,
              c = zi(e, n, 2, i, fr(a, s));
            return function (n, e, t, r) {
              let i = !1;
              if (Bg()) {
                const s = function (n, e, t) {
                    const r = n.directiveRegistry;
                    let i = null;
                    if (r)
                      for (let s = 0; s < r.length; s++) {
                        const o = r[s];
                        h_(t, o.selectors, !1) && (i || (i = []), Za(Xs(t, e), n, o.type), on(o) ? (N_(n, t), i.unshift(o)) : i.push(o))
                      }
                    return i
                  }(n, e, t),
                  o = null === r ? null : {
                    "": -1
                  };
                if (null !== s) {
                  i = !0, F_(t, n.data.length, s.length);
                  for (let u = 0; u < s.length; u++) {
                    const d = s[u];
                    d.providersResolver && d.providersResolver(d)
                  }
                  let a = !1,
                    l = !1,
                    c = Wi(n, e, s.length, null);
                  for (let u = 0; u < s.length; u++) {
                    const d = s[u];
                    t.mergedAttrs = Ka(t.mergedAttrs, d.hostAttrs), L_(n, t, e, c, d), $A(c, d, o), null !== d.contentQueries && (t.flags |= 8), (null !== d.hostBindings || null !== d.hostAttrs || 0 !== d.hostVars) && (t.flags |= 128);
                    const h = d.type.prototype;
                    !a && (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) && ((n.preOrderHooks || (n.preOrderHooks = [])).push(t.index), a = !0), !l && (h.ngOnChanges || h.ngDoCheck) && ((n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(t.index), l = !0), c++
                  }! function (n, e) {
                    const r = e.directiveEnd,
                      i = n.data,
                      s = e.attrs,
                      o = [];
                    let a = null,
                      l = null;
                    for (let c = e.directiveStart; c < r; c++) {
                      const u = i[c],
                        d = u.inputs,
                        h = null === s || d_(e) ? null : qA(d, s);
                      o.push(h), a = x_(d, c, a), l = x_(u.outputs, c, l)
                    }
                    null !== a && (a.hasOwnProperty("class") && (e.flags |= 16), a.hasOwnProperty("style") && (e.flags |= 32)), e.initialInputs = o, e.inputs = a, e.outputs = l
                  }(n, t)
                }
                o && function (n, e, t) {
                  if (e) {
                    const r = n.localNames = [];
                    for (let i = 0; i < e.length; i += 2) {
                      const s = t[e[i + 1]];
                      if (null == s) throw new xr("301", `Export of name '${e[i+1]}' not found!`);
                      r.push(e[i], s)
                    }
                  }
                }(t, r, o)
              }
              t.mergedAttrs = Ka(t.mergedAttrs, t.attrs)
            }(e, t, c, fr(a, o)), null !== c.attrs && vl(c, c.attrs, !1), null !== c.mergedAttrs && vl(c, c.mergedAttrs, !0), null !== e.queries && e.queries.elementStart(e, c), c
          }(o, s, i, 0, e, t, r) : s.data[o];
        Sn(c, !0);
        const u = c.mergedAttrs;
        null !== u && Ga(a, l, u);
        const d = c.classes;
        null !== d && Cd(a, l, d);
        const h = c.styles;
        null !== h && l_(a, l, h), 64 != (64 & c.flags) && hl(s, i, l, c), 0 === V.lFrame.elementDepthCount && Ze(l, i), V.lFrame.elementDepthCount++,
          function (n) {
            return 1 == (1 & n.flags)
          }(c) && (function (n, e, t) {
            !Bg() || (function (n, e, t, r) {
              const i = t.directiveStart,
                s = t.directiveEnd;
              n.firstCreatePass || Xs(t, e), Ze(r, e);
              const o = t.initialInputs;
              for (let a = i; a < s; a++) {
                const l = n.data[a],
                  c = on(l);
                c && zA(e, t, l);
                const u = Js(e, n, a, t);
                Ze(u, e), null !== o && WA(0, a - i, u, l, 0, o), c && (wt(t.index, e)[8] = u)
              }
            }(n, e, t, Ft(t, e)), 128 == (128 & t.flags) && function (n, e, t) {
              const r = t.directiveStart,
                i = t.directiveEnd,
                o = t.index,
                a = V.lFrame.currentDirectiveIndex;
              try {
                pr(o);
                for (let l = r; l < i; l++) {
                  const c = n.data[l],
                    u = e[l];
                  Lu(l), (null !== c.hostBindings || 0 !== c.hostVars || null !== c.hostAttrs) && P_(c, u)
                }
              } finally {
                pr(-1), Lu(a)
              }
            }(n, e, t))
          }(s, i, c), function (n, e, t) {
            if (Mu(e)) {
              const i = e.directiveEnd;
              for (let s = e.directiveStart; s < i; s++) {
                const o = n.data[s];
                o.contentQueries && o.contentQueries(1, t[s], s)
              }
            }
          }(s, c, i)), null !== r && function (n, e, t = Ft) {
            const r = e.localNames;
            if (null !== r) {
              let i = e.index + 1;
              for (let s = 0; s < r.length; s += 2) {
                const o = r[s + 1],
                  a = -1 === o ? t(e, n) : n[o];
                n[i++] = a
              }
            }
          }(i, c)
      }

      function He() {
        let n = Ve();
        Nu() ? Fu() : (n = n.parent, Sn(n, !1));
        const e = n;
        V.lFrame.elementDepthCount--;
        const t = te();
        t.firstCreatePass && (za(t, n), Mu(n) && t.queries.elementEnd(n)), null != e.classesWithoutHost && function (n) {
          return 0 != (16 & n.flags)
        }(e) && eh(t, e, C(), e.classesWithoutHost, !0), null != e.stylesWithoutHost && function (n) {
          return 0 != (32 & n.flags)
        }(e) && eh(t, e, C(), e.stylesWithoutHost, !1)
      }

      function Ht(n, e, t, r) {
        je(n, e, t, r), He()
      }

      function wl(n) {
        return !!n && "function" == typeof n.then
      }
      const th = function (n) {
        return !!n && "function" == typeof n.subscribe
      };

      function fR(n, e) {
        let t = null;
        const r = function (n) {
          const e = n.attrs;
          if (null != e) {
            const t = e.indexOf(5);
            if (0 == (1 & t)) return e[t + 1]
          }
          return null
        }(n);
        for (let i = 0; i < e.length; i++) {
          const s = e[i];
          if ("*" !== s) {
            if (null === r ? h_(n, s, !0) : mA(r, s)) return i
          } else t = i
        }
        return t
      }

      function Zn(n, e = 0, t) {
        const r = C(),
          i = te(),
          s = zi(i, 20 + n, 16, null, t || null);
        null === s.projection && (s.projection = e), Fu(), 64 != (64 & s.flags) && function (n, e, t) {
          a_(e[W], 0, e, t, Zm(n, t, e), t_(t.parent || e[6], t, e))
        }(i, r, s)
      }

      function Qy(n, e, t, r, i) {
        const s = n[t + 1],
          o = null === e;
        let a = r ? ln(s) : qn(s),
          l = !1;
        for (; 0 !== a && (!1 === l || o);) {
          const u = n[a + 1];
          mR(n[a], e) && (l = !0, n[a + 1] = r ? Dd(u) : Ed(u)), a = r ? ln(u) : qn(u)
        }
        l && (n[t + 1] = r ? Ed(s) : Dd(s))
      }

      function mR(n, e) {
        return null === n || null == e || (Array.isArray(n) ? n[1] : n) === e || !(!Array.isArray(n) || "string" != typeof e) && Fi(n, e) >= 0
      }

      function Ut(n, e) {
        return function (n, e, t, r) {
          const i = C(),
            s = te(),
            o = function (n) {
              const e = V.lFrame,
                t = e.bindingIndex;
              return e.bindingIndex = e.bindingIndex + n, t
            }(2);
          s.firstUpdatePass && function (n, e, t, r) {
            const i = n.data;
            if (null === i[t + 1]) {
              const s = i[at()],
                o = function (n, e) {
                  return e >= n.expandoStartIndex
                }(n, t);
              (function (n, e) {
                return 0 != (n.flags & (e ? 16 : 32))
              })(s, r) && null === e && !o && (e = !1), e = function (n, e, t, r) {
                  const i = function (n) {
                    const e = V.lFrame.currentDirectiveIndex;
                    return -1 === e ? null : n[e]
                  }(n);
                  let s = r ? e.residualClasses : e.residualStyles;
                  if (null === i) 0 === (r ? e.classBindings : e.styleBindings) && (t = Do(t = oh(null, n, e, t, r), e.attrs, r), s = null);
                  else {
                    const o = e.directiveStylingLast;
                    if (-1 === o || n[o] !== i)
                      if (t = oh(i, n, e, t, r), null === s) {
                        let l = function (n, e, t) {
                          const r = t ? e.classBindings : e.styleBindings;
                          if (0 !== qn(r)) return n[ln(r)]
                        }(n, e, r);
                        void 0 !== l && Array.isArray(l) && (l = oh(null, n, e, l[1], r), l = Do(l, e.attrs, r), function (n, e, t, r) {
                          n[ln(t ? e.classBindings : e.styleBindings)] = r
                        }(n, e, r, l))
                      } else s = function (n, e, t) {
                        let r;
                        const i = e.directiveEnd;
                        for (let s = 1 + e.directiveStylingLast; s < i; s++) r = Do(r, n[s].hostAttrs, t);
                        return Do(r, e.attrs, t)
                      }(n, e, r)
                  }
                  return void 0 !== s && (r ? e.residualClasses = s : e.residualStyles = s), t
                }(i, s, e, r),
                function (n, e, t, r, i, s) {
                  let o = s ? e.classBindings : e.styleBindings,
                    a = ln(o),
                    l = qn(o);
                  n[r] = t;
                  let u, c = !1;
                  if (Array.isArray(t)) {
                    const d = t;
                    u = d[1], (null === u || Fi(d, u) > 0) && (c = !0)
                  } else u = t;
                  if (i)
                    if (0 !== l) {
                      const h = ln(n[a + 1]);
                      n[r + 1] = pl(h, a), 0 !== h && (n[h + 1] = wd(n[h + 1], r)), n[a + 1] = function (n, e) {
                        return 131071 & n | e << 17
                      }(n[a + 1], r)
                    } else n[r + 1] = pl(a, 0), 0 !== a && (n[a + 1] = wd(n[a + 1], r)), a = r;
                  else n[r + 1] = pl(l, 0), 0 === a ? a = r : n[l + 1] = wd(n[l + 1], r), l = r;
                  c && (n[r + 1] = Ed(n[r + 1])), Qy(n, u, r, !0), Qy(n, u, r, !1),
                    function (n, e, t, r, i) {
                      const s = i ? n.residualClasses : n.residualStyles;
                      null != s && "string" == typeof e && Fi(s, e) >= 0 && (t[r + 1] = Dd(t[r + 1]))
                    }(e, u, n, r, s), o = pl(a, l), s ? e.classBindings = o : e.styleBindings = o
                }(i, s, e, t, o, r)
            }
          }(s, n, o, r), e !== j && function (n, e, t) {
            return !Object.is(n[e], t) && (n[e] = t, !0)
          }(i, o, e) && function (n, e, t, r, i, s, o, a) {
            if (!(3 & e.type)) return;
            const l = n.data,
              c = l[a + 1];
            Dl(function (n) {
              return 1 == (1 & n)
            }(c) ? ov(l, e, t, i, qn(c), o) : void 0) || (Dl(s) || function (n) {
              return 2 == (2 & n)
            }(c) && (s = ov(l, null, t, i, a, o)), function (n, e, t, r, i) {
              const s = Se(n);
              if (e) i ? s ? n.addClass(t, r) : t.classList.add(r) : s ? n.removeClass(t, r) : t.classList.remove(r);
              else {
                let o = -1 === r.indexOf("-") ? void 0 : Tt.DashCase;
                if (null == i) s ? n.removeStyle(t, r, o) : t.style.removeProperty(r);
                else {
                  const a = "string" == typeof i && i.endsWith("!important");
                  a && (i = i.slice(0, -10), o |= Tt.Important), s ? n.setStyle(t, r, i, o) : t.style.setProperty(r, i, a ? "important" : "")
                }
              }
            }(r, o, function (n, e) {
              return Pe(e[n])
            }(at(), t), i, s))
          }(s, s.data[at()], i, i[W], n, i[o + 1] = function (n, e) {
            return null == n || ("string" == typeof e ? n += e : "object" == typeof n && (n = G(function (n) {
              return n instanceof class {
                constructor(e) {
                  this.changingThisBreaksApplicationSecurity = e
                }
                toString() {
                  return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`
                }
              } ? n.changingThisBreaksApplicationSecurity : n
            }(n)))), n
          }(e, t), r, o)
        }(n, e, null, !0), Ut
      }

      function oh(n, e, t, r, i) {
        let s = null;
        const o = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (-1 === a ? a = t.directiveStart : a++; a < o && (s = e[a], r = Do(r, s.hostAttrs, i), s !== n);) a++;
        return null !== n && (t.directiveStylingLast = a), r
      }

      function Do(n, e, t) {
        const r = t ? 1 : 2;
        let i = -1;
        if (null !== e)
          for (let s = 0; s < e.length; s++) {
            const o = e[s];
            "number" == typeof o ? i = o : i === r && (Array.isArray(n) || (n = void 0 === n ? [] : ["", n]), Dt(n, o, !!t || e[++s]))
          }
        return void 0 === n ? null : n
      }

      function ov(n, e, t, r, i, s) {
        const o = null === e;
        let a;
        for (; i > 0;) {
          const l = n[i],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = null === u;
          let h = t[i + 1];
          h === j && (h = d ? fe : void 0);
          let f = d ? Ku(h, r) : u === r ? h : void 0;
          if (c && !Dl(f) && (f = Ku(l, r)), Dl(f) && (a = f, o)) return a;
          const p = n[i + 1];
          i = o ? ln(p) : qn(p)
        }
        if (null !== e) {
          let l = s ? e.residualClasses : e.residualStyles;
          null != l && (a = Ku(l, r))
        }
        return a
      }

      function Dl(n) {
        return void 0 !== n
      }

      function $t(n, e = "") {
        const t = C(),
          r = te(),
          i = n + 20,
          s = r.firstCreatePass ? zi(r, i, 1, e, null) : r.data[i],
          o = t[i] = function (n, e) {
            return Se(n) ? n.createText(e) : n.createTextNode(e)
          }(t[W], e);
        hl(r, t, o, s), Sn(s, !1)
      }
      const qr = void 0;
      var ZR = ["en", [
          ["a", "p"],
          ["AM", "PM"], qr
        ],
        [
          ["AM", "PM"], qr, qr
        ],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        ], qr, [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        ], qr, [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"]
        ], 0, [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", qr, "{1} 'at' {0}", qr],
        [".", ",", ";", "%", "+", "-", "E", "\xd7", "\u2030", "\u221e", "NaN", ":"],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr",
        function (n) {
          const e = Math.floor(Math.abs(n)),
            t = n.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === e && 0 === t ? 1 : 5
        }
      ];
      let ls = {};

      function Tv(n) {
        return n in ls || (ls[n] = oe.ng && oe.ng.common && oe.ng.common.locales && oe.ng.common.locales[n]), ls[n]
      }
      var S = (() => ((S = S || {})[S.LocaleId = 0] = "LocaleId", S[S.DayPeriodsFormat = 1] = "DayPeriodsFormat", S[S.DayPeriodsStandalone = 2] = "DayPeriodsStandalone", S[S.DaysFormat = 3] = "DaysFormat", S[S.DaysStandalone = 4] = "DaysStandalone", S[S.MonthsFormat = 5] = "MonthsFormat", S[S.MonthsStandalone = 6] = "MonthsStandalone", S[S.Eras = 7] = "Eras", S[S.FirstDayOfWeek = 8] = "FirstDayOfWeek", S[S.WeekendRange = 9] = "WeekendRange", S[S.DateFormat = 10] = "DateFormat", S[S.TimeFormat = 11] = "TimeFormat", S[S.DateTimeFormat = 12] = "DateTimeFormat", S[S.NumberSymbols = 13] = "NumberSymbols", S[S.NumberFormats = 14] = "NumberFormats", S[S.CurrencyCode = 15] = "CurrencyCode", S[S.CurrencySymbol = 16] = "CurrencySymbol", S[S.CurrencyName = 17] = "CurrencyName", S[S.Currencies = 18] = "Currencies", S[S.Directionality = 19] = "Directionality", S[S.PluralCase = 20] = "PluralCase", S[S.ExtraData = 21] = "ExtraData", S))();
      const Ml = "en-US";
      let Mv = Ml;

      function lh(n) {
        Ct(n, "Expected localeId to be defined"), "string" == typeof n && (Mv = n.toLowerCase().replace(/_/g, "-"))
      }
      class Xv {}
      const eb = "ngComponent";
      class Zx {
        resolveComponentFactory(e) {
          throw function (n) {
            const e = Error(`No component factory found for ${G(n)}. Did you add it to @NgModule.entryComponents?`);
            return e[eb] = n, e
          }(e)
        }
      }
      let Xn = (() => {
        class n {}
        return n.NULL = new Zx, n
      })();

      function Ol(...n) {}

      function us(n, e) {
        return new ae(Ft(n, e))
      }
      const eO = function () {
        return us(Ve(), C())
      };
      let ae = (() => {
        class n {
          constructor(t) {
            this.nativeElement = t
          }
        }
        return n.__NG_ELEMENT_ID__ = eO, n
      })();

      function tb(n) {
        return n instanceof ae ? n.nativeElement : n
      }
      class Gr {}
      let mh = (() => {
        class n {}
        return n.\u0275prov = M({
          token: n,
          providedIn: "root",
          factory: () => null
        }), n
      })();
      class Kr {
        constructor(e) {
          this.full = e, this.major = e.split(".")[0], this.minor = e.split(".")[1], this.patch = e.split(".").slice(2).join(".")
        }
      }
      const nb = new Kr("12.2.16");
      class rb {
        constructor() {}
        supports(e) {
          return bo(e)
        }
        create(e) {
          return new oO(e)
        }
      }
      const sO = (n, e) => e;
      class oO {
        constructor(e) {
          this.length = 0, this._linkedRecords = null, this._unlinkedRecords = null, this._previousItHead = null, this._itHead = null, this._itTail = null, this._additionsHead = null, this._additionsTail = null, this._movesHead = null, this._movesTail = null, this._removalsHead = null, this._removalsTail = null, this._identityChangesHead = null, this._identityChangesTail = null, this._trackByFn = e || sO
        }
        forEachItem(e) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) e(t)
        }
        forEachOperation(e) {
          let t = this._itHead,
            r = this._removalsHead,
            i = 0,
            s = null;
          for (; t || r;) {
            const o = !r || t && t.currentIndex < sb(r, i, s) ? t : r,
              a = sb(o, i, s),
              l = o.currentIndex;
            if (o === r) i--, r = r._nextRemoved;
            else if (t = t._next, null == o.previousIndex) i++;
            else {
              s || (s = []);
              const c = a - i,
                u = l - i;
              if (c != u) {
                for (let h = 0; h < c; h++) {
                  const f = h < s.length ? s[h] : s[h] = 0,
                    p = f + h;
                  u <= p && p < c && (s[h] = f + 1)
                }
                s[o.previousIndex] = u - c
              }
            }
            a !== l && e(o, a, l)
          }
        }
        forEachPreviousItem(e) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) e(t)
        }
        forEachAddedItem(e) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) e(t)
        }
        forEachMovedItem(e) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) e(t)
        }
        forEachRemovedItem(e) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) e(t)
        }
        forEachIdentityChange(e) {
          let t;
          for (t = this._identityChangesHead; null !== t; t = t._nextIdentityChange) e(t)
        }
        diff(e) {
          if (null == e && (e = []), !bo(e)) throw new Error(`Error trying to diff '${G(e)}'. Only arrays and iterables are allowed`);
          return this.check(e) ? this : null
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let i, s, o, t = this._itHead,
            r = !1;
          if (Array.isArray(e)) {
            this.length = e.length;
            for (let a = 0; a < this.length; a++) s = e[a], o = this._trackByFn(a, s), null !== t && Object.is(t.trackById, o) ? (r && (t = this._verifyReinsertion(t, s, o, a)), Object.is(t.item, s) || this._addIdentityChange(t, s)) : (t = this._mismatch(t, s, o, a), r = !0), t = t._next
          } else i = 0,
            function (n, e) {
              if (Array.isArray(n))
                for (let t = 0; t < n.length; t++) e(n[t]);
              else {
                const t = n[Yi()]();
                let r;
                for (; !(r = t.next()).done;) e(r.value)
              }
            }(e, a => {
              o = this._trackByFn(i, a), null !== t && Object.is(t.trackById, o) ? (r && (t = this._verifyReinsertion(t, a, o, i)), Object.is(t.item, a) || this._addIdentityChange(t, a)) : (t = this._mismatch(t, a, o, i), r = !0), t = t._next, i++
            }), this.length = i;
          return this._truncate(t), this.collection = e, this.isDirty
        }
        get isDirty() {
          return null !== this._additionsHead || null !== this._movesHead || null !== this._removalsHead || null !== this._identityChangesHead
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (e = this._previousItHead = this._itHead; null !== e; e = e._next) e._nextPrevious = e._next;
            for (e = this._additionsHead; null !== e; e = e._nextAdded) e.previousIndex = e.currentIndex;
            for (this._additionsHead = this._additionsTail = null, e = this._movesHead; null !== e; e = e._nextMoved) e.previousIndex = e.currentIndex;
            this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
          }
        }
        _mismatch(e, t, r, i) {
          let s;
          return null === e ? s = this._itTail : (s = e._prev, this._remove(e)), null !== (e = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null)) ? (Object.is(e.item, t) || this._addIdentityChange(e, t), this._reinsertAfter(e, s, i)) : null !== (e = null === this._linkedRecords ? null : this._linkedRecords.get(r, i)) ? (Object.is(e.item, t) || this._addIdentityChange(e, t), this._moveAfter(e, s, i)) : e = this._addAfter(new aO(t, r), s, i), e
        }
        _verifyReinsertion(e, t, r, i) {
          let s = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
          return null !== s ? e = this._reinsertAfter(s, e._prev, i) : e.currentIndex != i && (e.currentIndex = i, this._addToMoves(e, i)), e
        }
        _truncate(e) {
          for (; null !== e;) {
            const t = e._next;
            this._addToRemovals(this._unlink(e)), e = t
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(), null !== this._additionsTail && (this._additionsTail._nextAdded = null), null !== this._movesTail && (this._movesTail._nextMoved = null), null !== this._itTail && (this._itTail._next = null), null !== this._removalsTail && (this._removalsTail._nextRemoved = null), null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null)
        }
        _reinsertAfter(e, t, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(e);
          const i = e._prevRemoved,
            s = e._nextRemoved;
          return null === i ? this._removalsHead = s : i._nextRemoved = s, null === s ? this._removalsTail = i : s._prevRemoved = i, this._insertAfter(e, t, r), this._addToMoves(e, r), e
        }
        _moveAfter(e, t, r) {
          return this._unlink(e), this._insertAfter(e, t, r), this._addToMoves(e, r), e
        }
        _addAfter(e, t, r) {
          return this._insertAfter(e, t, r), this._additionsTail = null === this._additionsTail ? this._additionsHead = e : this._additionsTail._nextAdded = e, e
        }
        _insertAfter(e, t, r) {
          const i = null === t ? this._itHead : t._next;
          return e._next = i, e._prev = t, null === i ? this._itTail = e : i._prev = e, null === t ? this._itHead = e : t._next = e, null === this._linkedRecords && (this._linkedRecords = new ib), this._linkedRecords.put(e), e.currentIndex = r, e
        }
        _remove(e) {
          return this._addToRemovals(this._unlink(e))
        }
        _unlink(e) {
          null !== this._linkedRecords && this._linkedRecords.remove(e);
          const t = e._prev,
            r = e._next;
          return null === t ? this._itHead = r : t._next = r, null === r ? this._itTail = t : r._prev = t, e
        }
        _addToMoves(e, t) {
          return e.previousIndex === t || (this._movesTail = null === this._movesTail ? this._movesHead = e : this._movesTail._nextMoved = e), e
        }
        _addToRemovals(e) {
          return null === this._unlinkedRecords && (this._unlinkedRecords = new ib), this._unlinkedRecords.put(e), e.currentIndex = null, e._nextRemoved = null, null === this._removalsTail ? (this._removalsTail = this._removalsHead = e, e._prevRemoved = null) : (e._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = e), e
        }
        _addIdentityChange(e, t) {
          return e.item = t, this._identityChangesTail = null === this._identityChangesTail ? this._identityChangesHead = e : this._identityChangesTail._nextIdentityChange = e, e
        }
      }
      class aO {
        constructor(e, t) {
          this.item = e, this.trackById = t, this.currentIndex = null, this.previousIndex = null, this._nextPrevious = null, this._prev = null, this._next = null, this._prevDup = null, this._nextDup = null, this._prevRemoved = null, this._nextRemoved = null, this._nextAdded = null, this._nextMoved = null, this._nextIdentityChange = null
        }
      }
      class lO {
        constructor() {
          this._head = null, this._tail = null
        }
        add(e) {
          null === this._head ? (this._head = this._tail = e, e._nextDup = null, e._prevDup = null) : (this._tail._nextDup = e, e._prevDup = this._tail, e._nextDup = null, this._tail = e)
        }
        get(e, t) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if ((null === t || t <= r.currentIndex) && Object.is(r.trackById, e)) return r;
          return null
        }
        remove(e) {
          const t = e._prevDup,
            r = e._nextDup;
          return null === t ? this._head = r : t._nextDup = r, null === r ? this._tail = t : r._prevDup = t, null === this._head
        }
      }
      class ib {
        constructor() {
          this.map = new Map
        }
        put(e) {
          const t = e.trackById;
          let r = this.map.get(t);
          r || (r = new lO, this.map.set(t, r)), r.add(e)
        }
        get(e, t) {
          const i = this.map.get(e);
          return i ? i.get(e, t) : null
        }
        remove(e) {
          const t = e.trackById;
          return this.map.get(t).remove(e) && this.map.delete(t), e
        }
        get isEmpty() {
          return 0 === this.map.size
        }
        clear() {
          this.map.clear()
        }
      }

      function sb(n, e, t) {
        const r = n.previousIndex;
        if (null === r) return r;
        let i = 0;
        return t && r < t.length && (i = t[r]), r + e + i
      }
      class ob {
        constructor() {}
        supports(e) {
          return e instanceof Map || Qd(e)
        }
        create() {
          return new cO
        }
      }
      class cO {
        constructor() {
          this._records = new Map, this._mapHead = null, this._appendAfter = null, this._previousMapHead = null, this._changesHead = null, this._changesTail = null, this._additionsHead = null, this._additionsTail = null, this._removalsHead = null, this._removalsTail = null
        }
        get isDirty() {
          return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead
        }
        forEachItem(e) {
          let t;
          for (t = this._mapHead; null !== t; t = t._next) e(t)
        }
        forEachPreviousItem(e) {
          let t;
          for (t = this._previousMapHead; null !== t; t = t._nextPrevious) e(t)
        }
        forEachChangedItem(e) {
          let t;
          for (t = this._changesHead; null !== t; t = t._nextChanged) e(t)
        }
        forEachAddedItem(e) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) e(t)
        }
        forEachRemovedItem(e) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) e(t)
        }
        diff(e) {
          if (e) {
            if (!(e instanceof Map || Qd(e))) throw new Error(`Error trying to diff '${G(e)}'. Only maps and objects are allowed`)
          } else e = new Map;
          return this.check(e) ? this : null
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let t = this._mapHead;
          if (this._appendAfter = null, this._forEach(e, (r, i) => {
              if (t && t.key === i) this._maybeAddToChanges(t, r), this._appendAfter = t, t = t._next;
              else {
                const s = this._getOrCreateRecordForKey(i, r);
                t = this._insertBeforeOrAppend(t, s)
              }
            }), t) {
            t._prev && (t._prev._next = null), this._removalsHead = t;
            for (let r = t; null !== r; r = r._nextRemoved) r === this._mapHead && (this._mapHead = null), this._records.delete(r.key), r._nextRemoved = r._next, r.previousValue = r.currentValue, r.currentValue = null, r._prev = null, r._next = null
          }
          return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty
        }
        _insertBeforeOrAppend(e, t) {
          if (e) {
            const r = e._prev;
            return t._next = e, t._prev = r, e._prev = t, r && (r._next = t), e === this._mapHead && (this._mapHead = t), this._appendAfter = e, e
          }
          return this._appendAfter ? (this._appendAfter._next = t, t._prev = this._appendAfter) : this._mapHead = t, this._appendAfter = t, null
        }
        _getOrCreateRecordForKey(e, t) {
          if (this._records.has(e)) {
            const i = this._records.get(e);
            this._maybeAddToChanges(i, t);
            const s = i._prev,
              o = i._next;
            return s && (s._next = o), o && (o._prev = s), i._next = null, i._prev = null, i
          }
          const r = new uO(e);
          return this._records.set(e, r), r.currentValue = t, this._addToAdditions(r), r
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (this._previousMapHead = this._mapHead, e = this._previousMapHead; null !== e; e = e._next) e._nextPrevious = e._next;
            for (e = this._changesHead; null !== e; e = e._nextChanged) e.previousValue = e.currentValue;
            for (e = this._additionsHead; null != e; e = e._nextAdded) e.previousValue = e.currentValue;
            this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null
          }
        }
        _maybeAddToChanges(e, t) {
          Object.is(t, e.currentValue) || (e.previousValue = e.currentValue, e.currentValue = t, this._addToChanges(e))
        }
        _addToAdditions(e) {
          null === this._additionsHead ? this._additionsHead = this._additionsTail = e : (this._additionsTail._nextAdded = e, this._additionsTail = e)
        }
        _addToChanges(e) {
          null === this._changesHead ? this._changesHead = this._changesTail = e : (this._changesTail._nextChanged = e, this._changesTail = e)
        }
        _forEach(e, t) {
          e instanceof Map ? e.forEach(t) : Object.keys(e).forEach(r => t(e[r], r))
        }
      }
      class uO {
        constructor(e) {
          this.key = e, this.previousValue = null, this.currentValue = null, this._nextPrevious = null, this._next = null, this._prev = null, this._nextAdded = null, this._nextRemoved = null, this._nextChanged = null
        }
      }

      function ab() {
        return new ds([new rb])
      }
      let ds = (() => {
        class n {
          constructor(t) {
            this.factories = t
          }
          static create(t, r) {
            if (null != r) {
              const i = r.factories.slice();
              t = t.concat(i)
            }
            return new n(t)
          }
          static extend(t) {
            return {
              provide: n,
              useFactory: r => n.create(t, r || ab()),
              deps: [
                [n, new _r, new mt]
              ]
            }
          }
          find(t) {
            const r = this.factories.find(i => i.supports(t));
            if (null != r) return r;
            throw new Error(`Cannot find a differ supporting object '${t}' of type '${function(n){return n.name||typeof n}(t)}'`)
          }
        }
        return n.\u0275prov = M({
          token: n,
          providedIn: "root",
          factory: ab
        }), n
      })();

      function lb() {
        return new hs([new ob])
      }
      let hs = (() => {
        class n {
          constructor(t) {
            this.factories = t
          }
          static create(t, r) {
            if (r) {
              const i = r.factories.slice();
              t = t.concat(i)
            }
            return new n(t)
          }
          static extend(t) {
            return {
              provide: n,
              useFactory: r => n.create(t, r || lb()),
              deps: [
                [n, new _r, new mt]
              ]
            }
          }
          find(t) {
            const r = this.factories.find(i => i.supports(t));
            if (r) return r;
            throw new Error(`Cannot find a differ supporting object '${t}'`)
          }
        }
        return n.\u0275prov = M({
          token: n,
          providedIn: "root",
          factory: lb
        }), n
      })();

      function Pl(n, e, t, r, i = !1) {
        for (; null !== t;) {
          const s = e[t.index];
          if (null !== s && r.push(Pe(s)), sn(s))
            for (let a = 10; a < s.length; a++) {
              const l = s[a],
                c = l[1].firstChild;
              null !== c && Pl(l[1], l, c, r)
            }
          const o = t.type;
          if (8 & o) Pl(n, e, t.child, r);
          else if (32 & o) {
            const a = dd(t, e);
            let l;
            for (; l = a();) r.push(l)
          } else if (16 & o) {
            const a = s_(e, t);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = fo(e[16]);
              Pl(l[1], l, a, r, !0)
            }
          }
          t = i ? t.projectionNext : t.next
        }
        return r
      }
      class Ro {
        constructor(e, t) {
          this._lView = e, this._cdRefInjectingView = t, this._appRef = null, this._attachedToViewContainer = !1
        }
        get rootNodes() {
          const e = this._lView,
            t = e[1];
          return Pl(t, e, t.firstChild, [])
        }
        get context() {
          return this._lView[8]
        }
        set context(e) {
          this._lView[8] = e
        }
        get destroyed() {
          return 256 == (256 & this._lView[2])
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const e = this._lView[3];
            if (sn(e)) {
              const t = e[8],
                r = t ? t.indexOf(this) : -1;
              r > -1 && (md(e, r), Vr(t, r))
            }
            this._attachedToViewContainer = !1
          }
          Ym(this._lView[1], this._lView)
        }
        onDestroy(e) {
          R_(this._lView[1], this._lView, null, e)
        }
        markForCheck() {
          ! function (n) {
            for (; n;) {
              n[2] |= 64;
              const e = fo(n);
              if (H0(n) && !e) return n;
              n = e
            }
          }(this._cdRefInjectingView || this._lView)
        }
        detach() {
          this._lView[2] &= -129
        }
        reattach() {
          this._lView[2] |= 128
        }
        detectChanges() {
          Bd(this._lView[1], this._lView, this.context)
        }
        checkNoChanges() {
          ! function (n, e, t) {
            Ha(!0);
            try {
              Bd(n, e, t)
            } finally {
              Ha(!1)
            }
          }(this._lView[1], this._lView, this.context)
        }
        attachToViewContainerRef() {
          if (this._appRef) throw new Error("This view is already attached directly to the ApplicationRef!");
          this._attachedToViewContainer = !0
        }
        detachFromAppRef() {
          this._appRef = null,
            function (n, e) {
              po(n, e, e[W], 2, null, null)
            }(this._lView[1], this._lView)
        }
        attachToAppRef(e) {
          if (this._attachedToViewContainer) throw new Error("This view is already attached to a ViewContainer!");
          this._appRef = e
        }
      }
      class hO extends Ro {
        constructor(e) {
          super(e), this._view = e
        }
        detectChanges() {
          B_(this._view)
        }
        checkNoChanges() {
          ! function (n) {
            Ha(!0);
            try {
              B_(n)
            } finally {
              Ha(!1)
            }
          }(this._view)
        }
        get context() {
          return null
        }
      }
      const pO = function (n) {
        return function (n, e, t) {
          if (La(n) && !t) {
            const r = wt(n.index, e);
            return new Ro(r, r)
          }
          return 47 & n.type ? new Ro(e[16], e) : null
        }(Ve(), C(), 16 == (16 & n))
      };
      let Qr = (() => {
        class n {}
        return n.__NG_ELEMENT_ID__ = pO, n
      })();
      const _O = [new ob],
        vO = new ds([new rb]),
        bO = new hs(_O),
        EO = function () {
          return Nl(Ve(), C())
        };
      let zt = (() => {
        class n {}
        return n.__NG_ELEMENT_ID__ = EO, n
      })();
      const wO = zt,
        DO = class extends wO {
          constructor(e, t, r) {
            super(), this._declarationLView = e, this._declarationTContainer = t, this.elementRef = r
          }
          createEmbeddedView(e) {
            const t = this._declarationTContainer.tViews,
              r = go(this._declarationLView, t, e, 16, null, t.declTNode, null, null, null, null);
            r[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return null !== s && (r[19] = s.createEmbeddedView(t)), mo(t, r, e), new Ro(r)
          }
        };

      function Nl(n, e) {
        return 4 & n.type ? new DO(e, n, us(n, e)) : null
      }
      class Fn {}
      class cb {}
      const MO = function () {
        return hb(Ve(), C())
      };
      let ut = (() => {
        class n {}
        return n.__NG_ELEMENT_ID__ = MO, n
      })();
      const IO = ut,
        ub = class extends IO {
          constructor(e, t, r) {
            super(), this._lContainer = e, this._hostTNode = t, this._hostLView = r
          }
          get element() {
            return us(this._hostTNode, this._hostLView)
          }
          get injector() {
            return new Oi(this._hostTNode, this._hostLView)
          }
          get parentInjector() {
            const e = Ya(this._hostTNode, this._hostLView);
            if (Jg(e)) {
              const t = xi(e, this._hostLView),
                r = Ri(e);
              return new Oi(t[1].data[r + 8], t)
            }
            return new Oi(null, this._hostLView)
          }
          clear() {
            for (; this.length > 0;) this.remove(this.length - 1)
          }
          get(e) {
            const t = db(this._lContainer);
            return null !== t && t[e] || null
          }
          get length() {
            return this._lContainer.length - 10
          }
          createEmbeddedView(e, t, r) {
            const i = e.createEmbeddedView(t || {});
            return this.insert(i, r), i
          }
          createComponent(e, t, r, i, s) {
            const o = r || this.parentInjector;
            if (!s && null == e.ngModule && o) {
              const l = o.get(Fn, null);
              l && (s = l)
            }
            const a = e.create(o, i, void 0, s);
            return this.insert(a.hostView, t), a
          }
          insert(e, t) {
            const r = e._lView,
              i = r[1];
            if (function (n) {
                return sn(n[3])
              }(r)) {
              const u = this.indexOf(e);
              if (-1 !== u) this.detach(u);
              else {
                const d = r[3],
                  h = new ub(d, d[6], d[3]);
                h.detach(h.indexOf(e))
              }
            }
            const s = this._adjustIndex(t),
              o = this._lContainer;
            ! function (n, e, t, r) {
              const i = 10 + r,
                s = t.length;
              r > 0 && (t[i - 1][4] = e), r < s - 10 ? (e[4] = t[i], nl(t, 10 + r, e)) : (t.push(e), e[4] = null), e[3] = t;
              const o = e[17];
              null !== o && t !== o && function (n, e) {
                const t = n[9];
                e[16] !== e[3][3][16] && (n[2] = !0), null === t ? n[9] = [e] : t.push(e)
              }(o, e);
              const a = e[19];
              null !== a && a.insertView(n), e[2] |= 128
            }(i, r, o, s);
            const a = vd(s, o),
              l = r[W],
              c = dl(l, o[7]);
            return null !== c && function (n, e, t, r, i, s) {
              r[0] = i, r[6] = e, po(n, r, t, 1, i, s)
            }(i, o[6], l, r, c, a), e.attachToViewContainerRef(), nl(_h(o), s, e), e
          }
          move(e, t) {
            return this.insert(e, t)
          }
          indexOf(e) {
            const t = db(this._lContainer);
            return null !== t ? t.indexOf(e) : -1
          }
          remove(e) {
            const t = this._adjustIndex(e, -1),
              r = md(this._lContainer, t);
            r && (Vr(_h(this._lContainer), t), Ym(r[1], r))
          }
          detach(e) {
            const t = this._adjustIndex(e, -1),
              r = md(this._lContainer, t);
            return r && null != Vr(_h(this._lContainer), t) ? new Ro(r) : null
          }
          _adjustIndex(e, t = 0) {
            return null == e ? this.length + t : e
          }
        };

      function db(n) {
        return n[8]
      }

      function _h(n) {
        return n[8] || (n[8] = [])
      }

      function hb(n, e) {
        let t;
        const r = e[n.index];
        if (sn(r)) t = r;
        else {
          let i;
          if (8 & n.type) i = Pe(r);
          else {
            const s = e[W];
            i = s.createComment("");
            const o = Ft(n, e);
            Ur(s, dl(s, o), i, function (n, e) {
              return Se(n) ? n.nextSibling(e) : e.nextSibling
            }(s, o), !1)
          }
          e[n.index] = t = function (n, e, t, r) {
            return new Array(n, !0, !1, e, null, 0, r, t, null, null)
          }(r, e, i, n), yl(e, t)
        }
        return new ub(t, n, e)
      }
      const ms = {};
      class Ob extends Xn {
        constructor(e) {
          super(), this.ngModule = e
        }
        resolveComponentFactory(e) {
          const t = st(e);
          return new Pb(t, this.ngModule)
        }
      }

      function kb(n) {
        const e = [];
        for (let t in n) n.hasOwnProperty(t) && e.push({
          propName: n[t],
          templateName: t
        });
        return e
      }
      const Sk = new P("SCHEDULER_TOKEN", {
        providedIn: "root",
        factory: () => Um
      });
      class Pb extends Xv {
        constructor(e, t) {
          super(), this.componentDef = e, this.ngModule = t, this.componentType = e.type, this.selector = function (n) {
            return n.map(_A).join(",")
          }(e.selectors), this.ngContentSelectors = e.ngContentSelectors ? e.ngContentSelectors : [], this.isBoundToModule = !!t
        }
        get inputs() {
          return kb(this.componentDef.inputs)
        }
        get outputs() {
          return kb(this.componentDef.outputs)
        }
        create(e, t, r, i) {
          const s = (i = i || this.ngModule) ? function (n, e) {
              return {
                get: (t, r, i) => {
                  const s = n.get(t, ms, i);
                  return s !== ms || r === ms ? s : e.get(t, r, i)
                }
              }
            }(e, i.injector) : e,
            o = s.get(Gr, Fg),
            a = s.get(mh, null),
            l = o.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            u = r ? function (n, e, t) {
              if (Se(n)) return n.selectRootElement(e, t === Oe.ShadowDom);
              let r = "string" == typeof e ? n.querySelector(e) : e;
              return r.textContent = "", r
            }(l, r, this.componentDef.encapsulation) : gd(o.createRenderer(null, this.componentDef), c, function (n) {
              const e = n.toLowerCase();
              return "svg" === e ? "http://www.w3.org/2000/svg" : "math" === e ? "http://www.w3.org/1998/MathML/" : null
            }(c)),
            d = this.componentDef.onPush ? 576 : 528,
            h = function (n, e) {
              return {
                components: [],
                scheduler: n || Um,
                clean: tI,
                playerHandler: e || null,
                flags: 0
              }
            }(),
            f = _l(0, null, null, 1, 0, null, null, null, null, null),
            p = go(null, f, h, d, null, null, o, l, a, s);
          let m, g;
          Ua(p);
          try {
            const v = function (n, e, t, r, i, s) {
              const o = t[1];
              t[20] = n;
              const l = zi(o, 20, 2, "#host", null),
                c = l.mergedAttrs = e.hostAttrs;
              null !== c && (vl(l, c, !0), null !== n && (Ga(i, n, c), null !== l.classes && Cd(i, n, l.classes), null !== l.styles && l_(i, n, l.styles)));
              const u = r.createRenderer(n, e),
                d = go(t, M_(e), null, e.onPush ? 64 : 16, t[20], l, r, u, s || null, null);
              return o.firstCreatePass && (Za(Xs(l, t), o, e.type), N_(o, l), F_(l, t.length, 1)), yl(t, d), t[20] = d
            }(u, this.componentDef, p, o, l);
            if (u)
              if (r) Ga(l, u, ["ng-version", nb.full]);
              else {
                const {
                  attrs: y,
                  classes: E
                } = function (n) {
                  const e = [],
                    t = [];
                  let r = 1,
                    i = 2;
                  for (; r < n.length;) {
                    let s = n[r];
                    if ("string" == typeof s) 2 === i ? "" !== s && e.push(s, n[++r]) : 8 === i && t.push(s);
                    else {
                      if (!an(i)) break;
                      i = s
                    }
                    r++
                  }
                  return {
                    attrs: e,
                    classes: t
                  }
                }(this.componentDef.selectors[0]);
                y && Ga(l, u, y), E && E.length > 0 && Cd(l, u, E.join(" "))
              } if (g = function (n, e) {
                return n.data[e]
              }(f, 20), void 0 !== t) {
              const y = g.projection = [];
              for (let E = 0; E < this.ngContentSelectors.length; E++) {
                const w = t[E];
                y.push(null != w ? Array.from(w) : null)
              }
            }
            m = function (n, e, t, r, i) {
              const s = t[1],
                o = function (n, e, t) {
                  const r = Ve();
                  n.firstCreatePass && (t.providersResolver && t.providersResolver(t), L_(n, r, e, Wi(n, e, 1, null), t));
                  const i = Js(e, n, r.directiveStart, r);
                  Ze(i, e);
                  const s = Ft(r, e);
                  return s && Ze(s, e), i
                }(s, t, e);
              if (r.components.push(o), n[8] = o, i && i.forEach(l => l(o, e)), e.contentQueries) {
                const l = Ve();
                e.contentQueries(1, o, l.directiveStart)
              }
              const a = Ve();
              return !s.firstCreatePass || null === e.hostBindings && null === e.hostAttrs || (pr(a.index), k_(t[1], a, 0, a.directiveStart, a.directiveEnd, e), P_(e, o)), o
            }(v, this.componentDef, p, h, [MI]), mo(f, p, null)
          } finally {
            $a()
          }
          return new Ak(this.componentType, m, us(g, p), p, g)
        }
      }
      class Ak extends class {} {
        constructor(e, t, r, i, s) {
          super(), this.location = r, this._rootLView = i, this._tNode = s, this.instance = t, this.hostView = this.changeDetectorRef = new hO(i), this.componentType = e
        }
        get injector() {
          return new Oi(this._tNode, this._rootLView)
        }
        destroy() {
          this.hostView.destroy()
        }
        onDestroy(e) {
          this.hostView.onDestroy(e)
        }
      }
      const _s = new Map;
      class xk extends Fn {
        constructor(e, t) {
          super(), this._parent = t, this._bootstrapComponents = [], this.injector = this, this.destroyCbs = [], this.componentFactoryResolver = new Ob(this);
          const r = kt(e),
            i = function (n) {
              return n[k0] || null
            }(e);
          i && lh(i), this._bootstrapComponents = Rn(r.bootstrap), this._r3Injector = G_(e, t, [{
            provide: Fn,
            useValue: this
          }, {
            provide: Xn,
            useValue: this.componentFactoryResolver
          }], G(e)), this._r3Injector._resolveInjectorDefTypes(), this.instance = this.get(e)
        }
        get(e, t = he.THROW_IF_NOT_FOUND, r = x.Default) {
          return e === he || e === Fn || e === Gi ? this : this._r3Injector.get(e, t, r)
        }
        destroy() {
          const e = this._r3Injector;
          !e.destroyed && e.destroy(), this.destroyCbs.forEach(t => t()), this.destroyCbs = null
        }
        onDestroy(e) {
          this.destroyCbs.push(e)
        }
      }
      class Rh extends cb {
        constructor(e) {
          super(), this.moduleType = e, null !== kt(e) && function (n) {
            const e = new Set;
            ! function t(r) {
              const i = kt(r, !0),
                s = i.id;
              null !== s && (function (n, e, t) {
                if (e && e !== t) throw new Error(`Duplicate module registered for ${n} - ${G(e)} vs ${G(e.name)}`)
              }(s, _s.get(s), r), _s.set(s, r));
              const o = Rn(i.imports);
              for (const a of o) e.has(a) || (e.add(a), t(a))
            }(n)
          }(e)
        }
        create(e) {
          return new xk(this.moduleType, e)
        }
      }

      function xh(n) {
        return e => {
          setTimeout(n, void 0, e)
        }
      }
      const Ee = class extends X {
        constructor(e = !1) {
          super(), this.__isAsync = e
        }
        emit(e) {
          super.next(e)
        }
        subscribe(e, t, r) {
          var i, s, o;
          let a = e,
            l = t || (() => null),
            c = r;
          if (e && "object" == typeof e) {
            const d = e;
            a = null === (i = d.next) || void 0 === i ? void 0 : i.bind(d), l = null === (s = d.error) || void 0 === s ? void 0 : s.bind(d), c = null === (o = d.complete) || void 0 === o ? void 0 : o.bind(d)
          }
          this.__isAsync && (l = xh(l), a && (a = xh(a)), c && (c = xh(c)));
          const u = super.subscribe({
            next: a,
            error: l,
            complete: c
          });
          return e instanceof ie && e.add(u), u
        }
      };

      function Yk() {
        return this._results[Yi()]()
      }
      class jl {
        constructor(e = !1) {
          this._emitDistinctChangesOnly = e, this.dirty = !0, this._results = [], this._changesDetected = !1, this._changes = null, this.length = 0, this.first = void 0, this.last = void 0;
          const t = Yi(),
            r = jl.prototype;
          r[t] || (r[t] = Yk)
        }
        get changes() {
          return this._changes || (this._changes = new Ee)
        }
        get(e) {
          return this._results[e]
        }
        map(e) {
          return this._results.map(e)
        }
        filter(e) {
          return this._results.filter(e)
        }
        find(e) {
          return this._results.find(e)
        }
        reduce(e, t) {
          return this._results.reduce(e, t)
        }
        forEach(e) {
          this._results.forEach(e)
        }
        some(e) {
          return this._results.some(e)
        }
        toArray() {
          return this._results.slice()
        }
        toString() {
          return this._results.toString()
        }
        reset(e, t) {
          const r = this;
          r.dirty = !1;
          const i = Lt(e);
          (this._changesDetected = ! function (n, e, t) {
            if (n.length !== e.length) return !1;
            for (let r = 0; r < n.length; r++) {
              let i = n[r],
                s = e[r];
              if (t && (i = t(i), s = t(s)), s !== i) return !1
            }
            return !0
          }(r._results, i, t)) && (r._results = i, r.length = i.length, r.last = i[this.length - 1], r.first = i[0])
        }
        notifyOnChanges() {
          this._changes && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.emit(this)
        }
        setDirty() {
          this.dirty = !0
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe()
        }
      }
      Symbol;
      class Oh {
        constructor(e) {
          this.queryList = e, this.matches = null
        }
        clone() {
          return new Oh(this.queryList)
        }
        setDirty() {
          this.queryList.setDirty()
        }
      }
      class kh {
        constructor(e = []) {
          this.queries = e
        }
        createEmbeddedView(e) {
          const t = e.queries;
          if (null !== t) {
            const r = null !== e.contentQueries ? e.contentQueries[0] : t.length,
              i = [];
            for (let s = 0; s < r; s++) {
              const o = t.getByIndex(s);
              i.push(this.queries[o.indexInDeclarationView].clone())
            }
            return new kh(i)
          }
          return null
        }
        insertView(e) {
          this.dirtyQueriesWithMatches(e)
        }
        detachView(e) {
          this.dirtyQueriesWithMatches(e)
        }
        dirtyQueriesWithMatches(e) {
          for (let t = 0; t < this.queries.length; t++) null !== qb(e, t).matches && this.queries[t].setDirty()
        }
      }
      class Ub {
        constructor(e, t, r = null) {
          this.predicate = e, this.flags = t, this.read = r
        }
      }
      class Ph {
        constructor(e = []) {
          this.queries = e
        }
        elementStart(e, t) {
          for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(e, t)
        }
        elementEnd(e) {
          for (let t = 0; t < this.queries.length; t++) this.queries[t].elementEnd(e)
        }
        embeddedTView(e) {
          let t = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== t ? t.length : 0,
              s = this.getByIndex(r).embeddedTView(e, i);
            s && (s.indexInDeclarationView = r, null !== t ? t.push(s) : t = [s])
          }
          return null !== t ? new Ph(t) : null
        }
        template(e, t) {
          for (let r = 0; r < this.queries.length; r++) this.queries[r].template(e, t)
        }
        getByIndex(e) {
          return this.queries[e]
        }
        get length() {
          return this.queries.length
        }
        track(e) {
          this.queries.push(e)
        }
      }
      class Nh {
        constructor(e, t = -1) {
          this.metadata = e, this.matches = null, this.indexInDeclarationView = -1, this.crossesNgTemplate = !1, this._appliesToNextNode = !0, this._declarationNodeIndex = t
        }
        elementStart(e, t) {
          this.isApplyingToNode(t) && this.matchTNode(e, t)
        }
        elementEnd(e) {
          this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1)
        }
        template(e, t) {
          this.elementStart(e, t)
        }
        embeddedTView(e, t) {
          return this.isApplyingToNode(e) ? (this.crossesNgTemplate = !0, this.addMatch(-e.index, t), new Nh(this.metadata)) : null
        }
        isApplyingToNode(e) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let r = e.parent;
            for (; null !== r && 8 & r.type && r.index !== t;) r = r.parent;
            return t === (null !== r ? r.index : -1)
          }
          return this._appliesToNextNode
        }
        matchTNode(e, t) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const s = r[i];
              this.matchTNodeWithReadOption(e, t, Jk(t, s)), this.matchTNodeWithReadOption(e, t, Xa(t, e, s, !1, !1))
            } else r === zt ? 4 & t.type && this.matchTNodeWithReadOption(e, t, -1) : this.matchTNodeWithReadOption(e, t, Xa(t, e, r, !1, !1))
        }
        matchTNodeWithReadOption(e, t, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === ae || i === ut || i === zt && 4 & t.type) this.addMatch(t.index, -2);
              else {
                const s = Xa(t, e, i, !1, !1);
                null !== s && this.addMatch(t.index, s)
              }
            else this.addMatch(t.index, r)
          }
        }
        addMatch(e, t) {
          null === this.matches ? this.matches = [e, t] : this.matches.push(e, t)
        }
      }

      function Jk(n, e) {
        const t = n.localNames;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2)
            if (t[r] === e) return t[r + 1];
        return null
      }

      function tP(n, e, t, r) {
        return -1 === t ? function (n, e) {
          return 11 & n.type ? us(n, e) : 4 & n.type ? Nl(n, e) : null
        }(e, n) : -2 === t ? function (n, e, t) {
          return t === ae ? us(e, n) : t === zt ? Nl(e, n) : t === ut ? hb(e, n) : void 0
        }(n, e, r) : Js(n, n[1], t, e)
      }

      function $b(n, e, t, r) {
        const i = e[19].queries[r];
        if (null === i.matches) {
          const s = n.data,
            o = t.matches,
            a = [];
          for (let l = 0; l < o.length; l += 2) {
            const c = o[l];
            a.push(c < 0 ? null : tP(e, s[c], o[l + 1], t.metadata.read))
          }
          i.matches = a
        }
        return i.matches
      }

      function Fh(n, e, t, r) {
        const i = n.queries.getByIndex(t),
          s = i.matches;
        if (null !== s) {
          const o = $b(n, e, i, t);
          for (let a = 0; a < s.length; a += 2) {
            const l = s[a];
            if (l > 0) r.push(o[a / 2]);
            else {
              const c = s[a + 1],
                u = e[-l];
              for (let d = 10; d < u.length; d++) {
                const h = u[d];
                h[17] === h[3] && Fh(h[1], h, c, r)
              }
              if (null !== u[9]) {
                const d = u[9];
                for (let h = 0; h < d.length; h++) {
                  const f = d[h];
                  Fh(f[1], f, c, r)
                }
              }
            }
          }
        }
        return r
      }

      function Xr(n) {
        const e = C(),
          t = te(),
          r = zg();
        Bu(r + 1);
        const i = qb(t, r);
        if (n.dirty && Lg(e) === (2 == (2 & i.metadata.flags))) {
          if (null === i.matches) n.reset([]);
          else {
            const s = i.crossesNgTemplate ? Fh(t, e, r, []) : $b(t, e, i, r);
            n.reset(s, tb), n.notifyOnChanges()
          }
          return !0
        }
        return !1
      }

      function Ul(n, e, t, r) {
        const i = te();
        if (i.firstCreatePass) {
          const s = Ve();
          (function (n, e, t) {
            null === n.queries && (n.queries = new Ph), n.queries.track(new Nh(e, t))
          })(i, new Ub(e, t, r), s.index),
          function (n, e) {
            const t = n.contentQueries || (n.contentQueries = []);
            e !== (t.length ? t[t.length - 1] : -1) && t.push(n.queries.length - 1, e)
          }(i, n), 2 == (2 & t) && (i.staticContentQueries = !0)
        }! function (n, e, t) {
          const r = new jl(4 == (4 & t));
          R_(n, e, r, r.destroy), null === e[19] && (e[19] = new kh), e[19].queries.push(new Oh(r))
        }(i, C(), t)
      }

      function qb(n, e) {
        return n.queries.getByIndex(e)
      }
      const Uo = new P("Application Initializer");
      let vs = (() => {
        class n {
          constructor(t) {
            this.appInits = t, this.resolve = Ol, this.reject = Ol, this.initialized = !1, this.done = !1, this.donePromise = new Promise((r, i) => {
              this.resolve = r, this.reject = i
            })
          }
          runInitializers() {
            if (this.initialized) return;
            const t = [],
              r = () => {
                this.done = !0, this.resolve()
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const s = this.appInits[i]();
                if (wl(s)) t.push(s);
                else if (th(s)) {
                  const o = new Promise((a, l) => {
                    s.subscribe({
                      complete: a,
                      error: l
                    })
                  });
                  t.push(o)
                }
              }
            Promise.all(t).then(() => {
              r()
            }).catch(i => {
              this.reject(i)
            }), 0 === t.length && r(), this.initialized = !0
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(Uo, 8))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const $o = new P("AppId"),
        OP = {
          provide: $o,
          useFactory: function () {
            return `${Uh()}${Uh()}${Uh()}`
          },
          deps: []
        };

      function Uh() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()))
      }
      const uC = new P("Platform Initializer"),
        zo = new P("Platform ID"),
        dC = new P("appBootstrapListener");
      let Wl = (() => {
        class n {
          log(t) {
            console.log(t)
          }
          warn(t) {
            console.warn(t)
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const Jn = new P("LocaleId"),
        hC = new P("DefaultCurrencyCode");
      class PP {
        constructor(e, t) {
          this.ngModuleFactory = e, this.componentFactories = t
        }
      }
      const $h = function (n) {
          return new Rh(n)
        },
        NP = $h,
        FP = function (n) {
          return Promise.resolve($h(n))
        },
        fC = function (n) {
          const e = $h(n),
            r = Rn(kt(n).declarations).reduce((i, s) => {
              const o = st(s);
              return o && i.push(new Pb(o)), i
            }, []);
          return new PP(e, r)
        },
        LP = fC,
        VP = function (n) {
          return Promise.resolve(fC(n))
        };
      let ei = (() => {
        class n {
          constructor() {
            this.compileModuleSync = NP, this.compileModuleAsync = FP, this.compileModuleAndAllComponentsSync = LP, this.compileModuleAndAllComponentsAsync = VP
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
        }
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const HP = (() => Promise.resolve(0))();

      function zh(n) {
        "undefined" == typeof Zone ? HP.then(() => {
          n && n.apply(null, null)
        }) : Zone.current.scheduleMicroTask("scheduleMicrotask", n)
      }
      class z {
        constructor({
          enableLongStackTrace: e = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: r = !1
        }) {
          if (this.hasPendingMacrotasks = !1, this.hasPendingMicrotasks = !1, this.isStable = !0, this.onUnstable = new Ee(!1), this.onMicrotaskEmpty = new Ee(!1), this.onStable = new Ee(!1), this.onError = new Ee(!1), "undefined" == typeof Zone) throw new Error("In this configuration Angular requires Zone.js");
          Zone.assertZonePatched();
          const i = this;
          i._nesting = 0, i._outer = i._inner = Zone.current, Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec)), e && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)), i.shouldCoalesceEventChangeDetection = !r && t, i.shouldCoalesceRunChangeDetection = r, i.lastRequestAnimationFrameId = -1, i.nativeRequestAnimationFrame = function () {
              let n = oe.requestAnimationFrame,
                e = oe.cancelAnimationFrame;
              if ("undefined" != typeof Zone && n && e) {
                const t = n[Zone.__symbol__("OriginalDelegate")];
                t && (n = t);
                const r = e[Zone.__symbol__("OriginalDelegate")];
                r && (e = r)
              }
              return {
                nativeRequestAnimationFrame: n,
                nativeCancelAnimationFrame: e
              }
            }().nativeRequestAnimationFrame,
            function (n) {
              const e = () => {
                ! function (n) {
                  n.isCheckStableRunning || -1 !== n.lastRequestAnimationFrameId || (n.lastRequestAnimationFrameId = n.nativeRequestAnimationFrame.call(oe, () => {
                    n.fakeTopEventTask || (n.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
                      n.lastRequestAnimationFrameId = -1, qh(n), n.isCheckStableRunning = !0, Wh(n), n.isCheckStableRunning = !1
                    }, void 0, () => {}, () => {})), n.fakeTopEventTask.invoke()
                  }), qh(n))
                }(n)
              };
              n._inner = n._inner.fork({
                name: "angular",
                properties: {
                  isAngularZone: !0
                },
                onInvokeTask: (t, r, i, s, o, a) => {
                  try {
                    return pC(n), t.invokeTask(i, s, o, a)
                  } finally {
                    (n.shouldCoalesceEventChangeDetection && "eventTask" === s.type || n.shouldCoalesceRunChangeDetection) && e(), gC(n)
                  }
                },
                onInvoke: (t, r, i, s, o, a, l) => {
                  try {
                    return pC(n), t.invoke(i, s, o, a, l)
                  } finally {
                    n.shouldCoalesceRunChangeDetection && e(), gC(n)
                  }
                },
                onHasTask: (t, r, i, s) => {
                  t.hasTask(i, s), r === i && ("microTask" == s.change ? (n._hasPendingMicrotasks = s.microTask, qh(n), Wh(n)) : "macroTask" == s.change && (n.hasPendingMacrotasks = s.macroTask))
                },
                onHandleError: (t, r, i, s) => (t.handleError(i, s), n.runOutsideAngular(() => n.onError.emit(s)), !1)
              })
            }(i)
        }
        static isInAngularZone() {
          return !0 === Zone.current.get("isAngularZone")
        }
        static assertInAngularZone() {
          if (!z.isInAngularZone()) throw new Error("Expected to be in Angular Zone, but it is not!")
        }
        static assertNotInAngularZone() {
          if (z.isInAngularZone()) throw new Error("Expected to not be in Angular Zone, but it is!")
        }
        run(e, t, r) {
          return this._inner.run(e, t, r)
        }
        runTask(e, t, r, i) {
          const s = this._inner,
            o = s.scheduleEventTask("NgZoneEvent: " + i, e, $P, Ol, Ol);
          try {
            return s.runTask(o, t, r)
          } finally {
            s.cancelTask(o)
          }
        }
        runGuarded(e, t, r) {
          return this._inner.runGuarded(e, t, r)
        }
        runOutsideAngular(e) {
          return this._outer.run(e)
        }
      }
      const $P = {};

      function Wh(n) {
        if (0 == n._nesting && !n.hasPendingMicrotasks && !n.isStable) try {
          n._nesting++, n.onMicrotaskEmpty.emit(null)
        } finally {
          if (n._nesting--, !n.hasPendingMicrotasks) try {
            n.runOutsideAngular(() => n.onStable.emit(null))
          } finally {
            n.isStable = !0
          }
        }
      }

      function qh(n) {
        n.hasPendingMicrotasks = !!(n._hasPendingMicrotasks || (n.shouldCoalesceEventChangeDetection || n.shouldCoalesceRunChangeDetection) && -1 !== n.lastRequestAnimationFrameId)
      }

      function pC(n) {
        n._nesting++, n.isStable && (n.isStable = !1, n.onUnstable.emit(null))
      }

      function gC(n) {
        n._nesting--, Wh(n)
      }
      class qP {
        constructor() {
          this.hasPendingMicrotasks = !1, this.hasPendingMacrotasks = !1, this.isStable = !0, this.onUnstable = new Ee, this.onMicrotaskEmpty = new Ee, this.onStable = new Ee, this.onError = new Ee
        }
        run(e, t, r) {
          return e.apply(t, r)
        }
        runGuarded(e, t, r) {
          return e.apply(t, r)
        }
        runOutsideAngular(e) {
          return e()
        }
        runTask(e, t, r, i) {
          return e.apply(t, r)
        }
      }
      let Gh = (() => {
          class n {
            constructor(t) {
              this._ngZone = t, this._pendingCount = 0, this._isZoneStable = !0, this._didWork = !1, this._callbacks = [], this.taskTrackingZone = null, this._watchAngularEvents(), t.run(() => {
                this.taskTrackingZone = "undefined" == typeof Zone ? null : Zone.current.get("TaskTrackingZone")
              })
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  this._didWork = !0, this._isZoneStable = !1
                }
              }), this._ngZone.runOutsideAngular(() => {
                this._ngZone.onStable.subscribe({
                  next: () => {
                    z.assertNotInAngularZone(), zh(() => {
                      this._isZoneStable = !0, this._runCallbacksIfReady()
                    })
                  }
                })
              })
            }
            increasePendingRequestCount() {
              return this._pendingCount += 1, this._didWork = !0, this._pendingCount
            }
            decreasePendingRequestCount() {
              if (this._pendingCount -= 1, this._pendingCount < 0) throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount
            }
            isStable() {
              return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
            }
            _runCallbacksIfReady() {
              if (this.isStable()) zh(() => {
                for (; 0 !== this._callbacks.length;) {
                  let t = this._callbacks.pop();
                  clearTimeout(t.timeoutId), t.doneCb(this._didWork)
                }
                this._didWork = !1
              });
              else {
                let t = this.getPendingTasks();
                this._callbacks = this._callbacks.filter(r => !r.updateCb || !r.updateCb(t) || (clearTimeout(r.timeoutId), !1)), this._didWork = !0
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(t => ({
                source: t.source,
                creationLocation: t.creationLocation,
                data: t.data
              })) : []
            }
            addCallback(t, r, i) {
              let s = -1;
              r && r > 0 && (s = setTimeout(() => {
                this._callbacks = this._callbacks.filter(o => o.timeoutId !== s), t(this._didWork, this.getPendingTasks())
              }, r)), this._callbacks.push({
                doneCb: t,
                timeoutId: s,
                updateCb: i
              })
            }
            whenStable(t, r, i) {
              if (i && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
              this.addCallback(t, r, i), this._runCallbacksIfReady()
            }
            getPendingRequestCount() {
              return this._pendingCount
            }
            findProviders(t, r, i) {
              return []
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(z))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        mC = (() => {
          class n {
            constructor() {
              this._applications = new Map, Kh.addToWindow(this)
            }
            registerApplication(t, r) {
              this._applications.set(t, r)
            }
            unregisterApplication(t) {
              this._applications.delete(t)
            }
            unregisterAllApplications() {
              this._applications.clear()
            }
            getTestability(t) {
              return this._applications.get(t) || null
            }
            getAllTestabilities() {
              return Array.from(this._applications.values())
            }
            getAllRootElements() {
              return Array.from(this._applications.keys())
            }
            findTestabilityInTree(t, r = !0) {
              return Kh.findTestabilityInTree(this, t, r)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })();
      class GP {
        addToWindow(e) {}
        findTestabilityInTree(e, t, r) {
          return null
        }
      }
      let Kh = new GP,
        _C = !0,
        yC = !1;

      function Qh() {
        return yC = !0, _C
      }
      let gn;
      const vC = new P("AllowMultipleToken");
      class Yh {
        constructor(e, t) {
          this.name = e, this.token = t
        }
      }

      function bC(n, e, t = []) {
        const r = `Platform: ${e}`,
          i = new P(r);
        return (s = []) => {
          let o = CC();
          if (!o || o.injector.get(vC, !1))
            if (n) n(t.concat(s).concat({
              provide: i,
              useValue: !0
            }));
            else {
              const a = t.concat(s).concat({
                provide: i,
                useValue: !0
              }, {
                provide: _o,
                useValue: "platform"
              });
              ! function (n) {
                if (gn && !gn.destroyed && !gn.injector.get(vC, !1)) throw new Error("There can be only one platform. Destroy the previous one to create a new one.");
                gn = n.get(EC);
                const e = n.get(uC, null);
                e && e.forEach(t => t())
              }(he.create({
                providers: a,
                name: r
              }))
            } return function (n) {
            const e = CC();
            if (!e) throw new Error("No platform exists!");
            if (!e.injector.get(n, null)) throw new Error("A platform with a different configuration has been created. Please destroy it first.");
            return e
          }(i)
        }
      }

      function CC() {
        return gn && !gn.destroyed ? gn : null
      }
      let EC = (() => {
        class n {
          constructor(t) {
            this._injector = t, this._modules = [], this._destroyListeners = [], this._destroyed = !1
          }
          bootstrapModuleFactory(t, r) {
            const a = function (n, e) {
                let t;
                return t = "noop" === n ? new qP : ("zone.js" === n ? void 0 : n) || new z({
                  enableLongStackTrace: Qh(),
                  shouldCoalesceEventChangeDetection: !!(null == e ? void 0 : e.ngZoneEventCoalescing),
                  shouldCoalesceRunChangeDetection: !!(null == e ? void 0 : e.ngZoneRunCoalescing)
                }), t
              }(r ? r.ngZone : void 0, {
                ngZoneEventCoalescing: r && r.ngZoneEventCoalescing || !1,
                ngZoneRunCoalescing: r && r.ngZoneRunCoalescing || !1
              }),
              l = [{
                provide: z,
                useValue: a
              }];
            return a.run(() => {
              const c = he.create({
                  providers: l,
                  parent: this.injector,
                  name: t.moduleType.name
                }),
                u = t.create(c),
                d = u.injector.get(Hr, null);
              if (!d) throw new Error("No ErrorHandler. Is platform module (BrowserModule) included?");
              return a.runOutsideAngular(() => {
                  const h = a.onError.subscribe({
                    next: f => {
                      d.handleError(f)
                    }
                  });
                  u.onDestroy(() => {
                    Zh(this._modules, u), h.unsubscribe()
                  })
                }),
                function (n, e, t) {
                  try {
                    const r = t();
                    return wl(r) ? r.catch(i => {
                      throw e.runOutsideAngular(() => n.handleError(i)), i
                    }) : r
                  } catch (r) {
                    throw e.runOutsideAngular(() => n.handleError(r)), r
                  }
                }(d, a, () => {
                  const h = u.injector.get(vs);
                  return h.runInitializers(), h.donePromise.then(() => (lh(u.injector.get(Jn, Ml) || Ml), this._moduleDoBootstrap(u), u))
                })
            })
          }
          bootstrapModule(t, r = []) {
            const i = wC({}, r);
            return function (n, e, t) {
              const r = new Rh(t);
              return Promise.resolve(r)
            }(0, 0, t).then(s => this.bootstrapModuleFactory(s, i))
          }
          _moduleDoBootstrap(t) {
            const r = t.injector.get(ti);
            if (t._bootstrapComponents.length > 0) t._bootstrapComponents.forEach(i => r.bootstrap(i));
            else {
              if (!t.instance.ngDoBootstrap) throw new Error(`The module ${G(t.instance.constructor)} was bootstrapped, but it does not declare "@NgModule.bootstrap" components nor a "ngDoBootstrap" method. Please define one of these.`);
              t.instance.ngDoBootstrap(r)
            }
            this._modules.push(t)
          }
          onDestroy(t) {
            this._destroyListeners.push(t)
          }
          get injector() {
            return this._injector
          }
          destroy() {
            if (this._destroyed) throw new Error("The platform has already been destroyed!");
            this._modules.slice().forEach(t => t.destroy()), this._destroyListeners.forEach(t => t()), this._destroyed = !0
          }
          get destroyed() {
            return this._destroyed
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(he))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();

      function wC(n, e) {
        return Array.isArray(e) ? e.reduce(wC, n) : Object.assign(Object.assign({}, n), e)
      }
      let ti = (() => {
        class n {
          constructor(t, r, i, s, o) {
            this._zone = t, this._injector = r, this._exceptionHandler = i, this._componentFactoryResolver = s, this._initStatus = o, this._bootstrapListeners = [], this._views = [], this._runningTick = !1, this._stable = !0, this.componentTypes = [], this.components = [], this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this._zone.run(() => {
                  this.tick()
                })
              }
            });
            const a = new re(c => {
                this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks, this._zone.runOutsideAngular(() => {
                  c.next(this._stable), c.complete()
                })
              }),
              l = new re(c => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    z.assertNotInAngularZone(), zh(() => {
                      !this._stable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks && (this._stable = !0, c.next(!0))
                    })
                  })
                });
                const d = this._zone.onUnstable.subscribe(() => {
                  z.assertInAngularZone(), this._stable && (this._stable = !1, this._zone.runOutsideAngular(() => {
                    c.next(!1)
                  }))
                });
                return () => {
                  u.unsubscribe(), d.unsubscribe()
                }
              });
            this.isStable = _g(a, l.pipe(n => _u()(function (n, e) {
              return function (r) {
                let i;
                i = "function" == typeof n ? n : function () {
                  return n
                };
                const s = Object.create(r, p0);
                return s.source = r, s.subjectFactory = i, s
              }
            }(v0)(n))))
          }
          bootstrap(t, r) {
            if (!this._initStatus.done) throw new Error("Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.");
            let i;
            i = t instanceof Xv ? t : this._componentFactoryResolver.resolveComponentFactory(t), this.componentTypes.push(i.componentType);
            const s = function (n) {
                return n.isBoundToModule
              }(i) ? void 0 : this._injector.get(Fn),
              a = i.create(he.NULL, [], r || i.selector, s),
              l = a.location.nativeElement,
              c = a.injector.get(Gh, null),
              u = c && a.injector.get(mC);
            return c && u && u.registerApplication(l, c), a.onDestroy(() => {
              this.detachView(a.hostView), Zh(this.components, a), u && u.unregisterApplication(l)
            }), this._loadComponent(a), a
          }
          tick() {
            if (this._runningTick) throw new Error("ApplicationRef.tick is called recursively");
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges()
            } catch (t) {
              this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(t))
            } finally {
              this._runningTick = !1
            }
          }
          attachView(t) {
            const r = t;
            this._views.push(r), r.attachToAppRef(this)
          }
          detachView(t) {
            const r = t;
            Zh(this._views, r), r.detachFromAppRef()
          }
          _loadComponent(t) {
            this.attachView(t.hostView), this.tick(), this.components.push(t), this._injector.get(dC, []).concat(this._bootstrapListeners).forEach(i => i(t))
          }
          ngOnDestroy() {
            this._views.slice().forEach(t => t.destroy()), this._onMicrotaskEmptySubscription.unsubscribe()
          }
          get viewCount() {
            return this._views.length
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(z), _(he), _(Hr), _(Xn), _(vs))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();

      function Zh(n, e) {
        const t = n.indexOf(e);
        t > -1 && n.splice(t, 1)
      }
      class Gl {}
      class lN {}
      const cN = {
        factoryPathPrefix: "",
        factoryPathSuffix: ".ngfactory"
      };
      let uN = (() => {
        class n {
          constructor(t, r) {
            this._compiler = t, this._config = r || cN
          }
          load(t) {
            return this.loadAndCompile(t)
          }
          loadAndCompile(t) {
            let [r, i] = t.split("#");
            return void 0 === i && (i = "default"), Bs(255)(r).then(s => s[i]).then(s => MC(s, r, i)).then(s => this._compiler.compileModuleAsync(s))
          }
          loadFactory(t) {
            let [r, i] = t.split("#"), s = "NgFactory";
            return void 0 === i && (i = "default", s = ""), Bs(255)(this._config.factoryPathPrefix + r + this._config.factoryPathSuffix).then(o => o[i + s]).then(o => MC(o, r, i))
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(ei), _(lN, 8))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();

      function MC(n, e, t) {
        if (!n) throw new Error(`Cannot find '${t}' in '${e}'`);
        return n
      }
      const bN = bC(null, "core", [{
          provide: zo,
          useValue: "unknown"
        }, {
          provide: EC,
          deps: [he]
        }, {
          provide: mC,
          deps: []
        }, {
          provide: Wl,
          deps: []
        }]),
        SN = [{
          provide: ti,
          useClass: ti,
          deps: [z, he, Hr, Xn, vs]
        }, {
          provide: Sk,
          deps: [z],
          useFactory: function (n) {
            let e = [];
            return n.onStable.subscribe(() => {
                for (; e.length;) e.pop()()
              }),
              function (t) {
                e.push(t)
              }
          }
        }, {
          provide: vs,
          useClass: vs,
          deps: [
            [new mt, Uo]
          ]
        }, {
          provide: ei,
          useClass: ei,
          deps: []
        }, OP, {
          provide: ds,
          useFactory: function () {
            return vO
          },
          deps: []
        }, {
          provide: hs,
          useFactory: function () {
            return bO
          },
          deps: []
        }, {
          provide: Jn,
          useFactory: function (n) {
            return lh(n = n || "undefined" != typeof $localize && $localize.locale || Ml), n
          },
          deps: [
            [new Bi(Jn), new mt, new _r]
          ]
        }, {
          provide: hC,
          useValue: "USD"
        }];
      let MN = (() => {
          class n {
            constructor(t) {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(ti))
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            providers: SN
          }), n
        })(),
        rc = null;

      function wr() {
        return rc
      }
      const O = new P("DocumentToken");
      let ii = (() => {
        class n {
          historyGo(t) {
            throw new Error("Not implemented")
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275prov = M({
          factory: TF,
          token: n,
          providedIn: "platform"
        }), n
      })();

      function TF() {
        return _(ZC)
      }
      const MF = new P("Location Initialized");
      let ZC = (() => {
        class n extends ii {
          constructor(t) {
            super(), this._doc = t, this._init()
          }
          _init() {
            this.location = window.location, this._history = window.history
          }
          getBaseHrefFromDOM() {
            return wr().getBaseHref(this._doc)
          }
          onPopState(t) {
            const r = wr().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", t, !1), () => r.removeEventListener("popstate", t)
          }
          onHashChange(t) {
            const r = wr().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", t, !1), () => r.removeEventListener("hashchange", t)
          }
          get href() {
            return this.location.href
          }
          get protocol() {
            return this.location.protocol
          }
          get hostname() {
            return this.location.hostname
          }
          get port() {
            return this.location.port
          }
          get pathname() {
            return this.location.pathname
          }
          get search() {
            return this.location.search
          }
          get hash() {
            return this.location.hash
          }
          set pathname(t) {
            this.location.pathname = t
          }
          pushState(t, r, i) {
            XC() ? this._history.pushState(t, r, i) : this.location.hash = i
          }
          replaceState(t, r, i) {
            XC() ? this._history.replaceState(t, r, i) : this.location.hash = i
          }
          forward() {
            this._history.forward()
          }
          back() {
            this._history.back()
          }
          historyGo(t = 0) {
            this._history.go(t)
          }
          getState() {
            return this._history.state
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(O))
        }, n.\u0275prov = M({
          factory: AF,
          token: n,
          providedIn: "platform"
        }), n
      })();

      function XC() {
        return !!window.history.pushState
      }

      function AF() {
        return new ZC(_(O))
      }

      function ff(n, e) {
        if (0 == n.length) return e;
        if (0 == e.length) return n;
        let t = 0;
        return n.endsWith("/") && t++, e.startsWith("/") && t++, 2 == t ? n + e.substring(1) : 1 == t ? n + e : n + "/" + e
      }

      function JC(n) {
        const e = n.match(/#|\?|$/),
          t = e && e.index || n.length;
        return n.slice(0, t - ("/" === n[t - 1] ? 1 : 0)) + n.slice(t)
      }

      function tr(n) {
        return n && "?" !== n[0] ? "?" + n : n
      }
      let Es = (() => {
        class n {
          historyGo(t) {
            throw new Error("Not implemented")
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275prov = M({
          factory: IF,
          token: n,
          providedIn: "root"
        }), n
      })();

      function IF(n) {
        const e = _(O).location;
        return new eE(_(ii), e && e.origin || "")
      }
      const pf = new P("appBaseHref");
      let eE = (() => {
          class n extends Es {
            constructor(t, r) {
              if (super(), this._platformLocation = t, this._removeListenerFns = [], null == r && (r = this._platformLocation.getBaseHrefFromDOM()), null == r) throw new Error("No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.");
              this._baseHref = r
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
            }
            onPopState(t) {
              this._removeListenerFns.push(this._platformLocation.onPopState(t), this._platformLocation.onHashChange(t))
            }
            getBaseHref() {
              return this._baseHref
            }
            prepareExternalUrl(t) {
              return ff(this._baseHref, t)
            }
            path(t = !1) {
              const r = this._platformLocation.pathname + tr(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && t ? `${r}${i}` : r
            }
            pushState(t, r, i, s) {
              const o = this.prepareExternalUrl(i + tr(s));
              this._platformLocation.pushState(t, r, o)
            }
            replaceState(t, r, i, s) {
              const o = this.prepareExternalUrl(i + tr(s));
              this._platformLocation.replaceState(t, r, o)
            }
            forward() {
              this._platformLocation.forward()
            }
            back() {
              this._platformLocation.back()
            }
            historyGo(t = 0) {
              var r, i;
              null === (i = (r = this._platformLocation).historyGo) || void 0 === i || i.call(r, t)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(ii), _(pf, 8))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        RF = (() => {
          class n extends Es {
            constructor(t, r) {
              super(), this._platformLocation = t, this._baseHref = "", this._removeListenerFns = [], null != r && (this._baseHref = r)
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
            }
            onPopState(t) {
              this._removeListenerFns.push(this._platformLocation.onPopState(t), this._platformLocation.onHashChange(t))
            }
            getBaseHref() {
              return this._baseHref
            }
            path(t = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r
            }
            prepareExternalUrl(t) {
              const r = ff(this._baseHref, t);
              return r.length > 0 ? "#" + r : r
            }
            pushState(t, r, i, s) {
              let o = this.prepareExternalUrl(i + tr(s));
              0 == o.length && (o = this._platformLocation.pathname), this._platformLocation.pushState(t, r, o)
            }
            replaceState(t, r, i, s) {
              let o = this.prepareExternalUrl(i + tr(s));
              0 == o.length && (o = this._platformLocation.pathname), this._platformLocation.replaceState(t, r, o)
            }
            forward() {
              this._platformLocation.forward()
            }
            back() {
              this._platformLocation.back()
            }
            historyGo(t = 0) {
              var r, i;
              null === (i = (r = this._platformLocation).historyGo) || void 0 === i || i.call(r, t)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(ii), _(pf, 8))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        Qo = (() => {
          class n {
            constructor(t, r) {
              this._subject = new Ee, this._urlChangeListeners = [], this._platformStrategy = t;
              const i = this._platformStrategy.getBaseHref();
              this._platformLocation = r, this._baseHref = JC(tE(i)), this._platformStrategy.onPopState(s => {
                this._subject.emit({
                  url: this.path(!0),
                  pop: !0,
                  state: s.state,
                  type: s.type
                })
              })
            }
            path(t = !1) {
              return this.normalize(this._platformStrategy.path(t))
            }
            getState() {
              return this._platformLocation.getState()
            }
            isCurrentPathEqualTo(t, r = "") {
              return this.path() == this.normalize(t + tr(r))
            }
            normalize(t) {
              return n.stripTrailingSlash(function (n, e) {
                return n && e.startsWith(n) ? e.substring(n.length) : e
              }(this._baseHref, tE(t)))
            }
            prepareExternalUrl(t) {
              return t && "/" !== t[0] && (t = "/" + t), this._platformStrategy.prepareExternalUrl(t)
            }
            go(t, r = "", i = null) {
              this._platformStrategy.pushState(i, "", t, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(t + tr(r)), i)
            }
            replaceState(t, r = "", i = null) {
              this._platformStrategy.replaceState(i, "", t, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(t + tr(r)), i)
            }
            forward() {
              this._platformStrategy.forward()
            }
            back() {
              this._platformStrategy.back()
            }
            historyGo(t = 0) {
              var r, i;
              null === (i = (r = this._platformStrategy).historyGo) || void 0 === i || i.call(r, t)
            }
            onUrlChange(t) {
              this._urlChangeListeners.push(t), this._urlChangeSubscription || (this._urlChangeSubscription = this.subscribe(r => {
                this._notifyUrlChangeListeners(r.url, r.state)
              }))
            }
            _notifyUrlChangeListeners(t = "", r) {
              this._urlChangeListeners.forEach(i => i(t, r))
            }
            subscribe(t, r, i) {
              return this._subject.subscribe({
                next: t,
                error: r,
                complete: i
              })
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(Es), _(ii))
          }, n.normalizeQueryParams = tr, n.joinWithSlash = ff, n.stripTrailingSlash = JC, n.\u0275prov = M({
            factory: xF,
            token: n,
            providedIn: "root"
          }), n
        })();

      function xF() {
        return new Qo(_(Es), _(ii))
      }

      function tE(n) {
        return n.replace(/\/index.html$/, "")
      }
      var Ne = (() => ((Ne = Ne || {})[Ne.Zero = 0] = "Zero", Ne[Ne.One = 1] = "One", Ne[Ne.Two = 2] = "Two", Ne[Ne.Few = 3] = "Few", Ne[Ne.Many = 4] = "Many", Ne[Ne.Other = 5] = "Other", Ne))();
      const BF = function (n) {
        return function (n) {
          const e = function (n) {
            return n.toLowerCase().replace(/_/g, "-")
          }(n);
          let t = Tv(e);
          if (t) return t;
          const r = e.split("-")[0];
          if (t = Tv(r), t) return t;
          if ("en" === r) return ZR;
          throw new Error(`Missing locale data for the locale "${n}".`)
        }(n)[S.PluralCase]
      };
      class fc {}
      let g1 = (() => {
          class n extends fc {
            constructor(t) {
              super(), this.locale = t
            }
            getPluralCategory(t, r) {
              switch (BF(r || this.locale)(t)) {
                case Ne.Zero:
                  return "zero";
                case Ne.One:
                  return "one";
                case Ne.Two:
                  return "two";
                case Ne.Few:
                  return "few";
                case Ne.Many:
                  return "many";
                default:
                  return "other"
              }
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(Jn))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        Af = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            providers: [{
              provide: fc,
              useClass: g1
            }]
          }), n
        })();
      const pE = "browser";
      let gE = (() => {
        class n {}
        return n.\u0275prov = M({
          token: n,
          providedIn: "root",
          factory: () => new X1(_(O), window)
        }), n
      })();
      class X1 {
        constructor(e, t) {
          this.document = e, this.window = t, this.offset = () => [0, 0]
        }
        setOffset(e) {
          this.offset = Array.isArray(e) ? () => e : e
        }
        getScrollPosition() {
          return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0]
        }
        scrollToPosition(e) {
          this.supportsScrolling() && this.window.scrollTo(e[0], e[1])
        }
        scrollToAnchor(e) {
          if (!this.supportsScrolling()) return;
          const t = function (n, e) {
            const t = n.getElementById(e) || n.getElementsByName(e)[0];
            if (t) return t;
            if ("function" == typeof n.createTreeWalker && n.body && (n.body.createShadowRoot || n.body.attachShadow)) {
              const r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i;) {
                const s = i.shadowRoot;
                if (s) {
                  const o = s.getElementById(e) || s.querySelector(`[name="${e}"]`);
                  if (o) return o
                }
                i = r.nextNode()
              }
            }
            return null
          }(this.document, e);
          t && (this.scrollToElement(t), this.attemptFocus(t))
        }
        setHistoryScrollRestoration(e) {
          if (this.supportScrollRestoration()) {
            const t = this.window.history;
            t && t.scrollRestoration && (t.scrollRestoration = e)
          }
        }
        scrollToElement(e) {
          const t = e.getBoundingClientRect(),
            r = t.left + this.window.pageXOffset,
            i = t.top + this.window.pageYOffset,
            s = this.offset();
          this.window.scrollTo(r - s[0], i - s[1])
        }
        attemptFocus(e) {
          return e.focus(), this.document.activeElement === e
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const e = mE(this.window.history) || mE(Object.getPrototypeOf(this.window.history));
            return !(!e || !e.writable && !e.set)
          } catch (e) {
            return !1
          }
        }
        supportsScrolling() {
          try {
            return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window
          } catch (e) {
            return !1
          }
        }
      }

      function mE(n) {
        return Object.getOwnPropertyDescriptor(n, "scrollRestoration")
      }
      class If extends class extends class {} {
        constructor() {
          super(...arguments), this.supportsDOMEvents = !0
        }
      } {
        static makeCurrent() {
          ! function (n) {
            rc || (rc = n)
          }(new If)
        }
        onAndCancel(e, t, r) {
          return e.addEventListener(t, r, !1), () => {
            e.removeEventListener(t, r, !1)
          }
        }
        dispatchEvent(e, t) {
          e.dispatchEvent(t)
        }
        remove(e) {
          e.parentNode && e.parentNode.removeChild(e)
        }
        createElement(e, t) {
          return (t = t || this.getDefaultDocument()).createElement(e)
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle")
        }
        getDefaultDocument() {
          return document
        }
        isElementNode(e) {
          return e.nodeType === Node.ELEMENT_NODE
        }
        isShadowRoot(e) {
          return e instanceof DocumentFragment
        }
        getGlobalEventTarget(e, t) {
          return "window" === t ? window : "document" === t ? e : "body" === t ? e.body : null
        }
        getBaseHref(e) {
          const t = (Xo = Xo || document.querySelector("base"), Xo ? Xo.getAttribute("href") : null);
          return null == t ? null : function (n) {
            pc = pc || document.createElement("a"), pc.setAttribute("href", n);
            const e = pc.pathname;
            return "/" === e.charAt(0) ? e : `/${e}`
          }(t)
        }
        resetBaseElement() {
          Xo = null
        }
        getUserAgent() {
          return window.navigator.userAgent
        }
        getCookie(e) {
          return function (n, e) {
            e = encodeURIComponent(e);
            for (const t of n.split(";")) {
              const r = t.indexOf("="),
                [i, s] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
              if (i.trim() === e) return decodeURIComponent(s)
            }
            return null
          }(document.cookie, e)
        }
      }
      let pc, Xo = null;
      const _E = new P("TRANSITION_ID"),
        sL = [{
          provide: Uo,
          useFactory: function (n, e, t) {
            return () => {
              t.get(vs).donePromise.then(() => {
                const r = wr(),
                  i = e.querySelectorAll(`style[ng-transition="${n}"]`);
                for (let s = 0; s < i.length; s++) r.remove(i[s])
              })
            }
          },
          deps: [_E, O, he],
          multi: !0
        }];
      class Rf {
        static init() {
          ! function (n) {
            Kh = n
          }(new Rf)
        }
        addToWindow(e) {
          oe.getAngularTestability = (r, i = !0) => {
            const s = e.findTestabilityInTree(r, i);
            if (null == s) throw new Error("Could not find testability for element.");
            return s
          }, oe.getAllAngularTestabilities = () => e.getAllTestabilities(), oe.getAllAngularRootElements = () => e.getAllRootElements(), oe.frameworkStabilizers || (oe.frameworkStabilizers = []), oe.frameworkStabilizers.push(r => {
            const i = oe.getAllAngularTestabilities();
            let s = i.length,
              o = !1;
            const a = function (l) {
              o = o || l, s--, 0 == s && r(o)
            };
            i.forEach(function (l) {
              l.whenStable(a)
            })
          })
        }
        findTestabilityInTree(e, t, r) {
          if (null == t) return null;
          const i = e.getTestability(t);
          return null != i ? i : r ? wr().isShadowRoot(t) ? this.findTestabilityInTree(e, t.host, !0) : this.findTestabilityInTree(e, t.parentElement, !0) : null
        }
      }
      let oL = (() => {
        class n {
          build() {
            return new XMLHttpRequest
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const Jo = new P("EventManagerPlugins");
      let mc = (() => {
        class n {
          constructor(t, r) {
            this._zone = r, this._eventNameToPlugin = new Map, t.forEach(i => i.manager = this), this._plugins = t.slice().reverse()
          }
          addEventListener(t, r, i) {
            return this._findPluginFor(r).addEventListener(t, r, i)
          }
          addGlobalEventListener(t, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(t, r, i)
          }
          getZone() {
            return this._zone
          }
          _findPluginFor(t) {
            const r = this._eventNameToPlugin.get(t);
            if (r) return r;
            const i = this._plugins;
            for (let s = 0; s < i.length; s++) {
              const o = i[s];
              if (o.supports(t)) return this._eventNameToPlugin.set(t, o), o
            }
            throw new Error(`No event manager plugin found for event ${t}`)
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(Jo), _(z))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      class xf {
        constructor(e) {
          this._doc = e
        }
        addGlobalEventListener(e, t, r) {
          const i = wr().getGlobalEventTarget(this._doc, e);
          if (!i) throw new Error(`Unsupported event target ${i} for event ${t}`);
          return this.addEventListener(i, t, r)
        }
      }
      let vE = (() => {
          class n {
            constructor() {
              this._stylesSet = new Set
            }
            addStyles(t) {
              const r = new Set;
              t.forEach(i => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i))
              }), this.onStylesAdded(r)
            }
            onStylesAdded(t) {}
            getAllStyles() {
              return Array.from(this._stylesSet)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        ea = (() => {
          class n extends vE {
            constructor(t) {
              super(), this._doc = t, this._hostNodes = new Map, this._hostNodes.set(t.head, [])
            }
            _addStylesToHost(t, r, i) {
              t.forEach(s => {
                const o = this._doc.createElement("style");
                o.textContent = s, i.push(r.appendChild(o))
              })
            }
            addHost(t) {
              const r = [];
              this._addStylesToHost(this._stylesSet, t, r), this._hostNodes.set(t, r)
            }
            removeHost(t) {
              const r = this._hostNodes.get(t);
              r && r.forEach(bE), this._hostNodes.delete(t)
            }
            onStylesAdded(t) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(t, i, r)
              })
            }
            ngOnDestroy() {
              this._hostNodes.forEach(t => t.forEach(bE))
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(O))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })();

      function bE(n) {
        wr().remove(n)
      }
      const Of = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/"
        },
        kf = /%COMP%/g;

      function _c(n, e, t) {
        for (let r = 0; r < e.length; r++) {
          let i = e[r];
          Array.isArray(i) ? _c(n, i, t) : (i = i.replace(kf, n), t.push(i))
        }
        return t
      }

      function wE(n) {
        return e => {
          if ("__ngUnwrap__" === e) return n;
          !1 === n(e) && (e.preventDefault(), e.returnValue = !1)
        }
      }
      let yc = (() => {
        class n {
          constructor(t, r, i) {
            this.eventManager = t, this.sharedStylesHost = r, this.appId = i, this.rendererByCompId = new Map, this.defaultRenderer = new Pf(t)
          }
          createRenderer(t, r) {
            if (!t || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case Oe.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return i || (i = new CL(this.eventManager, this.sharedStylesHost, r, this.appId), this.rendererByCompId.set(r.id, i)), i.applyToHost(t), i
              }
              case 1:
              case Oe.ShadowDom:
                return new EL(this.eventManager, this.sharedStylesHost, t, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = _c(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(i), this.rendererByCompId.set(r.id, this.defaultRenderer)
                }
                return this.defaultRenderer
            }
          }
          begin() {}
          end() {}
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(mc), _(ea), _($o))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      class Pf {
        constructor(e) {
          this.eventManager = e, this.data = Object.create(null)
        }
        destroy() {}
        createElement(e, t) {
          return t ? document.createElementNS(Of[t] || t, e) : document.createElement(e)
        }
        createComment(e) {
          return document.createComment(e)
        }
        createText(e) {
          return document.createTextNode(e)
        }
        appendChild(e, t) {
          e.appendChild(t)
        }
        insertBefore(e, t, r) {
          e && e.insertBefore(t, r)
        }
        removeChild(e, t) {
          e && e.removeChild(t)
        }
        selectRootElement(e, t) {
          let r = "string" == typeof e ? document.querySelector(e) : e;
          if (!r) throw new Error(`The selector "${e}" did not match any elements`);
          return t || (r.textContent = ""), r
        }
        parentNode(e) {
          return e.parentNode
        }
        nextSibling(e) {
          return e.nextSibling
        }
        setAttribute(e, t, r, i) {
          if (i) {
            t = i + ":" + t;
            const s = Of[i];
            s ? e.setAttributeNS(s, t, r) : e.setAttribute(t, r)
          } else e.setAttribute(t, r)
        }
        removeAttribute(e, t, r) {
          if (r) {
            const i = Of[r];
            i ? e.removeAttributeNS(i, t) : e.removeAttribute(`${r}:${t}`)
          } else e.removeAttribute(t)
        }
        addClass(e, t) {
          e.classList.add(t)
        }
        removeClass(e, t) {
          e.classList.remove(t)
        }
        setStyle(e, t, r, i) {
          i & (Tt.DashCase | Tt.Important) ? e.style.setProperty(t, r, i & Tt.Important ? "important" : "") : e.style[t] = r
        }
        removeStyle(e, t, r) {
          r & Tt.DashCase ? e.style.removeProperty(t) : e.style[t] = ""
        }
        setProperty(e, t, r) {
          e[t] = r
        }
        setValue(e, t) {
          e.nodeValue = t
        }
        listen(e, t, r) {
          return "string" == typeof e ? this.eventManager.addGlobalEventListener(e, t, wE(r)) : this.eventManager.addEventListener(e, t, wE(r))
        }
      }
      class CL extends Pf {
        constructor(e, t, r, i) {
          super(e), this.component = r;
          const s = _c(i + "-" + r.id, r.styles, []);
          t.addStyles(s), this.contentAttr = function (n) {
            return "_ngcontent-%COMP%".replace(kf, n)
          }(i + "-" + r.id), this.hostAttr = function (n) {
            return "_nghost-%COMP%".replace(kf, n)
          }(i + "-" + r.id)
        }
        applyToHost(e) {
          super.setAttribute(e, this.hostAttr, "")
        }
        createElement(e, t) {
          const r = super.createElement(e, t);
          return super.setAttribute(r, this.contentAttr, ""), r
        }
      }
      class EL extends Pf {
        constructor(e, t, r, i) {
          super(e), this.sharedStylesHost = t, this.hostEl = r, this.shadowRoot = r.attachShadow({
            mode: "open"
          }), this.sharedStylesHost.addHost(this.shadowRoot);
          const s = _c(i.id, i.styles, []);
          for (let o = 0; o < s.length; o++) {
            const a = document.createElement("style");
            a.textContent = s[o], this.shadowRoot.appendChild(a)
          }
        }
        nodeOrShadowRoot(e) {
          return e === this.hostEl ? this.shadowRoot : e
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot)
        }
        appendChild(e, t) {
          return super.appendChild(this.nodeOrShadowRoot(e), t)
        }
        insertBefore(e, t, r) {
          return super.insertBefore(this.nodeOrShadowRoot(e), t, r)
        }
        removeChild(e, t) {
          return super.removeChild(this.nodeOrShadowRoot(e), t)
        }
        parentNode(e) {
          return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))
        }
      }
      let wL = (() => {
        class n extends xf {
          constructor(t) {
            super(t)
          }
          supports(t) {
            return !0
          }
          addEventListener(t, r, i) {
            return t.addEventListener(r, i, !1), () => this.removeEventListener(t, r, i)
          }
          removeEventListener(t, r, i) {
            return t.removeEventListener(r, i)
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(O))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const TE = ["alt", "control", "meta", "shift"],
        RL = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS"
        },
        ME = {
          A: "1",
          B: "2",
          C: "3",
          D: "4",
          E: "5",
          F: "6",
          G: "7",
          H: "8",
          I: "9",
          J: "*",
          K: "+",
          M: "-",
          N: ".",
          O: "/",
          "`": "0",
          "\x90": "NumLock"
        },
        xL = {
          alt: n => n.altKey,
          control: n => n.ctrlKey,
          meta: n => n.metaKey,
          shift: n => n.shiftKey
        };
      let OL = (() => {
        class n extends xf {
          constructor(t) {
            super(t)
          }
          supports(t) {
            return null != n.parseEventName(t)
          }
          addEventListener(t, r, i) {
            const s = n.parseEventName(r),
              o = n.eventCallback(s.fullKey, i, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(() => wr().onAndCancel(t, s.domEventName, o))
          }
          static parseEventName(t) {
            const r = t.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || "keydown" !== i && "keyup" !== i) return null;
            const s = n._normalizeKey(r.pop());
            let o = "";
            if (TE.forEach(l => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), o += l + ".")
              }), o += s, 0 != r.length || 0 === s.length) return null;
            const a = {};
            return a.domEventName = i, a.fullKey = o, a
          }
          static getEventFullKey(t) {
            let r = "",
              i = function (n) {
                let e = n.key;
                if (null == e) {
                  if (e = n.keyIdentifier, null == e) return "Unidentified";
                  e.startsWith("U+") && (e = String.fromCharCode(parseInt(e.substring(2), 16)), 3 === n.location && ME.hasOwnProperty(e) && (e = ME[e]))
                }
                return RL[e] || e
              }(t);
            return i = i.toLowerCase(), " " === i ? i = "space" : "." === i && (i = "dot"), TE.forEach(s => {
              s != i && xL[s](t) && (r += s + ".")
            }), r += i, r
          }
          static eventCallback(t, r, i) {
            return s => {
              n.getEventFullKey(s) === t && i.runGuarded(() => r(s))
            }
          }
          static _normalizeKey(t) {
            return "esc" === t ? "escape" : t
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(O))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const VL = [{
          provide: zo,
          useValue: pE
        }, {
          provide: uC,
          useValue: function () {
            If.makeCurrent(), Rf.init()
          },
          multi: !0
        }, {
          provide: O,
          useFactory: function () {
            return function (n) {
              Ru = n
            }(document), document
          },
          deps: []
        }],
        jL = bC(bN, "browser", VL),
        HL = [
          [], {
            provide: _o,
            useValue: "root"
          }, {
            provide: Hr,
            useFactory: function () {
              return new Hr
            },
            deps: []
          }, {
            provide: Jo,
            useClass: wL,
            multi: !0,
            deps: [O, z, zo]
          }, {
            provide: Jo,
            useClass: OL,
            multi: !0,
            deps: [O]
          },
          [], {
            provide: yc,
            useClass: yc,
            deps: [mc, ea, $o]
          }, {
            provide: Gr,
            useExisting: yc
          }, {
            provide: vE,
            useExisting: ea
          }, {
            provide: ea,
            useClass: ea,
            deps: [O]
          }, {
            provide: Gh,
            useClass: Gh,
            deps: [z]
          }, {
            provide: mc,
            useClass: mc,
            deps: [Jo, z]
          }, {
            provide: class {},
            useClass: oL,
            deps: []
          },
          []
        ];
      let Vf = (() => {
        class n {
          constructor(t) {
            if (t) throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.")
          }
          static withServerTransition(t) {
            return {
              ngModule: n,
              providers: [{
                provide: $o,
                useValue: t.appId
              }, {
                provide: _E,
                useExisting: $o
              }, sL]
            }
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(n, 12))
        }, n.\u0275mod = ge({
          type: n
        }), n.\u0275inj = de({
          providers: HL,
          imports: [Af, MN]
        }), n
      })();

      function F(...n) {
        let e = n[n.length - 1];
        return Ei(e) ? (n.pop(), gu(n, e)) : mu(n)
      }
      "undefined" != typeof window && window;
      class Qt extends X {
        constructor(e) {
          super(), this._value = e
        }
        get value() {
          return this.getValue()
        }
        _subscribe(e) {
          const t = super._subscribe(e);
          return t && !t.closed && e.next(this._value), t
        }
        getValue() {
          if (this.hasError) throw this.thrownError;
          if (this.closed) throw new Rr;
          return this._value
        }
        next(e) {
          super.next(this._value = e)
        }
      }
      class QL extends ue {
        notifyNext(e, t, r, i, s) {
          this.destination.next(t)
        }
        notifyError(e, t) {
          this.destination.error(e)
        }
        notifyComplete(e) {
          this.destination.complete()
        }
      }
      class YL extends ue {
        constructor(e, t, r) {
          super(), this.parent = e, this.outerValue = t, this.outerIndex = r, this.index = 0
        }
        _next(e) {
          this.parent.notifyNext(this.outerValue, e, this.outerIndex, this.index++, this)
        }
        _error(e) {
          this.parent.notifyError(e, this), this.unsubscribe()
        }
        _complete() {
          this.parent.notifyComplete(this), this.unsubscribe()
        }
      }

      function ZL(n, e, t, r, i = new YL(n, t, r)) {
        if (!i.closed) return e instanceof re ? e.subscribe(i) : pu(e)(i)
      }
      const IE = {};
      class JL {
        constructor(e) {
          this.resultSelector = e
        }
        call(e, t) {
          return t.subscribe(new eV(e, this.resultSelector))
        }
      }
      class eV extends QL {
        constructor(e, t) {
          super(e), this.resultSelector = t, this.active = 0, this.values = [], this.observables = []
        }
        _next(e) {
          this.values.push(IE), this.observables.push(e)
        }
        _complete() {
          const e = this.observables,
            t = e.length;
          if (0 === t) this.destination.complete();
          else {
            this.active = t, this.toRespond = t;
            for (let r = 0; r < t; r++) this.add(ZL(this, e[r], void 0, r))
          }
        }
        notifyComplete(e) {
          0 == (this.active -= 1) && this.destination.complete()
        }
        notifyNext(e, t, r) {
          const i = this.values,
            o = this.toRespond ? i[r] === IE ? --this.toRespond : this.toRespond : 0;
          i[r] = t, 0 === o && (this.resultSelector ? this._tryResultSelector(i) : this.destination.next(i.slice()))
        }
        _tryResultSelector(e) {
          let t;
          try {
            t = this.resultSelector.apply(this, e)
          } catch (r) {
            return void this.destination.error(r)
          }
          this.destination.next(t)
        }
      }
      const vc = (() => {
        function n() {
          return Error.call(this), this.message = "no elements in sequence", this.name = "EmptyError", this
        }
        return n.prototype = Object.create(Error.prototype), n
      })();

      function jf(...n) {
        return zs(1)(F(...n))
      }
      const ws = new re(n => n.complete());

      function bc(n) {
        return n ? function (n) {
          return new re(e => n.schedule(() => e.complete()))
        }(n) : ws
      }

      function RE(n) {
        return new re(e => {
          let t;
          try {
            t = n()
          } catch (i) {
            return void e.error(i)
          }
          return (t ? rt(t) : bc()).subscribe(e)
        })
      }

      function rr(n, e) {
        return "function" == typeof e ? t => t.pipe(rr((r, i) => rt(n(r, i)).pipe(_e((s, o) => e(r, s, i, o))))) : t => t.lift(new rV(n))
      }
      class rV {
        constructor(e) {
          this.project = e
        }
        call(e, t) {
          return t.subscribe(new iV(e, this.project))
        }
      }
      class iV extends Us {
        constructor(e, t) {
          super(e), this.project = t, this.index = 0
        }
        _next(e) {
          let t;
          const r = this.index++;
          try {
            t = this.project(e, r)
          } catch (i) {
            return void this.destination.error(i)
          }
          this._innerSub(t)
        }
        _innerSub(e) {
          const t = this.innerSubscription;
          t && t.unsubscribe();
          const r = new Hs(this),
            i = this.destination;
          i.add(r), this.innerSubscription = $s(e, r), this.innerSubscription !== r && i.add(this.innerSubscription)
        }
        _complete() {
          const {
            innerSubscription: e
          } = this;
          (!e || e.closed) && super._complete(), this.unsubscribe()
        }
        _unsubscribe() {
          this.innerSubscription = void 0
        }
        notifyComplete() {
          this.innerSubscription = void 0, this.isStopped && super._complete()
        }
        notifyNext(e) {
          this.destination.next(e)
        }
      }
      const xE = (() => {
        function n() {
          return Error.call(this), this.message = "argument out of range", this.name = "ArgumentOutOfRangeError", this
        }
        return n.prototype = Object.create(Error.prototype), n
      })();

      function Ds(n) {
        return e => 0 === n ? bc() : e.lift(new sV(n))
      }
      class sV {
        constructor(e) {
          if (this.total = e, this.total < 0) throw new xE
        }
        call(e, t) {
          return t.subscribe(new oV(e, this.total))
        }
      }
      class oV extends ue {
        constructor(e, t) {
          super(e), this.total = t, this.count = 0
        }
        _next(e) {
          const t = this.total,
            r = ++this.count;
          r <= t && (this.destination.next(e), r === t && (this.destination.complete(), this.unsubscribe()))
        }
      }

      function OE(n, e) {
        let t = !1;
        return arguments.length >= 2 && (t = !0),
          function (i) {
            return i.lift(new aV(n, e, t))
          }
      }
      class aV {
        constructor(e, t, r = !1) {
          this.accumulator = e, this.seed = t, this.hasSeed = r
        }
        call(e, t) {
          return t.subscribe(new lV(e, this.accumulator, this.seed, this.hasSeed))
        }
      }
      class lV extends ue {
        constructor(e, t, r, i) {
          super(e), this.accumulator = t, this._seed = r, this.hasSeed = i, this.index = 0
        }
        get seed() {
          return this._seed
        }
        set seed(e) {
          this.hasSeed = !0, this._seed = e
        }
        _next(e) {
          if (this.hasSeed) return this._tryNext(e);
          this.seed = e, this.destination.next(e)
        }
        _tryNext(e) {
          const t = this.index++;
          let r;
          try {
            r = this.accumulator(this.seed, e, t)
          } catch (i) {
            this.destination.error(i)
          }
          this.seed = r, this.destination.next(r)
        }
      }

      function si(n, e) {
        return function (r) {
          return r.lift(new cV(n, e))
        }
      }
      class cV {
        constructor(e, t) {
          this.predicate = e, this.thisArg = t
        }
        call(e, t) {
          return t.subscribe(new uV(e, this.predicate, this.thisArg))
        }
      }
      class uV extends ue {
        constructor(e, t, r) {
          super(e), this.predicate = t, this.thisArg = r, this.count = 0
        }
        _next(e) {
          let t;
          try {
            t = this.predicate.call(this.thisArg, e, this.count++)
          } catch (r) {
            return void this.destination.error(r)
          }
          t && this.destination.next(e)
        }
      }

      function oi(n) {
        return function (t) {
          const r = new dV(n),
            i = t.lift(r);
          return r.caught = i
        }
      }
      class dV {
        constructor(e) {
          this.selector = e
        }
        call(e, t) {
          return t.subscribe(new hV(e, this.selector, this.caught))
        }
      }
      class hV extends Us {
        constructor(e, t, r) {
          super(e), this.selector = t, this.caught = r
        }
        error(e) {
          if (!this.isStopped) {
            let t;
            try {
              t = this.selector(e, this.caught)
            } catch (s) {
              return void super.error(s)
            }
            this._unsubscribeAndRecycle();
            const r = new Hs(this);
            this.add(r);
            const i = $s(t, r);
            i !== r && this.add(i)
          }
        }
      }

      function ta(n, e) {
        return Ke(n, e, 1)
      }

      function Uf(n) {
        return function (t) {
          return 0 === n ? bc() : t.lift(new fV(n))
        }
      }
      class fV {
        constructor(e) {
          if (this.total = e, this.total < 0) throw new xE
        }
        call(e, t) {
          return t.subscribe(new pV(e, this.total))
        }
      }
      class pV extends ue {
        constructor(e, t) {
          super(e), this.total = t, this.ring = new Array, this.count = 0
        }
        _next(e) {
          const t = this.ring,
            r = this.total,
            i = this.count++;
          t.length < r ? t.push(e) : t[i % r] = e
        }
        _complete() {
          const e = this.destination;
          let t = this.count;
          if (t > 0) {
            const r = this.count >= this.total ? this.total : this.count,
              i = this.ring;
            for (let s = 0; s < r; s++) {
              const o = t++ % r;
              e.next(i[o])
            }
          }
          e.complete()
        }
      }

      function kE(n = _V) {
        return e => e.lift(new gV(n))
      }
      class gV {
        constructor(e) {
          this.errorFactory = e
        }
        call(e, t) {
          return t.subscribe(new mV(e, this.errorFactory))
        }
      }
      class mV extends ue {
        constructor(e, t) {
          super(e), this.errorFactory = t, this.hasValue = !1
        }
        _next(e) {
          this.hasValue = !0, this.destination.next(e)
        }
        _complete() {
          if (this.hasValue) return this.destination.complete(); {
            let e;
            try {
              e = this.errorFactory()
            } catch (t) {
              e = t
            }
            this.destination.error(e)
          }
        }
      }

      function _V() {
        return new vc
      }

      function PE(n = null) {
        return e => e.lift(new yV(n))
      }
      class yV {
        constructor(e) {
          this.defaultValue = e
        }
        call(e, t) {
          return t.subscribe(new vV(e, this.defaultValue))
        }
      }
      class vV extends ue {
        constructor(e, t) {
          super(e), this.defaultValue = t, this.isEmpty = !0
        }
        _next(e) {
          this.isEmpty = !1, this.destination.next(e)
        }
        _complete() {
          this.isEmpty && this.destination.next(this.defaultValue), this.destination.complete()
        }
      }

      function Ss(n, e) {
        const t = arguments.length >= 2;
        return r => r.pipe(n ? si((i, s) => n(i, s, r)) : Aa, Ds(1), t ? PE(e) : kE(() => new vc))
      }

      function Sr() {}

      function At(n, e, t) {
        return function (i) {
          return i.lift(new CV(n, e, t))
        }
      }
      class CV {
        constructor(e, t, r) {
          this.nextOrObserver = e, this.error = t, this.complete = r
        }
        call(e, t) {
          return t.subscribe(new EV(e, this.nextOrObserver, this.error, this.complete))
        }
      }
      class EV extends ue {
        constructor(e, t, r, i) {
          super(e), this._tapNext = Sr, this._tapError = Sr, this._tapComplete = Sr, this._tapError = r || Sr, this._tapComplete = i || Sr, En(t) ? (this._context = this, this._tapNext = t) : t && (this._context = t, this._tapNext = t.next || Sr, this._tapError = t.error || Sr, this._tapComplete = t.complete || Sr)
        }
        _next(e) {
          try {
            this._tapNext.call(this._context, e)
          } catch (t) {
            return void this.destination.error(t)
          }
          this.destination.next(e)
        }
        _error(e) {
          try {
            this._tapError.call(this._context, e)
          } catch (t) {
            return void this.destination.error(t)
          }
          this.destination.error(e)
        }
        _complete() {
          try {
            this._tapComplete.call(this._context)
          } catch (e) {
            return void this.destination.error(e)
          }
          return this.destination.complete()
        }
      }
      class DV {
        constructor(e) {
          this.callback = e
        }
        call(e, t) {
          return t.subscribe(new SV(e, this.callback))
        }
      }
      class SV extends ue {
        constructor(e, t) {
          super(e), this.add(new ie(t))
        }
      }
      class ir {
        constructor(e, t) {
          this.id = e, this.url = t
        }
      }
      class $f extends ir {
        constructor(e, t, r = "imperative", i = null) {
          super(e, t), this.navigationTrigger = r, this.restoredState = i
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`
        }
      }
      class na extends ir {
        constructor(e, t, r) {
          super(e, t), this.urlAfterRedirects = r
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
        }
      }
      class NE extends ir {
        constructor(e, t, r) {
          super(e, t), this.reason = r
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
        }
      }
      class TV extends ir {
        constructor(e, t, r) {
          super(e, t), this.error = r
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
        }
      }
      class MV extends ir {
        constructor(e, t, r, i) {
          super(e, t), this.urlAfterRedirects = r, this.state = i
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class AV extends ir {
        constructor(e, t, r, i) {
          super(e, t), this.urlAfterRedirects = r, this.state = i
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class IV extends ir {
        constructor(e, t, r, i, s) {
          super(e, t), this.urlAfterRedirects = r, this.state = i, this.shouldActivate = s
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
        }
      }
      class RV extends ir {
        constructor(e, t, r, i) {
          super(e, t), this.urlAfterRedirects = r, this.state = i
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class xV extends ir {
        constructor(e, t, r, i) {
          super(e, t), this.urlAfterRedirects = r, this.state = i
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class FE {
        constructor(e) {
          this.route = e
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`
        }
      }
      class LE {
        constructor(e) {
          this.route = e
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`
        }
      }
      class OV {
        constructor(e) {
          this.snapshot = e
        }
        toString() {
          return `ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
      }
      class kV {
        constructor(e) {
          this.snapshot = e
        }
        toString() {
          return `ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
      }
      class PV {
        constructor(e) {
          this.snapshot = e
        }
        toString() {
          return `ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
      }
      class NV {
        constructor(e) {
          this.snapshot = e
        }
        toString() {
          return `ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
      }
      class VE {
        constructor(e, t, r) {
          this.routerEvent = e, this.position = t, this.anchor = r
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${this.position?`${this.position[0]}, ${this.position[1]}`:null}')`
        }
      }
      const Q = "primary";
      class FV {
        constructor(e) {
          this.params = e || {}
        }
        has(e) {
          return Object.prototype.hasOwnProperty.call(this.params, e)
        }
        get(e) {
          if (this.has(e)) {
            const t = this.params[e];
            return Array.isArray(t) ? t[0] : t
          }
          return null
        }
        getAll(e) {
          if (this.has(e)) {
            const t = this.params[e];
            return Array.isArray(t) ? t : [t]
          }
          return []
        }
        get keys() {
          return Object.keys(this.params)
        }
      }

      function Ts(n) {
        return new FV(n)
      }
      const BE = "ngNavigationCancelingError";

      function zf(n) {
        const e = Error("NavigationCancelingError: " + n);
        return e[BE] = !0, e
      }

      function VV(n, e, t) {
        const r = t.path.split("/");
        if (r.length > n.length || "full" === t.pathMatch && (e.hasChildren() || r.length < n.length)) return null;
        const i = {};
        for (let s = 0; s < r.length; s++) {
          const o = r[s],
            a = n[s];
          if (o.startsWith(":")) i[o.substring(1)] = a;
          else if (o !== a.path) return null
        }
        return {
          consumed: n.slice(0, r.length),
          posParams: i
        }
      }

      function Ln(n, e) {
        const t = n ? Object.keys(n) : void 0,
          r = e ? Object.keys(e) : void 0;
        if (!t || !r || t.length != r.length) return !1;
        let i;
        for (let s = 0; s < t.length; s++)
          if (i = t[s], !jE(n[i], e[i])) return !1;
        return !0
      }

      function jE(n, e) {
        if (Array.isArray(n) && Array.isArray(e)) {
          if (n.length !== e.length) return !1;
          const t = [...n].sort(),
            r = [...e].sort();
          return t.every((i, s) => r[s] === i)
        }
        return n === e
      }

      function HE(n) {
        return Array.prototype.concat.apply([], n)
      }

      function UE(n) {
        return n.length > 0 ? n[n.length - 1] : null
      }

      function Qe(n, e) {
        for (const t in n) n.hasOwnProperty(t) && e(n[t], t)
      }

      function Vn(n) {
        return th(n) ? n : wl(n) ? rt(Promise.resolve(n)) : F(n)
      }
      const HV = {
          exact: function WE(n, e, t) {
            if (!li(n.segments, e.segments) || !Cc(n.segments, e.segments, t) || n.numberOfChildren !== e.numberOfChildren) return !1;
            for (const r in e.children)
              if (!n.children[r] || !WE(n.children[r], e.children[r], t)) return !1;
            return !0
          },
          subset: qE
        },
        $E = {
          exact: function (n, e) {
            return Ln(n, e)
          },
          subset: function (n, e) {
            return Object.keys(e).length <= Object.keys(n).length && Object.keys(e).every(t => jE(n[t], e[t]))
          },
          ignored: () => !0
        };

      function zE(n, e, t) {
        return HV[t.paths](n.root, e.root, t.matrixParams) && $E[t.queryParams](n.queryParams, e.queryParams) && !("exact" === t.fragment && n.fragment !== e.fragment)
      }

      function qE(n, e, t) {
        return GE(n, e, e.segments, t)
      }

      function GE(n, e, t, r) {
        if (n.segments.length > t.length) {
          const i = n.segments.slice(0, t.length);
          return !(!li(i, t) || e.hasChildren() || !Cc(i, t, r))
        }
        if (n.segments.length === t.length) {
          if (!li(n.segments, t) || !Cc(n.segments, t, r)) return !1;
          for (const i in e.children)
            if (!n.children[i] || !qE(n.children[i], e.children[i], r)) return !1;
          return !0
        } {
          const i = t.slice(0, n.segments.length),
            s = t.slice(n.segments.length);
          return !!(li(n.segments, i) && Cc(n.segments, i, r) && n.children[Q]) && GE(n.children[Q], e, s, r)
        }
      }

      function Cc(n, e, t) {
        return e.every((r, i) => $E[t](n[i].parameters, r.parameters))
      }
      class ai {
        constructor(e, t, r) {
          this.root = e, this.queryParams = t, this.fragment = r
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Ts(this.queryParams)), this._queryParamMap
        }
        toString() {
          return qV.serialize(this)
        }
      }
      class J {
        constructor(e, t) {
          this.segments = e, this.children = t, this.parent = null, Qe(t, (r, i) => r.parent = this)
        }
        hasChildren() {
          return this.numberOfChildren > 0
        }
        get numberOfChildren() {
          return Object.keys(this.children).length
        }
        toString() {
          return Ec(this)
        }
      }
      class ra {
        constructor(e, t) {
          this.path = e, this.parameters = t
        }
        get parameterMap() {
          return this._parameterMap || (this._parameterMap = Ts(this.parameters)), this._parameterMap
        }
        toString() {
          return ZE(this)
        }
      }

      function li(n, e) {
        return n.length === e.length && n.every((t, r) => t.path === e[r].path)
      }
      class Wf {}
      class KE {
        parse(e) {
          const t = new tB(e);
          return new ai(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment())
        }
        serialize(e) {
          const t = `/${ia(e.root,!0)}`,
            r = function (n) {
              const e = Object.keys(n).map(t => {
                const r = n[t];
                return Array.isArray(r) ? r.map(i => `${wc(t)}=${wc(i)}`).join("&") : `${wc(t)}=${wc(r)}`
              }).filter(t => !!t);
              return e.length ? `?${e.join("&")}` : ""
            }(e.queryParams),
            i = "string" == typeof e.fragment ? `#${function(n){return encodeURI(n)}(e.fragment)}` : "";
          return `${t}${r}${i}`
        }
      }
      const qV = new KE;

      function Ec(n) {
        return n.segments.map(e => ZE(e)).join("/")
      }

      function ia(n, e) {
        if (!n.hasChildren()) return Ec(n);
        if (e) {
          const t = n.children[Q] ? ia(n.children[Q], !1) : "",
            r = [];
          return Qe(n.children, (i, s) => {
            s !== Q && r.push(`${s}:${ia(i,!1)}`)
          }), r.length > 0 ? `${t}(${r.join("//")})` : t
        } {
          const t = function (n, e) {
            let t = [];
            return Qe(n.children, (r, i) => {
              i === Q && (t = t.concat(e(r, i)))
            }), Qe(n.children, (r, i) => {
              i !== Q && (t = t.concat(e(r, i)))
            }), t
          }(n, (r, i) => i === Q ? [ia(n.children[Q], !1)] : [`${i}:${ia(r,!1)}`]);
          return 1 === Object.keys(n.children).length && null != n.children[Q] ? `${Ec(n)}/${t[0]}` : `${Ec(n)}/(${t.join("//")})`
        }
      }

      function QE(n) {
        return encodeURIComponent(n).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
      }

      function wc(n) {
        return QE(n).replace(/%3B/gi, ";")
      }

      function qf(n) {
        return QE(n).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
      }

      function Dc(n) {
        return decodeURIComponent(n)
      }

      function YE(n) {
        return Dc(n.replace(/\+/g, "%20"))
      }

      function ZE(n) {
        return `${qf(n.path)}${function(n){return Object.keys(n).map(e=>`;${qf(e)}=${qf(n[e])}`).join("")}(n.parameters)}`
      }
      const YV = /^[^\/()?;=#]+/;

      function Sc(n) {
        const e = n.match(YV);
        return e ? e[0] : ""
      }
      const ZV = /^[^=?&#]+/,
        JV = /^[^?&#]+/;
      class tB {
        constructor(e) {
          this.url = e, this.remaining = e
        }
        parseRootSegment() {
          return this.consumeOptional("/"), "" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#") ? new J([], {}) : new J([], this.parseChildren())
        }
        parseQueryParams() {
          const e = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(e)
            } while (this.consumeOptional("&"));
          return e
        }
        parseFragment() {
          return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const e = [];
          for (this.peekStartsWith("(") || e.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");) this.capture("/"), e.push(this.parseSegment());
          let t = {};
          this.peekStartsWith("/(") && (this.capture("/"), t = this.parseParens(!0));
          let r = {};
          return this.peekStartsWith("(") && (r = this.parseParens(!1)), (e.length > 0 || Object.keys(t).length > 0) && (r[Q] = new J(e, t)), r
        }
        parseSegment() {
          const e = Sc(this.remaining);
          if ("" === e && this.peekStartsWith(";")) throw new Error(`Empty path url segment cannot have parameters: '${this.remaining}'.`);
          return this.capture(e), new ra(Dc(e), this.parseMatrixParams())
        }
        parseMatrixParams() {
          const e = {};
          for (; this.consumeOptional(";");) this.parseParam(e);
          return e
        }
        parseParam(e) {
          const t = Sc(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = Sc(this.remaining);
            i && (r = i, this.capture(r))
          }
          e[Dc(t)] = Dc(r)
        }
        parseQueryParam(e) {
          const t = function (n) {
            const e = n.match(ZV);
            return e ? e[0] : ""
          }(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = function (n) {
              const e = n.match(JV);
              return e ? e[0] : ""
            }(this.remaining);
            o && (r = o, this.capture(r))
          }
          const i = YE(t),
            s = YE(r);
          if (e.hasOwnProperty(i)) {
            let o = e[i];
            Array.isArray(o) || (o = [o], e[i] = o), o.push(s)
          } else e[i] = s
        }
        parseParens(e) {
          const t = {};
          for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
            const r = Sc(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new Error(`Cannot parse url '${this.url}'`);
            let s;
            r.indexOf(":") > -1 ? (s = r.substr(0, r.indexOf(":")), this.capture(s), this.capture(":")) : e && (s = Q);
            const o = this.parseChildren();
            t[s] = 1 === Object.keys(o).length ? o[Q] : new J([], o), this.consumeOptional("//")
          }
          return t
        }
        peekStartsWith(e) {
          return this.remaining.startsWith(e)
        }
        consumeOptional(e) {
          return !!this.peekStartsWith(e) && (this.remaining = this.remaining.substring(e.length), !0)
        }
        capture(e) {
          if (!this.consumeOptional(e)) throw new Error(`Expected "${e}".`)
        }
      }
      class XE {
        constructor(e) {
          this._root = e
        }
        get root() {
          return this._root.value
        }
        parent(e) {
          const t = this.pathFromRoot(e);
          return t.length > 1 ? t[t.length - 2] : null
        }
        children(e) {
          const t = Gf(e, this._root);
          return t ? t.children.map(r => r.value) : []
        }
        firstChild(e) {
          const t = Gf(e, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null
        }
        siblings(e) {
          const t = Kf(e, this._root);
          return t.length < 2 ? [] : t[t.length - 2].children.map(i => i.value).filter(i => i !== e)
        }
        pathFromRoot(e) {
          return Kf(e, this._root).map(t => t.value)
        }
      }

      function Gf(n, e) {
        if (n === e.value) return e;
        for (const t of e.children) {
          const r = Gf(n, t);
          if (r) return r
        }
        return null
      }

      function Kf(n, e) {
        if (n === e.value) return [e];
        for (const t of e.children) {
          const r = Kf(n, t);
          if (r.length) return r.unshift(e), r
        }
        return []
      }
      class sr {
        constructor(e, t) {
          this.value = e, this.children = t
        }
        toString() {
          return `TreeNode(${this.value})`
        }
      }

      function sa(n) {
        const e = {};
        return n && n.children.forEach(t => e[t.value.outlet] = t), e
      }
      class JE extends XE {
        constructor(e, t) {
          super(e), this.snapshot = t, Qf(this, e)
        }
        toString() {
          return this.snapshot.toString()
        }
      }

      function ew(n, e) {
        const t = function (n, e) {
            const o = new Tc([], {}, {}, "", {}, Q, e, null, n.root, -1, {});
            return new nw("", new sr(o, []))
          }(n, e),
          r = new Qt([new ra("", {})]),
          i = new Qt({}),
          s = new Qt({}),
          o = new Qt({}),
          a = new Qt(""),
          l = new Ms(r, i, o, a, s, Q, e, t.root);
        return l.snapshot = t.root, new JE(new sr(l, []), t)
      }
      class Ms {
        constructor(e, t, r, i, s, o, a, l) {
          this.url = e, this.params = t, this.queryParams = r, this.fragment = i, this.data = s, this.outlet = o, this.component = a, this._futureSnapshot = l
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig
        }
        get root() {
          return this._routerState.root
        }
        get parent() {
          return this._routerState.parent(this)
        }
        get firstChild() {
          return this._routerState.firstChild(this)
        }
        get children() {
          return this._routerState.children(this)
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this)
        }
        get paramMap() {
          return this._paramMap || (this._paramMap = this.params.pipe(_e(e => Ts(e)))), this._paramMap
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(_e(e => Ts(e)))), this._queryParamMap
        }
        toString() {
          return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
        }
      }

      function tw(n, e = "emptyOnly") {
        const t = n.pathFromRoot;
        let r = 0;
        if ("always" !== e)
          for (r = t.length - 1; r >= 1;) {
            const i = t[r],
              s = t[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (s.component) break;
              r--
            }
          }
        return function (n) {
          return n.reduce((e, t) => ({
            params: Object.assign(Object.assign({}, e.params), t.params),
            data: Object.assign(Object.assign({}, e.data), t.data),
            resolve: Object.assign(Object.assign({}, e.resolve), t._resolvedData)
          }), {
            params: {},
            data: {},
            resolve: {}
          })
        }(t.slice(r))
      }
      class Tc {
        constructor(e, t, r, i, s, o, a, l, c, u, d) {
          this.url = e, this.params = t, this.queryParams = r, this.fragment = i, this.data = s, this.outlet = o, this.component = a, this.routeConfig = l, this._urlSegment = c, this._lastPathIndex = u, this._resolve = d
        }
        get root() {
          return this._routerState.root
        }
        get parent() {
          return this._routerState.parent(this)
        }
        get firstChild() {
          return this._routerState.firstChild(this)
        }
        get children() {
          return this._routerState.children(this)
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this)
        }
        get paramMap() {
          return this._paramMap || (this._paramMap = Ts(this.params)), this._paramMap
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Ts(this.queryParams)), this._queryParamMap
        }
        toString() {
          return `Route(url:'${this.url.map(r=>r.toString()).join("/")}', path:'${this.routeConfig?this.routeConfig.path:""}')`
        }
      }
      class nw extends XE {
        constructor(e, t) {
          super(t), this.url = e, Qf(this, t)
        }
        toString() {
          return rw(this._root)
        }
      }

      function Qf(n, e) {
        e.value._routerState = n, e.children.forEach(t => Qf(n, t))
      }

      function rw(n) {
        const e = n.children.length > 0 ? ` { ${n.children.map(rw).join(", ")} } ` : "";
        return `${n.value}${e}`
      }

      function Yf(n) {
        if (n.snapshot) {
          const e = n.snapshot,
            t = n._futureSnapshot;
          n.snapshot = t, Ln(e.queryParams, t.queryParams) || n.queryParams.next(t.queryParams), e.fragment !== t.fragment && n.fragment.next(t.fragment), Ln(e.params, t.params) || n.params.next(t.params),
            function (n, e) {
              if (n.length !== e.length) return !1;
              for (let t = 0; t < n.length; ++t)
                if (!Ln(n[t], e[t])) return !1;
              return !0
            }(e.url, t.url) || n.url.next(t.url), Ln(e.data, t.data) || n.data.next(t.data)
        } else n.snapshot = n._futureSnapshot, n.data.next(n._futureSnapshot.data)
      }

      function Zf(n, e) {
        const t = Ln(n.params, e.params) && function (n, e) {
          return li(n, e) && n.every((t, r) => Ln(t.parameters, e[r].parameters))
        }(n.url, e.url);
        return t && !(!n.parent != !e.parent) && (!n.parent || Zf(n.parent, e.parent))
      }

      function Mc(n, e, t) {
        if (t && n.shouldReuseRoute(e.value, t.value.snapshot)) {
          const r = t.value;
          r._futureSnapshot = e.value;
          const i = function (n, e, t) {
            return e.children.map(r => {
              for (const i of t.children)
                if (n.shouldReuseRoute(r.value, i.value.snapshot)) return Mc(n, r, i);
              return Mc(n, r)
            })
          }(n, e, t);
          return new sr(r, i)
        } {
          if (n.shouldAttach(e.value)) {
            const s = n.retrieve(e.value);
            if (null !== s) {
              const o = s.route;
              return iw(e, o), o
            }
          }
          const r = function (n) {
              return new Ms(new Qt(n.url), new Qt(n.params), new Qt(n.queryParams), new Qt(n.fragment), new Qt(n.data), n.outlet, n.component, n)
            }(e.value),
            i = e.children.map(s => Mc(n, s));
          return new sr(r, i)
        }
      }

      function iw(n, e) {
        if (n.value.routeConfig !== e.value.routeConfig) throw new Error("Cannot reattach ActivatedRouteSnapshot created from a different route");
        if (n.children.length !== e.children.length) throw new Error("Cannot reattach ActivatedRouteSnapshot with a different number of children");
        e.value._futureSnapshot = n.value;
        for (let t = 0; t < n.children.length; ++t) iw(n.children[t], e.children[t])
      }

      function Ac(n) {
        return "object" == typeof n && null != n && !n.outlets && !n.segmentPath
      }

      function oa(n) {
        return "object" == typeof n && null != n && n.outlets
      }

      function Xf(n, e, t, r, i) {
        let s = {};
        return r && Qe(r, (o, a) => {
          s[a] = Array.isArray(o) ? o.map(l => `${l}`) : `${o}`
        }), new ai(t.root === n ? e : sw(t.root, n, e), s, i)
      }

      function sw(n, e, t) {
        const r = {};
        return Qe(n.children, (i, s) => {
          r[s] = i === e ? t : sw(i, e, t)
        }), new J(n.segments, r)
      }
      class ow {
        constructor(e, t, r) {
          if (this.isAbsolute = e, this.numberOfDoubleDots = t, this.commands = r, e && r.length > 0 && Ac(r[0])) throw new Error("Root segment cannot have matrix parameters");
          const i = r.find(oa);
          if (i && i !== UE(r)) throw new Error("{outlets:{}} has to be the last command")
        }
        toRoot() {
          return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0]
        }
      }
      class Jf {
        constructor(e, t, r) {
          this.segmentGroup = e, this.processChildren = t, this.index = r
        }
      }

      function aw(n, e, t) {
        if (n || (n = new J([], {})), 0 === n.segments.length && n.hasChildren()) return Ic(n, e, t);
        const r = function (n, e, t) {
            let r = 0,
              i = e;
            const s = {
              match: !1,
              pathIndex: 0,
              commandIndex: 0
            };
            for (; i < n.segments.length;) {
              if (r >= t.length) return s;
              const o = n.segments[i],
                a = t[r];
              if (oa(a)) break;
              const l = `${a}`,
                c = r < t.length - 1 ? t[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && c && "object" == typeof c && void 0 === c.outlets) {
                if (!cw(l, c, o)) return s;
                r += 2
              } else {
                if (!cw(l, {}, o)) return s;
                r++
              }
              i++
            }
            return {
              match: !0,
              pathIndex: i,
              commandIndex: r
            }
          }(n, e, t),
          i = t.slice(r.commandIndex);
        if (r.match && r.pathIndex < n.segments.length) {
          const s = new J(n.segments.slice(0, r.pathIndex), {});
          return s.children[Q] = new J(n.segments.slice(r.pathIndex), n.children), Ic(s, 0, i)
        }
        return r.match && 0 === i.length ? new J(n.segments, {}) : r.match && !n.hasChildren() ? ep(n, e, t) : r.match ? Ic(n, 0, i) : ep(n, e, t)
      }

      function Ic(n, e, t) {
        if (0 === t.length) return new J(n.segments, {}); {
          const r = function (n) {
              return oa(n[0]) ? n[0].outlets : {
                [Q]: n
              }
            }(t),
            i = {};
          return Qe(r, (s, o) => {
            "string" == typeof s && (s = [s]), null !== s && (i[o] = aw(n.children[o], e, s))
          }), Qe(n.children, (s, o) => {
            void 0 === r[o] && (i[o] = s)
          }), new J(n.segments, i)
        }
      }

      function ep(n, e, t) {
        const r = n.segments.slice(0, e);
        let i = 0;
        for (; i < t.length;) {
          const s = t[i];
          if (oa(s)) {
            const l = fB(s.outlets);
            return new J(r, l)
          }
          if (0 === i && Ac(t[0])) {
            r.push(new ra(n.segments[e].path, lw(t[0]))), i++;
            continue
          }
          const o = oa(s) ? s.outlets[Q] : `${s}`,
            a = i < t.length - 1 ? t[i + 1] : null;
          o && a && Ac(a) ? (r.push(new ra(o, lw(a))), i += 2) : (r.push(new ra(o, {})), i++)
        }
        return new J(r, {})
      }

      function fB(n) {
        const e = {};
        return Qe(n, (t, r) => {
          "string" == typeof t && (t = [t]), null !== t && (e[r] = ep(new J([], {}), 0, t))
        }), e
      }

      function lw(n) {
        const e = {};
        return Qe(n, (t, r) => e[r] = `${t}`), e
      }

      function cw(n, e, t) {
        return n == t.path && Ln(e, t.parameters)
      }
      class gB {
        constructor(e, t, r, i) {
          this.routeReuseStrategy = e, this.futureState = t, this.currState = r, this.forwardEvent = i
        }
        activate(e) {
          const t = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, r, e), Yf(this.futureState.root), this.activateChildRoutes(t, r, e)
        }
        deactivateChildRoutes(e, t, r) {
          const i = sa(t);
          e.children.forEach(s => {
            const o = s.value.outlet;
            this.deactivateRoutes(s, i[o], r), delete i[o]
          }), Qe(i, (s, o) => {
            this.deactivateRouteAndItsChildren(s, r)
          })
        }
        deactivateRoutes(e, t, r) {
          const i = e.value,
            s = t ? t.value : null;
          if (i === s)
            if (i.component) {
              const o = r.getContext(i.outlet);
              o && this.deactivateChildRoutes(e, t, o.children)
            } else this.deactivateChildRoutes(e, t, r);
          else s && this.deactivateRouteAndItsChildren(t, r)
        }
        deactivateRouteAndItsChildren(e, t) {
          this.routeReuseStrategy.shouldDetach(e.value.snapshot) ? this.detachAndStoreRouteSubtree(e, t) : this.deactivateRouteAndOutlet(e, t)
        }
        detachAndStoreRouteSubtree(e, t) {
          const r = t.getContext(e.value.outlet);
          if (r && r.outlet) {
            const i = r.outlet.detach(),
              s = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(e.value.snapshot, {
              componentRef: i,
              route: e,
              contexts: s
            })
          }
        }
        deactivateRouteAndOutlet(e, t) {
          const r = t.getContext(e.value.outlet),
            i = r && e.value.component ? r.children : t,
            s = sa(e);
          for (const o of Object.keys(s)) this.deactivateRouteAndItsChildren(s[o], i);
          r && r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated(), r.attachRef = null, r.resolver = null, r.route = null)
        }
        activateChildRoutes(e, t, r) {
          const i = sa(t);
          e.children.forEach(s => {
            this.activateRoutes(s, i[s.value.outlet], r), this.forwardEvent(new NV(s.value.snapshot))
          }), e.children.length && this.forwardEvent(new kV(e.value.snapshot))
        }
        activateRoutes(e, t, r) {
          const i = e.value,
            s = t ? t.value : null;
          if (Yf(i), i === s)
            if (i.component) {
              const o = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(e, t, o.children)
            } else this.activateChildRoutes(e, t, r);
          else if (i.component) {
            const o = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null), o.children.onOutletReAttached(a.contexts), o.attachRef = a.componentRef, o.route = a.route.value, o.outlet && o.outlet.attach(a.componentRef, a.route.value), uw(a.route)
            } else {
              const a = function (n) {
                  for (let e = n.parent; e; e = e.parent) {
                    const t = e.routeConfig;
                    if (t && t._loadedConfig) return t._loadedConfig;
                    if (t && t.component) return null
                  }
                  return null
                }(i.snapshot),
                l = a ? a.module.componentFactoryResolver : null;
              o.attachRef = null, o.route = i, o.resolver = l, o.outlet && o.outlet.activateWith(i, l), this.activateChildRoutes(e, null, o.children)
            }
          } else this.activateChildRoutes(e, null, r)
        }
      }

      function uw(n) {
        Yf(n.value), n.children.forEach(uw)
      }
      class tp {
        constructor(e, t) {
          this.routes = e, this.module = t
        }
      }

      function Tr(n) {
        return "function" == typeof n
      }

      function ci(n) {
        return n instanceof ai
      }
      const aa = Symbol("INITIAL_VALUE");

      function la() {
        return rr(n => function (...n) {
          let e, t;
          return Ei(n[n.length - 1]) && (t = n.pop()), "function" == typeof n[n.length - 1] && (e = n.pop()), 1 === n.length && Sa(n[0]) && (n = n[0]), mu(n, t).lift(new JL(e))
        }(n.map(e => e.pipe(Ds(1), function (...n) {
          const e = n[n.length - 1];
          return Ei(e) ? (n.pop(), t => jf(n, t, e)) : t => jf(n, t)
        }(aa)))).pipe(OE((e, t) => {
          let r = !1;
          return t.reduce((i, s, o) => i !== aa ? i : (s === aa && (r = !0), r || !1 !== s && o !== t.length - 1 && !ci(s) ? i : s), e)
        }, aa), si(e => e !== aa), _e(e => ci(e) ? e : !0 === e), Ds(1)))
      }
      let dw = (() => {
        class n {}
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275cmp = ke({
          type: n,
          selectors: [
            ["ng-component"]
          ],
          decls: 1,
          vars: 0,
          template: function (t, r) {
            1 & t && Ht(0, "router-outlet")
          },
          directives: function () {
            return [lp]
          },
          encapsulation: 2
        }), n
      })();

      function hw(n, e = "") {
        for (let t = 0; t < n.length; t++) {
          const r = n[t];
          EB(r, wB(e, r))
        }
      }

      function EB(n, e) {
        n.children && hw(n.children, e)
      }

      function wB(n, e) {
        return e ? n || e.path ? n && !e.path ? `${n}/` : !n && e.path ? e.path : `${n}/${e.path}` : "" : n
      }

      function np(n) {
        const e = n.children && n.children.map(np),
          t = e ? Object.assign(Object.assign({}, n), {
            children: e
          }) : Object.assign({}, n);
        return !t.component && (e || t.loadChildren) && t.outlet && t.outlet !== Q && (t.component = dw), t
      }

      function Yt(n) {
        return n.outlet || Q
      }

      function fw(n, e) {
        const t = n.filter(r => Yt(r) === e);
        return t.push(...n.filter(r => Yt(r) !== e)), t
      }
      const pw = {
        matched: !1,
        consumedSegments: [],
        lastChild: 0,
        parameters: {},
        positionalParamSegments: {}
      };

      function Rc(n, e, t) {
        var r;
        if ("" === e.path) return "full" === e.pathMatch && (n.hasChildren() || t.length > 0) ? Object.assign({}, pw) : {
          matched: !0,
          consumedSegments: [],
          lastChild: 0,
          parameters: {},
          positionalParamSegments: {}
        };
        const s = (e.matcher || VV)(t, n, e);
        if (!s) return Object.assign({}, pw);
        const o = {};
        Qe(s.posParams, (l, c) => {
          o[c] = l.path
        });
        const a = s.consumed.length > 0 ? Object.assign(Object.assign({}, o), s.consumed[s.consumed.length - 1].parameters) : o;
        return {
          matched: !0,
          consumedSegments: s.consumed,
          lastChild: s.consumed.length,
          parameters: a,
          positionalParamSegments: null !== (r = s.posParams) && void 0 !== r ? r : {}
        }
      }

      function xc(n, e, t, r, i = "corrected") {
        if (t.length > 0 && function (n, e, t) {
            return t.some(r => Oc(n, e, r) && Yt(r) !== Q)
          }(n, t, r)) {
          const o = new J(e, function (n, e, t, r) {
            const i = {};
            i[Q] = r, r._sourceSegment = n, r._segmentIndexShift = e.length;
            for (const s of t)
              if ("" === s.path && Yt(s) !== Q) {
                const o = new J([], {});
                o._sourceSegment = n, o._segmentIndexShift = e.length, i[Yt(s)] = o
              } return i
          }(n, e, r, new J(t, n.children)));
          return o._sourceSegment = n, o._segmentIndexShift = e.length, {
            segmentGroup: o,
            slicedSegments: []
          }
        }
        if (0 === t.length && function (n, e, t) {
            return t.some(r => Oc(n, e, r))
          }(n, t, r)) {
          const o = new J(n.segments, function (n, e, t, r, i, s) {
            const o = {};
            for (const a of r)
              if (Oc(n, t, a) && !i[Yt(a)]) {
                const l = new J([], {});
                l._sourceSegment = n, l._segmentIndexShift = "legacy" === s ? n.segments.length : e.length, o[Yt(a)] = l
              } return Object.assign(Object.assign({}, i), o)
          }(n, e, t, r, n.children, i));
          return o._sourceSegment = n, o._segmentIndexShift = e.length, {
            segmentGroup: o,
            slicedSegments: t
          }
        }
        const s = new J(n.segments, n.children);
        return s._sourceSegment = n, s._segmentIndexShift = e.length, {
          segmentGroup: s,
          slicedSegments: t
        }
      }

      function Oc(n, e, t) {
        return (!(n.hasChildren() || e.length > 0) || "full" !== t.pathMatch) && "" === t.path
      }

      function gw(n, e, t, r) {
        return !!(Yt(n) === r || r !== Q && Oc(e, t, n)) && ("**" === n.path || Rc(e, n, t).matched)
      }

      function mw(n, e, t) {
        return 0 === e.length && !n.children[t]
      }
      class ca {
        constructor(e) {
          this.segmentGroup = e || null
        }
      }
      class _w {
        constructor(e) {
          this.urlTree = e
        }
      }

      function kc(n) {
        return new re(e => e.error(new ca(n)))
      }

      function yw(n) {
        return new re(e => e.error(new _w(n)))
      }

      function AB(n) {
        return new re(e => e.error(new Error(`Only absolute redirects can have named outlets. redirectTo: '${n}'`)))
      }
      class xB {
        constructor(e, t, r, i, s) {
          this.configLoader = t, this.urlSerializer = r, this.urlTree = i, this.config = s, this.allowRedirects = !0, this.ngModule = e.get(Fn)
        }
        apply() {
          const e = xc(this.urlTree.root, [], [], this.config).segmentGroup,
            t = new J(e.segments, e.children);
          return this.expandSegmentGroup(this.ngModule, this.config, t, Q).pipe(_e(s => this.createUrlTree(rp(s), this.urlTree.queryParams, this.urlTree.fragment))).pipe(oi(s => {
            if (s instanceof _w) return this.allowRedirects = !1, this.match(s.urlTree);
            throw s instanceof ca ? this.noMatchError(s) : s
          }))
        }
        match(e) {
          return this.expandSegmentGroup(this.ngModule, this.config, e.root, Q).pipe(_e(i => this.createUrlTree(rp(i), e.queryParams, e.fragment))).pipe(oi(i => {
            throw i instanceof ca ? this.noMatchError(i) : i
          }))
        }
        noMatchError(e) {
          return new Error(`Cannot match any routes. URL Segment: '${e.segmentGroup}'`)
        }
        createUrlTree(e, t, r) {
          const i = e.segments.length > 0 ? new J([], {
            [Q]: e
          }) : e;
          return new ai(i, t, r)
        }
        expandSegmentGroup(e, t, r, i) {
          return 0 === r.segments.length && r.hasChildren() ? this.expandChildren(e, t, r).pipe(_e(s => new J([], s))) : this.expandSegment(e, r, t, r.segments, i, !0)
        }
        expandChildren(e, t, r) {
          const i = [];
          for (const s of Object.keys(r.children)) "primary" === s ? i.unshift(s) : i.push(s);
          return rt(i).pipe(ta(s => {
            const o = r.children[s],
              a = fw(t, s);
            return this.expandSegmentGroup(e, a, o, s).pipe(_e(l => ({
              segment: l,
              outlet: s
            })))
          }), OE((s, o) => (s[o.outlet] = o.segment, s), {}), function (n, e) {
            const t = arguments.length >= 2;
            return r => r.pipe(n ? si((i, s) => n(i, s, r)) : Aa, Uf(1), t ? PE(e) : kE(() => new vc))
          }())
        }
        expandSegment(e, t, r, i, s, o) {
          return rt(r).pipe(ta(a => this.expandSegmentAgainstRoute(e, t, r, a, i, s, o).pipe(oi(c => {
            if (c instanceof ca) return F(null);
            throw c
          }))), Ss(a => !!a), oi((a, l) => {
            if (a instanceof vc || "EmptyError" === a.name) {
              if (mw(t, i, s)) return F(new J([], {}));
              throw new ca(t)
            }
            throw a
          }))
        }
        expandSegmentAgainstRoute(e, t, r, i, s, o, a) {
          return gw(i, t, s, o) ? void 0 === i.redirectTo ? this.matchSegmentAgainstRoute(e, t, i, s, o) : a && this.allowRedirects ? this.expandSegmentAgainstRouteUsingRedirect(e, t, r, i, s, o) : kc(t) : kc(t)
        }
        expandSegmentAgainstRouteUsingRedirect(e, t, r, i, s, o) {
          return "**" === i.path ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(e, r, i, o) : this.expandRegularSegmentAgainstRouteUsingRedirect(e, t, r, i, s, o)
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(e, t, r, i) {
          const s = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/") ? yw(s) : this.lineralizeSegments(r, s).pipe(Ke(o => {
            const a = new J(o, {});
            return this.expandSegment(e, a, t, o, i, !1)
          }))
        }
        expandRegularSegmentAgainstRouteUsingRedirect(e, t, r, i, s, o) {
          const {
            matched: a,
            consumedSegments: l,
            lastChild: c,
            positionalParamSegments: u
          } = Rc(t, i, s);
          if (!a) return kc(t);
          const d = this.applyRedirectCommands(l, i.redirectTo, u);
          return i.redirectTo.startsWith("/") ? yw(d) : this.lineralizeSegments(i, d).pipe(Ke(h => this.expandSegment(e, t, r, h.concat(s.slice(c)), o, !1)))
        }
        matchSegmentAgainstRoute(e, t, r, i, s) {
          if ("**" === r.path) return r.loadChildren ? (r._loadedConfig ? F(r._loadedConfig) : this.configLoader.load(e.injector, r)).pipe(_e(h => (r._loadedConfig = h, new J(i, {})))) : F(new J(i, {}));
          const {
            matched: o,
            consumedSegments: a,
            lastChild: l
          } = Rc(t, r, i);
          if (!o) return kc(t);
          const c = i.slice(l);
          return this.getChildConfig(e, r, i).pipe(Ke(d => {
            const h = d.module,
              f = d.routes,
              {
                segmentGroup: p,
                slicedSegments: m
              } = xc(t, a, c, f),
              g = new J(p.segments, p.children);
            if (0 === m.length && g.hasChildren()) return this.expandChildren(h, f, g).pipe(_e(w => new J(a, w)));
            if (0 === f.length && 0 === m.length) return F(new J(a, {}));
            const v = Yt(r) === s;
            return this.expandSegment(h, g, f, m, v ? Q : s, !0).pipe(_e(E => new J(a.concat(E.segments), E.children)))
          }))
        }
        getChildConfig(e, t, r) {
          return t.children ? F(new tp(t.children, e)) : t.loadChildren ? void 0 !== t._loadedConfig ? F(t._loadedConfig) : this.runCanLoadGuards(e.injector, t, r).pipe(Ke(i => i ? this.configLoader.load(e.injector, t).pipe(_e(s => (t._loadedConfig = s, s))) : function (n) {
            return new re(e => e.error(zf(`Cannot load children because the guard of the route "path: '${n.path}'" returned false`)))
          }(t))) : F(new tp([], e))
        }
        runCanLoadGuards(e, t, r) {
          const i = t.canLoad;
          if (!i || 0 === i.length) return F(!0);
          const s = i.map(o => {
            const a = e.get(o);
            let l;
            if (function (n) {
                return n && Tr(n.canLoad)
              }(a)) l = a.canLoad(t, r);
            else {
              if (!Tr(a)) throw new Error("Invalid CanLoad guard");
              l = a(t, r)
            }
            return Vn(l)
          });
          return F(s).pipe(la(), At(o => {
            if (!ci(o)) return;
            const a = zf(`Redirecting to "${this.urlSerializer.serialize(o)}"`);
            throw a.url = o, a
          }), _e(o => !0 === o))
        }
        lineralizeSegments(e, t) {
          let r = [],
            i = t.root;
          for (;;) {
            if (r = r.concat(i.segments), 0 === i.numberOfChildren) return F(r);
            if (i.numberOfChildren > 1 || !i.children[Q]) return AB(e.redirectTo);
            i = i.children[Q]
          }
        }
        applyRedirectCommands(e, t, r) {
          return this.applyRedirectCreatreUrlTree(t, this.urlSerializer.parse(t), e, r)
        }
        applyRedirectCreatreUrlTree(e, t, r, i) {
          const s = this.createSegmentGroup(e, t.root, r, i);
          return new ai(s, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment)
        }
        createQueryParams(e, t) {
          const r = {};
          return Qe(e, (i, s) => {
            if ("string" == typeof i && i.startsWith(":")) {
              const a = i.substring(1);
              r[s] = t[a]
            } else r[s] = i
          }), r
        }
        createSegmentGroup(e, t, r, i) {
          const s = this.createSegments(e, t.segments, r, i);
          let o = {};
          return Qe(t.children, (a, l) => {
            o[l] = this.createSegmentGroup(e, a, r, i)
          }), new J(s, o)
        }
        createSegments(e, t, r, i) {
          return t.map(s => s.path.startsWith(":") ? this.findPosParam(e, s, i) : this.findOrReturn(s, r))
        }
        findPosParam(e, t, r) {
          const i = r[t.path.substring(1)];
          if (!i) throw new Error(`Cannot redirect to '${e}'. Cannot find '${t.path}'.`);
          return i
        }
        findOrReturn(e, t) {
          let r = 0;
          for (const i of t) {
            if (i.path === e.path) return t.splice(r), i;
            r++
          }
          return e
        }
      }

      function rp(n) {
        const e = {};
        for (const r of Object.keys(n.children)) {
          const s = rp(n.children[r]);
          (s.segments.length > 0 || s.hasChildren()) && (e[r] = s)
        }
        return function (n) {
          if (1 === n.numberOfChildren && n.children[Q]) {
            const e = n.children[Q];
            return new J(n.segments.concat(e.segments), e.children)
          }
          return n
        }(new J(n.segments, e))
      }
      class vw {
        constructor(e) {
          this.path = e, this.route = this.path[this.path.length - 1]
        }
      }
      class Pc {
        constructor(e, t) {
          this.component = e, this.route = t
        }
      }

      function PB(n, e, t) {
        const r = n._root;
        return ua(r, e ? e._root : null, t, [r.value])
      }

      function Nc(n, e, t) {
        const r = function (n) {
          if (!n) return null;
          for (let e = n.parent; e; e = e.parent) {
            const t = e.routeConfig;
            if (t && t._loadedConfig) return t._loadedConfig
          }
          return null
        }(e);
        return (r ? r.module.injector : t).get(n)
      }

      function ua(n, e, t, r, i = {
        canDeactivateChecks: [],
        canActivateChecks: []
      }) {
        const s = sa(e);
        return n.children.forEach(o => {
          (function (n, e, t, r, i = {
            canDeactivateChecks: [],
            canActivateChecks: []
          }) {
            const s = n.value,
              o = e ? e.value : null,
              a = t ? t.getContext(n.value.outlet) : null;
            if (o && s.routeConfig === o.routeConfig) {
              const l = function (n, e, t) {
                if ("function" == typeof t) return t(n, e);
                switch (t) {
                  case "pathParamsChange":
                    return !li(n.url, e.url);
                  case "pathParamsOrQueryParamsChange":
                    return !li(n.url, e.url) || !Ln(n.queryParams, e.queryParams);
                  case "always":
                    return !0;
                  case "paramsOrQueryParamsChange":
                    return !Zf(n, e) || !Ln(n.queryParams, e.queryParams);
                  default:
                    return !Zf(n, e)
                }
              }(o, s, s.routeConfig.runGuardsAndResolvers);
              l ? i.canActivateChecks.push(new vw(r)) : (s.data = o.data, s._resolvedData = o._resolvedData), ua(n, e, s.component ? a ? a.children : null : t, r, i), l && a && a.outlet && a.outlet.isActivated && i.canDeactivateChecks.push(new Pc(a.outlet.component, o))
            } else o && da(e, a, i), i.canActivateChecks.push(new vw(r)), ua(n, null, s.component ? a ? a.children : null : t, r, i)
          })(o, s[o.value.outlet], t, r.concat([o.value]), i), delete s[o.value.outlet]
        }), Qe(s, (o, a) => da(o, t.getContext(a), i)), i
      }

      function da(n, e, t) {
        const r = sa(n),
          i = n.value;
        Qe(r, (s, o) => {
          da(s, i.component ? e ? e.children.getContext(o) : null : e, t)
        }), t.canDeactivateChecks.push(new Pc(i.component && e && e.outlet && e.outlet.isActivated ? e.outlet.component : null, i))
      }
      class GB {}

      function bw(n) {
        return new re(e => e.error(n))
      }
      class QB {
        constructor(e, t, r, i, s, o) {
          this.rootComponentType = e, this.config = t, this.urlTree = r, this.url = i, this.paramsInheritanceStrategy = s, this.relativeLinkResolution = o
        }
        recognize() {
          const e = xc(this.urlTree.root, [], [], this.config.filter(o => void 0 === o.redirectTo), this.relativeLinkResolution).segmentGroup,
            t = this.processSegmentGroup(this.config, e, Q);
          if (null === t) return null;
          const r = new Tc([], Object.freeze({}), Object.freeze(Object.assign({}, this.urlTree.queryParams)), this.urlTree.fragment, {}, Q, this.rootComponentType, null, this.urlTree.root, -1, {}),
            i = new sr(r, t),
            s = new nw(this.url, i);
          return this.inheritParamsAndData(s._root), s
        }
        inheritParamsAndData(e) {
          const t = e.value,
            r = tw(t, this.paramsInheritanceStrategy);
          t.params = Object.freeze(r.params), t.data = Object.freeze(r.data), e.children.forEach(i => this.inheritParamsAndData(i))
        }
        processSegmentGroup(e, t, r) {
          return 0 === t.segments.length && t.hasChildren() ? this.processChildren(e, t) : this.processSegment(e, t, t.segments, r)
        }
        processChildren(e, t) {
          const r = [];
          for (const s of Object.keys(t.children)) {
            const o = t.children[s],
              a = fw(e, s),
              l = this.processSegmentGroup(a, o, s);
            if (null === l) return null;
            r.push(...l)
          }
          const i = Cw(r);
          return function (n) {
            n.sort((e, t) => e.value.outlet === Q ? -1 : t.value.outlet === Q ? 1 : e.value.outlet.localeCompare(t.value.outlet))
          }(i), i
        }
        processSegment(e, t, r, i) {
          for (const s of e) {
            const o = this.processSegmentAgainstRoute(s, t, r, i);
            if (null !== o) return o
          }
          return mw(t, r, i) ? [] : null
        }
        processSegmentAgainstRoute(e, t, r, i) {
          if (e.redirectTo || !gw(e, t, r, i)) return null;
          let s, o = [],
            a = [];
          if ("**" === e.path) {
            const f = r.length > 0 ? UE(r).parameters : {};
            s = new Tc(r, f, Object.freeze(Object.assign({}, this.urlTree.queryParams)), this.urlTree.fragment, Dw(e), Yt(e), e.component, e, Ew(t), ww(t) + r.length, Sw(e))
          } else {
            const f = Rc(t, e, r);
            if (!f.matched) return null;
            o = f.consumedSegments, a = r.slice(f.lastChild), s = new Tc(o, f.parameters, Object.freeze(Object.assign({}, this.urlTree.queryParams)), this.urlTree.fragment, Dw(e), Yt(e), e.component, e, Ew(t), ww(t) + o.length, Sw(e))
          }
          const l = function (n) {
              return n.children ? n.children : n.loadChildren ? n._loadedConfig.routes : []
            }(e),
            {
              segmentGroup: c,
              slicedSegments: u
            } = xc(t, o, a, l.filter(f => void 0 === f.redirectTo), this.relativeLinkResolution);
          if (0 === u.length && c.hasChildren()) {
            const f = this.processChildren(l, c);
            return null === f ? null : [new sr(s, f)]
          }
          if (0 === l.length && 0 === u.length) return [new sr(s, [])];
          const d = Yt(e) === i,
            h = this.processSegment(l, c, u, d ? Q : i);
          return null === h ? null : [new sr(s, h)]
        }
      }

      function XB(n) {
        const e = n.value.routeConfig;
        return e && "" === e.path && void 0 === e.redirectTo
      }

      function Cw(n) {
        const e = [],
          t = new Set;
        for (const r of n) {
          if (!XB(r)) {
            e.push(r);
            continue
          }
          const i = e.find(s => r.value.routeConfig === s.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), t.add(i)) : e.push(r)
        }
        for (const r of t) {
          const i = Cw(r.children);
          e.push(new sr(r.value, i))
        }
        return e.filter(r => !t.has(r))
      }

      function Ew(n) {
        let e = n;
        for (; e._sourceSegment;) e = e._sourceSegment;
        return e
      }

      function ww(n) {
        let e = n,
          t = e._segmentIndexShift ? e._segmentIndexShift : 0;
        for (; e._sourceSegment;) e = e._sourceSegment, t += e._segmentIndexShift ? e._segmentIndexShift : 0;
        return t - 1
      }

      function Dw(n) {
        return n.data || {}
      }

      function Sw(n) {
        return n.resolve || {}
      }

      function ip(n) {
        return rr(e => {
          const t = n(e);
          return t ? rt(t).pipe(_e(() => e)) : F(e)
        })
      }
      class a2 extends class {
        shouldDetach(e) {
          return !1
        }
        store(e, t) {}
        shouldAttach(e) {
          return !1
        }
        retrieve(e) {
          return null
        }
        shouldReuseRoute(e, t) {
          return e.routeConfig === t.routeConfig
        }
      } {}
      const sp = new P("ROUTES");
      class Tw {
        constructor(e, t, r, i) {
          this.loader = e, this.compiler = t, this.onLoadStartListener = r, this.onLoadEndListener = i
        }
        load(e, t) {
          if (t._loader$) return t._loader$;
          this.onLoadStartListener && this.onLoadStartListener(t);
          const i = this.loadModuleFactory(t.loadChildren).pipe(_e(s => {
            this.onLoadEndListener && this.onLoadEndListener(t);
            const o = s.create(e);
            return new tp(HE(o.injector.get(sp, void 0, x.Self | x.Optional)).map(np), o)
          }), oi(s => {
            throw t._loader$ = void 0, s
          }));
          return t._loader$ = new yg(i, () => new X).pipe(_u()), t._loader$
        }
        loadModuleFactory(e) {
          return "string" == typeof e ? rt(this.loader.load(e)) : Vn(e()).pipe(Ke(t => t instanceof cb ? F(t) : rt(this.compiler.compileModuleAsync(t))))
        }
      }
      class l2 {
        constructor() {
          this.outlet = null, this.route = null, this.resolver = null, this.children = new As, this.attachRef = null
        }
      }
      class As {
        constructor() {
          this.contexts = new Map
        }
        onChildOutletCreated(e, t) {
          const r = this.getOrCreateContext(e);
          r.outlet = t, this.contexts.set(e, r)
        }
        onChildOutletDestroyed(e) {
          const t = this.getContext(e);
          t && (t.outlet = null, t.attachRef = null)
        }
        onOutletDeactivated() {
          const e = this.contexts;
          return this.contexts = new Map, e
        }
        onOutletReAttached(e) {
          this.contexts = e
        }
        getOrCreateContext(e) {
          let t = this.getContext(e);
          return t || (t = new l2, this.contexts.set(e, t)), t
        }
        getContext(e) {
          return this.contexts.get(e) || null
        }
      }
      class u2 {
        shouldProcessUrl(e) {
          return !0
        }
        extract(e) {
          return e
        }
        merge(e, t) {
          return e
        }
      }

      function d2(n) {
        throw n
      }

      function h2(n, e, t) {
        return e.parse("/")
      }

      function Mw(n, e) {
        return F(null)
      }
      const f2 = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact"
        },
        p2 = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset"
        };
      let vt = (() => {
        class n {
          constructor(t, r, i, s, o, a, l, c) {
            this.rootComponentType = t, this.urlSerializer = r, this.rootContexts = i, this.location = s, this.config = c, this.lastSuccessfulNavigation = null, this.currentNavigation = null, this.disposed = !1, this.lastLocationChangeInfo = null, this.navigationId = 0, this.currentPageId = 0, this.isNgZoneEnabled = !1, this.events = new X, this.errorHandler = d2, this.malformedUriErrorHandler = h2, this.navigated = !1, this.lastSuccessfulId = -1, this.hooks = {
              beforePreactivation: Mw,
              afterPreactivation: Mw
            }, this.urlHandlingStrategy = new u2, this.routeReuseStrategy = new a2, this.onSameUrlNavigation = "ignore", this.paramsInheritanceStrategy = "emptyOnly", this.urlUpdateStrategy = "deferred", this.relativeLinkResolution = "corrected", this.canceledNavigationResolution = "replace", this.ngModule = o.get(Fn), this.console = o.get(Wl);
            const h = o.get(z);
            this.isNgZoneEnabled = h instanceof z && z.isInAngularZone(), this.resetConfig(c), this.currentUrlTree = new ai(new J([], {}), {}, null), this.rawUrlTree = this.currentUrlTree, this.browserUrlTree = this.currentUrlTree, this.configLoader = new Tw(a, l, f => this.triggerEvent(new FE(f)), f => this.triggerEvent(new LE(f))), this.routerState = ew(this.currentUrlTree, this.rootComponentType), this.transitions = new Qt({
              id: 0,
              targetPageId: 0,
              currentUrlTree: this.currentUrlTree,
              currentRawUrl: this.currentUrlTree,
              extractedUrl: this.urlHandlingStrategy.extract(this.currentUrlTree),
              urlAfterRedirects: this.urlHandlingStrategy.extract(this.currentUrlTree),
              rawUrl: this.currentUrlTree,
              extras: {},
              resolve: null,
              reject: null,
              promise: Promise.resolve(!0),
              source: "imperative",
              restoredState: null,
              currentSnapshot: this.routerState.snapshot,
              targetSnapshot: null,
              currentRouterState: this.routerState,
              targetRouterState: null,
              guards: {
                canActivateChecks: [],
                canDeactivateChecks: []
              },
              guardsResult: null
            }), this.navigations = this.setupNavigations(this.transitions), this.processNavigations()
          }
          get browserPageId() {
            var t;
            return null === (t = this.location.getState()) || void 0 === t ? void 0 : t.\u0275routerPageId
          }
          setupNavigations(t) {
            const r = this.events;
            return t.pipe(si(i => 0 !== i.id), _e(i => Object.assign(Object.assign({}, i), {
              extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl)
            })), rr(i => {
              let s = !1,
                o = !1;
              return F(i).pipe(At(a => {
                this.currentNavigation = {
                  id: a.id,
                  initialUrl: a.currentRawUrl,
                  extractedUrl: a.extractedUrl,
                  trigger: a.source,
                  extras: a.extras,
                  previousNavigation: this.lastSuccessfulNavigation ? Object.assign(Object.assign({}, this.lastSuccessfulNavigation), {
                    previousNavigation: null
                  }) : null
                }
              }), rr(a => {
                const l = this.browserUrlTree.toString(),
                  c = !this.navigated || a.extractedUrl.toString() !== l || l !== this.currentUrlTree.toString();
                if (("reload" === this.onSameUrlNavigation || c) && this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)) return Fc(a.source) && (this.browserUrlTree = a.extractedUrl), F(a).pipe(rr(d => {
                  const h = this.transitions.getValue();
                  return r.next(new $f(d.id, this.serializeUrl(d.extractedUrl), d.source, d.restoredState)), h !== this.transitions.getValue() ? ws : Promise.resolve(d)
                }), function (n, e, t, r) {
                  return rr(i => function (n, e, t, r, i) {
                    return new xB(n, e, t, r, i).apply()
                  }(n, e, t, i.extractedUrl, r).pipe(_e(s => Object.assign(Object.assign({}, i), {
                    urlAfterRedirects: s
                  }))))
                }(this.ngModule.injector, this.configLoader, this.urlSerializer, this.config), At(d => {
                  this.currentNavigation = Object.assign(Object.assign({}, this.currentNavigation), {
                    finalUrl: d.urlAfterRedirects
                  })
                }), function (n, e, t, r, i) {
                  return Ke(s => function (n, e, t, r, i = "emptyOnly", s = "legacy") {
                    try {
                      const o = new QB(n, e, t, r, i, s).recognize();
                      return null === o ? bw(new GB) : F(o)
                    } catch (o) {
                      return bw(o)
                    }
                  }(n, e, s.urlAfterRedirects, t(s.urlAfterRedirects), r, i).pipe(_e(o => Object.assign(Object.assign({}, s), {
                    targetSnapshot: o
                  }))))
                }(this.rootComponentType, this.config, d => this.serializeUrl(d), this.paramsInheritanceStrategy, this.relativeLinkResolution), At(d => {
                  "eager" === this.urlUpdateStrategy && (d.extras.skipLocationChange || this.setBrowserUrl(d.urlAfterRedirects, d), this.browserUrlTree = d.urlAfterRedirects);
                  const h = new MV(d.id, this.serializeUrl(d.extractedUrl), this.serializeUrl(d.urlAfterRedirects), d.targetSnapshot);
                  r.next(h)
                }));
                if (c && this.rawUrlTree && this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
                  const {
                    id: h,
                    extractedUrl: f,
                    source: p,
                    restoredState: m,
                    extras: g
                  } = a, v = new $f(h, this.serializeUrl(f), p, m);
                  r.next(v);
                  const y = ew(f, this.rootComponentType).snapshot;
                  return F(Object.assign(Object.assign({}, a), {
                    targetSnapshot: y,
                    urlAfterRedirects: f,
                    extras: Object.assign(Object.assign({}, g), {
                      skipLocationChange: !1,
                      replaceUrl: !1
                    })
                  }))
                }
                return this.rawUrlTree = a.rawUrl, this.browserUrlTree = a.urlAfterRedirects, a.resolve(null), ws
              }), ip(a => {
                const {
                  targetSnapshot: l,
                  id: c,
                  extractedUrl: u,
                  rawUrl: d,
                  extras: {
                    skipLocationChange: h,
                    replaceUrl: f
                  }
                } = a;
                return this.hooks.beforePreactivation(l, {
                  navigationId: c,
                  appliedUrlTree: u,
                  rawUrlTree: d,
                  skipLocationChange: !!h,
                  replaceUrl: !!f
                })
              }), At(a => {
                const l = new AV(a.id, this.serializeUrl(a.extractedUrl), this.serializeUrl(a.urlAfterRedirects), a.targetSnapshot);
                this.triggerEvent(l)
              }), _e(a => Object.assign(Object.assign({}, a), {
                guards: PB(a.targetSnapshot, a.currentSnapshot, this.rootContexts)
              })), function (n, e) {
                return Ke(t => {
                  const {
                    targetSnapshot: r,
                    currentSnapshot: i,
                    guards: {
                      canActivateChecks: s,
                      canDeactivateChecks: o
                    }
                  } = t;
                  return 0 === o.length && 0 === s.length ? F(Object.assign(Object.assign({}, t), {
                    guardsResult: !0
                  })) : function (n, e, t, r) {
                    return rt(n).pipe(Ke(i => function (n, e, t, r, i) {
                      const s = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
                      return s && 0 !== s.length ? F(s.map(a => {
                        const l = Nc(a, e, i);
                        let c;
                        if (function (n) {
                            return n && Tr(n.canDeactivate)
                          }(l)) c = Vn(l.canDeactivate(n, e, t, r));
                        else {
                          if (!Tr(l)) throw new Error("Invalid CanDeactivate guard");
                          c = Vn(l(n, e, t, r))
                        }
                        return c.pipe(Ss())
                      })).pipe(la()) : F(!0)
                    }(i.component, i.route, t, e, r)), Ss(i => !0 !== i, !0))
                  }(o, r, i, n).pipe(Ke(a => a && function (n) {
                    return "boolean" == typeof n
                  }(a) ? function (n, e, t, r) {
                    return rt(e).pipe(ta(i => jf(function (n, e) {
                      return null !== n && e && e(new OV(n)), F(!0)
                    }(i.route.parent, r), function (n, e) {
                      return null !== n && e && e(new PV(n)), F(!0)
                    }(i.route, r), function (n, e, t) {
                      const r = e[e.length - 1],
                        s = e.slice(0, e.length - 1).reverse().map(o => function (n) {
                          const e = n.routeConfig ? n.routeConfig.canActivateChild : null;
                          return e && 0 !== e.length ? {
                            node: n,
                            guards: e
                          } : null
                        }(o)).filter(o => null !== o).map(o => RE(() => F(o.guards.map(l => {
                          const c = Nc(l, o.node, t);
                          let u;
                          if (function (n) {
                              return n && Tr(n.canActivateChild)
                            }(c)) u = Vn(c.canActivateChild(r, n));
                          else {
                            if (!Tr(c)) throw new Error("Invalid CanActivateChild guard");
                            u = Vn(c(r, n))
                          }
                          return u.pipe(Ss())
                        })).pipe(la())));
                      return F(s).pipe(la())
                    }(n, i.path, t), function (n, e, t) {
                      const r = e.routeConfig ? e.routeConfig.canActivate : null;
                      if (!r || 0 === r.length) return F(!0);
                      const i = r.map(s => RE(() => {
                        const o = Nc(s, e, t);
                        let a;
                        if (function (n) {
                            return n && Tr(n.canActivate)
                          }(o)) a = Vn(o.canActivate(e, n));
                        else {
                          if (!Tr(o)) throw new Error("Invalid CanActivate guard");
                          a = Vn(o(e, n))
                        }
                        return a.pipe(Ss())
                      }));
                      return F(i).pipe(la())
                    }(n, i.route, t))), Ss(i => !0 !== i, !0))
                  }(r, s, n, e) : F(a)), _e(a => Object.assign(Object.assign({}, t), {
                    guardsResult: a
                  })))
                })
              }(this.ngModule.injector, a => this.triggerEvent(a)), At(a => {
                if (ci(a.guardsResult)) {
                  const c = zf(`Redirecting to "${this.serializeUrl(a.guardsResult)}"`);
                  throw c.url = a.guardsResult, c
                }
                const l = new IV(a.id, this.serializeUrl(a.extractedUrl), this.serializeUrl(a.urlAfterRedirects), a.targetSnapshot, !!a.guardsResult);
                this.triggerEvent(l)
              }), si(a => !!a.guardsResult || (this.restoreHistory(a), this.cancelNavigationTransition(a, ""), !1)), ip(a => {
                if (a.guards.canActivateChecks.length) return F(a).pipe(At(l => {
                  const c = new RV(l.id, this.serializeUrl(l.extractedUrl), this.serializeUrl(l.urlAfterRedirects), l.targetSnapshot);
                  this.triggerEvent(c)
                }), rr(l => {
                  let c = !1;
                  return F(l).pipe(function (n, e) {
                    return Ke(t => {
                      const {
                        targetSnapshot: r,
                        guards: {
                          canActivateChecks: i
                        }
                      } = t;
                      if (!i.length) return F(t);
                      let s = 0;
                      return rt(i).pipe(ta(o => function (n, e, t, r) {
                        return function (n, e, t, r) {
                          const i = Object.keys(n);
                          if (0 === i.length) return F({});
                          const s = {};
                          return rt(i).pipe(Ke(o => function (n, e, t, r) {
                            const i = Nc(n, e, r);
                            return Vn(i.resolve ? i.resolve(e, t) : i(e, t))
                          }(n[o], e, t, r).pipe(At(a => {
                            s[o] = a
                          }))), Uf(1), Ke(() => Object.keys(s).length === i.length ? F(s) : ws))
                        }(n._resolve, n, e, r).pipe(_e(s => (n._resolvedData = s, n.data = Object.assign(Object.assign({}, n.data), tw(n, t).resolve), null)))
                      }(o.route, r, n, e)), At(() => s++), Uf(1), Ke(o => s === i.length ? F(t) : ws))
                    })
                  }(this.paramsInheritanceStrategy, this.ngModule.injector), At({
                    next: () => c = !0,
                    complete: () => {
                      c || (this.restoreHistory(l), this.cancelNavigationTransition(l, "At least one route resolver didn't emit any value."))
                    }
                  }))
                }), At(l => {
                  const c = new xV(l.id, this.serializeUrl(l.extractedUrl), this.serializeUrl(l.urlAfterRedirects), l.targetSnapshot);
                  this.triggerEvent(c)
                }))
              }), ip(a => {
                const {
                  targetSnapshot: l,
                  id: c,
                  extractedUrl: u,
                  rawUrl: d,
                  extras: {
                    skipLocationChange: h,
                    replaceUrl: f
                  }
                } = a;
                return this.hooks.afterPreactivation(l, {
                  navigationId: c,
                  appliedUrlTree: u,
                  rawUrlTree: d,
                  skipLocationChange: !!h,
                  replaceUrl: !!f
                })
              }), _e(a => {
                const l = function (n, e, t) {
                  const r = Mc(n, e._root, t ? t._root : void 0);
                  return new JE(r, e)
                }(this.routeReuseStrategy, a.targetSnapshot, a.currentRouterState);
                return Object.assign(Object.assign({}, a), {
                  targetRouterState: l
                })
              }), At(a => {
                this.currentUrlTree = a.urlAfterRedirects, this.rawUrlTree = this.urlHandlingStrategy.merge(a.urlAfterRedirects, a.rawUrl), this.routerState = a.targetRouterState, "deferred" === this.urlUpdateStrategy && (a.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, a), this.browserUrlTree = a.urlAfterRedirects)
              }), ((n, e, t) => _e(r => (new gB(e, r.targetRouterState, r.currentRouterState, t).activate(n), r)))(this.rootContexts, this.routeReuseStrategy, a => this.triggerEvent(a)), At({
                next() {
                  s = !0
                },
                complete() {
                  s = !0
                }
              }), function (n) {
                return e => e.lift(new DV(n))
              }(() => {
                var a;
                if (!s && !o) {
                  const l = `Navigation ID ${i.id} is not equal to the current navigation id ${this.navigationId}`;
                  "replace" === this.canceledNavigationResolution ? (this.restoreHistory(i), this.cancelNavigationTransition(i, l)) : this.cancelNavigationTransition(i, l)
                }(null === (a = this.currentNavigation) || void 0 === a ? void 0 : a.id) === i.id && (this.currentNavigation = null)
              }), oi(a => {
                if (o = !0, function (n) {
                    return n && n[BE]
                  }(a)) {
                  const l = ci(a.url);
                  l || (this.navigated = !0, this.restoreHistory(i, !0));
                  const c = new NE(i.id, this.serializeUrl(i.extractedUrl), a.message);
                  r.next(c), l ? setTimeout(() => {
                    const u = this.urlHandlingStrategy.merge(a.url, this.rawUrlTree),
                      d = {
                        skipLocationChange: i.extras.skipLocationChange,
                        replaceUrl: "eager" === this.urlUpdateStrategy || Fc(i.source)
                      };
                    this.scheduleNavigation(u, "imperative", null, d, {
                      resolve: i.resolve,
                      reject: i.reject,
                      promise: i.promise
                    })
                  }, 0) : i.resolve(!1)
                } else {
                  this.restoreHistory(i, !0);
                  const l = new TV(i.id, this.serializeUrl(i.extractedUrl), a);
                  r.next(l);
                  try {
                    i.resolve(this.errorHandler(a))
                  } catch (c) {
                    i.reject(c)
                  }
                }
                return ws
              }))
            }))
          }
          resetRootComponentType(t) {
            this.rootComponentType = t, this.routerState.root.component = this.rootComponentType
          }
          getTransition() {
            const t = this.transitions.value;
            return t.urlAfterRedirects = this.browserUrlTree, t
          }
          setTransition(t) {
            this.transitions.next(Object.assign(Object.assign({}, this.getTransition()), t))
          }
          initialNavigation() {
            this.setUpLocationChangeListener(), 0 === this.navigationId && this.navigateByUrl(this.location.path(!0), {
              replaceUrl: !0
            })
          }
          setUpLocationChangeListener() {
            this.locationSubscription || (this.locationSubscription = this.location.subscribe(t => {
              const r = this.extractLocationChangeInfoFromEvent(t);
              this.shouldScheduleNavigation(this.lastLocationChangeInfo, r) && setTimeout(() => {
                const {
                  source: i,
                  state: s,
                  urlTree: o
                } = r, a = {
                  replaceUrl: !0
                };
                if (s) {
                  const l = Object.assign({}, s);
                  delete l.navigationId, delete l.\u0275routerPageId, 0 !== Object.keys(l).length && (a.state = l)
                }
                this.scheduleNavigation(o, i, s, a)
              }, 0), this.lastLocationChangeInfo = r
            }))
          }
          extractLocationChangeInfoFromEvent(t) {
            var r;
            return {
              source: "popstate" === t.type ? "popstate" : "hashchange",
              urlTree: this.parseUrl(t.url),
              state: (null === (r = t.state) || void 0 === r ? void 0 : r.navigationId) ? t.state : null,
              transitionId: this.getTransition().id
            }
          }
          shouldScheduleNavigation(t, r) {
            if (!t) return !0;
            const i = r.urlTree.toString() === t.urlTree.toString();
            return r.transitionId !== t.transitionId || !i || !("hashchange" === r.source && "popstate" === t.source || "popstate" === r.source && "hashchange" === t.source)
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree)
          }
          getCurrentNavigation() {
            return this.currentNavigation
          }
          triggerEvent(t) {
            this.events.next(t)
          }
          resetConfig(t) {
            hw(t), this.config = t.map(np), this.navigated = !1, this.lastSuccessfulId = -1
          }
          ngOnDestroy() {
            this.dispose()
          }
          dispose() {
            this.transitions.complete(), this.locationSubscription && (this.locationSubscription.unsubscribe(), this.locationSubscription = void 0), this.disposed = !0
          }
          createUrlTree(t, r = {}) {
            const {
              relativeTo: i,
              queryParams: s,
              fragment: o,
              queryParamsHandling: a,
              preserveFragment: l
            } = r, c = i || this.routerState.root, u = l ? this.currentUrlTree.fragment : o;
            let d = null;
            switch (a) {
              case "merge":
                d = Object.assign(Object.assign({}, this.currentUrlTree.queryParams), s);
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = s || null
            }
            return null !== d && (d = this.removeEmptyProps(d)),
              function (n, e, t, r, i) {
                if (0 === t.length) return Xf(e.root, e.root, e, r, i);
                const s = function (n) {
                  if ("string" == typeof n[0] && 1 === n.length && "/" === n[0]) return new ow(!0, 0, n);
                  let e = 0,
                    t = !1;
                  const r = n.reduce((i, s, o) => {
                    if ("object" == typeof s && null != s) {
                      if (s.outlets) {
                        const a = {};
                        return Qe(s.outlets, (l, c) => {
                          a[c] = "string" == typeof l ? l.split("/") : l
                        }), [...i, {
                          outlets: a
                        }]
                      }
                      if (s.segmentPath) return [...i, s.segmentPath]
                    }
                    return "string" != typeof s ? [...i, s] : 0 === o ? (s.split("/").forEach((a, l) => {
                      0 == l && "." === a || (0 == l && "" === a ? t = !0 : ".." === a ? e++ : "" != a && i.push(a))
                    }), i) : [...i, s]
                  }, []);
                  return new ow(t, e, r)
                }(t);
                if (s.toRoot()) return Xf(e.root, new J([], {}), e, r, i);
                const o = function (n, e, t) {
                    if (n.isAbsolute) return new Jf(e.root, !0, 0);
                    if (-1 === t.snapshot._lastPathIndex) {
                      const s = t.snapshot._urlSegment;
                      return new Jf(s, s === e.root, 0)
                    }
                    const r = Ac(n.commands[0]) ? 0 : 1;
                    return function (n, e, t) {
                      let r = n,
                        i = e,
                        s = t;
                      for (; s > i;) {
                        if (s -= i, r = r.parent, !r) throw new Error("Invalid number of '../'");
                        i = r.segments.length
                      }
                      return new Jf(r, !1, i - s)
                    }(t.snapshot._urlSegment, t.snapshot._lastPathIndex + r, n.numberOfDoubleDots)
                  }(s, e, n),
                  a = o.processChildren ? Ic(o.segmentGroup, o.index, s.commands) : aw(o.segmentGroup, o.index, s.commands);
                return Xf(o.segmentGroup, a, e, r, i)
              }(c, this.currentUrlTree, t, d, null != u ? u : null)
          }
          navigateByUrl(t, r = {
            skipLocationChange: !1
          }) {
            const i = ci(t) ? t : this.parseUrl(t),
              s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(s, "imperative", null, r)
          }
          navigate(t, r = {
            skipLocationChange: !1
          }) {
            return function (n) {
              for (let e = 0; e < n.length; e++) {
                const t = n[e];
                if (null == t) throw new Error(`The requested path contains ${t} segment at index ${e}`)
              }
            }(t), this.navigateByUrl(this.createUrlTree(t, r), r)
          }
          serializeUrl(t) {
            return this.urlSerializer.serialize(t)
          }
          parseUrl(t) {
            let r;
            try {
              r = this.urlSerializer.parse(t)
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, t)
            }
            return r
          }
          isActive(t, r) {
            let i;
            if (i = !0 === r ? Object.assign({}, f2) : !1 === r ? Object.assign({}, p2) : r, ci(t)) return zE(this.currentUrlTree, t, i);
            const s = this.parseUrl(t);
            return zE(this.currentUrlTree, s, i)
          }
          removeEmptyProps(t) {
            return Object.keys(t).reduce((r, i) => {
              const s = t[i];
              return null != s && (r[i] = s), r
            }, {})
          }
          processNavigations() {
            this.navigations.subscribe(t => {
              this.navigated = !0, this.lastSuccessfulId = t.id, this.currentPageId = t.targetPageId, this.events.next(new na(t.id, this.serializeUrl(t.extractedUrl), this.serializeUrl(this.currentUrlTree))), this.lastSuccessfulNavigation = this.currentNavigation, t.resolve(!0)
            }, t => {
              this.console.warn(`Unhandled Navigation Error: ${t}`)
            })
          }
          scheduleNavigation(t, r, i, s, o) {
            var a, l;
            if (this.disposed) return Promise.resolve(!1);
            const c = this.getTransition(),
              u = Fc(r) && c && !Fc(c.source),
              f = (this.lastSuccessfulId === c.id || this.currentNavigation ? c.rawUrl : c.urlAfterRedirects).toString() === t.toString();
            if (u && f) return Promise.resolve(!0);
            let p, m, g;
            o ? (p = o.resolve, m = o.reject, g = o.promise) : g = new Promise((E, w) => {
              p = E, m = w
            });
            const v = ++this.navigationId;
            let y;
            return "computed" === this.canceledNavigationResolution ? (0 === this.currentPageId && (i = this.location.getState()), y = i && i.\u0275routerPageId ? i.\u0275routerPageId : s.replaceUrl || s.skipLocationChange ? null !== (a = this.browserPageId) && void 0 !== a ? a : 0 : (null !== (l = this.browserPageId) && void 0 !== l ? l : 0) + 1) : y = 0, this.setTransition({
              id: v,
              targetPageId: y,
              source: r,
              restoredState: i,
              currentUrlTree: this.currentUrlTree,
              currentRawUrl: this.rawUrlTree,
              rawUrl: t,
              extras: s,
              resolve: p,
              reject: m,
              promise: g,
              currentSnapshot: this.routerState.snapshot,
              currentRouterState: this.routerState
            }), g.catch(E => Promise.reject(E))
          }
          setBrowserUrl(t, r) {
            const i = this.urlSerializer.serialize(t),
              s = Object.assign(Object.assign({}, r.extras.state), this.generateNgRouterState(r.id, r.targetPageId));
            this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl ? this.location.replaceState(i, "", s) : this.location.go(i, "", s)
          }
          restoreHistory(t, r = !1) {
            var i, s;
            if ("computed" === this.canceledNavigationResolution) {
              const o = this.currentPageId - t.targetPageId;
              "popstate" !== t.source && "eager" !== this.urlUpdateStrategy && this.currentUrlTree !== (null === (i = this.currentNavigation) || void 0 === i ? void 0 : i.finalUrl) || 0 === o ? this.currentUrlTree === (null === (s = this.currentNavigation) || void 0 === s ? void 0 : s.finalUrl) && 0 === o && (this.resetState(t), this.browserUrlTree = t.currentUrlTree, this.resetUrlToCurrentUrlTree()) : this.location.historyGo(o)
            } else "replace" === this.canceledNavigationResolution && (r && this.resetState(t), this.resetUrlToCurrentUrlTree())
          }
          resetState(t) {
            this.routerState = t.currentRouterState, this.currentUrlTree = t.currentUrlTree, this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, t.rawUrl)
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
          }
          cancelNavigationTransition(t, r) {
            const i = new NE(t.id, this.serializeUrl(t.extractedUrl), r);
            this.triggerEvent(i), t.resolve(!1)
          }
          generateNgRouterState(t, r) {
            return "computed" === this.canceledNavigationResolution ? {
              navigationId: t,
              \u0275routerPageId: r
            } : {
              navigationId: t
            }
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(el), _(Wf), _(As), _(Qo), _(he), _(Gl), _(ei), _(void 0))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();

      function Fc(n) {
        return "imperative" !== n
      }
      let lp = (() => {
        class n {
          constructor(t, r, i, s, o) {
            this.parentContexts = t, this.location = r, this.resolver = i, this.changeDetector = o, this.activated = null, this._activatedRoute = null, this.activateEvents = new Ee, this.deactivateEvents = new Ee, this.name = s || Q, t.onChildOutletCreated(this.name, this)
          }
          ngOnDestroy() {
            this.parentContexts.onChildOutletDestroyed(this.name)
          }
          ngOnInit() {
            if (!this.activated) {
              const t = this.parentContexts.getContext(this.name);
              t && t.route && (t.attachRef ? this.attach(t.attachRef, t.route) : this.activateWith(t.route, t.resolver || null))
            }
          }
          get isActivated() {
            return !!this.activated
          }
          get component() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this.activated.instance
          }
          get activatedRoute() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this._activatedRoute
          }
          get activatedRouteData() {
            return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
          }
          detach() {
            if (!this.activated) throw new Error("Outlet is not activated");
            this.location.detach();
            const t = this.activated;
            return this.activated = null, this._activatedRoute = null, t
          }
          attach(t, r) {
            this.activated = t, this._activatedRoute = r, this.location.insert(t.hostView)
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(), this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(t)
            }
          }
          activateWith(t, r) {
            if (this.isActivated) throw new Error("Cannot activate an already activated outlet");
            this._activatedRoute = t;
            const o = (r = r || this.resolver).resolveComponentFactory(t._futureSnapshot.routeConfig.component),
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new y2(t, a, this.location.injector);
            this.activated = this.location.createComponent(o, this.location.length, l), this.changeDetector.markForCheck(), this.activateEvents.emit(this.activated.instance)
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(b(As), b(ut), b(Xn), function (n) {
            return function (n, e) {
              if ("class" === e) return n.classes;
              if ("style" === e) return n.styles;
              const t = n.attrs;
              if (t) {
                const r = t.length;
                let i = 0;
                for (; i < r;) {
                  const s = t[i];
                  if (Zg(s)) break;
                  if (0 === s) i += 2;
                  else if ("number" == typeof s)
                    for (i++; i < r && "string" == typeof t[i];) i++;
                  else {
                    if (s === e) return t[i + 1];
                    i += 2
                  }
                }
              }
              return null
            }(Ve(), n)
          }("name"), b(Qr))
        }, n.\u0275dir = ee({
          type: n,
          selectors: [
            ["router-outlet"]
          ],
          outputs: {
            activateEvents: "activate",
            deactivateEvents: "deactivate"
          },
          exportAs: ["outlet"]
        }), n
      })();
      class y2 {
        constructor(e, t, r) {
          this.route = e, this.childContexts = t, this.parent = r
        }
        get(e, t) {
          return e === Ms ? this.route : e === As ? this.childContexts : this.parent.get(e, t)
        }
      }
      class Aw {}
      class Iw {
        preload(e, t) {
          return F(null)
        }
      }
      let Rw = (() => {
          class n {
            constructor(t, r, i, s, o) {
              this.router = t, this.injector = s, this.preloadingStrategy = o, this.loader = new Tw(r, i, c => t.triggerEvent(new FE(c)), c => t.triggerEvent(new LE(c)))
            }
            setUpPreloading() {
              this.subscription = this.router.events.pipe(si(t => t instanceof na), ta(() => this.preload())).subscribe(() => {})
            }
            preload() {
              const t = this.injector.get(Fn);
              return this.processRoutes(t, this.router.config)
            }
            ngOnDestroy() {
              this.subscription && this.subscription.unsubscribe()
            }
            processRoutes(t, r) {
              const i = [];
              for (const s of r)
                if (s.loadChildren && !s.canLoad && s._loadedConfig) {
                  const o = s._loadedConfig;
                  i.push(this.processRoutes(o.module, o.routes))
                } else s.loadChildren && !s.canLoad ? i.push(this.preloadConfig(t, s)) : s.children && i.push(this.processRoutes(t, s.children));
              return rt(i).pipe(zs(), _e(s => {}))
            }
            preloadConfig(t, r) {
              return this.preloadingStrategy.preload(r, () => (r._loadedConfig ? F(r._loadedConfig) : this.loader.load(t.injector, r)).pipe(Ke(s => (r._loadedConfig = s, this.processRoutes(s.module, s.routes)))))
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(vt), _(Gl), _(ei), _(he), _(Aw))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        cp = (() => {
          class n {
            constructor(t, r, i = {}) {
              this.router = t, this.viewportScroller = r, this.options = i, this.lastId = 0, this.lastSource = "imperative", this.restoredId = 0, this.store = {}, i.scrollPositionRestoration = i.scrollPositionRestoration || "disabled", i.anchorScrolling = i.anchorScrolling || "disabled"
            }
            init() {
              "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.setHistoryScrollRestoration("manual"), this.routerEventsSubscription = this.createScrollEvents(), this.scrollEventsSubscription = this.consumeScrollEvents()
            }
            createScrollEvents() {
              return this.router.events.subscribe(t => {
                t instanceof $f ? (this.store[this.lastId] = this.viewportScroller.getScrollPosition(), this.lastSource = t.navigationTrigger, this.restoredId = t.restoredState ? t.restoredState.navigationId : 0) : t instanceof na && (this.lastId = t.id, this.scheduleScrollEvent(t, this.router.parseUrl(t.urlAfterRedirects).fragment))
              })
            }
            consumeScrollEvents() {
              return this.router.events.subscribe(t => {
                t instanceof VE && (t.position ? "top" === this.options.scrollPositionRestoration ? this.viewportScroller.scrollToPosition([0, 0]) : "enabled" === this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition(t.position) : t.anchor && "enabled" === this.options.anchorScrolling ? this.viewportScroller.scrollToAnchor(t.anchor) : "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition([0, 0]))
              })
            }
            scheduleScrollEvent(t, r) {
              this.router.triggerEvent(new VE(t, "popstate" === this.lastSource ? this.store[this.restoredId] : null, r))
            }
            ngOnDestroy() {
              this.routerEventsSubscription && this.routerEventsSubscription.unsubscribe(), this.scrollEventsSubscription && this.scrollEventsSubscription.unsubscribe()
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(vt), _(gE), _(void 0))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })();
      const ui = new P("ROUTER_CONFIGURATION"),
        xw = new P("ROUTER_FORROOT_GUARD"),
        b2 = [Qo, {
          provide: Wf,
          useClass: KE
        }, {
          provide: vt,
          useFactory: function (n, e, t, r, i, s, o, a = {}, l, c) {
            const u = new vt(null, n, e, t, r, i, s, HE(o));
            return l && (u.urlHandlingStrategy = l), c && (u.routeReuseStrategy = c),
              function (n, e) {
                n.errorHandler && (e.errorHandler = n.errorHandler), n.malformedUriErrorHandler && (e.malformedUriErrorHandler = n.malformedUriErrorHandler), n.onSameUrlNavigation && (e.onSameUrlNavigation = n.onSameUrlNavigation), n.paramsInheritanceStrategy && (e.paramsInheritanceStrategy = n.paramsInheritanceStrategy), n.relativeLinkResolution && (e.relativeLinkResolution = n.relativeLinkResolution), n.urlUpdateStrategy && (e.urlUpdateStrategy = n.urlUpdateStrategy)
              }(a, u), a.enableTracing && u.events.subscribe(d => {
                var h, f;
                null === (h = console.group) || void 0 === h || h.call(console, `Router Event: ${d.constructor.name}`), console.log(d.toString()), console.log(d), null === (f = console.groupEnd) || void 0 === f || f.call(console)
              }), u
          },
          deps: [Wf, As, Qo, he, Gl, ei, sp, ui, [class {}, new mt],
            [class {}, new mt]
          ]
        }, As, {
          provide: Ms,
          useFactory: function (n) {
            return n.routerState.root
          },
          deps: [vt]
        }, {
          provide: Gl,
          useClass: uN
        }, Rw, Iw, class {
          preload(e, t) {
            return t().pipe(oi(() => F(null)))
          }
        }, {
          provide: ui,
          useValue: {
            enableTracing: !1
          }
        }];

      function C2() {
        return new Yh("Router", vt)
      }
      let Ow = (() => {
        class n {
          constructor(t, r) {}
          static forRoot(t, r) {
            return {
              ngModule: n,
              providers: [b2, kw(t), {
                  provide: xw,
                  useFactory: D2,
                  deps: [
                    [vt, new mt, new _r]
                  ]
                }, {
                  provide: ui,
                  useValue: r || {}
                }, {
                  provide: Es,
                  useFactory: w2,
                  deps: [ii, [new Bi(pf), new mt], ui]
                }, {
                  provide: cp,
                  useFactory: E2,
                  deps: [vt, gE, ui]
                }, {
                  provide: Aw,
                  useExisting: r && r.preloadingStrategy ? r.preloadingStrategy : Iw
                }, {
                  provide: Yh,
                  multi: !0,
                  useFactory: C2
                },
                [up, {
                  provide: Uo,
                  multi: !0,
                  useFactory: A2,
                  deps: [up]
                }, {
                  provide: Pw,
                  useFactory: I2,
                  deps: [up]
                }, {
                  provide: dC,
                  multi: !0,
                  useExisting: Pw
                }]
              ]
            }
          }
          static forChild(t) {
            return {
              ngModule: n,
              providers: [kw(t)]
            }
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(xw, 8), _(vt, 8))
        }, n.\u0275mod = ge({
          type: n
        }), n.\u0275inj = de({}), n
      })();

      function E2(n, e, t) {
        return t.scrollOffset && e.setOffset(t.scrollOffset), new cp(n, e, t)
      }

      function w2(n, e, t = {}) {
        return t.useHash ? new RF(n, e) : new eE(n, e)
      }

      function D2(n) {
        return "guarded"
      }

      function kw(n) {
        return [{
          provide: xT,
          multi: !0,
          useValue: n
        }, {
          provide: sp,
          multi: !0,
          useValue: n
        }]
      }
      let up = (() => {
        class n {
          constructor(t) {
            this.injector = t, this.initNavigation = !1, this.destroyed = !1, this.resultOfPreactivationDone = new X
          }
          appInitializer() {
            return this.injector.get(MF, Promise.resolve(null)).then(() => {
              if (this.destroyed) return Promise.resolve(!0);
              let r = null;
              const i = new Promise(a => r = a),
                s = this.injector.get(vt),
                o = this.injector.get(ui);
              return "disabled" === o.initialNavigation ? (s.setUpLocationChangeListener(), r(!0)) : "enabled" === o.initialNavigation || "enabledBlocking" === o.initialNavigation ? (s.hooks.afterPreactivation = () => this.initNavigation ? F(null) : (this.initNavigation = !0, r(!0), this.resultOfPreactivationDone), s.initialNavigation()) : r(!0), i
            })
          }
          bootstrapListener(t) {
            const r = this.injector.get(ui),
              i = this.injector.get(Rw),
              s = this.injector.get(cp),
              o = this.injector.get(vt),
              a = this.injector.get(ti);
            t === a.components[0] && (("enabledNonBlocking" === r.initialNavigation || void 0 === r.initialNavigation) && o.initialNavigation(), i.setUpPreloading(), s.init(), o.resetRootComponentType(a.componentTypes[0]), this.resultOfPreactivationDone.next(null), this.resultOfPreactivationDone.complete())
          }
          ngOnDestroy() {
            this.destroyed = !0
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(he))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();

      function A2(n) {
        return n.appInitializer.bind(n)
      }

      function I2(n) {
        return n.bootstrapListener.bind(n)
      }
      const Pw = new P("Router Initializer");
      let x2 = (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-cotacao"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (je(0, "p"), $t(1, "cotacao works!"), He())
            },
            styles: [""]
          }), n
        })(),
        O2 = (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-github"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (je(0, "p"), $t(1, "github works!"), He())
            },
            styles: [""]
          }), n
        })(),
        Lc = (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-home"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (je(0, "p"), $t(1, "home works!"), He())
            },
            styles: [""]
          }), n
        })();
      const k2 = [{
        path: "",
        component: Lc
      }, {
        path: "/",
        component: Lc
      }, {
        path: "GuilhermePortella.github.io",
        component: Lc
      }, {
        path: "news",
        component: (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-news"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (je(0, "p"), $t(1, "news works!"), He())
            },
            styles: [""]
          }), n
        })()
      }, {
        path: "cotacao",
        component: x2
      }, {
        path: "GuilhermePortella.github.io",
        component: Lc
      }, {
        path: "github",
        component: O2
      }, {
        path: "java",
        component: (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-java"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (je(0, "p"), $t(1, "java works!"), He())
            },
            styles: [""]
          }), n
        })()
      }, {
        path: "tutorial",
        component: (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-tutoriais"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (je(0, "p"), $t(1, "tutoriais works!"), He())
            },
            styles: [""]
          }), n
        })()
      }];
      let dp, P2 = (() => {
        class n {}
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275mod = ge({
          type: n
        }), n.\u0275inj = de({
          imports: [
            [Ow.forRoot(k2)], Ow
          ]
        }), n
      })();
      class K2 {
        constructor(e) {
          this.notifier = e
        }
        call(e, t) {
          const r = new Q2(e),
            i = $s(this.notifier, new Hs(r));
          return i && !r.seenValue ? (r.add(i), t.subscribe(r)) : r
        }
      }
      class Q2 extends Us {
        constructor(e) {
          super(e), this.seenValue = !1
        }
        notifyNext() {
          this.seenValue = !0, this.complete()
        }
        notifyComplete() {}
      }

      function Lw(n) {
        return Array.isArray(n) ? n : [n]
      }

      function Le(n) {
        return null == n ? "" : "string" == typeof n ? n : `${n}px`
      }
      try {
        dp = "undefined" != typeof Intl && Intl.v8BreakIterator
      } catch (n) {
        dp = !1
      }
      let hi, Ae = (() => {
          class n {
            constructor(t) {
              this._platformId = t, this.isBrowser = this._platformId ? function (n) {
                return n === pE
              }(this._platformId) : "object" == typeof document && !!document, this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent), this.TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent), this.BLINK = this.isBrowser && !(!window.chrome && !dp) && "undefined" != typeof CSS && !this.EDGE && !this.TRIDENT, this.WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT, this.IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window), this.FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent), this.ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT, this.SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(zo))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(zo))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        Vc = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({}), n
        })();

      function Bw() {
        if (null == hi) {
          if ("object" != typeof document || !document || "function" != typeof Element || !Element) return hi = !1, hi;
          if ("scrollBehavior" in document.documentElement.style) hi = !0;
          else {
            const n = Element.prototype.scrollTo;
            hi = !!n && !/\{\s*\[native code\]\s*\}/.test(n.toString())
          }
        }
        return hi
      }

      function fi(n) {
        return n.composedPath ? n.composedPath()[0] : n.target
      }

      function pp() {
        return "undefined" != typeof __karma__ && !!__karma__ || "undefined" != typeof jasmine && !!jasmine || "undefined" != typeof jest && !!jest || "undefined" != typeof Mocha && !!Mocha
      }
      class tj extends ie {
        constructor(e, t) {
          super()
        }
        schedule(e, t = 0) {
          return this
        }
      }
      class jc extends tj {
        constructor(e, t) {
          super(e, t), this.scheduler = e, this.work = t, this.pending = !1
        }
        schedule(e, t = 0) {
          if (this.closed) return this;
          this.state = e;
          const r = this.id,
            i = this.scheduler;
          return null != r && (this.id = this.recycleAsyncId(i, r, t)), this.pending = !0, this.delay = t, this.id = this.id || this.requestAsyncId(i, this.id, t), this
        }
        requestAsyncId(e, t, r = 0) {
          return setInterval(e.flush.bind(e, this), r)
        }
        recycleAsyncId(e, t, r = 0) {
          if (null !== r && this.delay === r && !1 === this.pending) return t;
          clearInterval(t)
        }
        execute(e, t) {
          if (this.closed) return new Error("executing a cancelled action");
          this.pending = !1;
          const r = this._execute(e, t);
          if (r) return r;
          !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
        }
        _execute(e, t) {
          let i, r = !1;
          try {
            this.work(e)
          } catch (s) {
            r = !0, i = !!s && s || new Error(s)
          }
          if (r) return this.unsubscribe(), i
        }
        _unsubscribe() {
          const e = this.id,
            t = this.scheduler,
            r = t.actions,
            i = r.indexOf(this);
          this.work = null, this.state = null, this.pending = !1, this.scheduler = null, -1 !== i && r.splice(i, 1), null != e && (this.id = this.recycleAsyncId(t, e, null)), this.delay = null
        }
      }
      let jw = (() => {
        class n {
          constructor(t, r = n.now) {
            this.SchedulerAction = t, this.now = r
          }
          schedule(t, r = 0, i) {
            return new this.SchedulerAction(this, t).schedule(i, r)
          }
        }
        return n.now = () => Date.now(), n
      })();
      class bn extends jw {
        constructor(e, t = jw.now) {
          super(e, () => bn.delegate && bn.delegate !== this ? bn.delegate.now() : t()), this.actions = [], this.active = !1, this.scheduled = void 0
        }
        schedule(e, t = 0, r) {
          return bn.delegate && bn.delegate !== this ? bn.delegate.schedule(e, t, r) : super.schedule(e, t, r)
        }
        flush(e) {
          const {
            actions: t
          } = this;
          if (this.active) return void t.push(e);
          let r;
          this.active = !0;
          do {
            if (r = e.execute(e.state, e.delay)) break
          } while (e = t.shift());
          if (this.active = !1, r) {
            for (; e = t.shift();) e.unsubscribe();
            throw r
          }
        }
      }
      const gp = new bn(jc);
      "undefined" != typeof Element && Element;
      const tD = "cdk-high-contrast-black-on-white",
        nD = "cdk-high-contrast-white-on-black",
        yp = "cdk-high-contrast-active";
      let rD = (() => {
        class n {
          constructor(t, r) {
            this._platform = t, this._document = r
          }
          getHighContrastMode() {
            if (!this._platform.isBrowser) return 0;
            const t = this._document.createElement("div");
            t.style.backgroundColor = "rgb(1,2,3)", t.style.position = "absolute", this._document.body.appendChild(t);
            const r = this._document.defaultView || window,
              i = r && r.getComputedStyle ? r.getComputedStyle(t) : null,
              s = (i && i.backgroundColor || "").replace(/ /g, "");
            switch (this._document.body.removeChild(t), s) {
              case "rgb(0,0,0)":
                return 2;
              case "rgb(255,255,255)":
                return 1
            }
            return 0
          }
          _applyBodyHighContrastModeCssClasses() {
            if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
              const t = this._document.body.classList;
              t.remove(yp), t.remove(tD), t.remove(nD), this._hasCheckedHighContrastMode = !0;
              const r = this.getHighContrastMode();
              1 === r ? (t.add(yp), t.add(tD)) : 2 === r && (t.add(yp), t.add(nD))
            }
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(Ae), _(O))
        }, n.\u0275prov = M({
          factory: function () {
            return new n(_(Ae), _(O))
          },
          token: n,
          providedIn: "root"
        }), n
      })();
      const iD = new P("cdk-dir-doc", {
        providedIn: "root",
        factory: function () {
          return fm(O)
        }
      });
      let ma = (() => {
          class n {
            constructor(t) {
              if (this.value = "ltr", this.change = new Ee, t) {
                const i = t.documentElement ? t.documentElement.dir : null,
                  s = (t.body ? t.body.dir : null) || i;
                this.value = "ltr" === s || "rtl" === s ? s : "ltr"
              }
            }
            ngOnDestroy() {
              this.change.complete()
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(iD, 8))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(iD, 8))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        _a = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({}), n
        })();
      const sD = new Kr("12.2.13");
      class oD {}
      const or = "*";

      function lD(n, e = null) {
        return {
          type: 2,
          steps: n,
          options: e
        }
      }

      function ya(n) {
        return {
          type: 6,
          styles: n,
          offset: null
        }
      }

      function dD(n) {
        Promise.resolve(null).then(n)
      }
      class Os {
        constructor(e = 0, t = 0) {
          this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this._started = !1, this._destroyed = !1, this._finished = !1, this._position = 0, this.parentPlayer = null, this.totalTime = e + t
        }
        _onFinish() {
          this._finished || (this._finished = !0, this._onDoneFns.forEach(e => e()), this._onDoneFns = [])
        }
        onStart(e) {
          this._onStartFns.push(e)
        }
        onDone(e) {
          this._onDoneFns.push(e)
        }
        onDestroy(e) {
          this._onDestroyFns.push(e)
        }
        hasStarted() {
          return this._started
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()), this._started = !0
        }
        triggerMicrotask() {
          dD(() => this._onFinish())
        }
        _onStart() {
          this._onStartFns.forEach(e => e()), this._onStartFns = []
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish()
        }
        destroy() {
          this._destroyed || (this._destroyed = !0, this.hasStarted() || this._onStart(), this.finish(), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
        }
        reset() {
          this._started = !1
        }
        setPosition(e) {
          this._position = this.totalTime ? e * this.totalTime : 1
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1
        }
        triggerCallback(e) {
          const t = "start" == e ? this._onStartFns : this._onDoneFns;
          t.forEach(r => r()), t.length = 0
        }
      }
      class hD {
        constructor(e) {
          this._onDoneFns = [], this._onStartFns = [], this._finished = !1, this._started = !1, this._destroyed = !1, this._onDestroyFns = [], this.parentPlayer = null, this.totalTime = 0, this.players = e;
          let t = 0,
            r = 0,
            i = 0;
          const s = this.players.length;
          0 == s ? dD(() => this._onFinish()) : this.players.forEach(o => {
            o.onDone(() => {
              ++t == s && this._onFinish()
            }), o.onDestroy(() => {
              ++r == s && this._onDestroy()
            }), o.onStart(() => {
              ++i == s && this._onStart()
            })
          }), this.totalTime = this.players.reduce((o, a) => Math.max(o, a.totalTime), 0)
        }
        _onFinish() {
          this._finished || (this._finished = !0, this._onDoneFns.forEach(e => e()), this._onDoneFns = [])
        }
        init() {
          this.players.forEach(e => e.init())
        }
        onStart(e) {
          this._onStartFns.push(e)
        }
        _onStart() {
          this.hasStarted() || (this._started = !0, this._onStartFns.forEach(e => e()), this._onStartFns = [])
        }
        onDone(e) {
          this._onDoneFns.push(e)
        }
        onDestroy(e) {
          this._onDestroyFns.push(e)
        }
        hasStarted() {
          return this._started
        }
        play() {
          this.parentPlayer || this.init(), this._onStart(), this.players.forEach(e => e.play())
        }
        pause() {
          this.players.forEach(e => e.pause())
        }
        restart() {
          this.players.forEach(e => e.restart())
        }
        finish() {
          this._onFinish(), this.players.forEach(e => e.finish())
        }
        destroy() {
          this._onDestroy()
        }
        _onDestroy() {
          this._destroyed || (this._destroyed = !0, this._onFinish(), this.players.forEach(e => e.destroy()), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
        }
        reset() {
          this.players.forEach(e => e.reset()), this._destroyed = !1, this._finished = !1, this._started = !1
        }
        setPosition(e) {
          const t = e * this.totalTime;
          this.players.forEach(r => {
            const i = r.totalTime ? Math.min(1, t / r.totalTime) : 1;
            r.setPosition(i)
          })
        }
        getPosition() {
          const e = this.players.reduce((t, r) => null === t || r.totalTime > t.totalTime ? r : t, null);
          return null != e ? e.getPosition() : 0
        }
        beforeDestroy() {
          this.players.forEach(e => {
            e.beforeDestroy && e.beforeDestroy()
          })
        }
        triggerCallback(e) {
          const t = "start" == e ? this._onStartFns : this._onDoneFns;
          t.forEach(r => r()), t.length = 0
        }
      }

      function fD() {
        return "undefined" != typeof window && void 0 !== window.document
      }

      function bp() {
        return "undefined" != typeof process && "[object process]" === {}.toString.call(process)
      }

      function Mr(n) {
        switch (n.length) {
          case 0:
            return new Os;
          case 1:
            return n[0];
          default:
            return new hD(n)
        }
      }

      function pD(n, e, t, r, i = {}, s = {}) {
        const o = [],
          a = [];
        let l = -1,
          c = null;
        if (r.forEach(u => {
            const d = u.offset,
              h = d == l,
              f = h && c || {};
            Object.keys(u).forEach(p => {
              let m = p,
                g = u[p];
              if ("offset" !== p) switch (m = e.normalizePropertyName(m, o), g) {
                case "!":
                  g = i[p];
                  break;
                case or:
                  g = s[p];
                  break;
                default:
                  g = e.normalizeStyleValue(p, m, g, o)
              }
              f[m] = g
            }), h || a.push(f), c = f, l = d
          }), o.length) {
          const u = "\n - ";
          throw new Error(`Unable to animate due to the following errors:${u}${o.join(u)}`)
        }
        return a
      }

      function Cp(n, e, t, r) {
        switch (e) {
          case "start":
            n.onStart(() => r(t && Ep(t, "start", n)));
            break;
          case "done":
            n.onDone(() => r(t && Ep(t, "done", n)));
            break;
          case "destroy":
            n.onDestroy(() => r(t && Ep(t, "destroy", n)))
        }
      }

      function Ep(n, e, t) {
        const r = t.totalTime,
          s = wp(n.element, n.triggerName, n.fromState, n.toState, e || n.phaseName, null == r ? n.totalTime : r, !!t.disabled),
          o = n._data;
        return null != o && (s._data = o), s
      }

      function wp(n, e, t, r, i = "", s = 0, o) {
        return {
          element: n,
          triggerName: e,
          fromState: t,
          toState: r,
          phaseName: i,
          totalTime: s,
          disabled: !!o
        }
      }

      function It(n, e, t) {
        let r;
        return n instanceof Map ? (r = n.get(e), r || n.set(e, r = t)) : (r = n[e], r || (r = n[e] = t)), r
      }

      function gD(n) {
        const e = n.indexOf(":");
        return [n.substring(1, e), n.substr(e + 1)]
      }
      let Dp = (n, e) => !1,
        Sp = (n, e) => !1,
        mD = (n, e, t) => [];
      const _D = bp();
      (_D || "undefined" != typeof Element) && (Dp = fD() ? (n, e) => {
        for (; e && e !== document.documentElement;) {
          if (e === n) return !0;
          e = e.parentNode || e.host
        }
        return !1
      } : (n, e) => n.contains(e), Sp = (() => {
        if (_D || Element.prototype.matches) return (n, e) => n.matches(e); {
          const n = Element.prototype,
            e = n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector;
          return e ? (t, r) => e.apply(t, [r]) : Sp
        }
      })(), mD = (n, e, t) => {
        let r = [];
        if (t) {
          const i = n.querySelectorAll(e);
          for (let s = 0; s < i.length; s++) r.push(i[s])
        } else {
          const i = n.querySelector(e);
          i && r.push(i)
        }
        return r
      });
      let pi = null,
        yD = !1;

      function Tp(n) {
        pi || (pi = ("undefined" != typeof document ? document.body : null) || {}, yD = !!pi.style && "WebkitAppearance" in pi.style);
        let e = !0;
        return pi.style && ! function (n) {
          return "ebkit" == n.substring(1, 6)
        }(n) && (e = n in pi.style, !e && yD && (e = "Webkit" + n.charAt(0).toUpperCase() + n.substr(1) in pi.style)), e
      }
      const Mp = Sp,
        Ap = Dp,
        Ip = mD;

      function vD(n) {
        const e = {};
        return Object.keys(n).forEach(t => {
          const r = t.replace(/([a-z])([A-Z])/g, "$1-$2");
          e[r] = n[t]
        }), e
      }
      let bD = (() => {
          class n {
            validateStyleProperty(t) {
              return Tp(t)
            }
            matchesElement(t, r) {
              return Mp(t, r)
            }
            containsElement(t, r) {
              return Ap(t, r)
            }
            query(t, r, i) {
              return Ip(t, r, i)
            }
            computeStyle(t, r, i) {
              return i || ""
            }
            animate(t, r, i, s, o, a = [], l) {
              return new Os(i, s)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        Rp = (() => {
          class n {}
          return n.NOOP = new bD, n
        })();
      const xp = "ng-enter",
        Uc = "ng-leave",
        $c = "ng-trigger",
        zc = ".ng-trigger",
        ED = "ng-animating",
        Op = ".ng-animating";

      function gi(n) {
        if ("number" == typeof n) return n;
        const e = n.match(/^(-?[\.\d]+)(m?s)/);
        return !e || e.length < 2 ? 0 : kp(parseFloat(e[1]), e[2])
      }

      function kp(n, e) {
        return "s" === e ? 1e3 * n : n
      }

      function Wc(n, e, t) {
        return n.hasOwnProperty("duration") ? n : function (n, e, t) {
          let i, s = 0,
            o = "";
          if ("string" == typeof n) {
            const a = n.match(/^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i);
            if (null === a) return e.push(`The provided timing value "${n}" is invalid.`), {
              duration: 0,
              delay: 0,
              easing: ""
            };
            i = kp(parseFloat(a[1]), a[2]);
            const l = a[3];
            null != l && (s = kp(parseFloat(l), a[4]));
            const c = a[5];
            c && (o = c)
          } else i = n;
          if (!t) {
            let a = !1,
              l = e.length;
            i < 0 && (e.push("Duration values below 0 are not allowed for this animation step."), a = !0), s < 0 && (e.push("Delay values below 0 are not allowed for this animation step."), a = !0), a && e.splice(l, 0, `The provided timing value "${n}" is invalid.`)
          }
          return {
            duration: i,
            delay: s,
            easing: o
          }
        }(n, e, t)
      }

      function ks(n, e = {}) {
        return Object.keys(n).forEach(t => {
          e[t] = n[t]
        }), e
      }

      function Ar(n, e, t = {}) {
        if (e)
          for (let r in n) t[r] = n[r];
        else ks(n, t);
        return t
      }

      function DD(n, e, t) {
        return t ? e + ":" + t + ";" : ""
      }

      function SD(n) {
        let e = "";
        for (let t = 0; t < n.style.length; t++) {
          const r = n.style.item(t);
          e += DD(0, r, n.style.getPropertyValue(r))
        }
        for (const t in n.style) n.style.hasOwnProperty(t) && !t.startsWith("_") && (e += DD(0, Vj(t), n.style[t]));
        n.setAttribute("style", e)
      }

      function Bn(n, e, t) {
        n.style && (Object.keys(e).forEach(r => {
          const i = Np(r);
          t && !t.hasOwnProperty(r) && (t[r] = n.style[i]), n.style[i] = e[r]
        }), bp() && SD(n))
      }

      function mi(n, e) {
        n.style && (Object.keys(e).forEach(t => {
          const r = Np(t);
          n.style[r] = ""
        }), bp() && SD(n))
      }

      function va(n) {
        return Array.isArray(n) ? 1 == n.length ? n[0] : lD(n) : n
      }
      const Pp = new RegExp("{{\\s*(.+?)\\s*}}", "g");

      function TD(n) {
        let e = [];
        if ("string" == typeof n) {
          let t;
          for (; t = Pp.exec(n);) e.push(t[1]);
          Pp.lastIndex = 0
        }
        return e
      }

      function qc(n, e, t) {
        const r = n.toString(),
          i = r.replace(Pp, (s, o) => {
            let a = e[o];
            return e.hasOwnProperty(o) || (t.push(`Please provide a value for the animation param ${o}`), a = ""), a.toString()
          });
        return i == r ? n : i
      }

      function Gc(n) {
        const e = [];
        let t = n.next();
        for (; !t.done;) e.push(t.value), t = n.next();
        return e
      }
      const Lj = /-+([a-z0-9])/g;

      function Np(n) {
        return n.replace(Lj, (...e) => e[1].toUpperCase())
      }

      function Vj(n) {
        return n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      }

      function MD(n, e) {
        return 0 === n || 0 === e
      }

      function AD(n, e, t) {
        const r = Object.keys(t);
        if (r.length && e.length) {
          let s = e[0],
            o = [];
          if (r.forEach(a => {
              s.hasOwnProperty(a) || o.push(a), s[a] = t[a]
            }), o.length)
            for (var i = 1; i < e.length; i++) {
              let a = e[i];
              o.forEach(function (l) {
                a[l] = Fp(n, l)
              })
            }
        }
        return e
      }

      function Rt(n, e, t) {
        switch (e.type) {
          case 7:
            return n.visitTrigger(e, t);
          case 0:
            return n.visitState(e, t);
          case 1:
            return n.visitTransition(e, t);
          case 2:
            return n.visitSequence(e, t);
          case 3:
            return n.visitGroup(e, t);
          case 4:
            return n.visitAnimate(e, t);
          case 5:
            return n.visitKeyframes(e, t);
          case 6:
            return n.visitStyle(e, t);
          case 8:
            return n.visitReference(e, t);
          case 9:
            return n.visitAnimateChild(e, t);
          case 10:
            return n.visitAnimateRef(e, t);
          case 11:
            return n.visitQuery(e, t);
          case 12:
            return n.visitStagger(e, t);
          default:
            throw new Error(`Unable to resolve animation metadata node #${e.type}`)
        }
      }

      function Fp(n, e) {
        return window.getComputedStyle(n)[e]
      }

      function Bj(n, e) {
        const t = [];
        return "string" == typeof n ? n.split(/\s*,\s*/).forEach(r => function (n, e, t) {
          if (":" == n[0]) {
            const l = function (n, e) {
              switch (n) {
                case ":enter":
                  return "void => *";
                case ":leave":
                  return "* => void";
                case ":increment":
                  return (t, r) => parseFloat(r) > parseFloat(t);
                case ":decrement":
                  return (t, r) => parseFloat(r) < parseFloat(t);
                default:
                  return e.push(`The transition alias value "${n}" is not supported`), "* => *"
              }
            }(n, t);
            if ("function" == typeof l) return void e.push(l);
            n = l
          }
          const r = n.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
          if (null == r || r.length < 4) return t.push(`The provided transition expression "${n}" is not supported`), e;
          const i = r[1],
            s = r[2],
            o = r[3];
          e.push(ID(i, o));
          "<" == s[0] && !("*" == i && "*" == o) && e.push(ID(o, i))
        }(r, t, e)) : t.push(n), t
      }
      const Qc = new Set(["true", "1"]),
        Yc = new Set(["false", "0"]);

      function ID(n, e) {
        const t = Qc.has(n) || Yc.has(n),
          r = Qc.has(e) || Yc.has(e);
        return (i, s) => {
          let o = "*" == n || n == i,
            a = "*" == e || e == s;
          return !o && t && "boolean" == typeof i && (o = i ? Qc.has(n) : Yc.has(n)), !a && r && "boolean" == typeof s && (a = s ? Qc.has(e) : Yc.has(e)), o && a
        }
      }
      const Uj = new RegExp("s*:selfs*,?", "g");

      function Lp(n, e, t) {
        return new $j(n).build(e, t)
      }
      class $j {
        constructor(e) {
          this._driver = e
        }
        build(e, t) {
          const r = new qj(t);
          return this._resetContextStyleTimingState(r), Rt(this, va(e), r)
        }
        _resetContextStyleTimingState(e) {
          e.currentQuerySelector = "", e.collectedStyles = {}, e.collectedStyles[""] = {}, e.currentTime = 0
        }
        visitTrigger(e, t) {
          let r = t.queryCount = 0,
            i = t.depCount = 0;
          const s = [],
            o = [];
          return "@" == e.name.charAt(0) && t.errors.push("animation triggers cannot be prefixed with an `@` sign (e.g. trigger('@foo', [...]))"), e.definitions.forEach(a => {
            if (this._resetContextStyleTimingState(t), 0 == a.type) {
              const l = a,
                c = l.name;
              c.toString().split(/\s*,\s*/).forEach(u => {
                l.name = u, s.push(this.visitState(l, t))
              }), l.name = c
            } else if (1 == a.type) {
              const l = this.visitTransition(a, t);
              r += l.queryCount, i += l.depCount, o.push(l)
            } else t.errors.push("only state() and transition() definitions can sit inside of a trigger()")
          }), {
            type: 7,
            name: e.name,
            states: s,
            transitions: o,
            queryCount: r,
            depCount: i,
            options: null
          }
        }
        visitState(e, t) {
          const r = this.visitStyle(e.styles, t),
            i = e.options && e.options.params || null;
          if (r.containsDynamicStyles) {
            const s = new Set,
              o = i || {};
            if (r.styles.forEach(a => {
                if (Zc(a)) {
                  const l = a;
                  Object.keys(l).forEach(c => {
                    TD(l[c]).forEach(u => {
                      o.hasOwnProperty(u) || s.add(u)
                    })
                  })
                }
              }), s.size) {
              const a = Gc(s.values());
              t.errors.push(`state("${e.name}", ...) must define default values for all the following style substitutions: ${a.join(", ")}`)
            }
          }
          return {
            type: 0,
            name: e.name,
            style: r,
            options: i ? {
              params: i
            } : null
          }
        }
        visitTransition(e, t) {
          t.queryCount = 0, t.depCount = 0;
          const r = Rt(this, va(e.animation), t);
          return {
            type: 1,
            matchers: Bj(e.expr, t.errors),
            animation: r,
            queryCount: t.queryCount,
            depCount: t.depCount,
            options: _i(e.options)
          }
        }
        visitSequence(e, t) {
          return {
            type: 2,
            steps: e.steps.map(r => Rt(this, r, t)),
            options: _i(e.options)
          }
        }
        visitGroup(e, t) {
          const r = t.currentTime;
          let i = 0;
          const s = e.steps.map(o => {
            t.currentTime = r;
            const a = Rt(this, o, t);
            return i = Math.max(i, t.currentTime), a
          });
          return t.currentTime = i, {
            type: 3,
            steps: s,
            options: _i(e.options)
          }
        }
        visitAnimate(e, t) {
          const r = function (n, e) {
            let t = null;
            if (n.hasOwnProperty("duration")) t = n;
            else if ("number" == typeof n) return Vp(Wc(n, e).duration, 0, "");
            const r = n;
            if (r.split(/\s+/).some(s => "{" == s.charAt(0) && "{" == s.charAt(1))) {
              const s = Vp(0, 0, "");
              return s.dynamic = !0, s.strValue = r, s
            }
            return t = t || Wc(r, e), Vp(t.duration, t.delay, t.easing)
          }(e.timings, t.errors);
          t.currentAnimateTimings = r;
          let i, s = e.styles ? e.styles : ya({});
          if (5 == s.type) i = this.visitKeyframes(s, t);
          else {
            let o = e.styles,
              a = !1;
            if (!o) {
              a = !0;
              const c = {};
              r.easing && (c.easing = r.easing), o = ya(c)
            }
            t.currentTime += r.duration + r.delay;
            const l = this.visitStyle(o, t);
            l.isEmptyStep = a, i = l
          }
          return t.currentAnimateTimings = null, {
            type: 4,
            timings: r,
            style: i,
            options: null
          }
        }
        visitStyle(e, t) {
          const r = this._makeStyleAst(e, t);
          return this._validateStyleAst(r, t), r
        }
        _makeStyleAst(e, t) {
          const r = [];
          Array.isArray(e.styles) ? e.styles.forEach(o => {
            "string" == typeof o ? o == or ? r.push(o) : t.errors.push(`The provided style string value ${o} is not allowed.`) : r.push(o)
          }) : r.push(e.styles);
          let i = !1,
            s = null;
          return r.forEach(o => {
            if (Zc(o)) {
              const a = o,
                l = a.easing;
              if (l && (s = l, delete a.easing), !i)
                for (let c in a)
                  if (a[c].toString().indexOf("{{") >= 0) {
                    i = !0;
                    break
                  }
            }
          }), {
            type: 6,
            styles: r,
            easing: s,
            offset: e.offset,
            containsDynamicStyles: i,
            options: null
          }
        }
        _validateStyleAst(e, t) {
          const r = t.currentAnimateTimings;
          let i = t.currentTime,
            s = t.currentTime;
          r && s > 0 && (s -= r.duration + r.delay), e.styles.forEach(o => {
            "string" != typeof o && Object.keys(o).forEach(a => {
              if (!this._driver.validateStyleProperty(a)) return void t.errors.push(`The provided animation property "${a}" is not a supported CSS property for animations`);
              const l = t.collectedStyles[t.currentQuerySelector],
                c = l[a];
              let u = !0;
              c && (s != i && s >= c.startTime && i <= c.endTime && (t.errors.push(`The CSS property "${a}" that exists between the times of "${c.startTime}ms" and "${c.endTime}ms" is also being animated in a parallel animation between the times of "${s}ms" and "${i}ms"`), u = !1), s = c.startTime), u && (l[a] = {
                startTime: s,
                endTime: i
              }), t.options && function (n, e, t) {
                const r = e.params || {},
                  i = TD(n);
                i.length && i.forEach(s => {
                  r.hasOwnProperty(s) || t.push(`Unable to resolve the local animation param ${s} in the given list of values`)
                })
              }(o[a], t.options, t.errors)
            })
          })
        }
        visitKeyframes(e, t) {
          const r = {
            type: 5,
            styles: [],
            options: null
          };
          if (!t.currentAnimateTimings) return t.errors.push("keyframes() must be placed inside of a call to animate()"), r;
          let s = 0;
          const o = [];
          let a = !1,
            l = !1,
            c = 0;
          const u = e.steps.map(v => {
            const y = this._makeStyleAst(v, t);
            let E = null != y.offset ? y.offset : function (n) {
                if ("string" == typeof n) return null;
                let e = null;
                if (Array.isArray(n)) n.forEach(t => {
                  if (Zc(t) && t.hasOwnProperty("offset")) {
                    const r = t;
                    e = parseFloat(r.offset), delete r.offset
                  }
                });
                else if (Zc(n) && n.hasOwnProperty("offset")) {
                  const t = n;
                  e = parseFloat(t.offset), delete t.offset
                }
                return e
              }(y.styles),
              w = 0;
            return null != E && (s++, w = y.offset = E), l = l || w < 0 || w > 1, a = a || w < c, c = w, o.push(w), y
          });
          l && t.errors.push("Please ensure that all keyframe offsets are between 0 and 1"), a && t.errors.push("Please ensure that all keyframe offsets are in order");
          const d = e.steps.length;
          let h = 0;
          s > 0 && s < d ? t.errors.push("Not all style() steps within the declared keyframes() contain offsets") : 0 == s && (h = 1 / (d - 1));
          const f = d - 1,
            p = t.currentTime,
            m = t.currentAnimateTimings,
            g = m.duration;
          return u.forEach((v, y) => {
            const E = h > 0 ? y == f ? 1 : h * y : o[y],
              w = E * g;
            t.currentTime = p + m.delay + w, m.duration = w, this._validateStyleAst(v, t), v.offset = E, r.styles.push(v)
          }), r
        }
        visitReference(e, t) {
          return {
            type: 8,
            animation: Rt(this, va(e.animation), t),
            options: _i(e.options)
          }
        }
        visitAnimateChild(e, t) {
          return t.depCount++, {
            type: 9,
            options: _i(e.options)
          }
        }
        visitAnimateRef(e, t) {
          return {
            type: 10,
            animation: this.visitReference(e.animation, t),
            options: _i(e.options)
          }
        }
        visitQuery(e, t) {
          const r = t.currentQuerySelector,
            i = e.options || {};
          t.queryCount++, t.currentQuery = e;
          const [s, o] = function (n) {
            const e = !!n.split(/\s*,\s*/).find(t => ":self" == t);
            return e && (n = n.replace(Uj, "")), n = n.replace(/@\*/g, zc).replace(/@\w+/g, t => zc + "-" + t.substr(1)).replace(/:animating/g, Op), [n, e]
          }(e.selector);
          t.currentQuerySelector = r.length ? r + " " + s : s, It(t.collectedStyles, t.currentQuerySelector, {});
          const a = Rt(this, va(e.animation), t);
          return t.currentQuery = null, t.currentQuerySelector = r, {
            type: 11,
            selector: s,
            limit: i.limit || 0,
            optional: !!i.optional,
            includeSelf: o,
            animation: a,
            originalSelector: e.selector,
            options: _i(e.options)
          }
        }
        visitStagger(e, t) {
          t.currentQuery || t.errors.push("stagger() can only be used inside of query()");
          const r = "full" === e.timings ? {
            duration: 0,
            delay: 0,
            easing: "full"
          } : Wc(e.timings, t.errors, !0);
          return {
            type: 12,
            animation: Rt(this, va(e.animation), t),
            timings: r,
            options: null
          }
        }
      }
      class qj {
        constructor(e) {
          this.errors = e, this.queryCount = 0, this.depCount = 0, this.currentTransition = null, this.currentQuery = null, this.currentQuerySelector = null, this.currentAnimateTimings = null, this.currentTime = 0, this.collectedStyles = {}, this.options = null
        }
      }

      function Zc(n) {
        return !Array.isArray(n) && "object" == typeof n
      }

      function _i(n) {
        return n ? (n = ks(n)).params && (n.params = function (n) {
          return n ? ks(n) : null
        }(n.params)) : n = {}, n
      }

      function Vp(n, e, t) {
        return {
          duration: n,
          delay: e,
          easing: t
        }
      }

      function Bp(n, e, t, r, i, s, o = null, a = !1) {
        return {
          type: 1,
          element: n,
          keyframes: e,
          preStyleProps: t,
          postStyleProps: r,
          duration: i,
          delay: s,
          totalTime: i + s,
          easing: o,
          subTimeline: a
        }
      }
      class Xc {
        constructor() {
          this._map = new Map
        }
        consume(e) {
          let t = this._map.get(e);
          return t ? this._map.delete(e) : t = [], t
        }
        append(e, t) {
          let r = this._map.get(e);
          r || this._map.set(e, r = []), r.push(...t)
        }
        has(e) {
          return this._map.has(e)
        }
        clear() {
          this._map.clear()
        }
      }
      const Zj = new RegExp(":enter", "g"),
        Jj = new RegExp(":leave", "g");

      function jp(n, e, t, r, i, s = {}, o = {}, a, l, c = []) {
        return (new eH).buildKeyframes(n, e, t, r, i, s, o, a, l, c)
      }
      class eH {
        buildKeyframes(e, t, r, i, s, o, a, l, c, u = []) {
          c = c || new Xc;
          const d = new Hp(e, t, c, i, s, u, []);
          d.options = l, d.currentTimeline.setStyles([o], null, d.errors, l), Rt(this, r, d);
          const h = d.timelines.filter(f => f.containsAnimation());
          if (h.length && Object.keys(a).length) {
            const f = h[h.length - 1];
            f.allowOnlyTimelineStyles() || f.setStyles([a], null, d.errors, l)
          }
          return h.length ? h.map(f => f.buildKeyframes()) : [Bp(t, [], [], [], 0, 0, "", !1)]
        }
        visitTrigger(e, t) {}
        visitState(e, t) {}
        visitTransition(e, t) {}
        visitAnimateChild(e, t) {
          const r = t.subInstructions.consume(t.element);
          if (r) {
            const i = t.createSubContext(e.options),
              s = t.currentTimeline.currentTime,
              o = this._visitSubInstructions(r, i, i.options);
            s != o && t.transformIntoNewTimeline(o)
          }
          t.previousNode = e
        }
        visitAnimateRef(e, t) {
          const r = t.createSubContext(e.options);
          r.transformIntoNewTimeline(), this.visitReference(e.animation, r), t.transformIntoNewTimeline(r.currentTimeline.currentTime), t.previousNode = e
        }
        _visitSubInstructions(e, t, r) {
          let s = t.currentTimeline.currentTime;
          const o = null != r.duration ? gi(r.duration) : null,
            a = null != r.delay ? gi(r.delay) : null;
          return 0 !== o && e.forEach(l => {
            const c = t.appendInstructionToTimeline(l, o, a);
            s = Math.max(s, c.duration + c.delay)
          }), s
        }
        visitReference(e, t) {
          t.updateOptions(e.options, !0), Rt(this, e.animation, t), t.previousNode = e
        }
        visitSequence(e, t) {
          const r = t.subContextCount;
          let i = t;
          const s = e.options;
          if (s && (s.params || s.delay) && (i = t.createSubContext(s), i.transformIntoNewTimeline(), null != s.delay)) {
            6 == i.previousNode.type && (i.currentTimeline.snapshotCurrentStyles(), i.previousNode = Jc);
            const o = gi(s.delay);
            i.delayNextStep(o)
          }
          e.steps.length && (e.steps.forEach(o => Rt(this, o, i)), i.currentTimeline.applyStylesToKeyframe(), i.subContextCount > r && i.transformIntoNewTimeline()), t.previousNode = e
        }
        visitGroup(e, t) {
          const r = [];
          let i = t.currentTimeline.currentTime;
          const s = e.options && e.options.delay ? gi(e.options.delay) : 0;
          e.steps.forEach(o => {
            const a = t.createSubContext(e.options);
            s && a.delayNextStep(s), Rt(this, o, a), i = Math.max(i, a.currentTimeline.currentTime), r.push(a.currentTimeline)
          }), r.forEach(o => t.currentTimeline.mergeTimelineCollectedStyles(o)), t.transformIntoNewTimeline(i), t.previousNode = e
        }
        _visitTiming(e, t) {
          if (e.dynamic) {
            const r = e.strValue;
            return Wc(t.params ? qc(r, t.params, t.errors) : r, t.errors)
          }
          return {
            duration: e.duration,
            delay: e.delay,
            easing: e.easing
          }
        }
        visitAnimate(e, t) {
          const r = t.currentAnimateTimings = this._visitTiming(e.timings, t),
            i = t.currentTimeline;
          r.delay && (t.incrementTime(r.delay), i.snapshotCurrentStyles());
          const s = e.style;
          5 == s.type ? this.visitKeyframes(s, t) : (t.incrementTime(r.duration), this.visitStyle(s, t), i.applyStylesToKeyframe()), t.currentAnimateTimings = null, t.previousNode = e
        }
        visitStyle(e, t) {
          const r = t.currentTimeline,
            i = t.currentAnimateTimings;
          !i && r.getCurrentStyleProperties().length && r.forwardFrame();
          const s = i && i.easing || e.easing;
          e.isEmptyStep ? r.applyEmptyStep(s) : r.setStyles(e.styles, s, t.errors, t.options), t.previousNode = e
        }
        visitKeyframes(e, t) {
          const r = t.currentAnimateTimings,
            i = t.currentTimeline.duration,
            s = r.duration,
            a = t.createSubContext().currentTimeline;
          a.easing = r.easing, e.styles.forEach(l => {
            a.forwardTime((l.offset || 0) * s), a.setStyles(l.styles, l.easing, t.errors, t.options), a.applyStylesToKeyframe()
          }), t.currentTimeline.mergeTimelineCollectedStyles(a), t.transformIntoNewTimeline(i + s), t.previousNode = e
        }
        visitQuery(e, t) {
          const r = t.currentTimeline.currentTime,
            i = e.options || {},
            s = i.delay ? gi(i.delay) : 0;
          s && (6 === t.previousNode.type || 0 == r && t.currentTimeline.getCurrentStyleProperties().length) && (t.currentTimeline.snapshotCurrentStyles(), t.previousNode = Jc);
          let o = r;
          const a = t.invokeQuery(e.selector, e.originalSelector, e.limit, e.includeSelf, !!i.optional, t.errors);
          t.currentQueryTotal = a.length;
          let l = null;
          a.forEach((c, u) => {
            t.currentQueryIndex = u;
            const d = t.createSubContext(e.options, c);
            s && d.delayNextStep(s), c === t.element && (l = d.currentTimeline), Rt(this, e.animation, d), d.currentTimeline.applyStylesToKeyframe(), o = Math.max(o, d.currentTimeline.currentTime)
          }), t.currentQueryIndex = 0, t.currentQueryTotal = 0, t.transformIntoNewTimeline(o), l && (t.currentTimeline.mergeTimelineCollectedStyles(l), t.currentTimeline.snapshotCurrentStyles()), t.previousNode = e
        }
        visitStagger(e, t) {
          const r = t.parentContext,
            i = t.currentTimeline,
            s = e.timings,
            o = Math.abs(s.duration),
            a = o * (t.currentQueryTotal - 1);
          let l = o * t.currentQueryIndex;
          switch (s.duration < 0 ? "reverse" : s.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime
          }
          const u = t.currentTimeline;
          l && u.delayNextStep(l);
          const d = u.currentTime;
          Rt(this, e.animation, t), t.previousNode = e, r.currentStaggerTime = i.currentTime - d + (i.startTime - r.currentTimeline.startTime)
        }
      }
      const Jc = {};
      class Hp {
        constructor(e, t, r, i, s, o, a, l) {
          this._driver = e, this.element = t, this.subInstructions = r, this._enterClassName = i, this._leaveClassName = s, this.errors = o, this.timelines = a, this.parentContext = null, this.currentAnimateTimings = null, this.previousNode = Jc, this.subContextCount = 0, this.options = {}, this.currentQueryIndex = 0, this.currentQueryTotal = 0, this.currentStaggerTime = 0, this.currentTimeline = l || new eu(this._driver, t, 0), a.push(this.currentTimeline)
        }
        get params() {
          return this.options.params
        }
        updateOptions(e, t) {
          if (!e) return;
          const r = e;
          let i = this.options;
          null != r.duration && (i.duration = gi(r.duration)), null != r.delay && (i.delay = gi(r.delay));
          const s = r.params;
          if (s) {
            let o = i.params;
            o || (o = this.options.params = {}), Object.keys(s).forEach(a => {
              (!t || !o.hasOwnProperty(a)) && (o[a] = qc(s[a], o, this.errors))
            })
          }
        }
        _copyOptions() {
          const e = {};
          if (this.options) {
            const t = this.options.params;
            if (t) {
              const r = e.params = {};
              Object.keys(t).forEach(i => {
                r[i] = t[i]
              })
            }
          }
          return e
        }
        createSubContext(e = null, t, r) {
          const i = t || this.element,
            s = new Hp(this._driver, i, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(i, r || 0));
          return s.previousNode = this.previousNode, s.currentAnimateTimings = this.currentAnimateTimings, s.options = this._copyOptions(), s.updateOptions(e), s.currentQueryIndex = this.currentQueryIndex, s.currentQueryTotal = this.currentQueryTotal, s.parentContext = this, this.subContextCount++, s
        }
        transformIntoNewTimeline(e) {
          return this.previousNode = Jc, this.currentTimeline = this.currentTimeline.fork(this.element, e), this.timelines.push(this.currentTimeline), this.currentTimeline
        }
        appendInstructionToTimeline(e, t, r) {
          const i = {
              duration: null != t ? t : e.duration,
              delay: this.currentTimeline.currentTime + (null != r ? r : 0) + e.delay,
              easing: ""
            },
            s = new tH(this._driver, e.element, e.keyframes, e.preStyleProps, e.postStyleProps, i, e.stretchStartingKeyframe);
          return this.timelines.push(s), i
        }
        incrementTime(e) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + e)
        }
        delayNextStep(e) {
          e > 0 && this.currentTimeline.delayNextStep(e)
        }
        invokeQuery(e, t, r, i, s, o) {
          let a = [];
          if (i && a.push(this.element), e.length > 0) {
            e = (e = e.replace(Zj, "." + this._enterClassName)).replace(Jj, "." + this._leaveClassName);
            let c = this._driver.query(this.element, e, 1 != r);
            0 !== r && (c = r < 0 ? c.slice(c.length + r, c.length) : c.slice(0, r)), a.push(...c)
          }
          return !s && 0 == a.length && o.push(`\`query("${t}")\` returned zero elements. (Use \`query("${t}", { optional: true })\` if you wish to allow this.)`), a
        }
      }
      class eu {
        constructor(e, t, r, i) {
          this._driver = e, this.element = t, this.startTime = r, this._elementTimelineStylesLookup = i, this.duration = 0, this._previousKeyframe = {}, this._currentKeyframe = {}, this._keyframes = new Map, this._styleSummary = {}, this._pendingStyles = {}, this._backFill = {}, this._currentEmptyStepKeyframe = null, this._elementTimelineStylesLookup || (this._elementTimelineStylesLookup = new Map), this._localTimelineStyles = Object.create(this._backFill, {}), this._globalTimelineStyles = this._elementTimelineStylesLookup.get(t), this._globalTimelineStyles || (this._globalTimelineStyles = this._localTimelineStyles, this._elementTimelineStylesLookup.set(t, this._localTimelineStyles)), this._loadKeyframe()
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.getCurrentStyleProperties().length > 0;
            default:
              return !0
          }
        }
        getCurrentStyleProperties() {
          return Object.keys(this._currentKeyframe)
        }
        get currentTime() {
          return this.startTime + this.duration
        }
        delayNextStep(e) {
          const t = 1 == this._keyframes.size && Object.keys(this._pendingStyles).length;
          this.duration || t ? (this.forwardTime(this.currentTime + e), t && this.snapshotCurrentStyles()) : this.startTime += e
        }
        fork(e, t) {
          return this.applyStylesToKeyframe(), new eu(this._driver, e, t || this.currentTime, this._elementTimelineStylesLookup)
        }
        _loadKeyframe() {
          this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe), this._currentKeyframe = this._keyframes.get(this.duration), this._currentKeyframe || (this._currentKeyframe = Object.create(this._backFill, {}), this._keyframes.set(this.duration, this._currentKeyframe))
        }
        forwardFrame() {
          this.duration += 1, this._loadKeyframe()
        }
        forwardTime(e) {
          this.applyStylesToKeyframe(), this.duration = e, this._loadKeyframe()
        }
        _updateStyle(e, t) {
          this._localTimelineStyles[e] = t, this._globalTimelineStyles[e] = t, this._styleSummary[e] = {
            time: this.currentTime,
            value: t
          }
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe
        }
        applyEmptyStep(e) {
          e && (this._previousKeyframe.easing = e), Object.keys(this._globalTimelineStyles).forEach(t => {
            this._backFill[t] = this._globalTimelineStyles[t] || or, this._currentKeyframe[t] = or
          }), this._currentEmptyStepKeyframe = this._currentKeyframe
        }
        setStyles(e, t, r, i) {
          t && (this._previousKeyframe.easing = t);
          const s = i && i.params || {},
            o = function (n, e) {
              const t = {};
              let r;
              return n.forEach(i => {
                "*" === i ? (r = r || Object.keys(e), r.forEach(s => {
                  t[s] = or
                })) : Ar(i, !1, t)
              }), t
            }(e, this._globalTimelineStyles);
          Object.keys(o).forEach(a => {
            const l = qc(o[a], s, r);
            this._pendingStyles[a] = l, this._localTimelineStyles.hasOwnProperty(a) || (this._backFill[a] = this._globalTimelineStyles.hasOwnProperty(a) ? this._globalTimelineStyles[a] : or), this._updateStyle(a, l)
          })
        }
        applyStylesToKeyframe() {
          const e = this._pendingStyles,
            t = Object.keys(e);
          0 != t.length && (this._pendingStyles = {}, t.forEach(r => {
            this._currentKeyframe[r] = e[r]
          }), Object.keys(this._localTimelineStyles).forEach(r => {
            this._currentKeyframe.hasOwnProperty(r) || (this._currentKeyframe[r] = this._localTimelineStyles[r])
          }))
        }
        snapshotCurrentStyles() {
          Object.keys(this._localTimelineStyles).forEach(e => {
            const t = this._localTimelineStyles[e];
            this._pendingStyles[e] = t, this._updateStyle(e, t)
          })
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration)
        }
        get properties() {
          const e = [];
          for (let t in this._currentKeyframe) e.push(t);
          return e
        }
        mergeTimelineCollectedStyles(e) {
          Object.keys(e._styleSummary).forEach(t => {
            const r = this._styleSummary[t],
              i = e._styleSummary[t];
            (!r || i.time > r.time) && this._updateStyle(t, i.value)
          })
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const e = new Set,
            t = new Set,
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const c = Ar(a, !0);
            Object.keys(c).forEach(u => {
              const d = c[u];
              "!" == d ? e.add(u) : d == or && t.add(u)
            }), r || (c.offset = l / this.duration), i.push(c)
          });
          const s = e.size ? Gc(e.values()) : [],
            o = t.size ? Gc(t.values()) : [];
          if (r) {
            const a = i[0],
              l = ks(a);
            a.offset = 0, l.offset = 1, i = [a, l]
          }
          return Bp(this.element, i, s, o, this.duration, this.startTime, this.easing, !1)
        }
      }
      class tH extends eu {
        constructor(e, t, r, i, s, o, a = !1) {
          super(e, t, o.delay), this.keyframes = r, this.preStyleProps = i, this.postStyleProps = s, this._stretchStartingKeyframe = a, this.timings = {
            duration: o.duration,
            delay: o.delay,
            easing: o.easing
          }
        }
        containsAnimation() {
          return this.keyframes.length > 1
        }
        buildKeyframes() {
          let e = this.keyframes,
            {
              delay: t,
              duration: r,
              easing: i
            } = this.timings;
          if (this._stretchStartingKeyframe && t) {
            const s = [],
              o = r + t,
              a = t / o,
              l = Ar(e[0], !1);
            l.offset = 0, s.push(l);
            const c = Ar(e[0], !1);
            c.offset = OD(a), s.push(c);
            const u = e.length - 1;
            for (let d = 1; d <= u; d++) {
              let h = Ar(e[d], !1);
              h.offset = OD((t + h.offset * r) / o), s.push(h)
            }
            r = o, t = 0, i = "", e = s
          }
          return Bp(this.element, e, this.preStyleProps, this.postStyleProps, r, t, i, !0)
        }
      }

      function OD(n, e = 3) {
        const t = Math.pow(10, e - 1);
        return Math.round(n * t) / t
      }
      class Up {}
      class rH extends Up {
        normalizePropertyName(e, t) {
          return Np(e)
        }
        normalizeStyleValue(e, t, r, i) {
          let s = "";
          const o = r.toString().trim();
          if (iH[t] && 0 !== r && "0" !== r)
            if ("number" == typeof r) s = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a && 0 == a[1].length && i.push(`Please provide a CSS unit value for ${e}:${r}`)
            } return o + s
        }
      }
      const iH = (() => function (n) {
        const e = {};
        return n.forEach(t => e[t] = !0), e
      }("width,height,minWidth,minHeight,maxWidth,maxHeight,left,top,bottom,right,fontSize,outlineWidth,outlineOffset,paddingTop,paddingLeft,paddingBottom,paddingRight,marginTop,marginLeft,marginBottom,marginRight,borderRadius,borderWidth,borderTopWidth,borderLeftWidth,borderRightWidth,borderBottomWidth,textIndent,perspective".split(",")))();

      function kD(n, e, t, r, i, s, o, a, l, c, u, d, h) {
        return {
          type: 0,
          element: n,
          triggerName: e,
          isRemovalTransition: i,
          fromState: t,
          fromStyles: s,
          toState: r,
          toStyles: o,
          timelines: a,
          queriedElements: l,
          preStyleProps: c,
          postStyleProps: u,
          totalTime: d,
          errors: h
        }
      }
      const $p = {};
      class PD {
        constructor(e, t, r) {
          this._triggerName = e, this.ast = t, this._stateStyles = r
        }
        match(e, t, r, i) {
          return function (n, e, t, r, i) {
            return n.some(s => s(e, t, r, i))
          }(this.ast.matchers, e, t, r, i)
        }
        buildStyles(e, t, r) {
          const i = this._stateStyles["*"],
            s = this._stateStyles[e],
            o = i ? i.buildStyles(t, r) : {};
          return s ? s.buildStyles(t, r) : o
        }
        build(e, t, r, i, s, o, a, l, c, u) {
          const d = [],
            h = this.ast.options && this.ast.options.params || $p,
            p = this.buildStyles(r, a && a.params || $p, d),
            m = l && l.params || $p,
            g = this.buildStyles(i, m, d),
            v = new Set,
            y = new Map,
            E = new Map,
            w = "void" === i,
            L = {
              params: Object.assign(Object.assign({}, h), m)
            },
            ce = u ? [] : jp(e, t, this.ast.animation, s, o, p, g, L, c, d);
          let pe = 0;
          if (ce.forEach(tt => {
              pe = Math.max(tt.duration + tt.delay, pe)
            }), d.length) return kD(t, this._triggerName, r, i, w, p, g, [], [], y, E, pe, d);
          ce.forEach(tt => {
            const nt = tt.element,
              ar = It(y, nt, {});
            tt.preStyleProps.forEach(Cn => ar[Cn] = !0);
            const lr = It(E, nt, {});
            tt.postStyleProps.forEach(Cn => lr[Cn] = !0), nt !== t && v.add(nt)
          });
          const ft = Gc(v.values());
          return kD(t, this._triggerName, r, i, w, p, g, ce, ft, y, E, pe)
        }
      }
      class aH {
        constructor(e, t, r) {
          this.styles = e, this.defaultParams = t, this.normalizer = r
        }
        buildStyles(e, t) {
          const r = {},
            i = ks(this.defaultParams);
          return Object.keys(e).forEach(s => {
            const o = e[s];
            null != o && (i[s] = o)
          }), this.styles.styles.forEach(s => {
            if ("string" != typeof s) {
              const o = s;
              Object.keys(o).forEach(a => {
                let l = o[a];
                l.length > 1 && (l = qc(l, i, t));
                const c = this.normalizer.normalizePropertyName(a, t);
                l = this.normalizer.normalizeStyleValue(a, c, l, t), r[c] = l
              })
            }
          }), r
        }
      }
      class cH {
        constructor(e, t, r) {
          this.name = e, this.ast = t, this._normalizer = r, this.transitionFactories = [], this.states = {}, t.states.forEach(i => {
            this.states[i.name] = new aH(i.style, i.options && i.options.params || {}, r)
          }), ND(this.states, "true", "1"), ND(this.states, "false", "0"), t.transitions.forEach(i => {
            this.transitionFactories.push(new PD(e, i, this.states))
          }), this.fallbackTransition = function (n, e, t) {
            return new PD(n, {
              type: 1,
              animation: {
                type: 2,
                steps: [],
                options: null
              },
              matchers: [(o, a) => !0],
              options: null,
              queryCount: 0,
              depCount: 0
            }, e)
          }(e, this.states)
        }
        get containsQueries() {
          return this.ast.queryCount > 0
        }
        matchTransition(e, t, r, i) {
          return this.transitionFactories.find(o => o.match(e, t, r, i)) || null
        }
        matchStyles(e, t, r) {
          return this.fallbackTransition.buildStyles(e, t, r)
        }
      }

      function ND(n, e, t) {
        n.hasOwnProperty(e) ? n.hasOwnProperty(t) || (n[t] = n[e]) : n.hasOwnProperty(t) && (n[e] = n[t])
      }
      const dH = new Xc;
      class hH {
        constructor(e, t, r) {
          this.bodyNode = e, this._driver = t, this._normalizer = r, this._animations = {}, this._playersById = {}, this.players = []
        }
        register(e, t) {
          const r = [],
            i = Lp(this._driver, t, r);
          if (r.length) throw new Error(`Unable to build the animation due to the following errors: ${r.join("\n")}`);
          this._animations[e] = i
        }
        _buildPlayer(e, t, r) {
          const i = e.element,
            s = pD(0, this._normalizer, 0, e.keyframes, t, r);
          return this._driver.animate(i, s, e.duration, e.delay, e.easing, [], !0)
        }
        create(e, t, r = {}) {
          const i = [],
            s = this._animations[e];
          let o;
          const a = new Map;
          if (s ? (o = jp(this._driver, t, s, xp, Uc, {}, {}, r, dH, i), o.forEach(u => {
              const d = It(a, u.element, {});
              u.postStyleProps.forEach(h => d[h] = null)
            })) : (i.push("The requested animation doesn't exist or has already been destroyed"), o = []), i.length) throw new Error(`Unable to create the animation due to the following errors: ${i.join("\n")}`);
          a.forEach((u, d) => {
            Object.keys(u).forEach(h => {
              u[h] = this._driver.computeStyle(d, h, or)
            })
          });
          const c = Mr(o.map(u => {
            const d = a.get(u.element);
            return this._buildPlayer(u, {}, d)
          }));
          return this._playersById[e] = c, c.onDestroy(() => this.destroy(e)), this.players.push(c), c
        }
        destroy(e) {
          const t = this._getPlayer(e);
          t.destroy(), delete this._playersById[e];
          const r = this.players.indexOf(t);
          r >= 0 && this.players.splice(r, 1)
        }
        _getPlayer(e) {
          const t = this._playersById[e];
          if (!t) throw new Error(`Unable to find the timeline player referenced by ${e}`);
          return t
        }
        listen(e, t, r, i) {
          const s = wp(t, "", "", "");
          return Cp(this._getPlayer(e), r, s, i), () => {}
        }
        command(e, t, r, i) {
          if ("register" == r) return void this.register(e, i[0]);
          if ("create" == r) return void this.create(e, t, i[0] || {});
          const s = this._getPlayer(e);
          switch (r) {
            case "play":
              s.play();
              break;
            case "pause":
              s.pause();
              break;
            case "reset":
              s.reset();
              break;
            case "restart":
              s.restart();
              break;
            case "finish":
              s.finish();
              break;
            case "init":
              s.init();
              break;
            case "setPosition":
              s.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(e)
          }
        }
      }
      const FD = "ng-animate-queued",
        LD = "ng-animate-disabled",
        VD = ".ng-animate-disabled",
        mH = [],
        BD = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1
        },
        _H = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0
        },
        Xt = "__ng_removed";
      class zp {
        constructor(e, t = "") {
          this.namespaceId = t;
          const r = e && e.hasOwnProperty("value");
          if (this.value = function (n) {
              return null != n ? n : null
            }(r ? e.value : e), r) {
            const s = ks(e);
            delete s.value, this.options = s
          } else this.options = {};
          this.options.params || (this.options.params = {})
        }
        get params() {
          return this.options.params
        }
        absorbOptions(e) {
          const t = e.params;
          if (t) {
            const r = this.options.params;
            Object.keys(t).forEach(i => {
              null == r[i] && (r[i] = t[i])
            })
          }
        }
      }
      const ba = "void",
        Wp = new zp(ba);
      class yH {
        constructor(e, t, r) {
          this.id = e, this.hostElement = t, this._engine = r, this.players = [], this._triggers = {}, this._queue = [], this._elementListeners = new Map, this._hostClassName = "ng-tns-" + e, Jt(t, this._hostClassName)
        }
        listen(e, t, r, i) {
          if (!this._triggers.hasOwnProperty(t)) throw new Error(`Unable to listen on the animation trigger event "${r}" because the animation trigger "${t}" doesn't exist!`);
          if (null == r || 0 == r.length) throw new Error(`Unable to listen on the animation trigger "${t}" because the provided event is undefined!`);
          if (! function (n) {
              return "start" == n || "done" == n
            }(r)) throw new Error(`The provided animation trigger event "${r}" for the animation trigger "${t}" is not supported!`);
          const s = It(this._elementListeners, e, []),
            o = {
              name: t,
              phase: r,
              callback: i
            };
          s.push(o);
          const a = It(this._engine.statesByElement, e, {});
          return a.hasOwnProperty(t) || (Jt(e, $c), Jt(e, $c + "-" + t), a[t] = Wp), () => {
            this._engine.afterFlush(() => {
              const l = s.indexOf(o);
              l >= 0 && s.splice(l, 1), this._triggers[t] || delete a[t]
            })
          }
        }
        register(e, t) {
          return !this._triggers[e] && (this._triggers[e] = t, !0)
        }
        _getTrigger(e) {
          const t = this._triggers[e];
          if (!t) throw new Error(`The provided animation trigger "${e}" has not been registered!`);
          return t
        }
        trigger(e, t, r, i = !0) {
          const s = this._getTrigger(t),
            o = new qp(this.id, t, e);
          let a = this._engine.statesByElement.get(e);
          a || (Jt(e, $c), Jt(e, $c + "-" + t), this._engine.statesByElement.set(e, a = {}));
          let l = a[t];
          const c = new zp(r, this.id);
          if (!(r && r.hasOwnProperty("value")) && l && c.absorbOptions(l.options), a[t] = c, l || (l = Wp), c.value !== ba && l.value === c.value) {
            if (! function (n, e) {
                const t = Object.keys(n),
                  r = Object.keys(e);
                if (t.length != r.length) return !1;
                for (let i = 0; i < t.length; i++) {
                  const s = t[i];
                  if (!e.hasOwnProperty(s) || n[s] !== e[s]) return !1
                }
                return !0
              }(l.params, c.params)) {
              const m = [],
                g = s.matchStyles(l.value, l.params, m),
                v = s.matchStyles(c.value, c.params, m);
              m.length ? this._engine.reportError(m) : this._engine.afterFlush(() => {
                mi(e, g), Bn(e, v)
              })
            }
            return
          }
          const h = It(this._engine.playersByElement, e, []);
          h.forEach(m => {
            m.namespaceId == this.id && m.triggerName == t && m.queued && m.destroy()
          });
          let f = s.matchTransition(l.value, c.value, e, c.params),
            p = !1;
          if (!f) {
            if (!i) return;
            f = s.fallbackTransition, p = !0
          }
          return this._engine.totalQueuedPlayers++, this._queue.push({
            element: e,
            triggerName: t,
            transition: f,
            fromState: l,
            toState: c,
            player: o,
            isFallbackTransition: p
          }), p || (Jt(e, FD), o.onStart(() => {
            Ps(e, FD)
          })), o.onDone(() => {
            let m = this.players.indexOf(o);
            m >= 0 && this.players.splice(m, 1);
            const g = this._engine.playersByElement.get(e);
            if (g) {
              let v = g.indexOf(o);
              v >= 0 && g.splice(v, 1)
            }
          }), this.players.push(o), h.push(o), o
        }
        deregister(e) {
          delete this._triggers[e], this._engine.statesByElement.forEach((t, r) => {
            delete t[e]
          }), this._elementListeners.forEach((t, r) => {
            this._elementListeners.set(r, t.filter(i => i.name != e))
          })
        }
        clearElementCache(e) {
          this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
          const t = this._engine.playersByElement.get(e);
          t && (t.forEach(r => r.destroy()), this._engine.playersByElement.delete(e))
        }
        _signalRemovalForInnerTriggers(e, t) {
          const r = this._engine.driver.query(e, zc, !0);
          r.forEach(i => {
            if (i[Xt]) return;
            const s = this._engine.fetchNamespacesByElement(i);
            s.size ? s.forEach(o => o.triggerLeaveAnimation(i, t, !1, !0)) : this.clearElementCache(i)
          }), this._engine.afterFlushAnimationsDone(() => r.forEach(i => this.clearElementCache(i)))
        }
        triggerLeaveAnimation(e, t, r, i) {
          const s = this._engine.statesByElement.get(e);
          if (s) {
            const o = [];
            if (Object.keys(s).forEach(a => {
                if (this._triggers[a]) {
                  const l = this.trigger(e, a, ba, i);
                  l && o.push(l)
                }
              }), o.length) return this._engine.markElementAsRemoved(this.id, e, !0, t), r && Mr(o).onDone(() => this._engine.processLeaveNode(e)), !0
          }
          return !1
        }
        prepareLeaveAnimationListeners(e) {
          const t = this._elementListeners.get(e),
            r = this._engine.statesByElement.get(e);
          if (t && r) {
            const i = new Set;
            t.forEach(s => {
              const o = s.name;
              if (i.has(o)) return;
              i.add(o);
              const l = this._triggers[o].fallbackTransition,
                c = r[o] || Wp,
                u = new zp(ba),
                d = new qp(this.id, o, e);
              this._engine.totalQueuedPlayers++, this._queue.push({
                element: e,
                triggerName: o,
                transition: l,
                fromState: c,
                toState: u,
                player: d,
                isFallbackTransition: !0
              })
            })
          }
        }
        removeNode(e, t) {
          const r = this._engine;
          if (e.childElementCount && this._signalRemovalForInnerTriggers(e, t), this.triggerLeaveAnimation(e, t, !0)) return;
          let i = !1;
          if (r.totalAnimations) {
            const s = r.players.length ? r.playersByQueriedElement.get(e) : [];
            if (s && s.length) i = !0;
            else {
              let o = e;
              for (; o = o.parentNode;)
                if (r.statesByElement.get(o)) {
                  i = !0;
                  break
                }
            }
          }
          if (this.prepareLeaveAnimationListeners(e), i) r.markElementAsRemoved(this.id, e, !1, t);
          else {
            const s = e[Xt];
            (!s || s === BD) && (r.afterFlush(() => this.clearElementCache(e)), r.destroyInnerAnimations(e), r._onRemovalComplete(e, t))
          }
        }
        insertNode(e, t) {
          Jt(e, this._hostClassName)
        }
        drainQueuedTransitions(e) {
          const t = [];
          return this._queue.forEach(r => {
            const i = r.player;
            if (i.destroyed) return;
            const s = r.element,
              o = this._elementListeners.get(s);
            o && o.forEach(a => {
              if (a.name == r.triggerName) {
                const l = wp(s, r.triggerName, r.fromState.value, r.toState.value);
                l._data = e, Cp(r.player, a.phase, l, a.callback)
              }
            }), i.markedForDestroy ? this._engine.afterFlush(() => {
              i.destroy()
            }) : t.push(r)
          }), this._queue = [], t.sort((r, i) => {
            const s = r.transition.ast.depCount,
              o = i.transition.ast.depCount;
            return 0 == s || 0 == o ? s - o : this._engine.driver.containsElement(r.element, i.element) ? 1 : -1
          })
        }
        destroy(e) {
          this.players.forEach(t => t.destroy()), this._signalRemovalForInnerTriggers(this.hostElement, e)
        }
        elementContainsData(e) {
          let t = !1;
          return this._elementListeners.has(e) && (t = !0), t = !!this._queue.find(r => r.element === e) || t, t
        }
      }
      class vH {
        constructor(e, t, r) {
          this.bodyNode = e, this.driver = t, this._normalizer = r, this.players = [], this.newHostElements = new Map, this.playersByElement = new Map, this.playersByQueriedElement = new Map, this.statesByElement = new Map, this.disabledNodes = new Set, this.totalAnimations = 0, this.totalQueuedPlayers = 0, this._namespaceLookup = {}, this._namespaceList = [], this._flushFns = [], this._whenQuietFns = [], this.namespacesByHostElement = new Map, this.collectedEnterElements = [], this.collectedLeaveElements = [], this.onRemovalComplete = (i, s) => {}
        }
        _onRemovalComplete(e, t) {
          this.onRemovalComplete(e, t)
        }
        get queuedPlayers() {
          const e = [];
          return this._namespaceList.forEach(t => {
            t.players.forEach(r => {
              r.queued && e.push(r)
            })
          }), e
        }
        createNamespace(e, t) {
          const r = new yH(e, t, this);
          return this.bodyNode && this.driver.containsElement(this.bodyNode, t) ? this._balanceNamespaceList(r, t) : (this.newHostElements.set(t, r), this.collectEnterElement(t)), this._namespaceLookup[e] = r
        }
        _balanceNamespaceList(e, t) {
          const r = this._namespaceList.length - 1;
          if (r >= 0) {
            let i = !1;
            for (let s = r; s >= 0; s--)
              if (this.driver.containsElement(this._namespaceList[s].hostElement, t)) {
                this._namespaceList.splice(s + 1, 0, e), i = !0;
                break
              } i || this._namespaceList.splice(0, 0, e)
          } else this._namespaceList.push(e);
          return this.namespacesByHostElement.set(t, e), e
        }
        register(e, t) {
          let r = this._namespaceLookup[e];
          return r || (r = this.createNamespace(e, t)), r
        }
        registerTrigger(e, t, r) {
          let i = this._namespaceLookup[e];
          i && i.register(t, r) && this.totalAnimations++
        }
        destroy(e, t) {
          if (!e) return;
          const r = this._fetchNamespace(e);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement), delete this._namespaceLookup[e];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1)
          }), this.afterFlushAnimationsDone(() => r.destroy(t))
        }
        _fetchNamespace(e) {
          return this._namespaceLookup[e]
        }
        fetchNamespacesByElement(e) {
          const t = new Set,
            r = this.statesByElement.get(e);
          if (r) {
            const i = Object.keys(r);
            for (let s = 0; s < i.length; s++) {
              const o = r[i[s]].namespaceId;
              if (o) {
                const a = this._fetchNamespace(o);
                a && t.add(a)
              }
            }
          }
          return t
        }
        trigger(e, t, r, i) {
          if (tu(t)) {
            const s = this._fetchNamespace(e);
            if (s) return s.trigger(t, r, i), !0
          }
          return !1
        }
        insertNode(e, t, r, i) {
          if (!tu(t)) return;
          const s = t[Xt];
          if (s && s.setForRemoval) {
            s.setForRemoval = !1, s.setForMove = !0;
            const o = this.collectedLeaveElements.indexOf(t);
            o >= 0 && this.collectedLeaveElements.splice(o, 1)
          }
          if (e) {
            const o = this._fetchNamespace(e);
            o && o.insertNode(t, r)
          }
          i && this.collectEnterElement(t)
        }
        collectEnterElement(e) {
          this.collectedEnterElements.push(e)
        }
        markElementAsDisabled(e, t) {
          t ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Jt(e, LD)) : this.disabledNodes.has(e) && (this.disabledNodes.delete(e), Ps(e, LD))
        }
        removeNode(e, t, r, i) {
          if (tu(t)) {
            const s = e ? this._fetchNamespace(e) : null;
            if (s ? s.removeNode(t, i) : this.markElementAsRemoved(e, t, !1, i), r) {
              const o = this.namespacesByHostElement.get(t);
              o && o.id !== e && o.removeNode(t, i)
            }
          } else this._onRemovalComplete(t, i)
        }
        markElementAsRemoved(e, t, r, i) {
          this.collectedLeaveElements.push(t), t[Xt] = {
            namespaceId: e,
            setForRemoval: i,
            hasAnimation: r,
            removedBeforeQueried: !1
          }
        }
        listen(e, t, r, i, s) {
          return tu(t) ? this._fetchNamespace(e).listen(t, r, i, s) : () => {}
        }
        _buildInstruction(e, t, r, i, s) {
          return e.transition.build(this.driver, e.element, e.fromState.value, e.toState.value, r, i, e.fromState.options, e.toState.options, t, s)
        }
        destroyInnerAnimations(e) {
          let t = this.driver.query(e, zc, !0);
          t.forEach(r => this.destroyActiveAnimationsForElement(r)), 0 != this.playersByQueriedElement.size && (t = this.driver.query(e, Op, !0), t.forEach(r => this.finishActiveQueriedAnimationOnElement(r)))
        }
        destroyActiveAnimationsForElement(e) {
          const t = this.playersByElement.get(e);
          t && t.forEach(r => {
            r.queued ? r.markedForDestroy = !0 : r.destroy()
          })
        }
        finishActiveQueriedAnimationOnElement(e) {
          const t = this.playersByQueriedElement.get(e);
          t && t.forEach(r => r.finish())
        }
        whenRenderingDone() {
          return new Promise(e => {
            if (this.players.length) return Mr(this.players).onDone(() => e());
            e()
          })
        }
        processLeaveNode(e) {
          const t = e[Xt];
          if (t && t.setForRemoval) {
            if (e[Xt] = BD, t.namespaceId) {
              this.destroyInnerAnimations(e);
              const r = this._fetchNamespace(t.namespaceId);
              r && r.clearElementCache(e)
            }
            this._onRemovalComplete(e, t.setForRemoval)
          }
          this.driver.matchesElement(e, VD) && this.markElementAsDisabled(e, !1), this.driver.query(e, VD, !0).forEach(r => {
            this.markElementAsDisabled(r, !1)
          })
        }
        flush(e = -1) {
          let t = [];
          if (this.newHostElements.size && (this.newHostElements.forEach((r, i) => this._balanceNamespaceList(r, i)), this.newHostElements.clear()), this.totalAnimations && this.collectedEnterElements.length)
            for (let r = 0; r < this.collectedEnterElements.length; r++) Jt(this.collectedEnterElements[r], "ng-star-inserted");
          if (this._namespaceList.length && (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            const r = [];
            try {
              t = this._flushAnimations(r, e)
            } finally {
              for (let i = 0; i < r.length; i++) r[i]()
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++) this.processLeaveNode(this.collectedLeaveElements[r]);
          if (this.totalQueuedPlayers = 0, this.collectedEnterElements.length = 0, this.collectedLeaveElements.length = 0, this._flushFns.forEach(r => r()), this._flushFns = [], this._whenQuietFns.length) {
            const r = this._whenQuietFns;
            this._whenQuietFns = [], t.length ? Mr(t).onDone(() => {
              r.forEach(i => i())
            }) : r.forEach(i => i())
          }
        }
        reportError(e) {
          throw new Error(`Unable to process animations due to the following failed trigger transitions\n ${e.join("\n")}`)
        }
        _flushAnimations(e, t) {
          const r = new Xc,
            i = [],
            s = new Map,
            o = [],
            a = new Map,
            l = new Map,
            c = new Map,
            u = new Set;
          this.disabledNodes.forEach(T => {
            u.add(T);
            const R = this.driver.query(T, ".ng-animate-queued", !0);
            for (let U = 0; U < R.length; U++) u.add(R[U])
          });
          const d = this.bodyNode,
            h = Array.from(this.statesByElement.keys()),
            f = UD(h, this.collectedEnterElements),
            p = new Map;
          let m = 0;
          f.forEach((T, R) => {
            const U = xp + m++;
            p.set(R, U), T.forEach(ne => Jt(ne, U))
          });
          const g = [],
            v = new Set,
            y = new Set;
          for (let T = 0; T < this.collectedLeaveElements.length; T++) {
            const R = this.collectedLeaveElements[T],
              U = R[Xt];
            U && U.setForRemoval && (g.push(R), v.add(R), U.hasAnimation ? this.driver.query(R, ".ng-star-inserted", !0).forEach(ne => v.add(ne)) : y.add(R))
          }
          const E = new Map,
            w = UD(h, Array.from(v));
          w.forEach((T, R) => {
            const U = Uc + m++;
            E.set(R, U), T.forEach(ne => Jt(ne, U))
          }), e.push(() => {
            f.forEach((T, R) => {
              const U = p.get(R);
              T.forEach(ne => Ps(ne, U))
            }), w.forEach((T, R) => {
              const U = E.get(R);
              T.forEach(ne => Ps(ne, U))
            }), g.forEach(T => {
              this.processLeaveNode(T)
            })
          });
          const L = [],
            ce = [];
          for (let T = this._namespaceList.length - 1; T >= 0; T--) this._namespaceList[T].drainQueuedTransitions(t).forEach(U => {
            const ne = U.player,
              Ge = U.element;
            if (L.push(ne), this.collectedEnterElements.length) {
              const Hn = Ge[Xt];
              if (Hn && Hn.setForMove) return void ne.destroy()
            }
            const jn = !d || !this.driver.containsElement(d, Ge),
              xt = E.get(Ge),
              Ir = p.get(Ge),
              Ie = this._buildInstruction(U, r, Ir, xt, jn);
            if (Ie.errors && Ie.errors.length) ce.push(Ie);
            else {
              if (jn) return ne.onStart(() => mi(Ge, Ie.fromStyles)), ne.onDestroy(() => Bn(Ge, Ie.toStyles)), void i.push(ne);
              if (U.isFallbackTransition) return ne.onStart(() => mi(Ge, Ie.fromStyles)), ne.onDestroy(() => Bn(Ge, Ie.toStyles)), void i.push(ne);
              Ie.timelines.forEach(Hn => Hn.stretchStartingKeyframe = !0), r.append(Ge, Ie.timelines), o.push({
                instruction: Ie,
                player: ne,
                element: Ge
              }), Ie.queriedElements.forEach(Hn => It(a, Hn, []).push(ne)), Ie.preStyleProps.forEach((Hn, wa) => {
                const hu = Object.keys(Hn);
                if (hu.length) {
                  let bi = l.get(wa);
                  bi || l.set(wa, bi = new Set), hu.forEach(sg => bi.add(sg))
                }
              }), Ie.postStyleProps.forEach((Hn, wa) => {
                const hu = Object.keys(Hn);
                let bi = c.get(wa);
                bi || c.set(wa, bi = new Set), hu.forEach(sg => bi.add(sg))
              })
            }
          });
          if (ce.length) {
            const T = [];
            ce.forEach(R => {
              T.push(`@${R.triggerName} has failed due to:\n`), R.errors.forEach(U => T.push(`- ${U}\n`))
            }), L.forEach(R => R.destroy()), this.reportError(T)
          }
          const pe = new Map,
            ft = new Map;
          o.forEach(T => {
            const R = T.element;
            r.has(R) && (ft.set(R, R), this._beforeAnimationBuild(T.player.namespaceId, T.instruction, pe))
          }), i.forEach(T => {
            const R = T.element;
            this._getPreviousPlayers(R, !1, T.namespaceId, T.triggerName, null).forEach(ne => {
              It(pe, R, []).push(ne), ne.destroy()
            })
          });
          const tt = g.filter(T => zD(T, l, c)),
            nt = new Map;
          HD(nt, this.driver, y, c, or).forEach(T => {
            zD(T, l, c) && tt.push(T)
          });
          const lr = new Map;
          f.forEach((T, R) => {
            HD(lr, this.driver, new Set(T), l, "!")
          }), tt.forEach(T => {
            const R = nt.get(T),
              U = lr.get(T);
            nt.set(T, Object.assign(Object.assign({}, R), U))
          });
          const Cn = [],
            Fs = [],
            Ls = {};
          o.forEach(T => {
            const {
              element: R,
              player: U,
              instruction: ne
            } = T;
            if (r.has(R)) {
              if (u.has(R)) return U.onDestroy(() => Bn(R, ne.toStyles)), U.disabled = !0, U.overrideTotalTime(ne.totalTime), void i.push(U);
              let Ge = Ls;
              if (ft.size > 1) {
                let xt = R;
                const Ir = [];
                for (; xt = xt.parentNode;) {
                  const Ie = ft.get(xt);
                  if (Ie) {
                    Ge = Ie;
                    break
                  }
                  Ir.push(xt)
                }
                Ir.forEach(Ie => ft.set(Ie, Ge))
              }
              const jn = this._buildAnimation(U.namespaceId, ne, pe, s, lr, nt);
              if (U.setRealPlayer(jn), Ge === Ls) Cn.push(U);
              else {
                const xt = this.playersByElement.get(Ge);
                xt && xt.length && (U.parentPlayer = Mr(xt)), i.push(U)
              }
            } else mi(R, ne.fromStyles), U.onDestroy(() => Bn(R, ne.toStyles)), Fs.push(U), u.has(R) && i.push(U)
          }), Fs.forEach(T => {
            const R = s.get(T.element);
            if (R && R.length) {
              const U = Mr(R);
              T.setRealPlayer(U)
            }
          }), i.forEach(T => {
            T.parentPlayer ? T.syncPlayerEvents(T.parentPlayer) : T.destroy()
          });
          for (let T = 0; T < g.length; T++) {
            const R = g[T],
              U = R[Xt];
            if (Ps(R, Uc), U && U.hasAnimation) continue;
            let ne = [];
            if (a.size) {
              let jn = a.get(R);
              jn && jn.length && ne.push(...jn);
              let xt = this.driver.query(R, Op, !0);
              for (let Ir = 0; Ir < xt.length; Ir++) {
                let Ie = a.get(xt[Ir]);
                Ie && Ie.length && ne.push(...Ie)
              }
            }
            const Ge = ne.filter(jn => !jn.destroyed);
            Ge.length ? wH(this, R, Ge) : this.processLeaveNode(R)
          }
          return g.length = 0, Cn.forEach(T => {
            this.players.push(T), T.onDone(() => {
              T.destroy();
              const R = this.players.indexOf(T);
              this.players.splice(R, 1)
            }), T.play()
          }), Cn
        }
        elementContainsData(e, t) {
          let r = !1;
          const i = t[Xt];
          return i && i.setForRemoval && (r = !0), this.playersByElement.has(t) && (r = !0), this.playersByQueriedElement.has(t) && (r = !0), this.statesByElement.has(t) && (r = !0), this._fetchNamespace(e).elementContainsData(t) || r
        }
        afterFlush(e) {
          this._flushFns.push(e)
        }
        afterFlushAnimationsDone(e) {
          this._whenQuietFns.push(e)
        }
        _getPreviousPlayers(e, t, r, i, s) {
          let o = [];
          if (t) {
            const a = this.playersByQueriedElement.get(e);
            a && (o = a)
          } else {
            const a = this.playersByElement.get(e);
            if (a) {
              const l = !s || s == ba;
              a.forEach(c => {
                c.queued || !l && c.triggerName != i || o.push(c)
              })
            }
          }
          return (r || i) && (o = o.filter(a => !(r && r != a.namespaceId || i && i != a.triggerName))), o
        }
        _beforeAnimationBuild(e, t, r) {
          const s = t.element,
            o = t.isRemovalTransition ? void 0 : e,
            a = t.isRemovalTransition ? void 0 : t.triggerName;
          for (const l of t.timelines) {
            const c = l.element,
              u = c !== s,
              d = It(r, c, []);
            this._getPreviousPlayers(c, u, o, a, t.toState).forEach(f => {
              const p = f.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), f.destroy(), d.push(f)
            })
          }
          mi(s, t.fromStyles)
        }
        _buildAnimation(e, t, r, i, s, o) {
          const a = t.triggerName,
            l = t.element,
            c = [],
            u = new Set,
            d = new Set,
            h = t.timelines.map(p => {
              const m = p.element;
              u.add(m);
              const g = m[Xt];
              if (g && g.removedBeforeQueried) return new Os(p.duration, p.delay);
              const v = m !== l,
                y = function (n) {
                  const e = [];
                  return $D(n, e), e
                }((r.get(m) || mH).map(pe => pe.getRealPlayer())).filter(pe => !!pe.element && pe.element === m),
                E = s.get(m),
                w = o.get(m),
                L = pD(0, this._normalizer, 0, p.keyframes, E, w),
                ce = this._buildPlayer(p, L, y);
              if (p.subTimeline && i && d.add(m), v) {
                const pe = new qp(e, a, m);
                pe.setRealPlayer(ce), c.push(pe)
              }
              return ce
            });
          c.forEach(p => {
            It(this.playersByQueriedElement, p.element, []).push(p), p.onDone(() => function (n, e, t) {
              let r;
              if (n instanceof Map) {
                if (r = n.get(e), r) {
                  if (r.length) {
                    const i = r.indexOf(t);
                    r.splice(i, 1)
                  }
                  0 == r.length && n.delete(e)
                }
              } else if (r = n[e], r) {
                if (r.length) {
                  const i = r.indexOf(t);
                  r.splice(i, 1)
                }
                0 == r.length && delete n[e]
              }
              return r
            }(this.playersByQueriedElement, p.element, p))
          }), u.forEach(p => Jt(p, ED));
          const f = Mr(h);
          return f.onDestroy(() => {
            u.forEach(p => Ps(p, ED)), Bn(l, t.toStyles)
          }), d.forEach(p => {
            It(i, p, []).push(f)
          }), f
        }
        _buildPlayer(e, t, r) {
          return t.length > 0 ? this.driver.animate(e.element, t, e.duration, e.delay, e.easing, r) : new Os(e.duration, e.delay)
        }
      }
      class qp {
        constructor(e, t, r) {
          this.namespaceId = e, this.triggerName = t, this.element = r, this._player = new Os, this._containsRealPlayer = !1, this._queuedCallbacks = {}, this.destroyed = !1, this.markedForDestroy = !1, this.disabled = !1, this.queued = !0, this.totalTime = 0
        }
        setRealPlayer(e) {
          this._containsRealPlayer || (this._player = e, Object.keys(this._queuedCallbacks).forEach(t => {
            this._queuedCallbacks[t].forEach(r => Cp(e, t, void 0, r))
          }), this._queuedCallbacks = {}, this._containsRealPlayer = !0, this.overrideTotalTime(e.totalTime), this.queued = !1)
        }
        getRealPlayer() {
          return this._player
        }
        overrideTotalTime(e) {
          this.totalTime = e
        }
        syncPlayerEvents(e) {
          const t = this._player;
          t.triggerCallback && e.onStart(() => t.triggerCallback("start")), e.onDone(() => this.finish()), e.onDestroy(() => this.destroy())
        }
        _queueEvent(e, t) {
          It(this._queuedCallbacks, e, []).push(t)
        }
        onDone(e) {
          this.queued && this._queueEvent("done", e), this._player.onDone(e)
        }
        onStart(e) {
          this.queued && this._queueEvent("start", e), this._player.onStart(e)
        }
        onDestroy(e) {
          this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e)
        }
        init() {
          this._player.init()
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted()
        }
        play() {
          !this.queued && this._player.play()
        }
        pause() {
          !this.queued && this._player.pause()
        }
        restart() {
          !this.queued && this._player.restart()
        }
        finish() {
          this._player.finish()
        }
        destroy() {
          this.destroyed = !0, this._player.destroy()
        }
        reset() {
          !this.queued && this._player.reset()
        }
        setPosition(e) {
          this.queued || this._player.setPosition(e)
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition()
        }
        triggerCallback(e) {
          const t = this._player;
          t.triggerCallback && t.triggerCallback(e)
        }
      }

      function tu(n) {
        return n && 1 === n.nodeType
      }

      function jD(n, e) {
        const t = n.style.display;
        return n.style.display = null != e ? e : "none", t
      }

      function HD(n, e, t, r, i) {
        const s = [];
        t.forEach(l => s.push(jD(l)));
        const o = [];
        r.forEach((l, c) => {
          const u = {};
          l.forEach(d => {
            const h = u[d] = e.computeStyle(c, d, i);
            (!h || 0 == h.length) && (c[Xt] = _H, o.push(c))
          }), n.set(c, u)
        });
        let a = 0;
        return t.forEach(l => jD(l, s[a++])), o
      }

      function UD(n, e) {
        const t = new Map;
        if (n.forEach(a => t.set(a, [])), 0 == e.length) return t;
        const i = new Set(e),
          s = new Map;

        function o(a) {
          if (!a) return 1;
          let l = s.get(a);
          if (l) return l;
          const c = a.parentNode;
          return l = t.has(c) ? c : i.has(c) ? 1 : o(c), s.set(a, l), l
        }
        return e.forEach(a => {
          const l = o(a);
          1 !== l && t.get(l).push(a)
        }), t
      }
      const nu = "$$classes";

      function Jt(n, e) {
        if (n.classList) n.classList.add(e);
        else {
          let t = n[nu];
          t || (t = n[nu] = {}), t[e] = !0
        }
      }

      function Ps(n, e) {
        if (n.classList) n.classList.remove(e);
        else {
          let t = n[nu];
          t && delete t[e]
        }
      }

      function wH(n, e, t) {
        Mr(t).onDone(() => n.processLeaveNode(e))
      }

      function $D(n, e) {
        for (let t = 0; t < n.length; t++) {
          const r = n[t];
          r instanceof hD ? $D(r.players, e) : e.push(r)
        }
      }

      function zD(n, e, t) {
        const r = t.get(n);
        if (!r) return !1;
        let i = e.get(n);
        return i ? r.forEach(s => i.add(s)) : e.set(n, r), t.delete(n), !0
      }
      class ru {
        constructor(e, t, r) {
          this.bodyNode = e, this._driver = t, this._normalizer = r, this._triggerCache = {}, this.onRemovalComplete = (i, s) => {}, this._transitionEngine = new vH(e, t, r), this._timelineEngine = new hH(e, t, r), this._transitionEngine.onRemovalComplete = (i, s) => this.onRemovalComplete(i, s)
        }
        registerTrigger(e, t, r, i, s) {
          const o = e + "-" + i;
          let a = this._triggerCache[o];
          if (!a) {
            const l = [],
              c = Lp(this._driver, s, l);
            if (l.length) throw new Error(`The animation trigger "${i}" has failed to build due to the following errors:\n - ${l.join("\n - ")}`);
            a = function (n, e, t) {
              return new cH(n, e, t)
            }(i, c, this._normalizer), this._triggerCache[o] = a
          }
          this._transitionEngine.registerTrigger(t, i, a)
        }
        register(e, t) {
          this._transitionEngine.register(e, t)
        }
        destroy(e, t) {
          this._transitionEngine.destroy(e, t)
        }
        onInsert(e, t, r, i) {
          this._transitionEngine.insertNode(e, t, r, i)
        }
        onRemove(e, t, r, i) {
          this._transitionEngine.removeNode(e, t, i || !1, r)
        }
        disableAnimations(e, t) {
          this._transitionEngine.markElementAsDisabled(e, t)
        }
        process(e, t, r, i) {
          if ("@" == r.charAt(0)) {
            const [s, o] = gD(r);
            this._timelineEngine.command(s, t, o, i)
          } else this._transitionEngine.trigger(e, t, r, i)
        }
        listen(e, t, r, i, s) {
          if ("@" == r.charAt(0)) {
            const [o, a] = gD(r);
            return this._timelineEngine.listen(o, t, a, s)
          }
          return this._transitionEngine.listen(e, t, r, i, s)
        }
        flush(e = -1) {
          this._transitionEngine.flush(e)
        }
        get players() {
          return this._transitionEngine.players.concat(this._timelineEngine.players)
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone()
        }
      }

      function WD(n, e) {
        let t = null,
          r = null;
        return Array.isArray(e) && e.length ? (t = Gp(e[0]), e.length > 1 && (r = Gp(e[e.length - 1]))) : e && (t = Gp(e)), t || r ? new TH(n, t, r) : null
      }
      let TH = (() => {
        class n {
          constructor(t, r, i) {
            this._element = t, this._startStyles = r, this._endStyles = i, this._state = 0;
            let s = n.initialStylesByElement.get(t);
            s || n.initialStylesByElement.set(t, s = {}), this._initialStyles = s
          }
          start() {
            this._state < 1 && (this._startStyles && Bn(this._element, this._startStyles, this._initialStyles), this._state = 1)
          }
          finish() {
            this.start(), this._state < 2 && (Bn(this._element, this._initialStyles), this._endStyles && (Bn(this._element, this._endStyles), this._endStyles = null), this._state = 1)
          }
          destroy() {
            this.finish(), this._state < 3 && (n.initialStylesByElement.delete(this._element), this._startStyles && (mi(this._element, this._startStyles), this._endStyles = null), this._endStyles && (mi(this._element, this._endStyles), this._endStyles = null), Bn(this._element, this._initialStyles), this._state = 3)
          }
        }
        return n.initialStylesByElement = new WeakMap, n
      })();

      function Gp(n) {
        let e = null;
        const t = Object.keys(n);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          MH(i) && (e = e || {}, e[i] = n[i])
        }
        return e
      }

      function MH(n) {
        return "display" === n || "position" === n
      }
      const qD = "animation",
        GD = "animationend";
      class RH {
        constructor(e, t, r, i, s, o, a) {
          this._element = e, this._name = t, this._duration = r, this._delay = i, this._easing = s, this._fillMode = o, this._onDoneFn = a, this._finished = !1, this._destroyed = !1, this._startTime = 0, this._position = 0, this._eventFn = l => this._handleCallback(l)
        }
        apply() {
          (function (n, e) {
            const t = Qp(n, "").trim();
            let r = 0;
            t.length && (function (n, e) {
              let t = 0;
              for (let r = 0; r < n.length; r++) "," === n.charAt(r) && t++;
              return t
            }(t) + 1, e = `${t}, ${e}`), iu(n, "", e)
          })(this._element, `${this._duration}ms ${this._easing} ${this._delay}ms 1 normal ${this._fillMode} ${this._name}`), YD(this._element, this._eventFn, !1), this._startTime = Date.now()
        }
        pause() {
          KD(this._element, this._name, "paused")
        }
        resume() {
          KD(this._element, this._name, "running")
        }
        setPosition(e) {
          const t = QD(this._element, this._name);
          this._position = e * this._duration, iu(this._element, "Delay", `-${this._position}ms`, t)
        }
        getPosition() {
          return this._position
        }
        _handleCallback(e) {
          const t = e._ngTestManualTimestamp || Date.now(),
            r = 1e3 * parseFloat(e.elapsedTime.toFixed(3));
          e.animationName == this._name && Math.max(t - this._startTime, 0) >= this._delay && r >= this._duration && this.finish()
        }
        finish() {
          this._finished || (this._finished = !0, this._onDoneFn(), YD(this._element, this._eventFn, !0))
        }
        destroy() {
          this._destroyed || (this._destroyed = !0, this.finish(), function (n, e) {
            const r = Qp(n, "").split(","),
              i = Kp(r, e);
            i >= 0 && (r.splice(i, 1), iu(n, "", r.join(",")))
          }(this._element, this._name))
        }
      }

      function KD(n, e, t) {
        iu(n, "PlayState", t, QD(n, e))
      }

      function QD(n, e) {
        const t = Qp(n, "");
        return t.indexOf(",") > 0 ? Kp(t.split(","), e) : Kp([t], e)
      }

      function Kp(n, e) {
        for (let t = 0; t < n.length; t++)
          if (n[t].indexOf(e) >= 0) return t;
        return -1
      }

      function YD(n, e, t) {
        t ? n.removeEventListener(GD, e) : n.addEventListener(GD, e)
      }

      function iu(n, e, t, r) {
        const i = qD + e;
        if (null != r) {
          const s = n.style[i];
          if (s.length) {
            const o = s.split(",");
            o[r] = t, t = o.join(",")
          }
        }
        n.style[i] = t
      }

      function Qp(n, e) {
        return n.style[qD + e] || ""
      }
      class ZD {
        constructor(e, t, r, i, s, o, a, l) {
          this.element = e, this.keyframes = t, this.animationName = r, this._duration = i, this._delay = s, this._finalStyles = a, this._specialStyles = l, this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this.currentSnapshot = {}, this._state = 0, this.easing = o || "linear", this.totalTime = i + s, this._buildStyler()
        }
        onStart(e) {
          this._onStartFns.push(e)
        }
        onDone(e) {
          this._onDoneFns.push(e)
        }
        onDestroy(e) {
          this._onDestroyFns.push(e)
        }
        destroy() {
          this.init(), !(this._state >= 4) && (this._state = 4, this._styler.destroy(), this._flushStartFns(), this._flushDoneFns(), this._specialStyles && this._specialStyles.destroy(), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
        }
        _flushDoneFns() {
          this._onDoneFns.forEach(e => e()), this._onDoneFns = []
        }
        _flushStartFns() {
          this._onStartFns.forEach(e => e()), this._onStartFns = []
        }
        finish() {
          this.init(), !(this._state >= 3) && (this._state = 3, this._styler.finish(), this._flushStartFns(), this._specialStyles && this._specialStyles.finish(), this._flushDoneFns())
        }
        setPosition(e) {
          this._styler.setPosition(e)
        }
        getPosition() {
          return this._styler.getPosition()
        }
        hasStarted() {
          return this._state >= 2
        }
        init() {
          this._state >= 1 || (this._state = 1, this._styler.apply(), this._delay && this._styler.pause())
        }
        play() {
          this.init(), this.hasStarted() || (this._flushStartFns(), this._state = 2, this._specialStyles && this._specialStyles.start()), this._styler.resume()
        }
        pause() {
          this.init(), this._styler.pause()
        }
        restart() {
          this.reset(), this.play()
        }
        reset() {
          this._state = 0, this._styler.destroy(), this._buildStyler(), this._styler.apply()
        }
        _buildStyler() {
          this._styler = new RH(this.element, this.animationName, this._duration, this._delay, this.easing, "forwards", () => this.finish())
        }
        triggerCallback(e) {
          const t = "start" == e ? this._onStartFns : this._onDoneFns;
          t.forEach(r => r()), t.length = 0
        }
        beforeDestroy() {
          this.init();
          const e = {};
          if (this.hasStarted()) {
            const t = this._state >= 3;
            Object.keys(this._finalStyles).forEach(r => {
              "offset" != r && (e[r] = t ? this._finalStyles[r] : Fp(this.element, r))
            })
          }
          this.currentSnapshot = e
        }
      }
      class FH extends Os {
        constructor(e, t) {
          super(), this.element = e, this._startingStyles = {}, this.__initialized = !1, this._styles = vD(t)
        }
        init() {
          this.__initialized || !this._startingStyles || (this.__initialized = !0, Object.keys(this._styles).forEach(e => {
            this._startingStyles[e] = this.element.style[e]
          }), super.init())
        }
        play() {
          !this._startingStyles || (this.init(), Object.keys(this._styles).forEach(e => this.element.style.setProperty(e, this._styles[e])), super.play())
        }
        destroy() {
          !this._startingStyles || (Object.keys(this._startingStyles).forEach(e => {
            const t = this._startingStyles[e];
            t ? this.element.style.setProperty(e, t) : this.element.style.removeProperty(e)
          }), this._startingStyles = null, super.destroy())
        }
      }
      class JD {
        constructor() {
          this._count = 0
        }
        validateStyleProperty(e) {
          return Tp(e)
        }
        matchesElement(e, t) {
          return Mp(e, t)
        }
        containsElement(e, t) {
          return Ap(e, t)
        }
        query(e, t, r) {
          return Ip(e, t, r)
        }
        computeStyle(e, t, r) {
          return window.getComputedStyle(e)[t]
        }
        buildKeyframeElement(e, t, r) {
          r = r.map(a => vD(a));
          let i = `@keyframes ${t} {\n`,
            s = "";
          r.forEach(a => {
            s = " ";
            const l = parseFloat(a.offset);
            i += `${s}${100*l}% {\n`, s += " ", Object.keys(a).forEach(c => {
              const u = a[c];
              switch (c) {
                case "offset":
                  return;
                case "easing":
                  return void(u && (i += `${s}animation-timing-function: ${u};\n`));
                default:
                  return void(i += `${s}${c}: ${u};\n`)
              }
            }), i += `${s}}\n`
          }), i += "}\n";
          const o = document.createElement("style");
          return o.textContent = i, o
        }
        animate(e, t, r, i, s, o = [], a) {
          const l = o.filter(g => g instanceof ZD),
            c = {};
          MD(r, i) && l.forEach(g => {
            let v = g.currentSnapshot;
            Object.keys(v).forEach(y => c[y] = v[y])
          });
          const u = function (n) {
            let e = {};
            return n && (Array.isArray(n) ? n : [n]).forEach(r => {
              Object.keys(r).forEach(i => {
                "offset" == i || "easing" == i || (e[i] = r[i])
              })
            }), e
          }(t = AD(e, t, c));
          if (0 == r) return new FH(e, u);
          const d = "gen_css_kf_" + this._count++,
            h = this.buildKeyframeElement(e, d, t);
          (function (n) {
            var e;
            const t = null === (e = n.getRootNode) || void 0 === e ? void 0 : e.call(n);
            return "undefined" != typeof ShadowRoot && t instanceof ShadowRoot ? t : document.head
          })(e).appendChild(h);
          const p = WD(e, t),
            m = new ZD(e, t, d, r, i, s, u, p);
          return m.onDestroy(() => function (n) {
            n.parentNode.removeChild(n)
          }(h)), m
        }
      }
      class tS {
        constructor(e, t, r, i) {
          this.element = e, this.keyframes = t, this.options = r, this._specialStyles = i, this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this._initialized = !1, this._finished = !1, this._started = !1, this._destroyed = !1, this.time = 0, this.parentPlayer = null, this.currentSnapshot = {}, this._duration = r.duration, this._delay = r.delay || 0, this.time = this._duration + this._delay
        }
        _onFinish() {
          this._finished || (this._finished = !0, this._onDoneFns.forEach(e => e()), this._onDoneFns = [])
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart()
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const e = this.keyframes;
          this.domPlayer = this._triggerWebAnimation(this.element, e, this.options), this._finalKeyframe = e.length ? e[e.length - 1] : {}, this.domPlayer.addEventListener("finish", () => this._onFinish())
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause()
        }
        _triggerWebAnimation(e, t, r) {
          return e.animate(t, r)
        }
        onStart(e) {
          this._onStartFns.push(e)
        }
        onDone(e) {
          this._onDoneFns.push(e)
        }
        onDestroy(e) {
          this._onDestroyFns.push(e)
        }
        play() {
          this._buildPlayer(), this.hasStarted() || (this._onStartFns.forEach(e => e()), this._onStartFns = [], this._started = !0, this._specialStyles && this._specialStyles.start()), this.domPlayer.play()
        }
        pause() {
          this.init(), this.domPlayer.pause()
        }
        finish() {
          this.init(), this._specialStyles && this._specialStyles.finish(), this._onFinish(), this.domPlayer.finish()
        }
        reset() {
          this._resetDomPlayerState(), this._destroyed = !1, this._finished = !1, this._started = !1
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel()
        }
        restart() {
          this.reset(), this.play()
        }
        hasStarted() {
          return this._started
        }
        destroy() {
          this._destroyed || (this._destroyed = !0, this._resetDomPlayerState(), this._onFinish(), this._specialStyles && this._specialStyles.destroy(), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
        }
        setPosition(e) {
          void 0 === this.domPlayer && this.init(), this.domPlayer.currentTime = e * this.time
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time
        }
        get totalTime() {
          return this._delay + this._duration
        }
        beforeDestroy() {
          const e = {};
          this.hasStarted() && Object.keys(this._finalKeyframe).forEach(t => {
            "offset" != t && (e[t] = this._finished ? this._finalKeyframe[t] : Fp(this.element, t))
          }), this.currentSnapshot = e
        }
        triggerCallback(e) {
          const t = "start" == e ? this._onStartFns : this._onDoneFns;
          t.forEach(r => r()), t.length = 0
        }
      }
      class HH {
        constructor() {
          this._isNativeImpl = /\{\s*\[native\s+code\]\s*\}/.test(nS().toString()), this._cssKeyframesDriver = new JD
        }
        validateStyleProperty(e) {
          return Tp(e)
        }
        matchesElement(e, t) {
          return Mp(e, t)
        }
        containsElement(e, t) {
          return Ap(e, t)
        }
        query(e, t, r) {
          return Ip(e, t, r)
        }
        computeStyle(e, t, r) {
          return window.getComputedStyle(e)[t]
        }
        overrideWebAnimationsSupport(e) {
          this._isNativeImpl = e
        }
        animate(e, t, r, i, s, o = [], a) {
          if (!a && !this._isNativeImpl) return this._cssKeyframesDriver.animate(e, t, r, i, s, o);
          const u = {
            duration: r,
            delay: i,
            fill: 0 == i ? "both" : "forwards"
          };
          s && (u.easing = s);
          const d = {},
            h = o.filter(p => p instanceof tS);
          MD(r, i) && h.forEach(p => {
            let m = p.currentSnapshot;
            Object.keys(m).forEach(g => d[g] = m[g])
          });
          const f = WD(e, t = AD(e, t = t.map(p => Ar(p, !1)), d));
          return new tS(e, t, u, f)
        }
      }

      function nS() {
        return fD() && Element.prototype.animate || {}
      }
      let $H = (() => {
        class n extends oD {
          constructor(t, r) {
            super(), this._nextAnimationId = 0, this._renderer = t.createRenderer(r.body, {
              id: "0",
              encapsulation: Oe.None,
              styles: [],
              data: {
                animation: []
              }
            })
          }
          build(t) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(t) ? lD(t) : t;
            return rS(this._renderer, null, r, "register", [i]), new zH(r, this._renderer)
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(Gr), _(O))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      class zH extends class {} {
        constructor(e, t) {
          super(), this._id = e, this._renderer = t
        }
        create(e, t) {
          return new WH(this._id, e, t || {}, this._renderer)
        }
      }
      class WH {
        constructor(e, t, r, i) {
          this.id = e, this.element = t, this._renderer = i, this.parentPlayer = null, this._started = !1, this.totalTime = 0, this._command("create", r)
        }
        _listen(e, t) {
          return this._renderer.listen(this.element, `@@${this.id}:${e}`, t)
        }
        _command(e, ...t) {
          return rS(this._renderer, this.element, this.id, e, t)
        }
        onDone(e) {
          this._listen("done", e)
        }
        onStart(e) {
          this._listen("start", e)
        }
        onDestroy(e) {
          this._listen("destroy", e)
        }
        init() {
          this._command("init")
        }
        hasStarted() {
          return this._started
        }
        play() {
          this._command("play"), this._started = !0
        }
        pause() {
          this._command("pause")
        }
        restart() {
          this._command("restart")
        }
        finish() {
          this._command("finish")
        }
        destroy() {
          this._command("destroy")
        }
        reset() {
          this._command("reset"), this._started = !1
        }
        setPosition(e) {
          this._command("setPosition", e)
        }
        getPosition() {
          var e, t;
          return null !== (t = null === (e = this._renderer.engine.players[+this.id]) || void 0 === e ? void 0 : e.getPosition()) && void 0 !== t ? t : 0
        }
      }

      function rS(n, e, t, r, i) {
        return n.setProperty(e, `@@${t}:${r}`, i)
      }
      const iS = "@.disabled";
      let qH = (() => {
        class n {
          constructor(t, r, i) {
            this.delegate = t, this.engine = r, this._zone = i, this._currentId = 0, this._microtaskId = 1, this._animationCallbacksBuffer = [], this._rendererCache = new Map, this._cdRecurDepth = 0, this.promise = Promise.resolve(0), r.onRemovalComplete = (s, o) => {
              o && o.parentNode(s) && o.removeChild(s.parentNode, s)
            }
          }
          createRenderer(t, r) {
            const s = this.delegate.createRenderer(t, r);
            if (!(t && r && r.data && r.data.animation)) {
              let u = this._rendererCache.get(s);
              return u || (u = new sS("", s, this.engine), this._rendererCache.set(s, u)), u
            }
            const o = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, t);
            const l = u => {
              Array.isArray(u) ? u.forEach(l) : this.engine.registerTrigger(o, a, t, u.name, u)
            };
            return r.data.animation.forEach(l), new GH(this, a, s, this.engine)
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin()
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++
            })
          }
          scheduleListenerCallback(t, r, i) {
            t >= 0 && t < this._microtaskId ? this._zone.run(() => r(i)) : (0 == this._animationCallbacksBuffer.length && Promise.resolve(null).then(() => {
              this._zone.run(() => {
                this._animationCallbacksBuffer.forEach(s => {
                  const [o, a] = s;
                  o(a)
                }), this._animationCallbacksBuffer = []
              })
            }), this._animationCallbacksBuffer.push([r, i]))
          }
          end() {
            this._cdRecurDepth--, 0 == this._cdRecurDepth && this._zone.runOutsideAngular(() => {
              this._scheduleCountTask(), this.engine.flush(this._microtaskId)
            }), this.delegate.end && this.delegate.end()
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone()
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(Gr), _(ru), _(z))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      class sS {
        constructor(e, t, r) {
          this.namespaceId = e, this.delegate = t, this.engine = r, this.destroyNode = this.delegate.destroyNode ? i => t.destroyNode(i) : null
        }
        get data() {
          return this.delegate.data
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate), this.delegate.destroy()
        }
        createElement(e, t) {
          return this.delegate.createElement(e, t)
        }
        createComment(e) {
          return this.delegate.createComment(e)
        }
        createText(e) {
          return this.delegate.createText(e)
        }
        appendChild(e, t) {
          this.delegate.appendChild(e, t), this.engine.onInsert(this.namespaceId, t, e, !1)
        }
        insertBefore(e, t, r, i = !0) {
          this.delegate.insertBefore(e, t, r), this.engine.onInsert(this.namespaceId, t, e, i)
        }
        removeChild(e, t, r) {
          this.engine.onRemove(this.namespaceId, t, this.delegate, r)
        }
        selectRootElement(e, t) {
          return this.delegate.selectRootElement(e, t)
        }
        parentNode(e) {
          return this.delegate.parentNode(e)
        }
        nextSibling(e) {
          return this.delegate.nextSibling(e)
        }
        setAttribute(e, t, r, i) {
          this.delegate.setAttribute(e, t, r, i)
        }
        removeAttribute(e, t, r) {
          this.delegate.removeAttribute(e, t, r)
        }
        addClass(e, t) {
          this.delegate.addClass(e, t)
        }
        removeClass(e, t) {
          this.delegate.removeClass(e, t)
        }
        setStyle(e, t, r, i) {
          this.delegate.setStyle(e, t, r, i)
        }
        removeStyle(e, t, r) {
          this.delegate.removeStyle(e, t, r)
        }
        setProperty(e, t, r) {
          "@" == t.charAt(0) && t == iS ? this.disableAnimations(e, !!r) : this.delegate.setProperty(e, t, r)
        }
        setValue(e, t) {
          this.delegate.setValue(e, t)
        }
        listen(e, t, r) {
          return this.delegate.listen(e, t, r)
        }
        disableAnimations(e, t) {
          this.engine.disableAnimations(e, t)
        }
      }
      class GH extends sS {
        constructor(e, t, r, i) {
          super(t, r, i), this.factory = e, this.namespaceId = t
        }
        setProperty(e, t, r) {
          "@" == t.charAt(0) ? "." == t.charAt(1) && t == iS ? this.disableAnimations(e, r = void 0 === r || !!r) : this.engine.process(this.namespaceId, e, t.substr(1), r) : this.delegate.setProperty(e, t, r)
        }
        listen(e, t, r) {
          if ("@" == t.charAt(0)) {
            const i = function (n) {
              switch (n) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return n
              }
            }(e);
            let s = t.substr(1),
              o = "";
            return "@" != s.charAt(0) && ([s, o] = function (n) {
              const e = n.indexOf(".");
              return [n.substring(0, e), n.substr(e + 1)]
            }(s)), this.engine.listen(this.namespaceId, i, s, o, a => {
              this.factory.scheduleListenerCallback(a._data || -1, r, a)
            })
          }
          return this.delegate.listen(e, t, r)
        }
      }
      let YH = (() => {
        class n extends ru {
          constructor(t, r, i) {
            super(t.body, r, i)
          }
          ngOnDestroy() {
            this.flush()
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(O), _(Rp), _(Up))
        }, n.\u0275prov = M({
          token: n,
          factory: n.\u0275fac
        }), n
      })();
      const Ns = new P("AnimationModuleType"),
        oS = [{
          provide: oD,
          useClass: $H
        }, {
          provide: Up,
          useFactory: function () {
            return new rH
          }
        }, {
          provide: ru,
          useClass: YH
        }, {
          provide: Gr,
          useFactory: function (n, e, t) {
            return new qH(n, e, t)
          },
          deps: [yc, ru, z]
        }],
        aS = [{
          provide: Rp,
          useFactory: function () {
            return "function" == typeof nS() ? new HH : new JD
          }
        }, {
          provide: Ns,
          useValue: "BrowserAnimations"
        }, ...oS],
        lS = [{
          provide: Rp,
          useClass: bD
        }, {
          provide: Ns,
          useValue: "NoopAnimations"
        }, ...oS];
      let eU = (() => {
        class n {
          static withConfig(t) {
            return {
              ngModule: n,
              providers: t.disableAnimations ? lS : aS
            }
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275mod = ge({
          type: n
        }), n.\u0275inj = de({
          providers: aS,
          imports: [Vf]
        }), n
      })();
      const cS = new Kr("12.2.13"),
        aU = new P("mat-sanity-checks", {
          providedIn: "root",
          factory: function () {
            return !0
          }
        });
      let en = (() => {
        class n {
          constructor(t, r, i) {
            this._hasDoneGlobalChecks = !1, this._document = i, t._applyBodyHighContrastModeCssClasses(), this._sanityChecks = r, this._hasDoneGlobalChecks || (this._checkDoctypeIsDefined(), this._checkThemeIsPresent(), this._checkCdkVersionMatch(), this._hasDoneGlobalChecks = !0)
          }
          _checkIsEnabled(t) {
            return !(!Qh() || pp()) && ("boolean" == typeof this._sanityChecks ? this._sanityChecks : !!this._sanityChecks[t])
          }
          _checkDoctypeIsDefined() {
            this._checkIsEnabled("doctype") && !this._document.doctype && console.warn("Current document does not have a doctype. This may cause some Angular Material components not to behave as expected.")
          }
          _checkThemeIsPresent() {
            if (!this._checkIsEnabled("theme") || !this._document.body || "function" != typeof getComputedStyle) return;
            const t = this._document.createElement("div");
            t.classList.add("mat-theme-loaded-marker"), this._document.body.appendChild(t);
            const r = getComputedStyle(t);
            r && "none" !== r.display && console.warn("Could not find Angular Material core theme. Most Material components may not work as expected. For more info refer to the theming guide: https://material.angular.io/guide/theming"), this._document.body.removeChild(t)
          }
          _checkCdkVersionMatch() {
            this._checkIsEnabled("version") && cS.full !== sD.full && console.warn("The Angular Material version (" + cS.full + ") does not match the Angular CDK version (" + sD.full + ").\nPlease ensure the versions of these two packages exactly match.")
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(rD), _(aU, 8), _(O))
        }, n.\u0275mod = ge({
          type: n
        }), n.\u0275inj = de({
          imports: [
            [_a], _a
          ]
        }), n
      })();

      function dS(n, e) {
        return class extends n {
          constructor(...t) {
            super(...t), this.defaultColor = e, this.color = e
          }
          get color() {
            return this._color
          }
          set color(t) {
            const r = t || this.defaultColor;
            r !== this._color && (this._color && this._elementRef.nativeElement.classList.remove(`mat-${this._color}`), r && this._elementRef.nativeElement.classList.add(`mat-${r}`), this._color = r)
          }
        }
      }
      const cU = new P("MAT_DATE_LOCALE", {
        providedIn: "root",
        factory: function () {
          return fm(Jn)
        }
      });
      class hS {
        constructor() {
          this._localeChanges = new X, this.localeChanges = this._localeChanges
        }
        getValidDateOrNull(e) {
          return this.isDateInstance(e) && this.isValid(e) ? e : null
        }
        deserialize(e) {
          return null == e || this.isDateInstance(e) && this.isValid(e) ? e : this.invalid()
        }
        setLocale(e) {
          this.locale = e, this._localeChanges.next()
        }
        compareDate(e, t) {
          return this.getYear(e) - this.getYear(t) || this.getMonth(e) - this.getMonth(t) || this.getDate(e) - this.getDate(t)
        }
        sameDate(e, t) {
          if (e && t) {
            let r = this.isValid(e),
              i = this.isValid(t);
            return r && i ? !this.compareDate(e, t) : r == i
          }
          return e == t
        }
        clampDate(e, t, r) {
          return t && this.compareDate(e, t) < 0 ? t : r && this.compareDate(e, r) > 0 ? r : e
        }
      }
      const dU = new P("mat-date-formats");
      let yi;
      try {
        yi = "undefined" != typeof Intl
      } catch (n) {
        yi = !1
      }
      const hU = {
          long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
        },
        fU = ou(31, n => String(n + 1)),
        pU = {
          long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          narrow: ["S", "M", "T", "W", "T", "F", "S"]
        },
        gU = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

      function ou(n, e) {
        const t = Array(n);
        for (let r = 0; r < n; r++) t[r] = e(r);
        return t
      }
      let mU = (() => {
          class n extends hS {
            constructor(t, r) {
              super(), this.useUtcForDisplay = !0, super.setLocale(t), this.useUtcForDisplay = !r.TRIDENT, this._clampDate = r.TRIDENT || r.EDGE
            }
            getYear(t) {
              return t.getFullYear()
            }
            getMonth(t) {
              return t.getMonth()
            }
            getDate(t) {
              return t.getDate()
            }
            getDayOfWeek(t) {
              return t.getDay()
            }
            getMonthNames(t) {
              if (yi) {
                const r = new Intl.DateTimeFormat(this.locale, {
                  month: t,
                  timeZone: "utc"
                });
                return ou(12, i => this._stripDirectionalityCharacters(this._format(r, new Date(2017, i, 1))))
              }
              return hU[t]
            }
            getDateNames() {
              if (yi) {
                const t = new Intl.DateTimeFormat(this.locale, {
                  day: "numeric",
                  timeZone: "utc"
                });
                return ou(31, r => this._stripDirectionalityCharacters(this._format(t, new Date(2017, 0, r + 1))))
              }
              return fU
            }
            getDayOfWeekNames(t) {
              if (yi) {
                const r = new Intl.DateTimeFormat(this.locale, {
                  weekday: t,
                  timeZone: "utc"
                });
                return ou(7, i => this._stripDirectionalityCharacters(this._format(r, new Date(2017, 0, i + 1))))
              }
              return pU[t]
            }
            getYearName(t) {
              if (yi) {
                const r = new Intl.DateTimeFormat(this.locale, {
                  year: "numeric",
                  timeZone: "utc"
                });
                return this._stripDirectionalityCharacters(this._format(r, t))
              }
              return String(this.getYear(t))
            }
            getFirstDayOfWeek() {
              return 0
            }
            getNumDaysInMonth(t) {
              return this.getDate(this._createDateWithOverflow(this.getYear(t), this.getMonth(t) + 1, 0))
            }
            clone(t) {
              return new Date(t.getTime())
            }
            createDate(t, r, i) {
              let s = this._createDateWithOverflow(t, r, i);
              return s.getMonth(), s
            }
            today() {
              return new Date
            }
            parse(t) {
              return "number" == typeof t ? new Date(t) : t ? new Date(Date.parse(t)) : null
            }
            format(t, r) {
              if (!this.isValid(t)) throw Error("NativeDateAdapter: Cannot format invalid date.");
              if (yi) {
                this._clampDate && (t.getFullYear() < 1 || t.getFullYear() > 9999) && (t = this.clone(t)).setFullYear(Math.max(1, Math.min(9999, t.getFullYear()))), r = Object.assign(Object.assign({}, r), {
                  timeZone: "utc"
                });
                const i = new Intl.DateTimeFormat(this.locale, r);
                return this._stripDirectionalityCharacters(this._format(i, t))
              }
              return this._stripDirectionalityCharacters(t.toDateString())
            }
            addCalendarYears(t, r) {
              return this.addCalendarMonths(t, 12 * r)
            }
            addCalendarMonths(t, r) {
              let i = this._createDateWithOverflow(this.getYear(t), this.getMonth(t) + r, this.getDate(t));
              return this.getMonth(i) != ((this.getMonth(t) + r) % 12 + 12) % 12 && (i = this._createDateWithOverflow(this.getYear(i), this.getMonth(i), 0)), i
            }
            addCalendarDays(t, r) {
              return this._createDateWithOverflow(this.getYear(t), this.getMonth(t), this.getDate(t) + r)
            }
            toIso8601(t) {
              return [t.getUTCFullYear(), this._2digit(t.getUTCMonth() + 1), this._2digit(t.getUTCDate())].join("-")
            }
            deserialize(t) {
              if ("string" == typeof t) {
                if (!t) return null;
                if (gU.test(t)) {
                  let r = new Date(t);
                  if (this.isValid(r)) return r
                }
              }
              return super.deserialize(t)
            }
            isDateInstance(t) {
              return t instanceof Date
            }
            isValid(t) {
              return !isNaN(t.getTime())
            }
            invalid() {
              return new Date(NaN)
            }
            _createDateWithOverflow(t, r, i) {
              const s = new Date;
              return s.setFullYear(t, r, i), s.setHours(0, 0, 0, 0), s
            }
            _2digit(t) {
              return ("00" + t).slice(-2)
            }
            _stripDirectionalityCharacters(t) {
              return t.replace(/[\u200e\u200f]/g, "")
            }
            _format(t, r) {
              const i = new Date;
              return i.setUTCFullYear(r.getFullYear(), r.getMonth(), r.getDate()), i.setUTCHours(r.getHours(), r.getMinutes(), r.getSeconds(), r.getMilliseconds()), t.format(i)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(cU, 8), _(Ae))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })(),
        yU = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            providers: [{
              provide: hS,
              useClass: mU
            }],
            imports: [
              [Vc]
            ]
          }), n
        })();
      const vU = {
        parse: {
          dateInput: null
        },
        display: {
          dateInput: {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          },
          monthYearLabel: {
            year: "numeric",
            month: "short"
          },
          dateA11yLabel: {
            year: "numeric",
            month: "long",
            day: "numeric"
          },
          monthYearA11yLabel: {
            year: "numeric",
            month: "long"
          }
        }
      };
      let bU = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            providers: [{
              provide: dU,
              useValue: vU
            }],
            imports: [
              [yU]
            ]
          }), n
        })(),
        mS = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            imports: [
              [en, Vc], en
            ]
          }), n
        })();
      const PU = ["*", [
          ["mat-toolbar-row"]
        ]],
        NU = ["*", "mat-toolbar-row"],
        FU = dS(class {
          constructor(n) {
            this._elementRef = n
          }
        });
      let LU = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275dir = ee({
            type: n,
            selectors: [
              ["mat-toolbar-row"]
            ],
            hostAttrs: [1, "mat-toolbar-row"],
            exportAs: ["matToolbarRow"]
          }), n
        })(),
        VU = (() => {
          class n extends FU {
            constructor(t, r, i) {
              super(t), this._platform = r, this._document = i
            }
            ngAfterViewInit() {
              this._platform.isBrowser && (this._checkToolbarMixedModes(), this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes()))
            }
            _checkToolbarMixedModes() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(b(ae), b(Ae), b(O))
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["mat-toolbar"]
            ],
            contentQueries: function (t, r, i) {
              if (1 & t && Ul(i, LU, 5), 2 & t) {
                let s;
                Xr(s = function (n, e) {
                  return n[19].queries[e].queryList
                }(C(), zg())) && (r._toolbarRows = s)
              }
            },
            hostAttrs: [1, "mat-toolbar"],
            hostVars: 4,
            hostBindings: function (t, r) {
              2 & t && Ut("mat-toolbar-multiple-rows", r._toolbarRows.length > 0)("mat-toolbar-single-row", 0 === r._toolbarRows.length)
            },
            inputs: {
              color: "color"
            },
            exportAs: ["matToolbar"],
            features: [_t],
            ngContentSelectors: NU,
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (function (n) {
                const e = C()[16][6];
                if (!e.projection) {
                  const r = e.projection = mr(n ? n.length : 1, null),
                    i = r.slice();
                  let s = e.child;
                  for (; null !== s;) {
                    const o = n ? fR(s, n) : 0;
                    null !== o && (i[o] ? i[o].projectionNext = s : r[o] = s, i[o] = s), s = s.next
                  }
                }
              }(PU), Zn(0), Zn(1, 1))
            },
            styles: [".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}\n"],
            encapsulation: 2,
            changeDetection: 0
          }), n
        })(),
        BU = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            imports: [
              [en], en
            ]
          }), n
        })(),
        jU = (() => {
          class n {
            constructor() {}
            ngOnInit() {}
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-footer"]
            ],
            decls: 2,
            vars: 0,
            consts: [
              [1, "footer"]
            ],
            template: function (t, r) {
              1 & t && (je(0, "mat-toolbar", 0), $t(1, " Desenvolvido por: Guilherme Portella\n"), He())
            },
            directives: [VU],
            styles: [".footer[_ngcontent-%COMP%]{height:5%;position:fixed;bottom:0;justify-content:flex-end;font-size:1rem;background:rgba(30,126,182,.705);opacity:1}"]
          }), n
        })(),
        HU = (() => {
          class n {
            constructor() {
              this.title = "GuilhermePortella"
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275cmp = ke({
            type: n,
            selectors: [
              ["app-root"]
            ],
            decls: 2,
            vars: 0,
            template: function (t, r) {
              1 & t && (Ht(0, "router-outlet"), Ht(1, "app-footer"))
            },
            directives: [lp, jU],
            styles: [""]
          }), n
        })();

      function Zp(n, e, t, r) {
        return En(t) && (r = t, t = void 0), r ? Zp(n, e, t).pipe(_e(i => Sa(i) ? r(...i) : r(i))) : new re(i => {
          bS(n, e, function (o) {
            i.next(arguments.length > 1 ? Array.prototype.slice.call(arguments) : o)
          }, i, t)
        })
      }

      function bS(n, e, t, r, i) {
        let s;
        if (function (n) {
            return n && "function" == typeof n.addEventListener && "function" == typeof n.removeEventListener
          }(n)) {
          const o = n;
          n.addEventListener(e, t, i), s = () => o.removeEventListener(e, t, i)
        } else if (function (n) {
            return n && "function" == typeof n.on && "function" == typeof n.off
          }(n)) {
          const o = n;
          n.on(e, t), s = () => o.off(e, t)
        } else if (function (n) {
            return n && "function" == typeof n.addListener && "function" == typeof n.removeListener
          }(n)) {
          const o = n;
          n.addListener(e, t), s = () => o.removeListener(e, t)
        } else {
          if (!n || !n.length) throw new TypeError("Invalid event target");
          for (let o = 0, a = n.length; o < a; o++) bS(n[o], e, t, r, i)
        }
        r.add(s)
      }
      new class extends bn {
        flush(e) {
          this.active = !0, this.scheduled = void 0;
          const {
            actions: t
          } = this;
          let r, i = -1,
            s = t.length;
          e = e || t.shift();
          do {
            if (r = e.execute(e.state, e.delay)) break
          } while (++i < s && (e = t.shift()));
          if (this.active = !1, r) {
            for (; ++i < s && (e = t.shift());) e.unsubscribe();
            throw r
          }
        }
      }(class extends jc {
        constructor(e, t) {
          super(e, t), this.scheduler = e, this.work = t
        }
        requestAsyncId(e, t, r = 0) {
          return null !== r && r > 0 ? super.requestAsyncId(e, t, r) : (e.actions.push(this), e.scheduled || (e.scheduled = requestAnimationFrame(() => e.flush(null))))
        }
        recycleAsyncId(e, t, r = 0) {
          if (null !== r && r > 0 || null === r && this.delay > 0) return super.recycleAsyncId(e, t, r);
          0 === e.actions.length && (cancelAnimationFrame(t), e.scheduled = void 0)
        }
      });
      let KU = 1;
      const QU = Promise.resolve(),
        lu = {};

      function CS(n) {
        return n in lu && (delete lu[n], !0)
      }
      const ES = {
        setImmediate(n) {
          const e = KU++;
          return lu[e] = !0, QU.then(() => CS(e) && n()), e
        },
        clearImmediate(n) {
          CS(n)
        }
      };
      new class extends bn {
        flush(e) {
          this.active = !0, this.scheduled = void 0;
          const {
            actions: t
          } = this;
          let r, i = -1,
            s = t.length;
          e = e || t.shift();
          do {
            if (r = e.execute(e.state, e.delay)) break
          } while (++i < s && (e = t.shift()));
          if (this.active = !1, r) {
            for (; ++i < s && (e = t.shift());) e.unsubscribe();
            throw r
          }
        }
      }(class extends jc {
        constructor(e, t) {
          super(e, t), this.scheduler = e, this.work = t
        }
        requestAsyncId(e, t, r = 0) {
          return null !== r && r > 0 ? super.requestAsyncId(e, t, r) : (e.actions.push(this), e.scheduled || (e.scheduled = ES.setImmediate(e.flush.bind(e, null))))
        }
        recycleAsyncId(e, t, r = 0) {
          if (null !== r && r > 0 || null === r && this.delay > 0) return super.recycleAsyncId(e, t, r);
          0 === e.actions.length && (ES.clearImmediate(t), e.scheduled = void 0)
        }
      });
      class e$ {
        constructor(e) {
          this.durationSelector = e
        }
        call(e, t) {
          return t.subscribe(new t$(e, this.durationSelector))
        }
      }
      class t$ extends Us {
        constructor(e, t) {
          super(e), this.durationSelector = t, this.hasValue = !1
        }
        _next(e) {
          if (this.value = e, this.hasValue = !0, !this.throttled) {
            let t;
            try {
              const {
                durationSelector: i
              } = this;
              t = i(e)
            } catch (i) {
              return this.destination.error(i)
            }
            const r = $s(t, new Hs(this));
            !r || r.closed ? this.clearThrottle() : this.add(this.throttled = r)
          }
        }
        clearThrottle() {
          const {
            value: e,
            hasValue: t,
            throttled: r
          } = this;
          r && (this.remove(r), this.throttled = void 0, r.unsubscribe()), t && (this.value = void 0, this.hasValue = !1, this.destination.next(e))
        }
        notifyNext() {
          this.clearThrottle()
        }
        notifyComplete() {
          this.clearThrottle()
        }
      }

      function DS(n) {
        return !Sa(n) && n - parseFloat(n) + 1 >= 0
      }

      function r$(n) {
        const {
          index: e,
          period: t,
          subscriber: r
        } = n;
        if (r.next(e), !r.closed) {
          if (-1 === t) return r.complete();
          n.index = e + 1, this.schedule(n, t)
        }
      }

      function Xp(n, e = gp) {
        return function (n) {
          return function (t) {
            return t.lift(new e$(n))
          }
        }(() => function (n = 0, e, t) {
          let r = -1;
          return DS(e) ? r = Number(e) < 1 ? 1 : Number(e) : Ei(e) && (t = e), Ei(t) || (t = gp), new re(i => {
            const s = DS(n) ? n : +n - t.now();
            return t.schedule(r$, s, {
              index: 0,
              period: r,
              subscriber: i
            })
          })
        }(n, e))
      }
      new class extends bn {}(class extends jc {
        constructor(e, t) {
          super(e, t), this.scheduler = e, this.work = t
        }
        schedule(e, t = 0) {
          return t > 0 ? super.schedule(e, t) : (this.delay = t, this.state = e, this.scheduler.flush(this), this)
        }
        execute(e, t) {
          return t > 0 || this.closed ? super.execute(e, t) : this._execute(e, t)
        }
        requestAsyncId(e, t, r = 0) {
          return null !== r && r > 0 || null === r && this.delay > 0 ? super.requestAsyncId(e, t, r) : e.flush(this)
        }
      });
      class tn {
        constructor(e, t, r) {
          this.kind = e, this.value = t, this.error = r, this.hasValue = "N" === e
        }
        observe(e) {
          switch (this.kind) {
            case "N":
              return e.next && e.next(this.value);
            case "E":
              return e.error && e.error(this.error);
            case "C":
              return e.complete && e.complete()
          }
        }
        do(e, t, r) {
          switch (this.kind) {
            case "N":
              return e && e(this.value);
            case "E":
              return t && t(this.error);
            case "C":
              return r && r()
          }
        }
        accept(e, t, r) {
          return e && "function" == typeof e.next ? this.observe(e) : this.do(e, t, r)
        }
        toObservable() {
          switch (this.kind) {
            case "N":
              return F(this.value);
            case "E":
              return function (n, e) {
                return new re(t => t.error(n))
              }(this.error);
            case "C":
              return bc()
          }
          throw new Error("unexpected notification kind value")
        }
        static
        createNext(e) {
          return void 0 !== e ? new tn("N", e) : tn.undefinedValueNotification
        }
        static createError(e) {
          return new tn("E", void 0, e)
        }
        static createComplete() {
          return tn.completeNotification
        }
      }
      tn.completeNotification = new tn("C"), tn.undefinedValueNotification = new tn("N", void 0);
      let uu = (() => {
          class n {
            constructor(t, r, i) {
              this._ngZone = t, this._platform = r, this._scrolled = new X, this._globalSubscription = null, this._scrolledCount = 0, this.scrollContainers = new Map, this._document = i
            }
            register(t) {
              this.scrollContainers.has(t) || this.scrollContainers.set(t, t.elementScrolled().subscribe(() => this._scrolled.next(t)))
            }
            deregister(t) {
              const r = this.scrollContainers.get(t);
              r && (r.unsubscribe(), this.scrollContainers.delete(t))
            }
            scrolled(t = 20) {
              return this._platform.isBrowser ? new re(r => {
                this._globalSubscription || this._addGlobalListener();
                const i = t > 0 ? this._scrolled.pipe(Xp(t)).subscribe(r) : this._scrolled.subscribe(r);
                return this._scrolledCount++, () => {
                  i.unsubscribe(), this._scrolledCount--, this._scrolledCount || this._removeGlobalListener()
                }
              }) : F()
            }
            ngOnDestroy() {
              this._removeGlobalListener(), this.scrollContainers.forEach((t, r) => this.deregister(r)), this._scrolled.complete()
            }
            ancestorScrolled(t, r) {
              const i = this.getAncestorScrollContainers(t);
              return this.scrolled(r).pipe(si(s => !s || i.indexOf(s) > -1))
            }
            getAncestorScrollContainers(t) {
              const r = [];
              return this.scrollContainers.forEach((i, s) => {
                this._scrollableContainsElement(s, t) && r.push(s)
              }), r
            }
            _getWindow() {
              return this._document.defaultView || window
            }
            _scrollableContainsElement(t, r) {
              let i = function (n) {
                  return n instanceof ae ? n.nativeElement : n
                }(r),
                s = t.getElementRef().nativeElement;
              do {
                if (i == s) return !0
              } while (i = i.parentElement);
              return !1
            }
            _addGlobalListener() {
              this._globalSubscription = this._ngZone.runOutsideAngular(() => Zp(this._getWindow().document, "scroll").subscribe(() => this._scrolled.next()))
            }
            _removeGlobalListener() {
              this._globalSubscription && (this._globalSubscription.unsubscribe(), this._globalSubscription = null)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(z), _(Ae), _(O, 8))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(z), _(Ae), _(O, 8))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        Ea = (() => {
          class n {
            constructor(t, r, i) {
              this._platform = t, this._change = new X, this._changeListener = s => {
                this._change.next(s)
              }, this._document = i, r.runOutsideAngular(() => {
                if (t.isBrowser) {
                  const s = this._getWindow();
                  s.addEventListener("resize", this._changeListener), s.addEventListener("orientationchange", this._changeListener)
                }
                this.change().subscribe(() => this._viewportSize = null)
              })
            }
            ngOnDestroy() {
              if (this._platform.isBrowser) {
                const t = this._getWindow();
                t.removeEventListener("resize", this._changeListener), t.removeEventListener("orientationchange", this._changeListener)
              }
              this._change.complete()
            }
            getViewportSize() {
              this._viewportSize || this._updateViewportSize();
              const t = {
                width: this._viewportSize.width,
                height: this._viewportSize.height
              };
              return this._platform.isBrowser || (this._viewportSize = null), t
            }
            getViewportRect() {
              const t = this.getViewportScrollPosition(),
                {
                  width: r,
                  height: i
                } = this.getViewportSize();
              return {
                top: t.top,
                left: t.left,
                bottom: t.top + i,
                right: t.left + r,
                height: i,
                width: r
              }
            }
            getViewportScrollPosition() {
              if (!this._platform.isBrowser) return {
                top: 0,
                left: 0
              };
              const t = this._document,
                r = this._getWindow(),
                i = t.documentElement,
                s = i.getBoundingClientRect();
              return {
                top: -s.top || t.body.scrollTop || r.scrollY || i.scrollTop || 0,
                left: -s.left || t.body.scrollLeft || r.scrollX || i.scrollLeft || 0
              }
            }
            change(t = 20) {
              return t > 0 ? this._change.pipe(Xp(t)) : this._change
            }
            _getWindow() {
              return this._document.defaultView || window
            }
            _updateViewportSize() {
              const t = this._getWindow();
              this._viewportSize = this._platform.isBrowser ? {
                width: t.innerWidth,
                height: t.innerHeight
              } : {
                width: 0,
                height: 0
              }
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(Ae), _(z), _(O, 8))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(Ae), _(z), _(O, 8))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        IS = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({}), n
        })(),
        RS = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            imports: [
              [_a, Vc, IS], _a, IS
            ]
          }), n
        })();
      class Jp {
        attach(e) {
          return this._attachedHost = e, e.attach(this)
        }
        detach() {
          let e = this._attachedHost;
          null != e && (this._attachedHost = null, e.detach())
        }
        get isAttached() {
          return null != this._attachedHost
        }
        setAttachedHost(e) {
          this._attachedHost = e
        }
      }
      class x$ extends Jp {
        constructor(e, t, r, i) {
          super(), this.component = e, this.viewContainerRef = t, this.injector = r, this.componentFactoryResolver = i
        }
      }
      class eg extends Jp {
        constructor(e, t, r) {
          super(), this.templateRef = e, this.viewContainerRef = t, this.context = r
        }
        get origin() {
          return this.templateRef.elementRef
        }
        attach(e, t = this.context) {
          return this.context = t, super.attach(e)
        }
        detach() {
          return this.context = void 0, super.detach()
        }
      }
      class O$ extends Jp {
        constructor(e) {
          super(), this.element = e instanceof ae ? e.nativeElement : e
        }
      }
      class k$ extends class {
        constructor() {
          this._isDisposed = !1, this.attachDomPortal = null
        }
        hasAttached() {
          return !!this._attachedPortal
        }
        attach(e) {
          return e instanceof x$ ? (this._attachedPortal = e, this.attachComponentPortal(e)) : e instanceof eg ? (this._attachedPortal = e, this.attachTemplatePortal(e)) : this.attachDomPortal && e instanceof O$ ? (this._attachedPortal = e, this.attachDomPortal(e)) : void 0
        }
        detach() {
          this._attachedPortal && (this._attachedPortal.setAttachedHost(null), this._attachedPortal = null), this._invokeDisposeFn()
        }
        dispose() {
          this.hasAttached() && this.detach(), this._invokeDisposeFn(), this._isDisposed = !0
        }
        setDisposeFn(e) {
          this._disposeFn = e
        }
        _invokeDisposeFn() {
          this._disposeFn && (this._disposeFn(), this._disposeFn = null)
        }
      } {
        constructor(e, t, r, i, s) {
          super(), this.outletElement = e, this._componentFactoryResolver = t, this._appRef = r, this._defaultInjector = i, this.attachDomPortal = o => {
            const a = o.element,
              l = this._document.createComment("dom-portal");
            a.parentNode.insertBefore(l, a), this.outletElement.appendChild(a), this._attachedPortal = o, super.setDisposeFn(() => {
              l.parentNode && l.parentNode.replaceChild(a, l)
            })
          }, this._document = s
        }
        attachComponentPortal(e) {
          const r = (e.componentFactoryResolver || this._componentFactoryResolver).resolveComponentFactory(e.component);
          let i;
          return e.viewContainerRef ? (i = e.viewContainerRef.createComponent(r, e.viewContainerRef.length, e.injector || e.viewContainerRef.injector), this.setDisposeFn(() => i.destroy())) : (i = r.create(e.injector || this._defaultInjector), this._appRef.attachView(i.hostView), this.setDisposeFn(() => {
            this._appRef.detachView(i.hostView), i.destroy()
          })), this.outletElement.appendChild(this._getComponentRootNode(i)), this._attachedPortal = e, i
        }
        attachTemplatePortal(e) {
          let t = e.viewContainerRef,
            r = t.createEmbeddedView(e.templateRef, e.context);
          return r.rootNodes.forEach(i => this.outletElement.appendChild(i)), r.detectChanges(), this.setDisposeFn(() => {
            let i = t.indexOf(r); - 1 !== i && t.remove(i)
          }), this._attachedPortal = e, r
        }
        dispose() {
          super.dispose(), null != this.outletElement.parentNode && this.outletElement.parentNode.removeChild(this.outletElement)
        }
        _getComponentRootNode(e) {
          return e.hostView.rootNodes[0]
        }
      }
      let OS = (() => {
        class n {}
        return n.\u0275fac = function (t) {
          return new(t || n)
        }, n.\u0275mod = ge({
          type: n
        }), n.\u0275inj = de({}), n
      })();
      const kS = Bw();
      class L$ {
        constructor(e, t) {
          this._viewportRuler = e, this._previousHTMLStyles = {
            top: "",
            left: ""
          }, this._isEnabled = !1, this._document = t
        }
        attach() {}
        enable() {
          if (this._canBeEnabled()) {
            const e = this._document.documentElement;
            this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition(), this._previousHTMLStyles.left = e.style.left || "", this._previousHTMLStyles.top = e.style.top || "", e.style.left = Le(-this._previousScrollPosition.left), e.style.top = Le(-this._previousScrollPosition.top), e.classList.add("cdk-global-scrollblock"), this._isEnabled = !0
          }
        }
        disable() {
          if (this._isEnabled) {
            const e = this._document.documentElement,
              r = e.style,
              i = this._document.body.style,
              s = r.scrollBehavior || "",
              o = i.scrollBehavior || "";
            this._isEnabled = !1, r.left = this._previousHTMLStyles.left, r.top = this._previousHTMLStyles.top, e.classList.remove("cdk-global-scrollblock"), kS && (r.scrollBehavior = i.scrollBehavior = "auto"), window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top), kS && (r.scrollBehavior = s, i.scrollBehavior = o)
          }
        }
        _canBeEnabled() {
          if (this._document.documentElement.classList.contains("cdk-global-scrollblock") || this._isEnabled) return !1;
          const t = this._document.body,
            r = this._viewportRuler.getViewportSize();
          return t.scrollHeight > r.height || t.scrollWidth > r.width
        }
      }
      class V$ {
        constructor(e, t, r, i) {
          this._scrollDispatcher = e, this._ngZone = t, this._viewportRuler = r, this._config = i, this._scrollSubscription = null, this._detach = () => {
            this.disable(), this._overlayRef.hasAttached() && this._ngZone.run(() => this._overlayRef.detach())
          }
        }
        attach(e) {
          this._overlayRef = e
        }
        enable() {
          if (this._scrollSubscription) return;
          const e = this._scrollDispatcher.scrolled(0);
          this._config && this._config.threshold && this._config.threshold > 1 ? (this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top, this._scrollSubscription = e.subscribe(() => {
            const t = this._viewportRuler.getViewportScrollPosition().top;
            Math.abs(t - this._initialScrollPosition) > this._config.threshold ? this._detach() : this._overlayRef.updatePosition()
          })) : this._scrollSubscription = e.subscribe(this._detach)
        }
        disable() {
          this._scrollSubscription && (this._scrollSubscription.unsubscribe(), this._scrollSubscription = null)
        }
        detach() {
          this.disable(), this._overlayRef = null
        }
      }
      class PS {
        enable() {}
        disable() {}
        attach() {}
      }

      function ng(n, e) {
        return e.some(t => n.bottom < t.top || n.top > t.bottom || n.right < t.left || n.left > t.right)
      }

      function NS(n, e) {
        return e.some(t => n.top < t.top || n.bottom > t.bottom || n.left < t.left || n.right > t.right)
      }
      class B$ {
        constructor(e, t, r, i) {
          this._scrollDispatcher = e, this._viewportRuler = t, this._ngZone = r, this._config = i, this._scrollSubscription = null
        }
        attach(e) {
          this._overlayRef = e
        }
        enable() {
          this._scrollSubscription || (this._scrollSubscription = this._scrollDispatcher.scrolled(this._config ? this._config.scrollThrottle : 0).subscribe(() => {
            if (this._overlayRef.updatePosition(), this._config && this._config.autoClose) {
              const t = this._overlayRef.overlayElement.getBoundingClientRect(),
                {
                  width: r,
                  height: i
                } = this._viewportRuler.getViewportSize();
              ng(t, [{
                width: r,
                height: i,
                bottom: i,
                right: r,
                top: 0,
                left: 0
              }]) && (this.disable(), this._ngZone.run(() => this._overlayRef.detach()))
            }
          }))
        }
        disable() {
          this._scrollSubscription && (this._scrollSubscription.unsubscribe(), this._scrollSubscription = null)
        }
        detach() {
          this.disable(), this._overlayRef = null
        }
      }
      let j$ = (() => {
        class n {
          constructor(t, r, i, s) {
            this._scrollDispatcher = t, this._viewportRuler = r, this._ngZone = i, this.noop = () => new PS, this.close = o => new V$(this._scrollDispatcher, this._ngZone, this._viewportRuler, o), this.block = () => new L$(this._viewportRuler, this._document), this.reposition = o => new B$(this._scrollDispatcher, this._viewportRuler, this._ngZone, o), this._document = s
          }
        }
        return n.\u0275fac = function (t) {
          return new(t || n)(_(uu), _(Ea), _(z), _(O))
        }, n.\u0275prov = M({
          factory: function () {
            return new n(_(uu), _(Ea), _(z), _(O))
          },
          token: n,
          providedIn: "root"
        }), n
      })();
      class FS {
        constructor(e) {
          if (this.scrollStrategy = new PS, this.panelClass = "", this.hasBackdrop = !1, this.backdropClass = "cdk-overlay-dark-backdrop", this.disposeOnNavigation = !1, e) {
            const t = Object.keys(e);
            for (const r of t) void 0 !== e[r] && (this[r] = e[r])
          }
        }
      }
      class H$ {
        constructor(e, t, r, i, s) {
          this.offsetX = r, this.offsetY = i, this.panelClass = s, this.originX = e.originX, this.originY = e.originY, this.overlayX = t.overlayX, this.overlayY = t.overlayY
        }
      }
      class U$ {
        constructor(e, t) {
          this.connectionPair = e, this.scrollableViewProperties = t
        }
      }
      let LS = (() => {
          class n {
            constructor(t) {
              this._attachedOverlays = [], this._document = t
            }
            ngOnDestroy() {
              this.detach()
            }
            add(t) {
              this.remove(t), this._attachedOverlays.push(t)
            }
            remove(t) {
              const r = this._attachedOverlays.indexOf(t);
              r > -1 && this._attachedOverlays.splice(r, 1), 0 === this._attachedOverlays.length && this.detach()
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(O))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(O))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        $$ = (() => {
          class n extends LS {
            constructor(t) {
              super(t), this._keydownListener = r => {
                const i = this._attachedOverlays;
                for (let s = i.length - 1; s > -1; s--)
                  if (i[s]._keydownEvents.observers.length > 0) {
                    i[s]._keydownEvents.next(r);
                    break
                  }
              }
            }
            add(t) {
              super.add(t), this._isAttached || (this._document.body.addEventListener("keydown", this._keydownListener), this._isAttached = !0)
            }
            detach() {
              this._isAttached && (this._document.body.removeEventListener("keydown", this._keydownListener), this._isAttached = !1)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(O))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(O))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        z$ = (() => {
          class n extends LS {
            constructor(t, r) {
              super(t), this._platform = r, this._cursorStyleIsSet = !1, this._pointerDownListener = i => {
                this._pointerDownEventTarget = fi(i)
              }, this._clickListener = i => {
                const s = fi(i),
                  o = "click" === i.type && this._pointerDownEventTarget ? this._pointerDownEventTarget : s;
                this._pointerDownEventTarget = null;
                const a = this._attachedOverlays.slice();
                for (let l = a.length - 1; l > -1; l--) {
                  const c = a[l];
                  if (!(c._outsidePointerEvents.observers.length < 1) && c.hasAttached()) {
                    if (c.overlayElement.contains(s) || c.overlayElement.contains(o)) break;
                    c._outsidePointerEvents.next(i)
                  }
                }
              }
            }
            add(t) {
              if (super.add(t), !this._isAttached) {
                const r = this._document.body;
                r.addEventListener("pointerdown", this._pointerDownListener, !0), r.addEventListener("click", this._clickListener, !0), r.addEventListener("auxclick", this._clickListener, !0), r.addEventListener("contextmenu", this._clickListener, !0), this._platform.IOS && !this._cursorStyleIsSet && (this._cursorOriginalValue = r.style.cursor, r.style.cursor = "pointer", this._cursorStyleIsSet = !0), this._isAttached = !0
              }
            }
            detach() {
              if (this._isAttached) {
                const t = this._document.body;
                t.removeEventListener("pointerdown", this._pointerDownListener, !0), t.removeEventListener("click", this._clickListener, !0), t.removeEventListener("auxclick", this._clickListener, !0), t.removeEventListener("contextmenu", this._clickListener, !0), this._platform.IOS && this._cursorStyleIsSet && (t.style.cursor = this._cursorOriginalValue, this._cursorStyleIsSet = !1), this._isAttached = !1
              }
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(O), _(Ae))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(O), _(Ae))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        rg = (() => {
          class n {
            constructor(t, r) {
              this._platform = r, this._document = t
            }
            ngOnDestroy() {
              const t = this._containerElement;
              t && t.parentNode && t.parentNode.removeChild(t)
            }
            getContainerElement() {
              return this._containerElement || this._createContainer(), this._containerElement
            }
            _createContainer() {
              const t = "cdk-overlay-container";
              if (this._platform.isBrowser || pp()) {
                const i = this._document.querySelectorAll(`.${t}[platform="server"], .${t}[platform="test"]`);
                for (let s = 0; s < i.length; s++) i[s].parentNode.removeChild(i[s])
              }
              const r = this._document.createElement("div");
              r.classList.add(t), pp() ? r.setAttribute("platform", "test") : this._platform.isBrowser || r.setAttribute("platform", "server"), this._document.body.appendChild(r), this._containerElement = r
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(O), _(Ae))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(O), _(Ae))
            },
            token: n,
            providedIn: "root"
          }), n
        })();
      class W$ {
        constructor(e, t, r, i, s, o, a, l, c) {
          this._portalOutlet = e, this._host = t, this._pane = r, this._config = i, this._ngZone = s, this._keyboardDispatcher = o, this._document = a, this._location = l, this._outsideClickDispatcher = c, this._backdropElement = null, this._backdropClick = new X, this._attachments = new X, this._detachments = new X, this._locationChanges = ie.EMPTY, this._backdropClickHandler = u => this._backdropClick.next(u), this._keydownEvents = new X, this._outsidePointerEvents = new X, i.scrollStrategy && (this._scrollStrategy = i.scrollStrategy, this._scrollStrategy.attach(this)), this._positionStrategy = i.positionStrategy
        }
        get overlayElement() {
          return this._pane
        }
        get backdropElement() {
          return this._backdropElement
        }
        get hostElement() {
          return this._host
        }
        attach(e) {
          let t = this._portalOutlet.attach(e);
          return !this._host.parentElement && this._previousHostParent && this._previousHostParent.appendChild(this._host), this._positionStrategy && this._positionStrategy.attach(this), this._updateStackingOrder(), this._updateElementSize(), this._updateElementDirection(), this._scrollStrategy && this._scrollStrategy.enable(), this._ngZone.onStable.pipe(Ds(1)).subscribe(() => {
            this.hasAttached() && this.updatePosition()
          }), this._togglePointerEvents(!0), this._config.hasBackdrop && this._attachBackdrop(), this._config.panelClass && this._toggleClasses(this._pane, this._config.panelClass, !0), this._attachments.next(), this._keyboardDispatcher.add(this), this._config.disposeOnNavigation && (this._locationChanges = this._location.subscribe(() => this.dispose())), this._outsideClickDispatcher.add(this), t
        }
        detach() {
          if (!this.hasAttached()) return;
          this.detachBackdrop(), this._togglePointerEvents(!1), this._positionStrategy && this._positionStrategy.detach && this._positionStrategy.detach(), this._scrollStrategy && this._scrollStrategy.disable();
          const e = this._portalOutlet.detach();
          return this._detachments.next(), this._keyboardDispatcher.remove(this), this._detachContentWhenStable(), this._locationChanges.unsubscribe(), this._outsideClickDispatcher.remove(this), e
        }
        dispose() {
          const e = this.hasAttached();
          this._positionStrategy && this._positionStrategy.dispose(), this._disposeScrollStrategy(), this._disposeBackdrop(this._backdropElement), this._locationChanges.unsubscribe(), this._keyboardDispatcher.remove(this), this._portalOutlet.dispose(), this._attachments.complete(), this._backdropClick.complete(), this._keydownEvents.complete(), this._outsidePointerEvents.complete(), this._outsideClickDispatcher.remove(this), this._host && this._host.parentNode && (this._host.parentNode.removeChild(this._host), this._host = null), this._previousHostParent = this._pane = null, e && this._detachments.next(), this._detachments.complete()
        }
        hasAttached() {
          return this._portalOutlet.hasAttached()
        }
        backdropClick() {
          return this._backdropClick
        }
        attachments() {
          return this._attachments
        }
        detachments() {
          return this._detachments
        }
        keydownEvents() {
          return this._keydownEvents
        }
        outsidePointerEvents() {
          return this._outsidePointerEvents
        }
        getConfig() {
          return this._config
        }
        updatePosition() {
          this._positionStrategy && this._positionStrategy.apply()
        }
        updatePositionStrategy(e) {
          e !== this._positionStrategy && (this._positionStrategy && this._positionStrategy.dispose(), this._positionStrategy = e, this.hasAttached() && (e.attach(this), this.updatePosition()))
        }
        updateSize(e) {
          this._config = Object.assign(Object.assign({}, this._config), e), this._updateElementSize()
        }
        setDirection(e) {
          this._config = Object.assign(Object.assign({}, this._config), {
            direction: e
          }), this._updateElementDirection()
        }
        addPanelClass(e) {
          this._pane && this._toggleClasses(this._pane, e, !0)
        }
        removePanelClass(e) {
          this._pane && this._toggleClasses(this._pane, e, !1)
        }
        getDirection() {
          const e = this._config.direction;
          return e ? "string" == typeof e ? e : e.value : "ltr"
        }
        updateScrollStrategy(e) {
          e !== this._scrollStrategy && (this._disposeScrollStrategy(), this._scrollStrategy = e, this.hasAttached() && (e.attach(this), e.enable()))
        }
        _updateElementDirection() {
          this._host.setAttribute("dir", this.getDirection())
        }
        _updateElementSize() {
          if (!this._pane) return;
          const e = this._pane.style;
          e.width = Le(this._config.width), e.height = Le(this._config.height), e.minWidth = Le(this._config.minWidth), e.minHeight = Le(this._config.minHeight), e.maxWidth = Le(this._config.maxWidth), e.maxHeight = Le(this._config.maxHeight)
        }
        _togglePointerEvents(e) {
          this._pane.style.pointerEvents = e ? "" : "none"
        }
        _attachBackdrop() {
          const e = "cdk-overlay-backdrop-showing";
          this._backdropElement = this._document.createElement("div"), this._backdropElement.classList.add("cdk-overlay-backdrop"), this._config.backdropClass && this._toggleClasses(this._backdropElement, this._config.backdropClass, !0), this._host.parentElement.insertBefore(this._backdropElement, this._host), this._backdropElement.addEventListener("click", this._backdropClickHandler), "undefined" != typeof requestAnimationFrame ? this._ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
              this._backdropElement && this._backdropElement.classList.add(e)
            })
          }) : this._backdropElement.classList.add(e)
        }
        _updateStackingOrder() {
          this._host.nextSibling && this._host.parentNode.appendChild(this._host)
        }
        detachBackdrop() {
          const e = this._backdropElement;
          if (!e) return;
          let t;
          const r = () => {
            e && (e.removeEventListener("click", this._backdropClickHandler), e.removeEventListener("transitionend", r), this._disposeBackdrop(e)), this._config.backdropClass && this._toggleClasses(e, this._config.backdropClass, !1), clearTimeout(t)
          };
          e.classList.remove("cdk-overlay-backdrop-showing"), this._ngZone.runOutsideAngular(() => {
            e.addEventListener("transitionend", r)
          }), e.style.pointerEvents = "none", t = this._ngZone.runOutsideAngular(() => setTimeout(r, 500))
        }
        _toggleClasses(e, t, r) {
          const i = e.classList;
          Lw(t).forEach(s => {
            s && (r ? i.add(s) : i.remove(s))
          })
        }
        _detachContentWhenStable() {
          this._ngZone.runOutsideAngular(() => {
            const e = this._ngZone.onStable.pipe(function (n) {
              return e => e.lift(new K2(n))
            }(_g(this._attachments, this._detachments))).subscribe(() => {
              (!this._pane || !this._host || 0 === this._pane.children.length) && (this._pane && this._config.panelClass && this._toggleClasses(this._pane, this._config.panelClass, !1), this._host && this._host.parentElement && (this._previousHostParent = this._host.parentElement, this._previousHostParent.removeChild(this._host)), e.unsubscribe())
            })
          })
        }
        _disposeScrollStrategy() {
          const e = this._scrollStrategy;
          e && (e.disable(), e.detach && e.detach())
        }
        _disposeBackdrop(e) {
          e && (e.parentNode && e.parentNode.removeChild(e), this._backdropElement === e && (this._backdropElement = null))
        }
      }
      const VS = "cdk-overlay-connected-position-bounding-box",
        q$ = /([A-Za-z%]+)$/;
      class BS {
        constructor(e, t, r, i, s) {
          this._viewportRuler = t, this._document = r, this._platform = i, this._overlayContainer = s, this._lastBoundingBoxSize = {
            width: 0,
            height: 0
          }, this._isPushed = !1, this._canPush = !0, this._growAfterOpen = !1, this._hasFlexibleDimensions = !0, this._positionLocked = !1, this._viewportMargin = 0, this._scrollables = [], this._preferredPositions = [], this._positionChanges = new X, this._resizeSubscription = ie.EMPTY, this._offsetX = 0, this._offsetY = 0, this._appliedPanelClasses = [], this.positionChanges = this._positionChanges, this.setOrigin(e)
        }
        get positions() {
          return this._preferredPositions
        }
        attach(e) {
          this._validatePositions(), e.hostElement.classList.add(VS), this._overlayRef = e, this._boundingBox = e.hostElement, this._pane = e.overlayElement, this._isDisposed = !1, this._isInitialRender = !0, this._lastPosition = null, this._resizeSubscription.unsubscribe(), this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
            this._isInitialRender = !0, this.apply()
          })
        }
        apply() {
          if (this._isDisposed || !this._platform.isBrowser) return;
          if (!this._isInitialRender && this._positionLocked && this._lastPosition) return void this.reapplyLastPosition();
          this._clearPanelClasses(), this._resetOverlayElementStyles(), this._resetBoundingBoxStyles(), this._viewportRect = this._getNarrowedViewportRect(), this._originRect = this._getOriginRect(), this._overlayRect = this._pane.getBoundingClientRect();
          const e = this._originRect,
            t = this._overlayRect,
            r = this._viewportRect,
            i = [];
          let s;
          for (let o of this._preferredPositions) {
            let a = this._getOriginPoint(e, o),
              l = this._getOverlayPoint(a, t, o),
              c = this._getOverlayFit(l, t, r, o);
            if (c.isCompletelyWithinViewport) return this._isPushed = !1, void this._applyPosition(o, a);
            this._canFitWithFlexibleDimensions(c, l, r) ? i.push({
              position: o,
              origin: a,
              overlayRect: t,
              boundingBoxRect: this._calculateBoundingBoxRect(a, o)
            }) : (!s || s.overlayFit.visibleArea < c.visibleArea) && (s = {
              overlayFit: c,
              overlayPoint: l,
              originPoint: a,
              position: o,
              overlayRect: t
            })
          }
          if (i.length) {
            let o = null,
              a = -1;
            for (const l of i) {
              const c = l.boundingBoxRect.width * l.boundingBoxRect.height * (l.position.weight || 1);
              c > a && (a = c, o = l)
            }
            return this._isPushed = !1, void this._applyPosition(o.position, o.origin)
          }
          if (this._canPush) return this._isPushed = !0, void this._applyPosition(s.position, s.originPoint);
          this._applyPosition(s.position, s.originPoint)
        }
        detach() {
          this._clearPanelClasses(), this._lastPosition = null, this._previousPushAmount = null, this._resizeSubscription.unsubscribe()
        }
        dispose() {
          this._isDisposed || (this._boundingBox && vi(this._boundingBox.style, {
            top: "",
            left: "",
            right: "",
            bottom: "",
            height: "",
            width: "",
            alignItems: "",
            justifyContent: ""
          }), this._pane && this._resetOverlayElementStyles(), this._overlayRef && this._overlayRef.hostElement.classList.remove(VS), this.detach(), this._positionChanges.complete(), this._overlayRef = this._boundingBox = null, this._isDisposed = !0)
        }
        reapplyLastPosition() {
          if (!this._isDisposed && (!this._platform || this._platform.isBrowser)) {
            this._originRect = this._getOriginRect(), this._overlayRect = this._pane.getBoundingClientRect(), this._viewportRect = this._getNarrowedViewportRect();
            const e = this._lastPosition || this._preferredPositions[0],
              t = this._getOriginPoint(this._originRect, e);
            this._applyPosition(e, t)
          }
        }
        withScrollableContainers(e) {
          return this._scrollables = e, this
        }
        withPositions(e) {
          return this._preferredPositions = e, -1 === e.indexOf(this._lastPosition) && (this._lastPosition = null), this._validatePositions(), this
        }
        withViewportMargin(e) {
          return this._viewportMargin = e, this
        }
        withFlexibleDimensions(e = !0) {
          return this._hasFlexibleDimensions = e, this
        }
        withGrowAfterOpen(e = !0) {
          return this._growAfterOpen = e, this
        }
        withPush(e = !0) {
          return this._canPush = e, this
        }
        withLockedPosition(e = !0) {
          return this._positionLocked = e, this
        }
        setOrigin(e) {
          return this._origin = e, this
        }
        withDefaultOffsetX(e) {
          return this._offsetX = e, this
        }
        withDefaultOffsetY(e) {
          return this._offsetY = e, this
        }
        withTransformOriginOn(e) {
          return this._transformOriginSelector = e, this
        }
        _getOriginPoint(e, t) {
          let r, i;
          if ("center" == t.originX) r = e.left + e.width / 2;
          else {
            const s = this._isRtl() ? e.right : e.left,
              o = this._isRtl() ? e.left : e.right;
            r = "start" == t.originX ? s : o
          }
          return i = "center" == t.originY ? e.top + e.height / 2 : "top" == t.originY ? e.top : e.bottom, {
            x: r,
            y: i
          }
        }
        _getOverlayPoint(e, t, r) {
          let i, s;
          return i = "center" == r.overlayX ? -t.width / 2 : "start" === r.overlayX ? this._isRtl() ? -t.width : 0 : this._isRtl() ? 0 : -t.width, s = "center" == r.overlayY ? -t.height / 2 : "top" == r.overlayY ? 0 : -t.height, {
            x: e.x + i,
            y: e.y + s
          }
        }
        _getOverlayFit(e, t, r, i) {
          const s = HS(t);
          let {
            x: o,
            y: a
          } = e, l = this._getOffset(i, "x"), c = this._getOffset(i, "y");
          l && (o += l), c && (a += c);
          let h = 0 - a,
            f = a + s.height - r.height,
            p = this._subtractOverflows(s.width, 0 - o, o + s.width - r.width),
            m = this._subtractOverflows(s.height, h, f),
            g = p * m;
          return {
            visibleArea: g,
            isCompletelyWithinViewport: s.width * s.height === g,
            fitsInViewportVertically: m === s.height,
            fitsInViewportHorizontally: p == s.width
          }
        }
        _canFitWithFlexibleDimensions(e, t, r) {
          if (this._hasFlexibleDimensions) {
            const i = r.bottom - t.y,
              s = r.right - t.x,
              o = jS(this._overlayRef.getConfig().minHeight),
              a = jS(this._overlayRef.getConfig().minWidth),
              c = e.fitsInViewportHorizontally || null != a && a <= s;
            return (e.fitsInViewportVertically || null != o && o <= i) && c
          }
          return !1
        }
        _pushOverlayOnScreen(e, t, r) {
          if (this._previousPushAmount && this._positionLocked) return {
            x: e.x + this._previousPushAmount.x,
            y: e.y + this._previousPushAmount.y
          };
          const i = HS(t),
            s = this._viewportRect,
            o = Math.max(e.x + i.width - s.width, 0),
            a = Math.max(e.y + i.height - s.height, 0),
            l = Math.max(s.top - r.top - e.y, 0),
            c = Math.max(s.left - r.left - e.x, 0);
          let u = 0,
            d = 0;
          return u = i.width <= s.width ? c || -o : e.x < this._viewportMargin ? s.left - r.left - e.x : 0, d = i.height <= s.height ? l || -a : e.y < this._viewportMargin ? s.top - r.top - e.y : 0, this._previousPushAmount = {
            x: u,
            y: d
          }, {
            x: e.x + u,
            y: e.y + d
          }
        }
        _applyPosition(e, t) {
          if (this._setTransformOrigin(e), this._setOverlayElementStyles(t, e), this._setBoundingBoxStyles(t, e), e.panelClass && this._addPanelClasses(e.panelClass), this._lastPosition = e, this._positionChanges.observers.length) {
            const r = this._getScrollVisibility(),
              i = new U$(e, r);
            this._positionChanges.next(i)
          }
          this._isInitialRender = !1
        }
        _setTransformOrigin(e) {
          if (!this._transformOriginSelector) return;
          const t = this._boundingBox.querySelectorAll(this._transformOriginSelector);
          let r, i = e.overlayY;
          r = "center" === e.overlayX ? "center" : this._isRtl() ? "start" === e.overlayX ? "right" : "left" : "start" === e.overlayX ? "left" : "right";
          for (let s = 0; s < t.length; s++) t[s].style.transformOrigin = `${r} ${i}`
        }
        _calculateBoundingBoxRect(e, t) {
          const r = this._viewportRect,
            i = this._isRtl();
          let s, o, a, u, d, h;
          if ("top" === t.overlayY) o = e.y, s = r.height - o + this._viewportMargin;
          else if ("bottom" === t.overlayY) a = r.height - e.y + 2 * this._viewportMargin, s = r.height - a + this._viewportMargin;
          else {
            const f = Math.min(r.bottom - e.y + r.top, e.y),
              p = this._lastBoundingBoxSize.height;
            s = 2 * f, o = e.y - f, s > p && !this._isInitialRender && !this._growAfterOpen && (o = e.y - p / 2)
          }
          if ("end" === t.overlayX && !i || "start" === t.overlayX && i) h = r.width - e.x + this._viewportMargin, u = e.x - this._viewportMargin;
          else if ("start" === t.overlayX && !i || "end" === t.overlayX && i) d = e.x, u = r.right - e.x;
          else {
            const f = Math.min(r.right - e.x + r.left, e.x),
              p = this._lastBoundingBoxSize.width;
            u = 2 * f, d = e.x - f, u > p && !this._isInitialRender && !this._growAfterOpen && (d = e.x - p / 2)
          }
          return {
            top: o,
            left: d,
            bottom: a,
            right: h,
            width: u,
            height: s
          }
        }
        _setBoundingBoxStyles(e, t) {
          const r = this._calculateBoundingBoxRect(e, t);
          !this._isInitialRender && !this._growAfterOpen && (r.height = Math.min(r.height, this._lastBoundingBoxSize.height), r.width = Math.min(r.width, this._lastBoundingBoxSize.width));
          const i = {};
          if (this._hasExactPosition()) i.top = i.left = "0", i.bottom = i.right = i.maxHeight = i.maxWidth = "", i.width = i.height = "100%";
          else {
            const s = this._overlayRef.getConfig().maxHeight,
              o = this._overlayRef.getConfig().maxWidth;
            i.height = Le(r.height), i.top = Le(r.top), i.bottom = Le(r.bottom), i.width = Le(r.width), i.left = Le(r.left), i.right = Le(r.right), i.alignItems = "center" === t.overlayX ? "center" : "end" === t.overlayX ? "flex-end" : "flex-start", i.justifyContent = "center" === t.overlayY ? "center" : "bottom" === t.overlayY ? "flex-end" : "flex-start", s && (i.maxHeight = Le(s)), o && (i.maxWidth = Le(o))
          }
          this._lastBoundingBoxSize = r, vi(this._boundingBox.style, i)
        }
        _resetBoundingBoxStyles() {
          vi(this._boundingBox.style, {
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            height: "",
            width: "",
            alignItems: "",
            justifyContent: ""
          })
        }
        _resetOverlayElementStyles() {
          vi(this._pane.style, {
            top: "",
            left: "",
            bottom: "",
            right: "",
            position: "",
            transform: ""
          })
        }
        _setOverlayElementStyles(e, t) {
          const r = {},
            i = this._hasExactPosition(),
            s = this._hasFlexibleDimensions,
            o = this._overlayRef.getConfig();
          if (i) {
            const u = this._viewportRuler.getViewportScrollPosition();
            vi(r, this._getExactOverlayY(t, e, u)), vi(r, this._getExactOverlayX(t, e, u))
          } else r.position = "static";
          let a = "",
            l = this._getOffset(t, "x"),
            c = this._getOffset(t, "y");
          l && (a += `translateX(${l}px) `), c && (a += `translateY(${c}px)`), r.transform = a.trim(), o.maxHeight && (i ? r.maxHeight = Le(o.maxHeight) : s && (r.maxHeight = "")), o.maxWidth && (i ? r.maxWidth = Le(o.maxWidth) : s && (r.maxWidth = "")), vi(this._pane.style, r)
        }
        _getExactOverlayY(e, t, r) {
          let i = {
              top: "",
              bottom: ""
            },
            s = this._getOverlayPoint(t, this._overlayRect, e);
          this._isPushed && (s = this._pushOverlayOnScreen(s, this._overlayRect, r));
          let o = this._overlayContainer.getContainerElement().getBoundingClientRect().top;
          return s.y -= o, "bottom" === e.overlayY ? i.bottom = this._document.documentElement.clientHeight - (s.y + this._overlayRect.height) + "px" : i.top = Le(s.y), i
        }
        _getExactOverlayX(e, t, r) {
          let o, i = {
              left: "",
              right: ""
            },
            s = this._getOverlayPoint(t, this._overlayRect, e);
          return this._isPushed && (s = this._pushOverlayOnScreen(s, this._overlayRect, r)), o = this._isRtl() ? "end" === e.overlayX ? "left" : "right" : "end" === e.overlayX ? "right" : "left", "right" === o ? i.right = this._document.documentElement.clientWidth - (s.x + this._overlayRect.width) + "px" : i.left = Le(s.x), i
        }
        _getScrollVisibility() {
          const e = this._getOriginRect(),
            t = this._pane.getBoundingClientRect(),
            r = this._scrollables.map(i => i.getElementRef().nativeElement.getBoundingClientRect());
          return {
            isOriginClipped: NS(e, r),
            isOriginOutsideView: ng(e, r),
            isOverlayClipped: NS(t, r),
            isOverlayOutsideView: ng(t, r)
          }
        }
        _subtractOverflows(e, ...t) {
          return t.reduce((r, i) => r - Math.max(i, 0), e)
        }
        _getNarrowedViewportRect() {
          const e = this._document.documentElement.clientWidth,
            t = this._document.documentElement.clientHeight,
            r = this._viewportRuler.getViewportScrollPosition();
          return {
            top: r.top + this._viewportMargin,
            left: r.left + this._viewportMargin,
            right: r.left + e - this._viewportMargin,
            bottom: r.top + t - this._viewportMargin,
            width: e - 2 * this._viewportMargin,
            height: t - 2 * this._viewportMargin
          }
        }
        _isRtl() {
          return "rtl" === this._overlayRef.getDirection()
        }
        _hasExactPosition() {
          return !this._hasFlexibleDimensions || this._isPushed
        }
        _getOffset(e, t) {
          return "x" === t ? null == e.offsetX ? this._offsetX : e.offsetX : null == e.offsetY ? this._offsetY : e.offsetY
        }
        _validatePositions() {}
        _addPanelClasses(e) {
          this._pane && Lw(e).forEach(t => {
            "" !== t && -1 === this._appliedPanelClasses.indexOf(t) && (this._appliedPanelClasses.push(t), this._pane.classList.add(t))
          })
        }
        _clearPanelClasses() {
          this._pane && (this._appliedPanelClasses.forEach(e => {
            this._pane.classList.remove(e)
          }), this._appliedPanelClasses = [])
        }
        _getOriginRect() {
          const e = this._origin;
          if (e instanceof ae) return e.nativeElement.getBoundingClientRect();
          if (e instanceof Element) return e.getBoundingClientRect();
          const t = e.width || 0,
            r = e.height || 0;
          return {
            top: e.y,
            bottom: e.y + r,
            left: e.x,
            right: e.x + t,
            height: r,
            width: t
          }
        }
      }

      function vi(n, e) {
        for (let t in e) e.hasOwnProperty(t) && (n[t] = e[t]);
        return n
      }

      function jS(n) {
        if ("number" != typeof n && null != n) {
          const [e, t] = n.split(q$);
          return t && "px" !== t ? null : parseFloat(e)
        }
        return n || null
      }

      function HS(n) {
        return {
          top: Math.floor(n.top),
          right: Math.floor(n.right),
          bottom: Math.floor(n.bottom),
          left: Math.floor(n.left),
          width: Math.floor(n.width),
          height: Math.floor(n.height)
        }
      }
      class G$ {
        constructor(e, t, r, i, s, o, a) {
          this._preferredPositions = [], this._positionStrategy = new BS(r, i, s, o, a).withFlexibleDimensions(!1).withPush(!1).withViewportMargin(0), this.withFallbackPosition(e, t), this.onPositionChange = this._positionStrategy.positionChanges
        }
        get positions() {
          return this._preferredPositions
        }
        attach(e) {
          this._overlayRef = e, this._positionStrategy.attach(e), this._direction && (e.setDirection(this._direction), this._direction = null)
        }
        dispose() {
          this._positionStrategy.dispose()
        }
        detach() {
          this._positionStrategy.detach()
        }
        apply() {
          this._positionStrategy.apply()
        }
        recalculateLastPosition() {
          this._positionStrategy.reapplyLastPosition()
        }
        withScrollableContainers(e) {
          this._positionStrategy.withScrollableContainers(e)
        }
        withFallbackPosition(e, t, r, i) {
          const s = new H$(e, t, r, i);
          return this._preferredPositions.push(s), this._positionStrategy.withPositions(this._preferredPositions), this
        }
        withDirection(e) {
          return this._overlayRef ? this._overlayRef.setDirection(e) : this._direction = e, this
        }
        withOffsetX(e) {
          return this._positionStrategy.withDefaultOffsetX(e), this
        }
        withOffsetY(e) {
          return this._positionStrategy.withDefaultOffsetY(e), this
        }
        withLockedPosition(e) {
          return this._positionStrategy.withLockedPosition(e), this
        }
        withPositions(e) {
          return this._preferredPositions = e.slice(), this._positionStrategy.withPositions(this._preferredPositions), this
        }
        setOrigin(e) {
          return this._positionStrategy.setOrigin(e), this
        }
      }
      const US = "cdk-global-overlay-wrapper";
      class K$ {
        constructor() {
          this._cssPosition = "static", this._topOffset = "", this._bottomOffset = "", this._leftOffset = "", this._rightOffset = "", this._alignItems = "", this._justifyContent = "", this._width = "", this._height = ""
        }
        attach(e) {
          const t = e.getConfig();
          this._overlayRef = e, this._width && !t.width && e.updateSize({
            width: this._width
          }), this._height && !t.height && e.updateSize({
            height: this._height
          }), e.hostElement.classList.add(US), this._isDisposed = !1
        }
        top(e = "") {
          return this._bottomOffset = "", this._topOffset = e, this._alignItems = "flex-start", this
        }
        left(e = "") {
          return this._rightOffset = "", this._leftOffset = e, this._justifyContent = "flex-start", this
        }
        bottom(e = "") {
          return this._topOffset = "", this._bottomOffset = e, this._alignItems = "flex-end", this
        }
        right(e = "") {
          return this._leftOffset = "", this._rightOffset = e, this._justifyContent = "flex-end", this
        }
        width(e = "") {
          return this._overlayRef ? this._overlayRef.updateSize({
            width: e
          }) : this._width = e, this
        }
        height(e = "") {
          return this._overlayRef ? this._overlayRef.updateSize({
            height: e
          }) : this._height = e, this
        }
        centerHorizontally(e = "") {
          return this.left(e), this._justifyContent = "center", this
        }
        centerVertically(e = "") {
          return this.top(e), this._alignItems = "center", this
        }
        apply() {
          if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
          const e = this._overlayRef.overlayElement.style,
            t = this._overlayRef.hostElement.style,
            r = this._overlayRef.getConfig(),
            {
              width: i,
              height: s,
              maxWidth: o,
              maxHeight: a
            } = r,
            l = !("100%" !== i && "100vw" !== i || o && "100%" !== o && "100vw" !== o),
            c = !("100%" !== s && "100vh" !== s || a && "100%" !== a && "100vh" !== a);
          e.position = this._cssPosition, e.marginLeft = l ? "0" : this._leftOffset, e.marginTop = c ? "0" : this._topOffset, e.marginBottom = this._bottomOffset, e.marginRight = this._rightOffset, l ? t.justifyContent = "flex-start" : "center" === this._justifyContent ? t.justifyContent = "center" : "rtl" === this._overlayRef.getConfig().direction ? "flex-start" === this._justifyContent ? t.justifyContent = "flex-end" : "flex-end" === this._justifyContent && (t.justifyContent = "flex-start") : t.justifyContent = this._justifyContent, t.alignItems = c ? "flex-start" : this._alignItems
        }
        dispose() {
          if (this._isDisposed || !this._overlayRef) return;
          const e = this._overlayRef.overlayElement.style,
            t = this._overlayRef.hostElement,
            r = t.style;
          t.classList.remove(US), r.justifyContent = r.alignItems = e.marginTop = e.marginBottom = e.marginLeft = e.marginRight = e.position = "", this._overlayRef = null, this._isDisposed = !0
        }
      }
      let Q$ = (() => {
          class n {
            constructor(t, r, i, s) {
              this._viewportRuler = t, this._document = r, this._platform = i, this._overlayContainer = s
            }
            global() {
              return new K$
            }
            connectedTo(t, r, i) {
              return new G$(r, i, t, this._viewportRuler, this._document, this._platform, this._overlayContainer)
            }
            flexibleConnectedTo(t) {
              return new BS(t, this._viewportRuler, this._document, this._platform, this._overlayContainer)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(Ea), _(O), _(Ae), _(rg))
          }, n.\u0275prov = M({
            factory: function () {
              return new n(_(Ea), _(O), _(Ae), _(rg))
            },
            token: n,
            providedIn: "root"
          }), n
        })(),
        Y$ = 0,
        ig = (() => {
          class n {
            constructor(t, r, i, s, o, a, l, c, u, d, h) {
              this.scrollStrategies = t, this._overlayContainer = r, this._componentFactoryResolver = i, this._positionBuilder = s, this._keyboardDispatcher = o, this._injector = a, this._ngZone = l, this._document = c, this._directionality = u, this._location = d, this._outsideClickDispatcher = h
            }
            create(t) {
              const r = this._createHostElement(),
                i = this._createPaneElement(r),
                s = this._createPortalOutlet(i),
                o = new FS(t);
              return o.direction = o.direction || this._directionality.value, new W$(s, r, i, o, this._ngZone, this._keyboardDispatcher, this._document, this._location, this._outsideClickDispatcher)
            }
            position() {
              return this._positionBuilder
            }
            _createPaneElement(t) {
              const r = this._document.createElement("div");
              return r.id = "cdk-overlay-" + Y$++, r.classList.add("cdk-overlay-pane"), t.appendChild(r), r
            }
            _createHostElement() {
              const t = this._document.createElement("div");
              return this._overlayContainer.getContainerElement().appendChild(t), t
            }
            _createPortalOutlet(t) {
              return this._appRef || (this._appRef = this._injector.get(ti)), new k$(t, this._componentFactoryResolver, this._appRef, this._injector, this._document)
            }
          }
          return n.\u0275fac = function (t) {
            return new(t || n)(_(j$), _(rg), _(Xn), _(Q$), _($$), _(he), _(z), _(O), _(ma), _(Qo), _(z$))
          }, n.\u0275prov = M({
            token: n,
            factory: n.\u0275fac
          }), n
        })();
      const J$ = {
        provide: new P("cdk-connected-overlay-scroll-strategy"),
        deps: [ig],
        useFactory: function (n) {
          return () => n.scrollStrategies.reposition()
        }
      };
      let e3 = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            providers: [ig, J$],
            imports: [
              [_a, OS, RS], RS
            ]
          }), n
        })(),
        s3 = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            imports: [
              [mS, en], en
            ]
          }), n
        })(),
        h3 = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n
          }), n.\u0275inj = de({
            imports: [
              [e3, OS, Af, s3, en], en
            ]
          }), n
        })(),
        p3 = (() => {
          class n {}
          return n.\u0275fac = function (t) {
            return new(t || n)
          }, n.\u0275mod = ge({
            type: n,
            bootstrap: [HU]
          }), n.\u0275inj = de({
            providers: [],
            imports: [
              [Vf, P2, eU, h3, bU, BU]
            ]
          }), n
        })();
      (function () {
        if (yC) throw new Error("Cannot enable prod mode after platform setup.");
        _C = !1
      })(), jL().bootstrapModule(p3).catch(n => console.error(n))
    }
  },
  Vs => {
    Vs(Vs.s = 414)
  }
]);
