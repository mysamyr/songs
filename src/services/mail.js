import {
	createTransport,
	createTestAccount,
	getTestMessageUrl,
} from "nodemailer";
import logger from "./logger.js";
import { PRODUCTION } from "../constants/index.js";

const { SEND_EMAIL, EMAIL_API_KEY, NODE_ENV } = process.env;

let transporter;

const createTransporter = async () => {
	if (!transporter) {
		if (NODE_ENV !== PRODUCTION) {
			const testAccount = await createTestAccount();
			logger.info(
				`Test account created: ${testAccount.user} ${testAccount.pass}`,
			);
			transporter = createTransport({
				host: "smtp.ethereal.email",
				port: 587,
				secure: false,
				auth: {
					user: testAccount.user,
					pass: testAccount.pass,
				},
			});
		} else {
			transporter = createTransport({
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				auth: {
					user: SEND_EMAIL,
					pass: EMAIL_API_KEY,
				},
			});
		}
	}
	return transporter;
};

const generateMail = (email, subject, text) => ({
	from: SEND_EMAIL,
	to: email,
	subject,
	text,
});

const sendMail = async (data) => {
	try {
		const transporter = await createTransporter();

		const info = await transporter.sendMail(data);

		if (NODE_ENV !== "production") {
			logger.debug(`Preview URL: ${getTestMessageUrl(info)}`);
		}
		logger.info(`Message sent: ${info.messageId}`);
	} catch (error) {
		logger.error(`Error sending email: ${error.messageId}`, error);
		if (error.responseCode === 550) {
			logger.error("Mailbox unavailable or not found");
		}
		throw error;
	}
};

export const sendAuthorisationEmail = async ({ email, name, url }) =>
	sendMail(
		generateMail(
			email,
			"Вітаю на сайті пісеннику!",
			`Вітаю, ${name}. Щоб мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш обліковий запис.
Посилання для активації: ${url} .
Приємного користування сайтом!`,
		),
	);

export const sendUpdateEmail = async ({ email, name, url }) =>
	sendMail(
		generateMail(
			email,
			"Пошту успішно змінено!",
			`Вітаю, ${name}. Щоб знову мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш новий email.
Посилання для активації: ${url} .
Дякую, що користуєтесь сайтом!`,
		),
	);

export const sendUpdatePassword = async ({ email }) =>
	sendMail(
		generateMail(
			email,
			"Ваш пароль до сайту Пісенник було змінено",
			`Якщо це Ви змінювали пароль - просто проігноруйте даний лист.
Якщо ж пароль був змінений не Вами - повідомте, будь ласка, адміністрацію відповівши на даний лист.`,
		),
	);
