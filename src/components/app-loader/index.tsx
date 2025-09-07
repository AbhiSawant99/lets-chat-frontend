import logo from "/loading-bubble.png";
import "./styles.css";

function AppLoader() {
  return (
    <div className="loader-container">
      <div className="logo-wrapper">
        <img src={logo} alt="Loading..." className="loader-logo" />
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <h3 className="loader-text">Please wait...</h3>
    </div>
  );
}

export default AppLoader;
