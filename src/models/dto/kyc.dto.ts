export default interface kycDto {
    id?: string;
    userid: string;
    country: string;
    fname: string;
    // lname: string;
    doctype: string;
    docnumber: string;
    idfront: string;
    idback :string;
    statement :string;
    isVerified :boolean;
    isReject : boolean;
    destinationPath?: string;
    dob: Date;
  }
  