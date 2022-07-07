import 'swiper/css';
import "@/styles/styles.scss";

// import Swiper JS
import Swiper, { Autoplay } from 'swiper';
Swiper.use([Autoplay]);

window.addEventListener("DOMContentLoaded", () => {
  /* eslint-disable no-unused-vars */
  const swiper = new Swiper('.swiper', {
    loop: true,
    slidesPerView: 5,
    speed: 8000,
    autoHeight: true,
    spaceBetween: 64,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
  });
});
