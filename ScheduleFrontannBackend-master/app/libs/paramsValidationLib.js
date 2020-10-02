let Email = (email) => {
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(emailFormat)) {
        return email
    } else {
        return false
    }
}

//Minimum 6 Characters with 
let Password = (password) => {
    //\w{7,} match any string which contains sequence of atleast 7 word characters 
    let passwordFormat = /^[A-Za-z0-9]\w{7,}$/
    if(password.match(passwordFormat)) {
        return password
    } else {
        return false
    }
}

module.exports = {
    Email : Email,
    Password : Password
}