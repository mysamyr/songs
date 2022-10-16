const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDGRID_EMAIL } = require("../keys");

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports.sendAuthorisationEmail = async ({ email, name, link }) => {
  await sgMail.send({
    from: SENDGRID_EMAIL,
    to: email,
    subject: "Вітаю на сайті пісеннику!",
    text: `Вітаю, ${name}. Щоб мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш обліковий запис.
      Посилання для активації: ${link} .
      Дякую, що користуєтесь сайтом!`,
  });
};

module.exports.sendUpdateEmail = async ({ email, name, link }) => {
  await sgMail.send({
    from: SENDGRID_EMAIL,
    to: email,
    subject: "Пошту успішно змінено!",
    text: `Вітаю, ${name}. Щоб знову мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш новий email.
      Посилання для активації: ${link} .
      Дякую, що користуєтесь сайтом!`,
  });
};

module.exports.sendUpdatePassword = async (email) => {
  await sgMail.send({
    from: SENDGRID_EMAIL,
    to: email,
    subject: "Ваш пароль до сайту Пісенник було змінено",
    text: `Якщо це Ви міняли пароль - просто проігноруйте даний лист.
      Якщо ж пароль був змінений не Вами - повідомте нас, будь ласка.
      Ви можете зв'язатися з нами просто відповівши на це повідомлення.`,
  });
};
