class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
 if((Math.round(Math.random() * 100)) <= 20) {
    return a * b
 } else {
  throw new MultiplicatorUnitFailure('Failed to multiply')
 }
}

function trial(a, b) {
    for(;;) {
      try {
       let result = primitiveMultiply(a, b)
       console.log(result)
       break
      }
      catch(e) {
        if (e instanceof MultiplicatorUnitFailure) console.error(e)
        else throw e
      }
    }
  }
  trial(12, 5)