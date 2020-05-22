class Promise {
  constructor (executor) {
    if (typeof executor !== 'function') {
      throw new Error(`Promise resolver ${executor} in not a function`)
    }
    
    const resolve = () => {
    
    }

    const reject = () => {
    
    }

    executor(resolve, reject)
  }
}

module.exports = Promise