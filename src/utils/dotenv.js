import fs from "node:fs";
import path from "node:path";

export default () => {
	try {
		const data = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
		data.split(/\r?\n/).forEach((line) => {
			line = line.trim();
			if (line[0] === "#") return;
			if (!line.length) return;

			if (line.includes("=")) {
				const [name, ...value] = line.split("=");

				if (!process.env[name]) {
					process.env[name] = value.join("=");
				}
			}
		});
	} catch (err) {
		if (err.code === "ENOENT") {
			// eslint-disable-next-line no-console
			console.log(".env file not found!");
			process.exit();
		} else {
			throw err;
		}
	}
};
