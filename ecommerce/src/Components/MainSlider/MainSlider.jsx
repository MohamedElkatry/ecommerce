import React from "react";
import Slider from "react-slick";
import slide1 from "../../assets/images/slider-image-1.jpeg";
import slide2 from "../../assets/images/slider-image-2.jpeg";
import slide3 from "../../assets/images/slider-image-3.jpeg";
import banner1 from "../../assets/images/banner-4.jpeg";
import banner2 from "../../assets/images/slider-2.jpeg";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <div className="container mx-auto px-4 my-6">
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Slider Section */}
        <div className="w-full md:w-3/4">
          <Slider {...settings}>
            {[slide1, slide2, slide3].map((slide, index) => (
              <div key={index}>
                <img
                  src={slide}
                  className="w-full h-[400px] object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Banner Section */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          {[banner1, banner2].map((banner, index) => (
            <img
              key={index}
              src={banner}
              className="w-full h-[195px] object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              alt={`Banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
