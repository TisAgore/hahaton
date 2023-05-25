
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'messages', component: () => import('pages/Messages/Index.vue') },
      { path: 'users', component: () => import('pages/Users/Index.vue') },
      { path: 'statistics', component: () => import('pages/Statistics/Index.vue') },
    ]
  },
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  // }
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
