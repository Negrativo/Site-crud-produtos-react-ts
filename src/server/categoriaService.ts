import api from "./api";

export interface Categoria {
	id: number;
	nome: string;
	ativo: boolean;
	departamentoId: number;
	nomeDepartamento: string;
	dataCadastro: string;
	usuario?: string;
}

export const getCategorias: () => Promise<Categoria[]> = async () => {
	try {
		const response = await api.get("/categoria");
		console.log(response.data);
		const dados: Categoria[] = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return [];
	}
};

export const createCategoria: (categoria: Categoria) => Promise<Categoria> = async (categoria: Categoria) => {
	try {
		const response = await api.post("/categoria", categoria);
		console.log(response.data);
		const dados: Categoria = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return null;
	}
};

export const updateCategoria: (categoriaId: string, categoria: Categoria) => Promise<Categoria> = async (categoriaId: string, categoria: Categoria) => {
	try {
		const response = await api.put(`/categoria/${categoriaId}`, categoria);
		console.log(response.data);
		const dados: Categoria = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return null;
	}
};

export const deleteCategoria: (categoriaId: string) => Promise<Categoria> = async (categoriaId: string) => {
	try {
		const response = await api.delete(`/categoria/${categoriaId}`);
		console.log(response.data);
		const dados: Categoria = response.data;
		return dados;
	} catch (error) {
		console.error("Error logging in:", error);
		console.error("Error logging in:", error.message);
		return null;
	}
};


