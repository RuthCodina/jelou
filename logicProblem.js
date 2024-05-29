let arr = [1,2,3,4,5]

function totalScore(arr){
  let score = 0
  for (let i= 0; i < arr.length; i++ ) {
    if (arr[i] % 2 != 0) {
      if (arr[i] == 5) {
        score = score + 5
        continue
      }
      score = score + 3
      continue
    }
    score = score + 1
  }
  return score
}


console.log(totalScore(arr))