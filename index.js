// Select .content div, all sections, and sidebar links
const content = document.querySelector(".content");
const sections = document.querySelectorAll("section");
const sideLinks = document.querySelectorAll(".sidebar .side-menu li a");

function updateActiveLinkOnScroll() {
    let currentSection = "";

    // Iterate through each section to find the one in view within .content
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const contentScroll = content.scrollTop;

        // Adjust section boundaries to detect which is in view
        if (contentScroll >= sectionTop - sectionHeight / 6 && contentScroll < sectionTop + sectionHeight - sectionHeight / 6) {
            currentSection = section.getAttribute("id");
        }
    });

    // Update the active class on sidebar links based on currentSection
    sideLinks.forEach(link => {
        const li = link.parentElement;
        li.classList.remove("active");

        if (link.getAttribute("href").substring(1) === currentSection) {
            li.classList.add("active");
        }
    });
}

// Attach scroll event listener to .content div
content.addEventListener("scroll", updateActiveLinkOnScroll);

// Initial check to set the active link when the page loads
updateActiveLinkOnScroll();


const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
});

function tdnn() {
    const tdnnElement = document.getElementsByClassName("tdnn")[0];
    const body = document.body;

    // Toggle the sun and moon appearance
    document.getElementsByClassName("moon")[0].classList.toggle("sun");

    // Toggle the background theme (day/night) on the tdnn element
    tdnnElement.classList.toggle("day");

    // Add or remove 'dark' class from the body
    if (tdnnElement.classList.contains("day")) {
      body.classList.remove("dark"); // Light mode
      body.classList.add("light");
    } else {
      body.classList.remove("light");
      body.classList.add("dark"); // Dark mode
    }
  }
