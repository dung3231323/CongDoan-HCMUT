import { redirect, type RouteObject } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import ErrorBoundary from './layouts/ErrorBoundary';
// import ErrorBoundary from './layouts/ErrorBoundary';

function lazy(moduleLoader: () => Promise<any> /* eslint-disable-line */) {
  return async () => {
    const component = await moduleLoader();
    return { Component: component.default };
  };
}

const routes: RouteObject[] = [
  {
    path: '',
    loader: () => {
      return redirect('/activity');
    },
  },
  {
    path: 'activity',
    lazy: lazy(() => import('./pages/activities/Activity')),
  },
  {
    path: 'category',
    lazy: lazy(() => import('./pages/activities/Category')),
  },
  {
    path: 'activity-search',
    lazy: lazy(() => import('./pages/activities/Activity-search')),
  },
  {
    path: 'activity-detail',
    lazy: lazy(() => import('./pages/activities/Activity-detail')),
  },
  {
    path: 'account',
    lazy: lazy(() => import('./pages/account/Account')),
  },
  {
    path: 'achievement',
    lazy: lazy(() => import('./pages/achievement/view/Achievement')),
  },
  {
    path: 'achievement-detail/:id',
    lazy: lazy(() => import('./pages/achievement/view/DetailAchievement')),
  },
  {
    path: 'achievement-search',
    lazy: lazy(() => import('./pages/achievement/view/SearchAchievement')),
  },

<<<<<<< HEAD
    {
        path: 'participants',
        lazy: lazy(() => import('./pages/participant/ParticipantManagement')),
    },
    {
        path: 'participants/edit-bulk',
        lazy: lazy(() => import('./pages/participant/view/EditBatchParticipant')),
    },
    {
        path: 'participants/add-bulk',
        lazy: lazy(() => import('./pages/participant/view/AddBatch')),
    },
    {
        path: 'achievement',
        lazy: lazy(() => import('./pages/achievement/view/Achievement')),
    },
    {
        path: 'achievement-detail/:id',
        lazy: lazy(() => import('./pages/achievement/view/DetailAchievement')),
    },
    {
        path: 'achievement-search',
        lazy: lazy(() => import('./pages/achievement/view/SearchAchievement')),
    },
    {
        path: 'participants',
        lazy: lazy(() => import('./pages/participant/ParticipantManagement')),
    },
    {
        path: 'participants/edit-bulk',
        lazy: lazy(() => import('./pages/participant/view/EditBatchParticipant')),
    },
    {
        path: 'participants/search',
        lazy: lazy(() => import('./pages/participant/view/SearchParticipant')),
    },
=======
  {
    path: 'participants',
    lazy: lazy(() => import('./pages/participant/ParticipantManagement')),
  },
  {
    path: 'participants/edit-bulk',
    lazy: lazy(() => import('./pages/participant/view/EditBatchParticipant')),
  },
  {
    path: 'participants/add-bulk',
    lazy: lazy(() => import('./pages/participant/view/AddBatch')),
  },
  {
    path: 'achievement',
    lazy: lazy(() => import('./pages/achievement/view/Achievement')),
  },
  {
    path: 'achievement-detail/:id',
    lazy: lazy(() => import('./pages/achievement/view/DetailAchievement')),
  },
  {
    path: 'achievement-search',
    lazy: lazy(() => import('./pages/achievement/view/SearchAchievement')),
  },
  {
    path: 'participants',
    lazy: lazy(() => import('./pages/participant/ParticipantManagement')),
  },
  {
    path: 'participants/edit-bulk',
    lazy: lazy(() => import('./pages/participant/view/EditBatchParticipant')),
  },
>>>>>>> 364ec89ae047109cdbbfb2de5bf6f47146641eee
];

const routesWithLayout: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />, // need not be lazy cause it's a layout
    children: routes,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    lazy: lazy(() => import('./pages/login/Login')),
  },
];

export default routesWithLayout;
