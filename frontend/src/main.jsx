import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./store/Store.js";
import {Provider} from "react-redux";

// export const Context = createContext({
//   isAuthorized: false,
// });

// const AppWrapper = () => {
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [user, setUser] = useState({});

//   return (
//     <Context.Provider
//       value={{
//         isAuthorized,
//         setIsAuthorized,
//         user,
//         setUser,
//       }}
//     >
//       <App />
//     </Context.Provider>
//   );
// }
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <Provider store={store}>

    <App />
    </Provider>

  </React.StrictMode>
);
