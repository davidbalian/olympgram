import logo from "../head.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/guest" className="logo">
        <img src={logo} alt="olympgram logo" className="logo" />
      </Link>
    </header>
  );
};

export default Header;
