import {createCategoria, deleteCategoria, getCategorias, updateCategoria} from "../server/categoriaService.js";

export async function getMany({paginationModel, filterModel, sortModel}) {
    const categoriasStore = await getCategorias();

    let filteredCategorias = [...categoriasStore];

    // Apply filters (example only)
    if (filterModel?.items?.length) {
        filterModel.items.forEach(({field, value, operator}) => {
            if (!field || value == null) {
                return;
            }

            filteredCategorias = filteredCategorias.filter((categoria) => {
                const categoriaValue = categoria[field];

                switch (operator) {
                    case 'contains':
                        return String(categoriaValue)
                            .toLowerCase()
                            .includes(String(value).toLowerCase());
                    case 'equals':
                        return categoriaValue === value;
                    case 'startsWith':
                        return String(categoriaValue)
                            .toLowerCase()
                            .startsWith(String(value).toLowerCase());
                    case 'endsWith':
                        return String(categoriaValue)
                            .toLowerCase()
                            .endsWith(String(value).toLowerCase());
                    case '>':
                        return categoriaValue > value;
                    case '<':
                        return categoriaValue < value;
                    default:
                        return true;
                }
            });
        });
    }

    // Apply sorting
    if (sortModel?.length) {
        filteredCategorias.sort((a, b) => {
            for (const {field, sort} of sortModel) {
                if (a[field] < b[field]) {
                    return sort === 'asc' ? -1 : 1;
                }
                if (a[field] > b[field]) {
                    return sort === 'asc' ? 1 : -1;
                }
            }
            return 0;
        });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedCategorias = filteredCategorias.slice(start, end);

    return {
        items: paginatedCategorias,
        itemCount: filteredCategorias.length,
    };
}

export async function getOne(categoriaId) {
    const categoriasStore = await getCategorias();

    const categoriaToShow = categoriasStore.find(
        (categoria) => categoria.id === categoriaId,
    );

    if (!categoriaToShow) {
        throw new Error('Categoria não encontrado');
    }
    return categoriaToShow;
}

export async function createOne(data) {
    const newCategoria = await createCategoria(data);

    return newCategoria;
}

export async function updateOne(categoriaId, data) {
    console.log(categoriaId, data);
    const categoriasStore = await updateCategoria(categoriaId, data);
    console.log(categoriasStore);
    return categoriasStore;
}

export async function deleteOne(categoriaId) {
    await deleteCategoria(categoriaId);
}

// Validation follows the [Standard Schema](https://standardschema.dev/).

export function validate(categoria) {
    let issues = [];

    if (!categoria.nome) {
        issues = [...issues, {message: 'Name is required', path: ['nome']}];
    }

    if (!categoria.departamentoId) {
        issues = [...issues, {message: 'Age is required', path: ['departamentoId']}];
    }

    if (!categoria.dataCadastro) {
        issues = [...issues, {message: 'Join date is required', path: ['dataCadastro']}];
    }

    return {issues};
}
