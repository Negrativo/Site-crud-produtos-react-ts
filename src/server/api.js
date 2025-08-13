import axios from "axios";

let instance = axios.create({
	// baseURL: "https://atualiza_etiquetas_backend.muffato.com.br/atualiza-etiq",
	baseURL: "http://localhost:8080/backend-crm-app",
	// baseURL: "http://10.250.100.49:8160/atualiza-etiq",

	//Usar baseURL abaixo caso use um ambiente front em localhost apontando para back homolog - (CORS)
	//Solicitar acesso cors heroku: https://cors-anywhere.herokuapp.com/corsdemo
	// baseURL: 'https://cors-anywhere.herokuapp.com/http://00.000.00.000:3000/',

	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

instance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem("token");
		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);


const setAuthToken = (token) => {
	console.log("token:", token);
	if (token) {
		instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete instance.defaults.headers.common["Authorization"];
	}
};

const api = {
	get: (url, params) => {
		return instance.get(url, { params });
	},

	post: (url, data) => {
		if (data instanceof FormData) {
			delete instance.defaults.headers["Content-Type"];
		}
		return instance.post(url, data);
	},

	put: (url, data) => {
		return instance.put(url, data);
	},

	delete: (url) => {
		return instance.delete(url);
	},
	setAuthToken: setAuthToken,
};

export default api;
