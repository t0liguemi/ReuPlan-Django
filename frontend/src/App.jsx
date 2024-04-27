import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import injectContext, { Context } from "./store/context";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Evento from "./views/Evento.jsx";
import Footer from "./components/Footer.jsx";
import "./custom.css";
import CreateEvent from "./views/CreateEvent.jsx";
import EditEvent from "./views/EditEvent.jsx";
import Navbar from "./components/Navbar.jsx";
import LoggedInNavbar from "./components/LoggedInNavbar.jsx";
import Login from "./views/Login.jsx";
import Welcome from "./views/WelcomeSplash.jsx";
import "./custom.css";
import EventList from "./views/EventList.jsx";
import SignIn from "./views/SignIn.jsx";
import Profile from "./views/Profile.jsx";
import ScrollToAnchor from "./components/ScrollToAnchor.jsx";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";

function App() {
   const { store, actions } = useContext(Context);
   useEffect(() => {
      if (store.loggedIn === false) {
         actions.getSession();
      }
   }, []);

   return (
      <div className="App d-flex flex-column min-vh-100">
         <HashRouter>
            <ScrollToAnchor />
            {store.loggedIn ? <LoggedInNavbar /> : <Navbar />}
            <Routes>
               <Route path="/login" Component={Login} />
               <Route
                  path="/signin"
                  Component={store.loggedIn ? EventList : SignIn}
               />
               <Route
                  path="/signin/:newUsername/:testerKey"
                  Component={store.loggedIn ? EventList : SignIn}
               />
               <Route path="/profile" Component={Profile} />
               <Route path="/" Component={Welcome} />
               <Route path="/create" Component={CreateEvent} />
               <Route path="/eventList" Component={EventList} />
               <Route path="/event/:eventID">
                  <Route index Component={Evento} />
                  <Route path="edit" Component={EditEvent} />
               </Route>

               <Route render={() => <h1>Not found!</h1>} />
            </Routes>
            <Toaster
               position="top-center"
               reverseOrder={false}
               toastOptions={{
                  className: "",
                  style: {
                     background: "#f18805",
                     color: "#ffffff",
                  },
                  success: {
                     style: {
                        background: "#6f8e7b",
                     },
                  },
                  error: {
                     style: {
                        background: "#d95d39",
                     },
                  },
               }}
            />
            <Footer />
         </HashRouter>
      </div>
   );
}

export default injectContext(App);
