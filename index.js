new Promise((resolve, reject) => {
  // throw new Error('error')
  setTimeout(() => {
    resolve('sssssss')
  }, 500)
}).then(v => {
  console.log('v1:', v)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Promise(r => {
        r('333333333')
      }))
    }, 500)
  })
}, r => {
  console.log('r:', r)
}).then(v => {
  console.log('v2:', v)
})