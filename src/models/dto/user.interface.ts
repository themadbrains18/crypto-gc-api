export interface registerUser {
    username: string,
    password: string,
    number? : string,
    email? : string, 
    confirmPassword: true,
    termAndCondition: string,
    id : string,
    refeer_code? : string,
    own_code?:string,
    secret?:string,
  }


  export interface loginUser {
    otp? : string | number
    // username : string | number,
    email? : string,
    number? : string | number,
    password : string | number
  }
