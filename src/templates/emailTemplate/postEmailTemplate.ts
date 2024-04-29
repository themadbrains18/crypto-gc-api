const PostEmailTemplate = function () {
    const html = `
    <!DOCTYPE html>
    <html
      lang="en"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta charset="utf-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, address=no, email=no"
        />
        <title>Crypto Post Created</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        
        <style>
          .hover-underline:hover {
            text-decoration: underline !important;
          }
    
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
    
          @keyframes ping {
            75%,
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
    
          @keyframes pulse {
            50% {
              opacity: 0.5;
            }
          }
    
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(-25%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
    
            50% {
              transform: none;
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
    
          @media (max-width: 600px) {
            .sm-px-24 {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
    
            .sm-py-32 {
              padding-top: 32px !important;
              padding-bottom: 32px !important;
            }
    
            .sm-w-full {
              width: 100% !important;
            }
          }
        </style>
      </head>
    
      <body style="margin: 0; padding: 0; width: 100%; word-break: break-word">
        <center>
          <div>
            <table
              width="100%"
              style="width: 100%; max-width: 600px; padding-top: 10px"
              align="center"
            >
              <tbody>
                <tr>
                  <td
                    style="
                      padding: 0px 0px 0px 0px;
                      color: #000000;
                      text-align: left;
                    "
                    width="100%"
                    align="left"
                  >
                    <table
                      border="0"
                      align="center"
                      width="100%"
                      style="
                        padding: 1px 15px 1px 7%;
                        background-color: #fff;
                        box-sizing: border-box;
                      "
                    >
                      <tbody>
                        <tr>
                          <td height="100%">
                            <table
                              style="border-spacing: 0; margin: 0px 0px 0px 0px"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      padding: 0px;
                                      margin: 0px;
                                      border-spacing: 0;
                                      border-bottom: 1px solid #eee;
                                    "
                                  >
                                    <table width="100%" style="table-layout: fixed">
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 6px;
                                              line-height: 10px;
                                              padding: 13px 11px 16px 0;
                                              background-color: #fff;
                                              width: 130px;
                                            "
                                            align="center"
                                          >
                                            <a href="/" target="_blank"
                                              ><img
                                                border="0"
                                                style="
                                                  display: block;
                                                  color: #000000;
                                                  text-decoration: none;
                                                  font-size: 16px;
                                                  max-width: 100% !important;
                                                  width: 100%;
                                                  height: auto !important;
                                                "
                                                src="https://ci3.googleusercontent.com/meips/ADKq_NbRd3kJJoCgEjIGRHGaPTxv_0mLt0elJGtsVZJTPzInzxhsbcWH2zm0KYmwGThBQ8-g6D8-sgSUkxR-MFB8kZ16Qzi-DLLzO3agmDwN_Rcn3L9ppYuwPfkrRePEImWdvQ=s0-d-e1-ft#https://img.bitgetimg.com/image/emailTemplate/bitget-logo-rebrand-0803.png"
                                                alt=""
                                            /></a>
                                          </td>
                                          <td
                                            style="
                                              color: #ffffff;
                                              opacity: 0.5;
                                              font-size: 12px;
                                              white-space: nowrap;
                                              font-family: Roboto;
                                              text-align: right;
                                              padding-right: 20px;
                                            "
                                          ></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      width="100%"
                      style="width: 100%; max-width: 600px; padding-top: 10px"
                      align="center"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              padding: 0px 0px 0px 0px;
                              color: #000000;
                              text-align: left;
                            "
                            width="100%"
                          >
                            <table
                              width="100%"
                              style="table-layout: fixed; background-color: #ffffff"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      padding: 30px 7% 15px 7%;
                                      line-height: 22px;
                                    "
                                    height="100%"
                                    valign="top"
                                  >
                                    <div>
                                      <span
                                        style="
                                          color: #222a35;
                                          font-family: Roboto;
                                          font-size: 15px;
                                          line-height: 1.5;
                                        "
                                        >Dear User,</span
                                      >
                                    </div>
                                    <div>
                                      <span
                                        style="
                                          color: #222a35;
                                          font-family: Roboto;
                                          font-size: 15px;
                                          line-height: 1.5;
                                        "
                                     </span>
                                    </div>
                                    <div>
                                      <span
                                        style="line-height: 1.5; font-size: 15px;"
                                      >
                                    <div>
                                            <span style="font-size: 14px; color:#222a35"
                                              >Your crypto post has been successfully created on our platform.</span
                                            >
                                          </div>
                                      
                                          <div>
                                            <span style="font-size: 14px; color:#222a35"
                                              >
                                              Share your insights and engage with the crypto community!
                                              </span
                                            >
                                          </div>
                                          
                                          <div style=" margin-top: 30px;">
                                            <span style="font-size: 14px; color:#222a35;"
                                              >If you did not request this action,
                                              please contact us：<a
                                                style="text-decoration: none"
                                                href="/"
                                                target="_blank"
                                                ><span
                                                  style="
                                                    font-size: 15px;
                                                    color: #5367FF;
                                                  "
                                                  >https://launchyourexchange.com/.</span
                                                ></a
                                              ></span
                                            >
    
                                          </div>
                                      </span>
                                      <div style="margin-bottom: 5px">
                                        <br />
                                        <div
                                          style="color: #222a35; font-size: 9px; line-height: 1.5"
                                        >
                                          Crypto Planet Team
                                        </div>
                                      </div>
                                      <div>
                                        <span style="font-family: Roboto"
                                          ><span
                                            style="
                                              color: #999999;
                                              font-size: 11px;
                                              line-height: 18px;
                                            "
                                            >This is an automated email, please do not
                                            reply.</span
                                          ></span
                                        >
                                      </div>
                                      <div
                                        style="
                                          padding-bottom: 5px;
                                          border-bottom: 1px solid #eeeeee;
                                        "
                                      >
                                        <span style="font-family: Roboto"></span>
                                      </div>
                                      <div style="padding-top: 40px">
                                        <div
                                          style="
                                            text-align: center;
                                            margin-bottom: 13px;
                                            font-size: 13px;
                                            color: #222a35;
                                            font-family: Roboto;
                                          "
                                        >
                                          Get the latest Crypto Planet App for your phone
                                        </div>
                                        <div style="text-align:center;">
                                        <img  src="https://ci3.googleusercontent.com/meips/ADKq_Na12W-KR7Pe4DbmDLD1yzLqz0G6JuwgPOu_Sxdat3dxeHSp8ULwGamg_wNF0IkpsJiq1tiwno2vt72gcFeJupbUQkFPcBKXktAYjrstvMkgA_cY=s0-d-e1-ft#https://miro.medium.com/proxy/1*CXKdDEfFShoF6Azy5V8ZKQ@2x.png" width="120px" height="40px"/>
                                        <img  src="https://ci3.googleusercontent.com/meips/ADKq_NbXF1y8pLBTkQJ0MCcfm5qYrQAeMTNJvygdD0V_aElzAbYJiUuk3y05zrzxuN9qDWkdr_8hzXHWYkMQilTaypbced72pzgMLhnSJ-TKMF1-2Z62=s0-d-e1-ft#https://miro.medium.com/proxy/1*D-oULOaPtKR8A1jatsII4w@2x.png" width="120px" height="40px"/>
                                      </div>
                                        <div
                                          style="
                                            padding-top: 8px;
                                            text-align: center;
                                            line-height: 18px;
                                            color: #999999;
                                            font-size: 11px;
                                            font-family: Roboto;
                                          "
                                        >
                                          Copyright 2017-2024&nbsp;©&nbsp;<a
                                            target="_blank"
                                            >Crypto Planet.com</a
                                          >
                                        </div>
                                      </div>
                                  
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </center>
      </body>
    </html>
    `;
    
    const text = `
        Use this OTP to confirm your account and log in`;
    return {
        html: html,
        text: text,
    };
};

export default PostEmailTemplate;