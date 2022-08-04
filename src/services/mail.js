const sgMail = require('@sendgrid/mail');
const {SENDGRID_API_KEY, SENDGRID_EMAIL} = require("../keys");

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports.sendAuthorisationEmail = async ({email, name, link}) => {
  await sgMail.send({
    from: SENDGRID_EMAIL,
    to: email,
    subject: "Вітаю на сайті пісеннику!",
    text: `Вітаю, ${name}. Щоб мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш обліковий запис.
      Посилання для активації: ${link} .
      Дякую, що користуєтесь сайтом!`
  });
};