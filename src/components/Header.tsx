import { useEffect, useState } from "react";
import logo from "../head.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 60) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.onscroll = () => {
      handleScroll();
    };
  }, []);
  return (
    <header
      style={{
        backgroundColor: `${
          scrolled ? "var(--header-transparent)" : "var(--header-transparent)"
        }`,
        backdropFilter: `${scrolled ? "blur(8px)" : "none"}`,
        height: `${scrolled ? "40px" : "50px"}`,
        padding: `${scrolled ? ".2rem" : ".25rem"}`,
      }}
    >
      <Link to="/guest" className="logo">
        <img src={logo} alt="logo" className="logo" />
      </Link>
    </header>
  );
};

export default Header;
