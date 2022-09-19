import "@/styles/styles.scss";


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
  spNavSet();
});
