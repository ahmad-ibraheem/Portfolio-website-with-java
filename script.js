var menuBtn = document.querySelector(".menu-btn");
var nav = document.querySelector("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");
});

var navLinks = nav.querySelectorAll("a");

for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    nav.classList.remove("open");
  });
}

var words = ["Web Developer", "Designer", "Data Analyst"];
var typed = document.getElementById("typed");
var wordIndex = 0;
var charIndex = 0;
var deleting = false;

function type() {
  var word = words[wordIndex];
  typed.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(type, 1400);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  if (deleting) {
    charIndex = charIndex - 1;
  } else {
    charIndex = charIndex + 1;
  }

  setTimeout(type, deleting ? 50 : 100);
}

type();

function animateCount(el) {
  var target = Number(el.dataset.to);
  var suffix = el.dataset.suffix;
  var number = 0;
  var step = Math.max(1, Math.ceil(target / 40));

  var timer = setInterval(function () {
    number = number + step;

    if (number >= target) {
      number = target;
      clearInterval(timer);
    }

    el.textContent = number + suffix;
  }, 30);
}

function fillSkill(skill) {
  var fill = skill.querySelector(".fill");
  var label = skill.querySelector("b");
  var level = Number(fill.dataset.level);
  var number = 0;

  if (level > 100) {
    level = 100;
  }

  if (level < 0) {
    level = 0;
  }

  fill.style.width = level + "%";

  var timer = setInterval(function () {
    number = Math.min(level, number + 2);
    label.textContent = number + "%";

    if (number >= level) {
      clearInterval(timer);
    }
  }, 30);
}

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    var el = entry.target;
    el.classList.add("show");

    el.querySelectorAll(".count").forEach(animateCount);

    if (el.classList.contains("skill")) {
      fillSkill(el);
    }

    revealObserver.unobserve(el);
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

var sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + entry.target.id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
}, { rootMargin: "-50% 0px -50% 0px" });

document.querySelectorAll("section[id]").forEach(function (section) {
  sectionObserver.observe(section);
});

var accHeads = document.querySelectorAll(".acc-head");
var accItems = document.querySelectorAll(".acc-item");

accHeads.forEach(function (head) {
  head.addEventListener("click", function () {
    var item = head.parentElement;
    var wasOpen = item.classList.contains("open");

    accItems.forEach(function (other) {
      other.classList.remove("open");
      other.querySelector(".acc-body").style.maxHeight = null;
    });

    if (!wasOpen) {
      var body = item.querySelector(".acc-body");
      item.classList.add("open");
      body.style.maxHeight = body.scrollHeight + "px";
    }
  });
});

var slider = document.querySelector(".slider");
var slides = document.querySelectorAll(".slide");
var dotsBox = document.querySelector(".dots");
var current = 0;
var slideTimer;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  var dots = dotsBox.querySelectorAll(".dot");

  for (var i = 0; i < slides.length; i++) {
    if (i === current) {
      slides[i].classList.add("active");
      dots[i].classList.add("active");
    } else {
      slides[i].classList.remove("active");
      dots[i].classList.remove("active");
    }
  }
}

function startAuto() {
  clearInterval(slideTimer);
  slideTimer = setInterval(function () {
    showSlide(current + 1);
  }, 5000);
}

function makeDot(index) {
  var dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", "Project " + (index + 1));
  dot.addEventListener("click", function () {
    showSlide(index);
    startAuto();
  });
  dotsBox.appendChild(dot);
}

for (var d = 0; d < slides.length; d++) {
  makeDot(d);
}

document.querySelector(".prev").addEventListener("click", function () {
  showSlide(current - 1);
  startAuto();
});

document.querySelector(".next").addEventListener("click", function () {
  showSlide(current + 1);
  startAuto();
});

slider.addEventListener("mouseenter", function () {
  clearInterval(slideTimer);
});

slider.addEventListener("mouseleave", startAuto);

var touchStart = 0;

slider.addEventListener("touchstart", function (e) {
  touchStart = e.touches[0].clientX;
}, { passive: true });

slider.addEventListener("touchend", function (e) {
  var distance = e.changedTouches[0].clientX - touchStart;

  if (Math.abs(distance) > 50) {
    if (distance < 0) {
      showSlide(current + 1);
    } else {
      showSlide(current - 1);
    }
    startAuto();
  }
});

showSlide(0);
startAuto();
