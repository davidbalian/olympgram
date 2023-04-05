import React, { useState, useRef, useEffect } from "react";

interface Props {
  reference: string;
}

const InfoPopup: React.FC<Props> = ({ reference }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("scroll", () => {
      setShowPopup(false);
    });

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", () => {
        setShowPopup(false);
      });
    };
  }, []);

  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        className="info-icon"
        onClick={() => setShowPopup(!showPopup)}
      >
        &#9432;
      </span>
      {showPopup && (
        <div className="reference" ref={popupRef}>
          <h3>Πηγές</h3>
          <p>{reference}</p>
        </div>
      )}
    </>
  );
};

export default InfoPopup;
