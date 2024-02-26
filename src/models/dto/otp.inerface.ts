export interface otpSchema {
    username : number | string,
    token : string,
    otp : string | number
}

export interface matchWithData {
    username : number | string,
    otp : string | number
}