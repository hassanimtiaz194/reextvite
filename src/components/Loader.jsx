import React, { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import LottieFile from './loader.json';
import './styles.css'; // CSS for styling

const Loader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkLoading = () => {
      const loading = localStorage.getItem("loading");
      if (loading === "true") {
        setIsVisible(true);

        // Auto-hide and reset localStorage after 1 sec
        setTimeout(() => {
          setIsVisible(false);
          localStorage.setItem("loading", "false");
        }, 1000);
      }
    };

    checkLoading();

    const interval = setInterval(checkLoading, 300); // Poll every 300ms

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="lottie-loader-wrapper">
      <Player
        autoplay
        loop
        src={LottieFile}
        className="lottie-player"
      />
    </div>
  );
};

export default Loader;
