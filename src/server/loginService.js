import api from "./api";

export const loginWeb = async (username, password) => {
	try {
		const response = await api.post("/login", { username: username, password: password });
		console.log(response.data);
		if (response.data) {
			localStorage.setItem("token", response.data);
			api.setAuthToken(response.data);
			return response.data;
		}
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return false;
	}
};
