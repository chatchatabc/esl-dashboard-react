import "./index.css";

function LoadingComp() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="phone">
        <span className="loader" />
        <span className="text">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingComp;
