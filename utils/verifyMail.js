const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = require("../config");

const sendMail = async (email, verToken) => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const vfLink = `http://localhost:3000/api/users/verify/${verToken}`;
  const msg = {
    to: email,
    from: "kamilkrolik@hotmail.com",
    subject: "Verification token",
    text: `Your verification token: ${vfLink}`,
    html: `<b>Your verification token: <a href="${vfLink}">${vfLink}</a></b>`,
  };

  await sgMail.send(msg);
  return;
};

module.exports = { sendMail };
