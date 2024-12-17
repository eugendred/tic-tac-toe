import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Container from '@mui/material/Container';

import './index.scss';

export const SnowfallLayout: React.FC = () => {
  useEffect(() => {
    const snowContainer: HTMLElement | null = document.getElementById("snowfall");
    const maxSnowflakes = Math.min(100, (window.innerWidth * window.innerHeight) / 5000);
    const snowflakes: HTMLElement[] = [];
    let isTabActive = true;
  
    function createSnowflake() {
      if (snowflakes.length >= maxSnowflakes) return;
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
  
      const size = Math.random() * 5 + 2;
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      snowflake.style.left = `${Math.random() * window.innerWidth}px`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      snowflakes.push(snowflake);
      snowContainer?.appendChild(snowflake);

      snowflake.addEventListener("animationend", () => {
        snowflake.remove();
        snowflakes.splice(snowflakes.indexOf(snowflake), 1);
      });
    }
  
    function generateSnowflakes() {
      createSnowflake();
      if (isTabActive) requestAnimationFrame(generateSnowflakes);
    }
  
    function handleVisibilityChange() {
      isTabActive = !document.hidden;
      if (isTabActive) requestAnimationFrame(generateSnowflakes);
    }
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", () => {
      snowflakes.length = 0;
      if (snowContainer) {
        snowContainer.innerHTML = "";
      }
    });
  
    requestAnimationFrame(generateSnowflakes);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleVisibilityChange);
    };
  }, []);

  return (
    <div id="snowfall" className="snow-container"></div>
  );
};

export const BaseLayout: React.FC = () => (
  <Container maxWidth="lg">
    <Outlet />
  </Container>
);
