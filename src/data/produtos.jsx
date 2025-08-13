import {createProduto, getProdutos, updateProduto, deleteProduto} from "../server/produtosService.js";

export function setProdutosStore(produtos) {
  return localStorage.setItem('produtos-store', JSON.stringify(produtos));
}

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const produtosStore = await getProdutos();

  let filteredProdutos = [...produtosStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredProdutos = filteredProdutos.filter((produto) => {
        const produtoValue = produto[field];

        switch (operator) {
          case 'contains':
            return String(produtoValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case 'equals':
            return produtoValue === value;
          case 'startsWith':
            return String(produtoValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(produtoValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case '>':
            return produtoValue > value;
          case '<':
            return produtoValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredProdutos.sort((a, b) => {
      for (const { field, sort } of sortModel) {
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
  const paginatedProdutos = filteredProdutos.slice(start, end);

  return {
    items: paginatedProdutos,
    itemCount: filteredProdutos.length,
  };
}

export async function getOne(produtoId) {
  const produtosStore = await getProdutos();

  const produtoToShow = produtosStore.find(
    (produto) => produto.id === produtoId,
  );

  if (!produtoToShow) {
    throw new Error('Produto não encontrado');
  }
  return produtoToShow;
}

export async function createOne(data) {
  const newProduto = await createProduto(data);

  return newProduto;
}

export async function updateOne(produtoId, data) {
  const produtosStore = await updateProduto(produtoId, data);

  let updatedProduto = null;

  setProdutosStore(
    produtosStore.map((produto) => {
      if (produto.id === produtoId) {
        updatedProduto = { ...produto, ...data };
        return updatedProduto;
      }
      return produto;
    }),
  );

  if (!updatedProduto) {
    throw new Error('Produto não encontrado');
  }
  return updatedProduto;
}

export async function deleteOne(produtoId) {
  const produtosStore = await deleteProduto(produtoId);

  setProdutosStore(produtosStore.filter((produto) => produto.id !== produtoId));
}

// Validation follows the [Standard Schema](https://standardschema.dev/).

export function validate(produto) {
  let issues = [];

  if (!produto.name) {
    issues = [...issues, { message: 'Name is required', path: ['name'] }];
  }

  if (!produto.ean) {
    issues = [...issues, { message: 'Age is required', path: ['ean'] }];
  } else if (produto.age < 18) {
    issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
  }

  if (!produto.joinDate) {
    issues = [...issues, { message: 'Join date is required', path: ['joinDate'] }];
  }

  if (!produto.role) {
    issues = [...issues, { message: 'Role is required', path: ['role'] }];
  } else if (!['Market', 'Finance', 'Development'].includes(produto.role)) {
    issues = [
      ...issues,
      {
        message: 'Role must be "Market", "Finance" or "Development"',
        path: ['role'],
      },
    ];
  }

  return { issues };
}
