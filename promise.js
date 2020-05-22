const PENDING = 'pending'
const FULFULLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === PENDING) {
        this.state = FULFULLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor.call(this, resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    }

    let promise = new Promise((resolve, reject) => {
      if (this.state === FULFULLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise
  }

  catch (cb) {
    return this.then(null, cb)
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, value => {
          if (called) return
          called = true
          resolvePromise(promise, value, resolve, reject)
        }, reason => {
          if (called) return
          called = true
          reject(reason)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.deferred = function () {
  const defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = Promise