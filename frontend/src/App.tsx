import Dropzone from "./components/dropzone.tsx"

function App() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800">Card</h2>
        <p className="text-gray-600 mt-3">
            Dropzone testing
        </p>
        <Dropzone />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Learn More
        </button>
    </div>
  );
}
export default App;
