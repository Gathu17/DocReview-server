function randomString(){
    const len = 10
    var arr = ['a', 'b', 'c', 'd', 'e', 'f','1','2','3','4','5','6','7','8','9']
    let rand = ''
    for(let i = 0; i < len; i++){
        var ch = Math.floor(Math.random() * arr.length)
        rand += arr[ch]
    }
    return rand
}
module.exports = {randomString}