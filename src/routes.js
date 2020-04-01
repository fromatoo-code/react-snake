import { prepareRoutes } from '@curi/router';
import Home from './pages/Home';
// import FlexSnake from './components/ReactSnake';
// import FlexSnake from './components/ReactSnake';
// import CanvasSnake from './components/CanvasSnake';
// import Settings from './components/Setings';
// import NotFound from './components/NotFound';

export default prepareRoutes([
  {
    name: "Home",
    path: "",
    response() {
      return { body: Home };
    }
  },
  // {
  //   name: "FlexSnake",
  //   path: "flexsnake",
  //   response() {
  //     return { body: FlexSnake };
  //   }
  // },
  // {
  //   name: "CanvasSnake",
  //   path: "canvassnake",
  //   response() {
  //     return { body: CanvasSnake };
  //   }
  // },
  // {
  //   name: "Settings",
  //   path: "settings",
  //   response() {
  //     return { body: Settings };
  //   }
  // },
  // {
  //   name: "Catch All",
  //   path: "(.*)",
  //   response() {
  //     return { body: NotFound };
  //   }
  // }
]);
