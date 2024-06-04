const { createTransport } = require("nodemailer");

const { SEND_EMAIL, EMAIL_API_KEY } = process.env;

const transporter = createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: SEND_EMAIL,
		pass: EMAIL_API_KEY,
	},
});

const generateMail = (email, subject, text) => ({
	from: SEND_EMAIL,
	to: email,
	subject,
	text,
});

module.exports.sendAuthorisationEmail = async ({ email, name, url }) =>
	transporter.send(
		generateMail(
			email,
			"Вітаю на сайті пісеннику!",
			`Вітаю, ${name}. Щоб мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш обліковий запис.
      Посилання для активації: ${url} .
      Приємного користування сайтом!`,
		),
	);

module.exports.sendUpdateEmail = async ({ email, name, url }) =>
	transporter.send(
		generateMail(
			email,
			"Пошту успішно змінено!",
			`Вітаю, ${name}. Щоб знову мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш новий email.
      Посилання для активації: ${url} .
      Дякую, що користуєтесь сайтом!`,
		),
	);

module.exports.sendUpdatePassword = async (email) =>
	transporter.send(
		generateMail(
			email,
			"Ваш пароль до сайту Пісенник було змінено",
			`Якщо це Ви міняли пароль - просто проігноруйте даний лист.
      Якщо ж пароль був змінений не Вами - повідомте адміністрацію.
      Ви можете зв'язатися просто відповівши на це повідомлення.`,
		),
	);
