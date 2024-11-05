import { useEffect } from "react";

function ChristmasBackground() {
  useEffect(() => {
    const createSnowflakes = () => {
      const container = document.querySelector(".christmas-background");
      for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
        snowflake.textContent = "❄";
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5-10s
        snowflake.style.fontSize = `${Math.random() * 1 + 1}rem`; // Random size between 1-2rem
        container.appendChild(snowflake);
      }
    };

    createSnowflakes();
    return () => {
      document.querySelectorAll(".snowflake").forEach((node) => node.remove());
    };
  }, []);

  return <div className="christmas-background"></div>;
}

export default ChristmasBackground;
