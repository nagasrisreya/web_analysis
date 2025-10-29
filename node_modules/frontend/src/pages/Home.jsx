import React, { useEffect } from "react";
import { trackEvent } from "../utils/tracker";

export default function Home() {
  useEffect(() => {
    trackEvent("page_view", { page: "Home" });
  }, []);

  const handleClick = () => {
    trackEvent("button_click", { label: "Explore Products" });
    alert("You clicked Explore Products!");
  };

  return (
    <div className="page">
      <h1>Welcome to the Web Analytics Demo</h1>
      <button onClick={handleClick}>Explore Products</button>
    </div>
  );
}
