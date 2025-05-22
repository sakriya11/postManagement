import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;
