import { useState } from "react";
import upArrow from "../up-arrow.svg";
import { useEffect } from "react";

const ScrollToTop = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <button
        className={`up-arrow ${hasScrolled ? "show" : "hide"}`}
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        <img src={upArrow} alt="up arrow" />
      </button>
    </>
  );
};

export default ScrollToTop;
