const {set, get} = require('./redis')

const test = async () => {
  try {
    await set('test', 'test value')
    console.log(await get('test'))
  } catch (error) {
    console.log(error)
  }
}

test()