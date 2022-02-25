const dobCheck = (dob) => {
  const date = new Date();

  const currentYearMinYear = (parseInt(date.getFullYear()) - 13);
  const userBirthYear = parseInt(dob.split("-")[0])
  
  if (userBirthYear > currentYearMinYear) {
    return false
  }

  return true
}

const stringsCorrectLength = (strings, minLength, maxLength) => {
  for (let string of strings) {
    if (string.length < minLength || string.length > maxLength) {
      return false
    }
  }
  return true
}

const validString = (string) => {
  string = string.replace(/^[0-9]/ig, "");

  string = string.replace(/[!"£$%^&*()-/.,?<>;'#:@~|]/ig, "");

  return string
}

module.exports = {
  dobCheck,
  stringsCorrectLength,
  validString
}