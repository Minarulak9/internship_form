let audio = new Audio("./click_sound.mp3");
audio.volume = 0.4;
// Preloader animation
window.addEventListener("load", function () {
  setTimeout(function () {
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(function () {
      document.querySelector(".preloader").style.display = "none";
      initAnimations();
    }, 500);
  }, 2000); // Show preloader for 2 seconds
});

document.getElementById("resume").addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.size > 5 * 1024 * 1024) {
    // 5MB in bytes
    alert("File size should not exceed 5MB.");
    this.value = ""; // clear the file input
  }
});
document.getElementById("projectFile").addEventListener("change", function () {
  const maxSize = 1 * 1024 * 1024; // 1MB in bytes
  const files = this.files;
  let valid = true;

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize) {
      alert(`"${files[i].name}" exceeds 1MB limit.`);
      valid = false;
      break;
    }
  }

  if (!valid) {
    this.value = ""; // Clear all selected files
  }
});
// Initialize GSAP animations
function initAnimations() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Logo animation
  const tl = gsap.timeline();

  // Animate logo
  tl.to(".logo-container", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
  });

  // Animate logo paths
  tl.fromTo(
    ".logo-path",
    {
      strokeDasharray: 300,
      strokeDashoffset: 300,
    },
    {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
    },
    "-=0.5"
  );

  tl.fromTo(
    ".logo-path-inner",
    {
      strokeDasharray: 200,
      strokeDashoffset: 200,
    },
    {
      strokeDashoffset: 0,
      duration: 1,
      ease: "power2.inOut",
    },
    "-=1"
  );

  // Animate logo text
  tl.fromTo(
    ".logo-text",
    {
      y: 20,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
    },
    "-=0.5"
  );

  tl.fromTo(
    ".logo-tagline",
    {
      y: 15,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
    },
    "-=0.6"
  );

  // Form container animation
  tl.to(
    ".form-container",
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.3"
  );

  // Header text animation
  tl.fromTo(
    ".form-header h1",
    {
      y: 30,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.5"
  );

  tl.fromTo(
    ".form-header p",
    {
      y: 20,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.7"
  );

  // Stagger form sections
  gsap.from(".form-section", {
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".form-container",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Animated section titles
  gsap.from(".section-title", {
    opacity: 0,
    x: -20,
    stagger: 0.2,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".form-container",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Submit button animation
  gsap.from(".submit-btn", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".submit-btn",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
}

// Form validation
const form = document.getElementById("internshipForm");
const inputs = form.querySelectorAll("input, textarea, select");

inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    validateInput(this);
  });

  input.addEventListener("focus", function () {
    // Remove validation classes on focus
    this.classList.remove("is-valid", "is-invalid");

    // Remove feedback messages
    const feedbacks = this.parentElement.querySelectorAll(
      ".valid-feedback, .invalid-feedback"
    );
    feedbacks.forEach((el) => el.remove());
  });
});

// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   let isValid = true;
//   inputs.forEach((input) => {
//     if (input.required && !validateInput(input)) {
//       isValid = false;
//     }
//   });

//   if (isValid) {
//     // Show success animation
//     const submitBtn = this.querySelector(".submit-btn");

//     gsap.to(submitBtn, {
//       backgroundColor: "#00b894",
//       scale: 1.05,
//       duration: 0.3,
//       ease: "back.out(1.7)",
//       onComplete: function () {
//         submitBtn.innerHTML =
//           '<i class="fas fa-check"></i> Application Submitted!';

//         gsap.to(submitBtn, {
//           scale: 1,
//           duration: 0.3,
//           ease: "power2.out",
//         });
//       },
//     });

//     // Disable form
//     inputs.forEach((input) => {
//       input.disabled = true;
//     });

//     // You would typically send data to server here
//     console.log("Form submitted successfully");
//   } else {
//     // Scroll to first invalid field
//     const firstInvalid = form.querySelector(".is-invalid");
//     if (firstInvalid) {
//       firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   }
// });

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;
  let message = "";

  // Remove existing feedback
  const feedbacks = input.parentElement.querySelectorAll(
    ".valid-feedback, .invalid-feedback"
  );
  feedbacks.forEach((el) => el.remove());

  // Skip validation if not required and empty
  if (!input.required && value === "") {
    input.classList.remove("is-valid", "is-invalid");
    return true;
  }

  // Required field check
  if (input.required && value === "") {
    isValid = false;
    message = "This field is required";
  } else if (input.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
    message = isValid
      ? "Email looks good!"
      : "Please enter a valid email address";
  } else if (input.type === "tel") {
    const phoneRegex = /^\d{10,15}$/;
    if (value !== "") {
      isValid = phoneRegex.test(value);
      message = isValid
        ? "Phone number looks good!"
        : "Please enter a valid phone number";
    }
  } else if (input.type === "url") {
    if (value !== "") {
      try {
        new URL(value);
        isValid = true;
        message = "URL looks good!";
      } catch (e) {
        isValid = false;
        message = "Please enter a valid URL";
      }
    }
  } else if (input.type === "file") {
    if (input.required && input.files.length === 0) {
      isValid = false;
      message = "Please upload a file";
    }
  } else if (input.tagName === "SELECT") {
    isValid = value !== "";
    message = isValid ? "Selection looks good!" : "Please select an option";
  } else if (input.required) {
    isValid = value !== "";
    message = isValid ? "Looks good!" : "This field is required";
  }

  // Add validation classes and feedback
  if (isValid) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");

    if (message) {
      const validFeedback = document.createElement("div");
      validFeedback.className = "valid-feedback";
      validFeedback.textContent = message;
      input.parentElement.appendChild(validFeedback);
    }
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    const invalidFeedback = document.createElement("div");
    invalidFeedback.className = "invalid-feedback";
    invalidFeedback.textContent = message;
    input.parentElement.appendChild(invalidFeedback);
  }

  return isValid;
}

