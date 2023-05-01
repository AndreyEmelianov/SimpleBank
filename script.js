'use strict';

//events
const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');

const lazyImages = document.querySelectorAll('img[data-src]');

const slideBtnLeft = document.querySelector('.slider__btn--left');
const slideBtnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

// Modal window
const openModalWindow = function (event) {
  event.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(btn =>
  btn.addEventListener('click', openModalWindow)
);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

// плавный скролл на кнопке

btnScrollTo.addEventListener('click', function (event) {
  // для старых браузеров
  // const section1Coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: section1Coords.left + window.pageXOffset,
  //   top: section1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//плавный скролл на панеле навигации

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    if (event.target.classList.contains('nav__link')) {
      const href = event.target.getAttribute('href');
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });

// вкладки (вложенный контент для кнопок)

tabContainer.addEventListener('click', function (event) {
  const clickedBtn = event.target;

  if (!clickedBtn) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedBtn.classList.add('operations__tab--active');

  tabContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// анимация потускнения элементов навигационной панели

const navLinksHoverAnimation = function (event, opacity) {
  if (event.target.classList.contains('nav__link')) {
    const linkOver = event.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(link => {
      if (link !== linkOver) {
        link.style.opacity = opacity;
      }
    });

    logo.style.opacity = opacity;
    logoText.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (event) {
  navLinksHoverAnimation(event, 0.4);
});

nav.addEventListener('mouseout', function (event) {
  navLinksHoverAnimation(event, 1);
});

// sticky navigation

const navHeight = nav.getBoundingClientRect().height;

const getStickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// появление секций сайта

const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.18,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading для изображений
const loadImage = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.5,
});

lazyImages.forEach(img => lazyImagesObserver.observe(img));

// слайдер

let curretnSlide = 0;
const slidesNumber = slides.length;

const createDots = function () {
  slides.forEach((_, index) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `
        <button class="dots__dot" data-slide="${index}"></button>
      `
    );
  });
};

createDots();

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateCurrentDot(0);

const moveToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};

moveToSlide(0);

const nextSlide = function () {
  if (curretnSlide === slidesNumber - 1) {
    curretnSlide = 0;
  } else {
    curretnSlide++;
  }

  moveToSlide(curretnSlide);
  activateCurrentDot(curretnSlide);
};

const prevSlide = function () {
  if (curretnSlide === 0) {
    curretnSlide = slidesNumber - 1;
  } else {
    curretnSlide--;
  }

  moveToSlide(curretnSlide);
  activateCurrentDot(curretnSlide);
};

slideBtnRight.addEventListener('click', nextSlide);

slideBtnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') {
    nextSlide();
  }

  if (event.key === 'ArrowLeft') {
    prevSlide();
  }
});

dotsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    const slide = event.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});
