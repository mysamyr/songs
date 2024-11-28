export const getLinkForVerification = (id) =>
	`${process.env.URL}auth/verify/${id}`;
