import api from "./api";

export interface Produto {
	id: number;
	descricao: string;
	ean: string;
	unidadeMedida: string;
	categoriaId: number;
	categoria: string;
	nomeDepartamento: string;
	dataCadastro: string;
}

export const getProdutos: () => Promise<Produto[]> = async () => {
	try {
		const response = await api.get("/produto");
		console.log(response.data);
		const dados: Produto[] = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return [];
	}
};

export const createProduto: (produto: Produto) => Promise<Produto> = async (produto: Produto) => {
	try {
		const response = await api.post("/produto", produto);
		console.log(response.data);
		const dados: Produto = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return null;
	}
};

export const updateProduto: (produtoId: string, produto: Produto) => Promise<Produto> = async (produtoId: string, produto: Produto) => {
	try {
		const response = await api.put(`/produto/${produtoId}`, produto);
		console.log(response.data);
		const dados: Produto = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return null;
	}
};

export const deleteProduto: (produtoId: string) => Promise<Produto> = async (produtoId: string) => {
	try {
		const response = await api.delete(`/produto/${produtoId}`);
		console.log(response.data);
		const dados: Produto = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return null;
	}
};


