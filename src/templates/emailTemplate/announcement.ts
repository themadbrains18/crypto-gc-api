const Announcement = function () {

  const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <title>Reset your Password</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
      
      <style>
        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
        }
      
        .main-table-top{
          background-color: #ebebeb;
        }
        .main_table{
          width: 100%;
          max-width: 720px;
          margin:0 auto;
          padding: 50px;
        }
        .banner_img{
          max-width: 300px;
          width: 100%;
        }
        .banner_heading {
          font-size: 42px;
          margin-bottom: 17px;
        }
        .banner_info {
          font-size: 16px;
          line-height: 28px;
        }
        .banner_td{
         
          padding-right: 15px;
        }
        .text_content_wraper{
          padding: 20px;
          background-color: #fff;
        }
        .main-table-modifier{
          padding:0;
        }
        .content_heading{
          font-size: 24px;
          font-weight: bold;
          line-height: 30px;
          color: #1e1e1e;
        }
        .content_info,
        .list-points
        {
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #1e1e1e;
          padding: 40px 0;
        }
        .sp-b-40{
          padding: 0 0 40px 0;
        }
        .banner_heading{
          padding: 0;
        }
        .list_points{
          margin-top: 20px;
          padding: 0 0 10px 0;
        }
        .list_wrapper{
          padding: 0 0 0 20px;
        }
        .p-0{
          padding: 0;
        }
        .pb-0{
          padding-bottom: 0;
        }
        /* responsive breakpoints */
        @media (max-width:767px) {
          .main_table{
            padding: 15px;
          }
          .banner_heading {
            font-size: 28px;
            margin-bottom: 17px;
          }
          .banner_info {
            font-size: 12px;
            line-height: 18px;
          }
          .banner_img {
            max-width: 140px;
            width: 100%;
            margin-left: 17px;
          }
          .banner_td_2{
            text-align: end;
          }
          .text_content_wraper{
            padding: 0;
          }
        }
      </style>
    </head>

      <body style="margin: 0; padding: 0; width: 100%; word-break: break-word">
        <table
            class="main_table main-table-top"
              width="100%"
            >
            <tbody>
              <tr>
                <td class="banner_td">
                  <h2 class="banner_heading">Exchange<br>Token Fiesta</h2>
                  <p class="banner_info">Trade to Win BLUR, USTC, MAGIC and LUNC!</p>
                </td>
                <td class="banner_td_2">
                  <img class="banner_img" src="https://themadbrains.com/email-template-images/banner-img.png" alt="img-description">
                </td>
              </tr>
             
            </tbody>

        </table>
        <table class="main_table main-table-modifier">
          <tbody>
            <tr>
              <td class="text_content_wraper">
                <h3 class="content_heading">Dear Exchanger,</h3>
                <p class="content_info">Get ready for an exciting opportunity to boost your trading experience and earn exclusive rewards! We are thrilled to announce the Exchange Deposit and Trading Event, where users can participate in deposit and trading tasks to unlock hot token rewards such as USTC, MAGIC, and LUNC.</p>
                <p class="content_info sp-b-40"><strong> Event Period: 11 AM, November 28, 2023 - 11 AM, December 5, 2023 (UTC)</strong></p>
                <p class="content_info  p-0"><strong>How to Participate:</strong></p>
                <ul class="list_wrapper">
                  <li class="list_points">KYC task: complete KYC and get your rewards immediately</li>
                  <li class="list_points">Deposit Task: Deposit during the event period to qualify for rewards</li>
                  <li class="list_points">Trading Task: Trade to unlock additional rewards. </li>
                </ul>

                <p class="content_info  pb-0"><strong>Hot Token Rewards:</strong></p>
                <ul class="list_wrapper">
                  <li class="list_points">USTC</li>
                  <li class="list_points">MAGIC</li>
                  <li class="list_points">LUNC</li>
                  <li class="list_points">BLUR</li>
                  <li class="list_points">Trading Bonus</li>
                </ul>
                <p class="content_info">Don’t miss this chance to enhance your trading journey and accumulate hot tokens! Join the Exchange Deposit and Trading Event and experience the thrill of trading with lucrative rewards.
                </p>
                <p class="content_info  pb-0"><strong>Exchange Team</strong></p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>

    </html>
    `;

  const text = `
    Use this OTP to confirm your account and log in`;
  return {
    html: html,
    text: text,
  };

}


export default Announcement;