import type { RouteObject } from 'react-router-dom'
import BaseLayout from './components/layouts/BaseLayout'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
