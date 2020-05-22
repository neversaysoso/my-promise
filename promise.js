class Promise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new Error(`Promise resolver ${executor} in not a function`)
    }

    this.initValue()
    this.initBind()

    try {
      executor.call(this, this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  initValue() {
    this.value = null
    this.reason = null
    // 不可逆 pending fulfilled rejected
    this.state = Promise.PENDING
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
  }

  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(value) {
    // 状态改变 成功回调执行
    if (this.state === Promise.PENDING) {
      this.state = Promise.FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(this.value))
    }
  }

  reject(reason) {
    // 状态改变 失败回调执行
    if (this.state === Promise.PENDING) {
      this.state = Promise.REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn(this.reason))
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = value => {
        return value
      }
    }

    if (typeof onRejected !== 'function') {
      onRejected = reason => {
        return reason
      }
    }

    if (this.state === Promise.FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.value)
      })
    }

    if (this.state === Promise.REJECTED) {
      setTimeout(() => {
        onRejected(this.reason)
      })
    }

    if (this.state === Promise.PENDING) {
      this.onFulfilledCallbacks.push(value => {
        setTimeout(() => {
          onFulfilled(this.value)
        })
      })

      this.onRejectedCallbacks.push(reason => {
        setTimeout(() => {
          onRejected(this.reason)
        })
      })
    }
  }
}

Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'

module.exports = Promise