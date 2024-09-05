import './App.css';
import CountryIndicators from "./components/CountryIndicators";

function App() {
  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-md-10">
            <CountryIndicators />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
