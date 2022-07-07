import 'swiper/css';
import "@/styles/styles.scss";

// import Swiper JS
import Swiper, { Autoplay } from 'swiper';
Swiper.use([Autoplay]);

const swiperSet = () => {
  /* eslint-disable no-unused-vars */
  const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 8000,
    slidesPerView: 3,
    spaceBetween: 12,
    autoHeight: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    breakpoints: {
      519: {
        slidesPerView: 5,
        spaceBetween: 64,
      }
    }
  });
};

const spNavSet = () => {
  const button = document.querySelector('.js-sp-nav-button');
  const target = document.querySelector('.js-sp-nav');
  button.addEventListener('click', function () {
    const isActive = this.classList.contains('is-active');
    target.style.setProperty("--js-h", target.scrollHeight + "px");
    if (!isActive) {
      this.classList.add('is-active');
      target.classList.add('is-active');
    } else {
      this.classList.remove('is-active');
      target.classList.remove('is-active');
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  swiperSet();
  spNavSet();
});
