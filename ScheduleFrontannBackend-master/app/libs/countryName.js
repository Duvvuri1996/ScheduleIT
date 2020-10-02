const callingCodes = require('/home/sowmya/Meeting-Organizer-app/scheduleitBackend-master/node_modules/country-json/src/country-by-calling-code')

console.log(callingCodes[0])
let countryCallingCode = (country) => {
    for (x of callingCodes){
        if(country === x.country){
            telCode = x.calling_code
            console.log(telCode)
            return telCode
        }
    }
}

module.exports = {
    countryCallingCode : countryCallingCode
}
