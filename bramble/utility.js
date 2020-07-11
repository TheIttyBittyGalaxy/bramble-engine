function ensureValue(obj, index, value) {
  if (!obj[index]) obj[index] = value;
  return obj[index];
}

function removeValue(obj, value) {
  let i = obj.indexOf(value);
  if (i > -1) {
    obj.splice(i, 1);
    return true;
  }
  return false
}
