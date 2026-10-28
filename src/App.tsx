import "./App.css";
import { Navigation} from "./components/Header";
import  CheckTheRate from "./components/CheckTheRate";
  
function App() {

  return (
    <>
      <main className="w-screen h-screen bg-[var(--color-bg-primary)] text-white">
        <Navigation  />
        <CheckTheRate />
      </main>
    </>
  );
}

export default App;
