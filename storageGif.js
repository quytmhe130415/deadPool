function saveGif() {
  let values= [],
    keys = Object.keys(localStorage),
    for (let index = 0; index < keys.length; index++) {
      values.push(localStorage.getItem(keys[i])); 
    }
  return values;
}
module.exports = { saveGif };