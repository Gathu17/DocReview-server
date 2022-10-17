const nodemailer = require("nodemailer");

module.exports = async (email, subject, url) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: 'jerrycloud67@gmail.com',
				pass: 'momrnjlwallbwqqr',
			},
            tls : { rejectUnauthorized: false }
		});

		await transporter.sendMail({
			from: "Jerry",
			to: email,
			subject: subject,
			text: url
            
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
