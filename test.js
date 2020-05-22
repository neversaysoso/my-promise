const Promise = require('./promise')

new Promise((resolve, reject) => {
  // console.log('开始')
  // throw new Error('error')
  setTimeout(() => {
    resolve('sssssss')
  }, 2000)
}).then(v => {
  console.log(`v:${v}`)
}, r => {
  console.log(`r:${r}`)
})