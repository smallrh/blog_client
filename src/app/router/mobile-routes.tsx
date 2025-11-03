import { createBrowserRouter } from 'react-router-dom';
import Home from '../../pages/mobile/Home';
import AboutUs from '../../pages/mobile/AboutUs';

const mobileRoutes = createBrowserRouter([
  {
    path: '/m',
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <AboutUs />,
      },
    ],
  },
]);

export default mobileRoutes;