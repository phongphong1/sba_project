import type { RouteObject } from 'react-router-dom'
import BaseLayout from './components/layouts/BaseLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Verify from './pages/Verify'
import Profile from './pages/Profile'
import Questions from './pages/Questions'
import QuestionDetail from './pages/QuestionDetail'
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
                path: 'questions',
                element: <Questions />,
            },
            {
                path: 'questions/:id',
                element: <QuestionDetail />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
