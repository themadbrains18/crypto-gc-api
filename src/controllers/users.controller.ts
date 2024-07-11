import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";


import { loginUser, registerUser } from "../models/dto/user.interface";

//email service
import otpGenrate from "../utils/otp.genrate";
import userModel, { UserInput } from "../models/model/users.model";
import service from "../services/service";
import {
  updateFundcode,
  updatepassword,
  checkUser,
  googleAuth,
  updateUserStatus,
  updateUserPin,
  antiPhishingCode,
  updateWhiteList,
} from "../utils/interface";
import covalenthq from "../blockchain/scaner/covalenthq";
import { lastLoginModel, userJwtTokenModel } from "../models";
import { profileInput } from "../models/model/profile.model";



class userController extends BaseController {

  protected async executeImpl(
    req: Request,
    res: Response
  ): Promise<void | any> {
    try {
      // ... Handle request by creating objects
    } catch (error: any) {
      return super.fail(res, error.toString());
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user: registerUser = req.body;

      let regx = /^[6-9]\d{9}$/;
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

      let flag = "";

      // verify provide username is
      if (regx.test(user?.username)) flag = "number";

      if (regex.test(user?.username)) flag = "email";

      // validate email & phone number
      if (flag == "") {
        return super.forbidden(
          res,
          `Please enter valid phone number or email.`
        );
      }

      //  recogonize user provided phone / email
      if (flag == "number") user.number = user?.username;
      if (flag == "email") user.email = user?.username;

      // check refer code available or not
      if (user?.refeer_code != "") {
        let referCodeExist = await service.user.checkUserReferCodeExist(user?.refeer_code);
        if (!referCodeExist) {
          return super.fail(res, `Please enter an valid referal code. Please try again`);
        }
      }
      //   check if user already exist
      let userExist: any = await service.user.checkIfUserExsit(user?.username);

      let message;
      if (userExist?.success === true) {
        let message = flag == "number" ? "phone number" : "email address";
        return super.fail(res, `An account with this ${message} already exists.`);
        // throw new Error();
      }

      if (userExist?.success === false && req.body?.step == 1) {
        return super.ok<any>(res, "send otp");
      }

      if (
        req.body.otp === "string" ||
        req.body.otp === "" ||
        req.body.otp === null
      ) {
        //SEND VERIFICATION MAIL TO USER
        if (flag == "email") {
          //  send email otp to user
          let otp: any = await service.otpGenerate.createOtpForUser(user);
          const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

          let emailResponse = await service.emailService.sendMail(
            req.headers["X-Request-Id"],
            {
              to: user.username,
              subject: "Verify OTP",
              html: emailTemplate.html,
            }
          );

          // if (
          //   emailResponse?.accepted != undefined &&
          //   emailResponse?.accepted?.length > 0
          // ) {
          //   return super.ok<any>(res, "Mail sent successfully!!");
          // }
          delete otp["otp"];
          return super.ok<any>(res, { message: "OTP sent in your inbox. please verify your otp", otp });

        }
        else {
          let otp: any = await service.otpGenerate.createOtpForUser(user);

          let response = await fetch('https://www.fast2sms.com/dev/bulkV2?authorization=6ElMeqCL34x7iskWctpVyGRZ52PfKbJNhuOoFUYvnrjXI8T0AaI64E2FnHjecMJXPqDbTd7QCKiWhuZg&route=otp&variables_values=' + Number(otp.otp) + '&flash=1&numbers=' + user?.username)

          console.log(await response.json(), "===fdjkhfjkdh");


          delete otp["otp"];
          return super.ok<any>(res, { message: "OTP sent in your phone. please verify your otp", otp });
        }
      } else {
        let userOtp;
        userOtp = {
          username: user.username,
          otp: req.body?.otp,
        };
        let result = await service.otpService.matchOtp(userOtp);
        if (result.success) {
          //   normal password connect into hash
          user.password = await service.bcypt.MDB_crateHash(user.password);
          user.refeer_code = req.body.refeer_code;
          user.own_code = await service.otpGenerate.referalCodeGenerate();
          user.secret = await service.otpGenerate.secretCodeGenerate();

          let newuser: any = await service.user.create(user);

          var string =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let code = "";

          // Find the length of string
          var len = string.length;
          for (let i = 0; i < 6; i++) {
            code += string[Math.floor(Math.random() * len)];
          }
          let profile: profileInput = {
            user_id: newuser?.id,
            dName: 'CPUSER-' + code,
            uName: 'CPUSER-' + code,
          };
          await service.profile.create(profile);

          service.walletService.allWallets(newuser?.id);
          //SENDING RESPONSE
          return super.ok<any>(res, newuser);
        } else {
          return super.fail(res, result.message);
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *login(req
   * @param req
   * @param res
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {

      // console.log(req.body,'---------body');

      let TOKEN_KEY =
        process.env.TOKEN_KEY ||
        "$2b$10$oy2o.eHnBE1bZMyAkj4GQ.j0nT4ceDBNU7PZ71Tjp19Mpwf0.NGlW";
      let user: UserInput = req.body;
      let login = await service.user.login(user);

      if (login.success == false) {
        return super.fail(res, `Username or password is incorrect.`);
      }

      login = login.data;

      // console.log(login,'----------------------');
      if (req.body.loginType === 'admin' && login.role === 'user') {
        return super.fail(res, 'You have not access to admin account.');
      }

      if (login && req.body?.step === 1) {
        return super.ok<any>(res, { message: "User Matched!!", login });
      }

      let userOtp;
      // let regx = /^[6-9]\d{9}$/;
      // let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

      let flag = "";

      // // verify provide username is
      flag = login?.email ? "email" : "number"

      if (
        req.body?.otp === "string" ||
        req.body?.otp === "" ||
        req.body?.otp === null
      ) {
        userOtp = { username: login?.email ? login?.email : login?.number };
        if (flag == "email") {
          let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

          const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

          service.emailService.sendMail(req.headers["X-Request-Id"], {
            to: userOtp.username,
            subject: "Verify OTP",
            html: emailTemplate.html,
          });

          // Return a 200
          delete otp["otp"];
          super.ok<any>(
            res,
            { message: "OTP sent in your inbox. please verify your otp", otp }
          );
        }
        else {
          let otp: any = await service.otpGenerate.createOtpForUser(userOtp);
          let response = await fetch('https://www.fast2sms.com/dev/bulkV2?authorization=6ElMeqCL34x7iskWctpVyGRZ52PfKbJNhuOoFUYvnrjXI8T0AaI64E2FnHjecMJXPqDbTd7QCKiWhuZg&route=otp&variables_values=' + Number(otp.otp) + '&flash=1&numbers=' + userOtp?.username)

          console.log(await response.json(), "===fdjkhfjkdh");


          delete otp["otp"];
          return super.ok<any>(res, { message: "OTP sent in your phone. please verify your otp", otp });
        }
      } else {
        //  send email otp to user

        if (req.body?.otp) {
          userOtp = {
            username: login?.email ? login?.email : login?.number,
            otp: req.body?.otp,
          };

          let result = await service.otpService.matchOtp(userOtp);

          if (result.success === true) {
            lastLoginModel
              .findOne({
                where: { user_id: login?.id },
                order: [["loginTime", "DESC"]],
                raw: true,
              })
              .then((userDetail: any) => {
                if (userDetail) {
                  let obj = {
                    user_id: login?.id,
                    loginTime: Date.now(),
                    lastLogin: userDetail?.loginTime,
                    location: req?.body?.location,
                    region: req?.body?.region,
                    ip: req?.body?.ip,
                    browser: req?.body?.browser,
                    os: req?.body?.browser,
                    deviceType: req.body?.deviceType,
                  };
                  lastLoginModel
                    .create(obj)
                    .then((updateRecord) => {
                      if (updateRecord) {
                        return updateRecord;
                      }
                    })
                    .catch((error) => {
                      console.log("=====error1", error);
                    });
                } else {
                  let obj = {
                    user_id: login?.id,
                    loginTime: Date.now(),
                    lastLogin: Date.now(),
                    location: req?.body?.location,
                    region: req?.body?.region,
                    ip: req?.body?.ip,
                    os: req?.body?.os,
                    browser: req?.body?.browser,
                    deviceType: req.body?.deviceType,
                  };
                  let data = lastLoginModel
                    .create(obj)
                    .then((updateRecord) => {
                      if (updateRecord) {
                        return updateRecord;
                      }
                    })
                    .catch((error) => {
                      console.log("=====error2", error);
                    });
                }
              })
              .catch((error) => {
                console.error("====", error);
              });

            delete login["password"];
            delete login["otpToken"];
            // Create token
            let token = await service.jwt.sign({
              user_id: login.id,
              username: login?.email ? login?.email : login.number,
              role: login?.role,
            });

            login.access_token = token;
            let jwtToken = await userJwtTokenModel.findOne({ where: { user_id: login.id }, raw: true });
            if (jwtToken) {
              await userJwtTokenModel.update({ token: token }, { where: { user_id: login.id } });
            }
            else {
              await userJwtTokenModel.create({ user_id: login.id, token: token });
            }

            return super.ok<any>(res, {
              status: "success",
              message: "Your account has successfully logged-in.",
              token: token,
              user: login,
            });
          } else {
            return super.fail(res, result.message);
          }
        }
      }
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  }

  /**
   *checkUser(
   * @param req
   * @param res
   */
  async checkUser(req: Request, res: Response) {
    try {

      let user = await userModel.findOne({
        where: { id: req.body.user_id },
        raw: true,
      });

      return super.ok<any>(res, user);
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }

  /**
   *userAuthen
   * @param req
   * @param res
   */
  userAuthenticate(req: Request, res: Response) { }

  /**
   *updateUser
   * @param req
   * @param res
   */
  async updateUser(req: Request, res: Response) {
    try {
      // let user = await service.user.checkIfUserExsit(req?.body?.username);
      let alreadyExist: any = await service.user.checkIfUserExsit(req?.body?.data);
      let regx = /^[6-9]\d{9}$/;
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

      let flag = "";

      if (regx.test(req.body?.data)) flag = "number";

      if (regex.test(req.body?.data)) flag = "email";

      if (alreadyExist.success === true) {
        return super.fail(
          res,
          `This ${flag} is already exist. Try another ${flag}`
        );
      } else {
        let userOtp;
        let userNewOtp;
        if (
          req.body?.otp === "string" ||
          req.body?.otp === "" ||
          req.body?.otp === null
        ) {
          userOtp = { username: req?.body?.step === 1 ? req?.body?.data : req?.body?.username };
          // userNewOtp = { username: req?.body?.data };
          let otp: any = await service.otpGenerate.createOtpForUser(userOtp);
          // let otp2: any = await service.otpGenerate.createOtpForUser(userNewOtp);
          const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);
          // const newEmailTemplate = service.emailTemplate.otpVerfication(
          //   `${otp2?.otp}`
          // );

          service.emailService.sendMail(
            req.headers["X-Request-Id"],
            {
              to: userOtp?.username,
              subject: "Verify OTP",
              html: emailTemplate.html,
            }
          );

          // let emailResponse2 = service.emailService.sendMail(
          //   req.headers["X-Request-Id"],
          //   {
          //     to: userNewOtp.username,
          //     subject: "Verify OTP",
          //     html: newEmailTemplate.html,
          //   }
          // );

          return super.ok<any>(res, {
            message: "OTP sent in your inbox. please verify your otp", otp
          });
        }
        else {
          if (req.body?.otp) {
            let username =
              req?.body?.password == "" ? req?.body?.data : req?.body?.username;

            userOtp = {
              username: username,
              otp: req.body?.otp,
            };
            let result = await service.otpService.matchOtp(userOtp);
            if (result.success) {
              if (req?.body?.password == "") {
                super.ok<any>(res, { result });
              } else {
                let user: UserInput = req.body;
                user.id = req.body.user_id;
                if (flag === "email") {
                  user.email = req.body.data;
                } else {
                  user.number = req.body.data;
                }
                let userResponse = await service.user.updateUser(user);
                // console.log(userResponse);

                // if(userResponse)
                super.ok<any>(res, {
                  data: "User update successfully.",
                });
              }
            } else {
              return super.fail(res, result.message);
            }
          }
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *verifyGoog
   * @param req
   * @param res
   */
  // async verifyGoogleAuth(req: Request, res: Response) {
  //   try {
  //     let user = await service.user.checkIfUserExsit(req?.body?.username);
  //     if (user) {
  //       let userOtp;
  //       if (
  //         req.body?.otp === "string" ||
  //         req.body?.otp === "" ||
  //         req.body?.otp === null
  //       ) {
  //         //  send email otp to user
  //         userOtp = { username: req?.body?.username };

  //         let otp = await service.otpGenerate.createOtpForUser(userOtp);

  //         // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);

  //         // service.emailService.sendMail(req.headers["X-Request-Id"], {
  //         //   to: userOtp.username,
  //         //   subject: "Verify OTP",
  //         //   html: emailTemplate.html,
  //         // });

  //         super.ok<any>(res, { message: "OTP sent in your inbox. please your verify otp", otp });
  //       } else {

  //         if (req.body?.otp) {
  //           userOtp = {
  //             username: req?.body?.username,
  //             otp: req.body?.otp,
  //           };

  //           let result = await service.otpService.matchOtp(userOtp);

  //           if (result.success === true) {

  //             let user: any = await userModel.findOne({
  //               where: { id: req?.body?.user_id },
  //               raw: true,
  //             });

  //             let pass = service.bcypt.MDB_compareHash(
  //               `${req?.body?.password}`,
  //               user?.password
  //             );

  //             if (pass) {
  //               let pwdData: googleAuth = req.body;

  //               pwdData.TwoFA = user?.TwoFA === true || user?.TwoFA === 1 ? false : true;

  //               let pwdResponse = await service.user.googleAuth(pwdData);

  //               if (pwdResponse === true) {

  //                 user = await userModel.findOne({
  //                   where: { id: req?.body?.user_id },
  //                   raw: true,
  //                 });

  //                 super.ok<any>(res, {
  //                   message: `Two Factor Authentication ${user.TwoFA === true || user.TwoFA ? 'Enabled' : 'Disabled'}!!.`,
  //                   result: user.TwoFA === true || user.TwoFA === 1 ? true : false,
  //                 });
  //               }
  //               else {
  //                 return super.fail(res, 'Google security code not matched');
  //               }

  //             }
  //             else {
  //               return super.fail(res, 'Password not matched');
  //             }
  //           }
  //           else {
  //             return super.fail(res, result.message);
  //           }

  //         }
  //       }
  //     }
  //   } catch (error: any) {
  //     super.fail(res, error.message);
  //   }
  // }


  async verifyGoogleAuth(req: Request, res: Response) {
    try {
      let userExist = await service.user.checkIfUserExsit(req?.body?.username);
      if (userExist) {
        let user: any = await userModel.findOne({
          where: { id: req?.body?.user_id },
          raw: true,
        });

        let pass = service.bcypt.MDB_compareHash(
          `${req?.body?.password}`,
          user?.password
        );

        if (pass) {
          let pwdData: googleAuth = req.body;

          pwdData.TwoFA = user?.TwoFA === true || user?.TwoFA === 1 ? false : true;

          let pwdResponse = await service.user.googleAuth(pwdData);

          if (pwdResponse === true) {

            user = await userModel.findOne({
              where: { id: req?.body?.user_id },
              raw: true,
            });

            super.ok<any>(res, {
              message: `Two Factor Authentication ${user.TwoFA === true || user.TwoFA ? 'Enabled' : 'Disabled'}!!.`,
              result: user.TwoFA === true || user.TwoFA === 1 ? true : false,
            });
          }
          else {
            return super.fail(res, 'Google security code not matched');
          }

        }
        else {
          return super.fail(res, 'Password not matched');
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *updatePass
   * @param req
   * @param res
   */
  async updatePassword(req: Request, res: Response) {
    try {
      if (req.body.type === "forget") {
        let user: any = await service.user.checkIfUserExsit(
          req?.body?.username
        );
        if (user.success == false) {
          return super.fail(res, `Account doesn't exist`);
        }

        if (user.success == true) {
          let userOtp;
          if (
            req.body?.otp === "string" ||
            req.body?.otp === "" ||
            req.body?.otp === null
          ) {
            //  send email otp to user
            userOtp = { username: req?.body?.username };
            let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

            const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

            service.emailService.sendMail(req.headers["X-Request-Id"], {
              to: userOtp.username,
              subject: "Verify OTP",
              html: emailTemplate.html,
            });

            delete otp["otp"];
            super.ok<any>(
              res,
              { message: "OTP sent in your inbox. please verify your otp", otp }
            );
          } else {
            if (req.body?.otp) {

              userOtp = {
                username: req?.body?.username,
                otp: req.body?.otp,
              };

              if (req.body.step === 3) {
                let result = await service.otpService.matchOtp(userOtp);
                if (result.success === true) {

                  return super.ok<any>(res, { status: 200, message: "OTP matched" });
                } else {
                  return super.fail(res, result.message);
                }
              }
              if (req.body.step === 4) {

                let pass = service.bcypt.MDB_compareHash(
                  `${req.body.new_password}`,
                  user?.data?.dataValues?.password
                );

                if (pass) {
                  super.fail(res, 'Password should not be same as previous password!!');
                } else {
                  let pwdData: updatepassword = req.body;
                  pwdData.user_id = user?.data?.dataValues?.id;

                  let pwdResponse = await service.user.updatePassword(pwdData);

                  // Delete sensitive fields from the cloned response
                  await delete pwdResponse?.password;
                  await delete pwdResponse?.tradingPassword;

                  const emailTemplate = service.emailTemplate.passwordMail();

                  service.emailService.sendMail(req.headers["X-Request-Id"], {
                    to: userOtp.username,
                    subject: "Password Update",
                    html: emailTemplate.html,
                  });
                  super.ok<any>(res, {
                    status: 200,
                    message: "Password update successfully!!.",
                    result: pwdResponse,
                  });
                }
              }

            }
          }
        } else {
          return super.fail(res, "Old Password not matched. Please try again.");
        }
      }
      else {
        let isMatched = await service.user.confirmPassword(req?.body);

        let user: any = await service.user.checkIfUserExsit(
          req?.body?.username
        );

        if (isMatched) {
          if (req.body.step === 1) {
            let pass = service.bcypt.MDB_compareHash(
              `${req.body.new_password}`,
              user?.data?.dataValues?.password
            );

            if (pass) {
              return super.fail(res, 'Password should not be same as previous password!!');
            } else {
              return super.ok<any>(res, "User matched");
            }
          }
          let userOtp;
          if (
            req.body?.otp === "string" ||
            req.body?.otp === "" ||
            req.body?.otp === null
          ) {
            //  send email otp to user
            userOtp = { username: req?.body?.username };
            let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

            const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

            service.emailService.sendMail(req.headers["X-Request-Id"], {
              to: userOtp.username,
              subject: "Verify OTP",
              html: emailTemplate.html,
            });
            delete otp["otp"];
            super.ok<any>(
              res,
              { message: "OTP sent in your inbox. please verify your otp", otp }
            );
          } else {
            if (req.body?.otp) {
              userOtp = {
                username: req?.body?.username,
                otp: req.body?.otp,
              };

              let result = await service.otpService.matchOtp(userOtp);
              if (result.success === true) {
                let pwdData: updatepassword = req.body;

                let pwdResponse = await service.user.updatePassword(pwdData);
                const emailTemplate = service.emailTemplate.passwordMail();

                service.emailService.sendMail(req.headers["X-Request-Id"], {
                  to: userOtp.username,
                  subject: "Password Update",
                  html: emailTemplate.html,
                });
                super.ok<any>(res, {
                  status: 200,
                  message: "Password update successfully!!.",
                  result: pwdResponse,
                });
              } else {
                return super.fail(res, result.message);
              }
            }
          }
        } else {
          return super.fail(res, "Old Password not matched. Please try again.");
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * antiphishing code
   * @param req
   * @param res
   */

  async antiPhishingCode(req: Request, res: Response) {
    try {

      let user: any = await service.user.checkIfUserExsit(req.body.username);
      if (user) {
        if (user?.data?.dataValues?.antiphishing === req.body.antiphishing) {
          super.fail(res, 'Antifishing code should not be same as previous code');
        }
        else {
          let userOtp;
          if (
            req.body?.otp === "string" ||
            req.body?.otp === "" ||
            req.body?.otp === null
          ) {
            userOtp = { username: req?.body?.username };

            let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

            const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);
            service.emailService.sendMail(req.headers["X-Request-Id"], {
              to: userOtp.username,
              subject: "Verify OTP",
              html: emailTemplate.html,
            });
            delete otp["otp"];
            super.ok<any>(res, { message: "OTP sent in your inbox. please verify your otp", otp });
          }
          else {
            if (req.body?.otp) {
              userOtp = {
                username: req?.body?.username,
                otp: req.body?.otp,
              };

              let result = await service.otpService.matchOtp(userOtp);
              if (result.success === true) {
                let data: antiPhishingCode = req.body;
                let pwdResponse = await service.user.antiPhishingCode(data);
                super.ok<any>(res, {
                  status: 200,
                  message: `Antiphishing Code ${user?.data?.dataValues?.antiphishing === null ? 'create' : 'update'} successfully!!.`,
                  result: pwdResponse,
                });
              }
              else {
                super.fail(res, result.message);
              }
            }
          }
        }

      }

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
   *tradePass
   * @param req
   * @param res
   */
  async tradingPassword(req: Request, res: Response) {
    try {

      // if (req.body.step === 1) {
      let user = await service.user.checkIfUserExsit(req.body.username);
      if (user) {
        let isMatched;
        if (req?.body?.old_password) {
          isMatched = await service.user.confirmTradingPassword(req?.body);

          if (isMatched && req.body.step === 1) {

            return super.ok<any>(res, "User match")
          }

          if (isMatched) {

            let userOtp;
            if (
              req.body?.otp === "string" ||
              req.body?.otp === "" ||
              req.body?.otp === null
            ) {
              userOtp = { username: req?.body?.username };

              let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

              const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);
              service.emailService.sendMail(req.headers["X-Request-Id"], {
                to: userOtp.username,
                subject: "Verify OTP",
                html: emailTemplate.html,
              });
              delete otp["otp"];
              super.ok<any>(res, { message: "OTP sent in your inbox. please verify your otp", otp });
            } else {
              //  send email otp to user
              if (req.body?.otp) {
                userOtp = {
                  username: req?.body?.username,
                  otp: req.body?.otp,
                };

                let result = await service.otpService.matchOtp(userOtp);
                if (result.success === true) {
                  let pwdData: updatepassword = req.body;

                  pwdData.new_password = await service.bcypt.MDB_crateHash(pwdData.new_password);
                  let pwdResponse = await service.user.tradingPassword(pwdData);

                  super.ok<any>(res, {
                    status: 200,
                    message: "Trading password update successfully!!.",
                    result: pwdResponse,
                  });
                }
                else {
                  super.fail(res, result.message);
                }
              }
            }
          } else {
            return super.fail(res, "Old Password not matched. Please try again.");
          }
        }
        else {
          if (req.body.step === 1) {
            return super.ok<any>(res, "User match")
          }
          let userOtp;
          if (
            req.body?.otp === "string" ||
            req.body?.otp === "" ||
            req.body?.otp === null
          ) {

            userOtp = { username: req?.body?.username };
            let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

            const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);
            service.emailService.sendMail(req.headers["X-Request-Id"], {
              to: userOtp.username,
              subject: "Verify OTP",
              html: emailTemplate.html,
            });
            delete otp["otp"];
            // Return a 200
            super.ok<any>(res, { message: "OTP sent in your inbox. please verify your otp", otp });
          } else {
            //  send email otp to user
            if (req.body?.otp) {
              userOtp = {
                username: req?.body?.username,
                otp: req.body?.otp,
              };

              let result = await service.otpService.matchOtp(userOtp);

              if (result?.success === true) {
                let pwdData: updatepassword = req.body;

                pwdData.new_password = await service.bcypt.MDB_crateHash(pwdData.new_password);

                let pwdResponse = await service.user.tradingPassword(pwdData);

                super.ok<any>(res, {
                  status: 200,
                  message: " Trading password create successfully!!.",
                  result: pwdResponse,
                });
              }
              else {
                super.fail(res, result?.message);
              }
            }
          }
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *confirmPas
   * @param req
   * @param res
   */
  async confirmPassword(req: Request, res: Response) {
    try {
      let data: updatepassword = req.body;
      let passwordResponse = await service.user.confirmPassword(data);
      if (passwordResponse) {
        super.ok<any>(res, {
          message: "Password matched successfully!.",
          result: passwordResponse,
        });
      } else {
        super.fail(res, "Old Password not matched successfully!.");
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *confirmFun
   * @param req
   * @param res
   */
  async confirmFuncode(req: Request, res: Response) {
    try {
      let data: updateFundcode = req.body;
      let fundingCodeResponse = await service.user.confirmFundcode(data);

      super.ok<any>(res, {
        message: "Funding password matched successfully!.",
        result: fundingCodeResponse,
      });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *updatePass
   * @param req
   * @param res
   */
  async updateFundcode(req: Request, res: Response) {
    try {
      let pwdData: updateFundcode = req.body;

      let pwdResponse = await service.user.updateFundcode(pwdData);

      super.ok<any>(res, {
        message: "Password update successfully!!.",
        result: pwdResponse,
      });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   *updateWhiteList
   * @param req
   * @param res
   */
  async updateWhiteList(req: Request, res: Response) {
    try {
      let pwdData: updateWhiteList = req.body;
      let user: any = await userModel.findOne({
        where: { id: req?.body?.user_id },
        raw: true,
      });

      pwdData.whitelist = user?.whitelist === true || user?.whitelist === 1 ? false : true;
      let pwdResponse = await service.user.updateWhiteList(pwdData);

      super.ok<any>(res, {
        message: "Whitelist status update successfully!!.",
        result: pwdResponse,
      });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *removeUser
   * @param req
   * @param res
   */
  removeUser(req: Request, res: Response) { }

  /**
   *depositAdd
   * @param req
   * @param res
   */
  depositAddress(req: Request, res: Response) { }

  /**
   *userExist
   * @param req
   * @param res
   */
  async userExist(req: Request, res: Response) {
    try {
      let formInput: checkUser = req.body;
      let regx = /^[6-9]\d{9}$/;
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

      let flag = "";

      const user: registerUser = req.body;
      // verify provide username is
      if (regx.test(user?.username)) flag = "number";

      if (regex.test(user?.username)) flag = "email";
      let userExist = await service.user.checkIfUserExsit(user?.username);

      if (userExist) {
        let message = flag == "number" ? "Phone number" : "Email";
        return this.forbidden(res, `${message} is already used in our system.`);
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *authRemove
   * @param req
   * @param res
   */
  authRemove(req: Request, res: Response) { }

  async userAccountScanner(req: Request, res: Response): Promise<any> {
    try {

      let { address, chainid, userid } = req.params;
      //============================================//
      // check address & chainid is provided or not
      //============================================//

      if (!address && !chainid)
        throw new Error("Please provide wallet address and chainid");

      let cova = new covalenthq();
      let trns = await cova.scanner(address, +chainid, userid);

      if (trns === undefined) {
        return super.ok<any>(res, []);
      }
      super.ok<any>(res, trns);
      // res.status(200).send(trns);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * userList
   * @param req
   * @param res
   */
  async usersList(req: Request, res: Response) {
    try {

      let userResponse = await service.user.getUsersList();
      super.ok<any>(res, userResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * userListByLimit
   * @param req
   * @param res
   */
  async usersListByLimit(req: Request, res: Response) {
    try {
      let { offset, limit } = req.params;
      let users = await service.user.getUsersList();
      let userResponse = await service.user.getUsersListByLimit(offset, limit);
      super.ok<any>(res, { data: userResponse, total: users?.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * adminProfit
   * @param req
   * @param res
   */

  async getAdminProfit(req: Request, res: Response) {
    try {
      let adminProfit = await service.user.getAdminProfitList();

      let tokens = await service.token.adminTokenAll()
      // console.log(adminProfit, "==admin");

      adminProfit.map((item, index) => {
        tokens.filter((x: any) => {

          if (x.symbol == item.coin_type) {

            item.fees *= x.price
          }
        })
      })

      // console.log(adminProfit, "==admin");

      super.ok<any>(res, adminProfit);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * activityList
   * @param req
   * @param res
   */
  async activityList(req: Request, res: Response) {
    try {
      let activityResponse = await service.user.getUsersActivityList();
      super.ok<any>(res, activityResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * activityListByLimit
   * @param req
   * @param res
   */
  async activityListByLimit(req: Request, res: Response) {
    try {
      let { offset, limit } = req?.params
      let activityResponse = await service.user.getUsersActivityList();
      let activityResponsePaginate = await service.user.getUsersActivityListByLimit(offset, limit);
      super.ok<any>(res, { data: activityResponsePaginate, total: activityResponse?.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * activityListByLimit
   * @param req
   * @param res
   */
  async activityListByIdLimit(req: Request, res: Response) {
    try {
      let { offset, limit, userid } = req?.params
      let activityResponse = await service.user.getUsersActivityList();
      let activityResponsePaginate = await service.user.getUsersActivityListByIdLimit(userid, offset, limit);
      super.ok<any>(res, { data: activityResponsePaginate, total: activityResponse?.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * clearActivity
   * @param req
   * @param res
   */
  async clearActivity(req: Request, res: Response) {

    try {
      let activityResponse = await service.user.clearActivityList(
        req.params.userid
      );
      if (activityResponse) {

        super.ok<any>(res, {
          message: "Activity cleared!!.",
        });
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   *update user status
   * @param req
   * @param res
   */
  async userUpdate(req: Request, res: Response) {
    try {
      let data: updateUserStatus = req.body;
      let pwdResponse = await service.user.updateUserStatus(data);
      if (pwdResponse) {
        let result = await userModel.findAll();


        let user = await userModel.findOne({
          where: { id: req.body.user_id },
          raw: true,
        });


        const emailTemplate = service.emailTemplate.announcementMail();
        // console.log(userOtp.username, " ========== 00")

        service.emailService.sendMail(req.headers["X-Request-Id"], {
          to: user?.email || "",
          subject: "Verify OTP",
          html: emailTemplate.html,
        });


        super.ok<any>(res, {
          message: "Status update successfully!!.",
          result: result,
        });
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async userPinUpdate(req: Request, res: Response) {
    try {
      let data: updateUserPin = req.body;
      let pwdResponse = await service.user.updateUserPin(data);
      if (pwdResponse) {
        let result = await userModel.findAll();
        super.ok<any>(res, {
          message: "Status update successfully!!.",
          result: result,
        });
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async userInformationByUserId(req: Request, res: Response) {
    try {
      let userResponse = await service.user.userActivity(req.params.id);

      super.ok<any>(res, userResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async getUserDataAsCounts(req: Request, res: Response) {
    try {
      let userData = await service.user.getUserDataAsCounts();

      super.ok<any>(res, userData);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async confirmUserOtp(req: Request, res: Response) {
    try {

      let userOtp;
      userOtp = {
        username: req.body?.username,
        otp: req.body?.otp,
      };
      let result = await service.otpService.matchOtp(userOtp);
      if (result.success) {
        return super.ok<any>(res, "Otp Matched");
      } else {
        return super.fail(res, result.message);
      }
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }

  async sendOtp(req: Request, res: Response) {
    try {
      let user = await service.user.checkIfUserExsit(req?.body?.username);
      if (user) {
        let userOtp;
        // let regx = /^[6-9]\d{9}$/;
        // let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

        // let flag = "";

        // // verify provide username is
        // if (regx.test(req?.body?.username)) flag = "number";

        // if (regex.test(req?.body?.username)) flag = "email";

        if (
          req.body?.otp === "string" ||
          req.body?.otp === "" ||
          req.body?.otp === null
        ) {
          //  send email otp to user
          userOtp = { username: req?.body?.username };

          // if (flag == "email") {

          let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

          const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

          service.emailService.sendMail(req.headers["X-Request-Id"], {
            to: userOtp.username,
            subject: "Verify OTP",
            html: emailTemplate.html,
          });

          delete otp["otp"];
          super.ok<any>(res, { message: "OTP sent in your inbox. please verify your otp", otp });
          // }

          // else {
          //   let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

          //   let response = await fetch('https://www.fast2sms.com/dev/bulkV2?authorization=6ElMeqCL34x7iskWctpVyGRZ52PfKbJNhuOoFUYvnrjXI8T0AaI64E2FnHjecMJXPqDbTd7QCKiWhuZg&route=otp&variables_values=' + Number(otp.otp) + '&flash=1&numbers=' + userOtp?.username)

          //   console.log(await response.json(), "===send otp");


          //   delete otp["otp"];
          //   return super.ok<any>(res, { message: "OTP sent in your phone. please verify your otp", otp });

          // }
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
}

export default userController;
