import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from './components/DashboardLayout';

import {ProdutoList} from './components/produto/ProdutoList';
import ProdutoShow from './components/produto/ProdutoShow';
import ProdutoCreate from './components/produto/ProdutoCreate';
import ProdutoEdit from './components/produto/ProdutoEdit';

import {CategoriaList} from './components/categoria/CategoriaList';
import CategoriaShow from './components/categoria/CategoriaShow';
import CategoriaCreate from './components/categoria/CategoriaCreate';
import CategoriaEdit from './components/categoria/CategoriaEdit';

import {DepartamentoList} from './components/departamento/DepartamentoList';
import DepartamentoShow from './components/departamento/DepartamentoShow';
import DepartamentoCreate from './components/departamento/DepartamentoCreate';
import DepartamentoEdit from './components/departamento/DepartamentoEdit';

import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from './shared-theme/AppTheme';
import {
    dataGridCustomizations,
    datePickersCustomizations,
    sidebarCustomizations,
    formInputCustomizations,
} from './theme/customizations';

const router = createHashRouter([
    {
        Component: DashboardLayout,
        children: [
            {
                path: '/produto',
                Component: ProdutoList,
            },
            {
                path: '/produto/:produtoId',
                Component: ProdutoShow,
            },
            {
                path: '/produto/novo',
                Component: ProdutoCreate,
            },
            {
                path: '/produto/:produtoId/editar',
                Component: ProdutoEdit,
            },


            {
                path: '/categoria',
                Component: CategoriaList,
            },
            {
                path: '/categoria/:categoriaId',
                Component: CategoriaShow,
            },
            {
                path: '/categoria/novo',
                Component: CategoriaCreate,
            },
            {
                path: '/categoria/:categoriaId/editar',
                Component: CategoriaEdit,
            },


            {
                path: '/departamento',
                Component: DepartamentoList,
            },
            {
                path: '/departamento/:departamentoId',
                Component: DepartamentoShow,
            },
            {
                path: '/departamento/novo',
                Component: DepartamentoCreate,
            },
            {
                path: '/departamento/:departamentoId/editar',
                Component: DepartamentoEdit,
            },



            // Fallback route for the example routes in dashboard sidebar items
            {
                path: '*',
                Component: ProdutoList,
            },
        ],
    },
]);

const themeComponents = {
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...sidebarCustomizations,
    ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props} themeComponents={themeComponents}>
            <CssBaseline enableColorScheme />
            <NotificationsProvider>
                <DialogsProvider>
                    <RouterProvider router={router} />
                </DialogsProvider>
            </NotificationsProvider>
        </AppTheme>
    );
}