// Star rating system
// const starContainers = document.querySelectorAll(".stars");

// starContainers.forEach((container) => {
//   const stars = container.querySelectorAll(".star");
//   const inputId = container.dataset.ratingFor;
//   const input = document.getElementById(inputId);

//   stars.forEach((star) => {
//     star.addEventListener("click", function () {
//       const value = this.dataset.value;
//       input.value = value;

//       // Update star display
//       stars.forEach((s) => {
//         if (s.dataset.value <= value) {
//           s.classList.add("active");
//         } else {
//           s.classList.remove("active");
//         }
//       });
//     });

//     star.addEventListener("mouseover", function () {
//       const value = this.dataset.value;

//       stars.forEach((s) => {
//         if (s.dataset.value <= value) {
//           s.style.color = "var(--accent-color-secondary)";
//         }
//       });
//     });

//     star.addEventListener("mouseout", function () {
//       stars.forEach((s) => {
//         s.style.color = "";
//       });
//     });
//   });
// });

// Range slider
const rangeSlider = document.getElementById("yearsExperience");
const rangeValue = document.querySelector(".range-value");

rangeSlider.addEventListener("input", function () {
  const value = this.value;
  rangeValue.textContent = value;

  // Calculate position
  const min = this.min ? parseFloat(this.min) : 0;
  const max = this.max ? parseFloat(this.max) : 100;
  const newVal = ((value - min) * 100) / (max - min);
  rangeValue.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  audio.play();
});

// Scroll progress
window.addEventListener("scroll", function () {
  const windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  document.querySelector(".scroll-progress").style.width = `${scrolled}%`;

  // Show/hide scroll to top button
  if (window.scrollY > 300) {
    document.querySelector(".scroll-to-top").classList.add("visible");
  } else {
    document.querySelector(".scroll-to-top").classList.remove("visible");
  }
});

// Scroll to top functionality
document.querySelector(".scroll-to-top").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("click", () => {
  audio.play();
});


const pillInput = document.getElementById("pillInput");
const pillWrapper = document.getElementById("pillWrapper");
const hiddenInput = document.getElementById("otherSkills");

let skills = [];

function createPill(skill) {
  if (!skill || skills.includes(skill.toLowerCase())) return;

  skills.push(skill.toLowerCase());
  updateHiddenInput();

  const pill = document.createElement("div");
  pill.className = "pill";
  pill.innerHTML = `${skill}<span class="remove">&times;</span>`;

  pill.querySelector(".remove").addEventListener("click", () => {
    skills = skills.filter((s) => s !== skill.toLowerCase());
    pillWrapper.removeChild(pill);
    updateHiddenInput();
  });

  pillWrapper.insertBefore(pill, pillInput);
}

function updateHiddenInput() {
  hiddenInput.value = skills.join(",");
}

pillInput.addEventListener("keydown", function (e) {
  if (e.key === "," || e.key === "Enter") {
    e.preventDefault();
    const value = pillInput.value.trim().replace(",", "");
    if (value) {
      createPill(value);
      pillInput.value = "";
    }
  }
});