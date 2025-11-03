import React from 'react';
import { RouterProvider } from 'react-router-dom';
import pcRoutes from './pc-routes';

// 直接使用PC路由配置，它已经包含了根路径重定向
const AppRouter: React.FC = () => {
  return <RouterProvider router={pcRoutes} />;
};

export default AppRouter;