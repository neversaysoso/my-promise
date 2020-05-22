new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve(1)
  }, 1000)
}).then(v => {
  console.log(v)
}, r => {
  console.log(r)
})