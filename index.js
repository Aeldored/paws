const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
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

const scrollContainer = document.querySelector('.content');
scrollContainer.addEventListener('mouseover', () => {
    scrollContainer.style.overflowY = 'scroll';
});
scrollContainer.addEventListener('mouseleave', () => {
    scrollContainer.style.overflowY = 'hidden';
});

function adjustScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    window.scrollTo({
      top: targetElement.offsetTop - 10, // Adjust the value as needed
      behavior: 'smooth'
    });
  }

