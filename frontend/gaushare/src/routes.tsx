import type { RouteObject } from 'react-router-dom'
import BaseLayout from './components/layouts/BaseLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Verify from './pages/Verify'
import NotFound from './pages/NotFound'

export const routes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <SignUp />,
    },
    {
        path: '/verify',
        element: <Verify />,
    },
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
