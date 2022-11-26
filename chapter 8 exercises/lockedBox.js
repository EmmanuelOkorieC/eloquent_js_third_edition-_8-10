const box = {
    locked: true,
    unlock() { this.locked = false },
    lock() { this.locked = true },
    _content: [],
    get content() {
      if (this.locked) throw new Error("Locked!");
      return this._content;
    }
  } 
// box.unlock()
function withBoxUnlocked(body) {
 let progress = 0
 try {
 if(box.locked) {
   box.unlock()
   progress = 1
 }
 body()
} finally {
  if(progress == 1)  box.lock()
}
}

withBoxUnlocked(function() {
box.content.push("gold piece");
})
    
try {
withBoxUnlocked(function() {
throw new Error("Pirates on the horizon! Abort!");
})
} catch (e) {
console.log("Error raised:", e);
}
    
console.log(box.locked);
// console.log(box.content)