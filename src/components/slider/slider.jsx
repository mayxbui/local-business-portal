import React, { useState, useEffect } from 'react';
import '../slider/slider.css';
import img1 from "../../assets/slider/27.jpg";
import img2 from "../../assets/slider/28.jpg";
import img3 from "../../assets/slider/29.jpg";
import img4 from "../../assets/slider/deal 1.png";
import img5 from "../../assets/slider/deal 5.png";
import img6 from "../../assets/slider/deal 6.png";
import img7 from "../../assets/slider/deal 7.png";
import img8 from "../../assets/slider/deal 8.png";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];


const SliderImg = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-img-container">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <img key={i} src={img} alt={`slide-${i}`} className="slider-img" />
        ))}
      </div>
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default SliderImg;