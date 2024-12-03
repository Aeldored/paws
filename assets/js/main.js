const content = document.querySelector(".content");
const sections = document.querySelectorAll("section");
const sideLinks = document.querySelectorAll(".sidebar .side-menu li a");

function updateActiveLinkOnScroll() {
   let currentSection = "";
   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const contentScroll = content.scrollTop;
      if (contentScroll >= sectionTop - sectionHeight / 6 && contentScroll < sectionTop + sectionHeight - sectionHeight / 6) {
         currentSection = section.getAttribute("id");
      }
   });
   sideLinks.forEach(link => {
      const li = link.parentElement;
      li.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSection) {
         li.classList.add("active");
      }
   });
}
content.addEventListener("scroll", updateActiveLinkOnScroll);
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
   document.getElementsByClassName("moon")[0].classList.toggle("sun");
   tdnnElement.classList.toggle("day");
   if (tdnnElement.classList.contains("day")) {
      body.classList.remove("dark");
      body.classList.add("light");
   } else {
      body.classList.remove("light");
      body.classList.add("dark");
   }
}
if (window.location.pathname.includes('admin.html')) {
   function fetchNotifications() {
      fetch('php/get_notifications.php')
         .then(response => response.json())
         .then(notifications => {
            const notifDropdown = document.getElementById('notif-dropdown');
            const notifCount = document.querySelector('.notif .count');
            const notifIcon = document.getElementById('notif-icon');
            notifDropdown.innerHTML = '';
            if (notifications.length === 0) {
               notifIcon.style.pointerEvents = 'none';
               notifIcon.style.opacity = 0.5;
               notifDropdown.style.display = 'none';
            } else {
               notifIcon.style.pointerEvents = 'auto';
               notifIcon.style.opacity = 1;
            }
            notifications.forEach(notification => {
               const li = document.createElement('li');
               li.classList.add('notification');
               li.setAttribute('data-id', notification.id);
               li.innerHTML = `
                        <span>${notification.message}</span>
                        <button onclick="markAsRead(this)">Mark as Read</button>
                    `;
               notifDropdown.appendChild(li);
            });
            notifCount.textContent = notifications.length;
         });
   }
   window.addEventListener('load', fetchNotifications);
   document.getElementById('notif-icon').addEventListener('click', () => {
      const notifDropdown = document.getElementById('notif-dropdown');
      notifDropdown.style.display = (notifDropdown.style.display === 'block') ? 'none' : 'block';
      if (notifDropdown.style.display === 'block') {
         fetchNotifications();
      }
   });

   function markAsRead(button) {
      const notification = button.closest('.notification');
      const notifId = notification.getAttribute('data-id');
      fetch('php/mark_as_read.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               id: notifId
            }),
         })
         .then(response => response.json())
         .then(result => {
            if (result.success) {
               notification.remove();
               const notifCount = document.querySelector('.notif .count');
               const currentCount = parseInt(notifCount.textContent, 10);
               notifCount.textContent = Math.max(currentCount - 1, 0);
               const remainingNotifications = document.querySelectorAll('.notification');
               if (remainingNotifications.length === 0) {
                  document.getElementById('notif-dropdown').style.display = 'none';
               }
            }
         });
   }
}
document.querySelectorAll('.popover-trigger').forEach(trigger => {
   trigger.addEventListener('click', function (event) {
      event.preventDefault();
      const formId = this.getAttribute('data-form');
      document.getElementById(formId).style.display = 'block';
      document.getElementById('overlay').style.display = 'block';
   });
});
document.querySelectorAll('.close-btn').forEach(button => {
   button.addEventListener('click', function () {
      this.closest('.popover-card').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
   });
});
document.querySelectorAll('.close-btn-rehome').forEach(button => {
   button.addEventListener('click', function () {
      this.closest('.popover-card').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
   });
});
document.querySelectorAll('.close-btn-foster').forEach(button => {
   button.addEventListener('click', function () {
      this.closest('.popover-card').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('pet-overlay').style.display = 'none';
   });
});
document.querySelectorAll('.close-btn-form').forEach(button => {
   button.addEventListener('click', function () {
      this.closest('.popover-card').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('pet-overlay').style.display = 'none';
   });
});
document.querySelectorAll('.close-btn-all').forEach(button => {
   button.addEventListener('click', function () {
      this.closest('.popover-card').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
   });
});
document.querySelectorAll('.close-btn-spon').forEach(button => {
   button.addEventListener('click', function () {
      this.closest('.popover-card').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
   });
});
document.getElementById('overlay').addEventListener('click', function () {
   document.querySelectorAll('.popover-card').forEach(card => {
      card.style.display = 'none';
   });
   this.style.display = 'none';
});

function initializeCarousel(carouselId) {
   const track = document.querySelector(`#${carouselId}-track`);
   const prevButton = document.querySelector(`.carousel-control.prev[data-carousel="${carouselId}"]`);
   const nextButton = document.querySelector(`.carousel-control.next[data-carousel="${carouselId}"]`);
   const cardWidth = document.querySelector('.animal-card').offsetWidth + 20;
   let currentPosition = 0;
   nextButton.addEventListener('click', () => {
      if (currentPosition > -(track.scrollWidth - cardWidth)) {
         currentPosition -= cardWidth;
         track.style.transform = `translateX(${currentPosition}px)`;
      }
   });
   prevButton.addEventListener('click', () => {
      if (currentPosition < 0) {
         currentPosition += cardWidth;
         track.style.transform = `translateX(${currentPosition}px)`;
      }
   });
}
initializeCarousel('cats');
initializeCarousel('dogs');

function showModal() {
   document.getElementById('modal-overlay').style.display = 'block';
   document.getElementById('modal').style.display = 'block';
}

function closesModal() {
   document.getElementById('modal-overlay').style.display = 'none';
   document.getElementById('modal').style.display = 'none';
}

function updateQRCode() {
   const paymentMethod = document.getElementById("paymentMethod").value;
   const qrCodeDisplay = document.getElementById("qrCodeDisplay");
   const qrCodeImage = document.getElementById("qrCodeImage");
   if (paymentMethod === "gcash") {
      qrCodeImage.src = "assets/images/gcash-qr.png";
      qrCodeDisplay.style.display = "block";
   } else if (paymentMethod === "paymaya") {
      qrCodeImage.src = "assets/images/paymaya-qr.png";
      qrCodeDisplay.style.display = "block";
   } else {
      qrCodeDisplay.style.display = "none";
   }
}
document.getElementById('donateFormContent').addEventListener('submit', function (event) {
   event.preventDefault();
   const formData = new FormData(event.target);
   fetch('php/donateform.php', {
         method: 'POST',
         body: formData,
      })
      .then(response => {
         if (!response.ok) {
            return response.json().then(errorData => {
               throw new Error(errorData.error || 'An error occurred');
            });
         }
         return response.json();
      })
      .then(() => {
         return fetch('php/donateform.php');
      })
      .then(response => {
         if (!response.ok) {
            return response.json().then(errorData => {
               throw new Error(errorData.error || 'An error occurred');
            });
         }
         return response.json();
      })
      .then(data => {
         const donorsList = document.getElementById('donorsList');
         donorsList.innerHTML = "";
         currentPage = 1;
         loadDonors();
         data.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${donor.donorName}</td>
                    <td>₱${donor.donationAmount}</td>
                    <td>${donor.location}</td>
                `;
            donorsList.appendChild(row);
         });
         document.getElementById('donorsTable').style.display = 'block';
         document.getElementById('donateForm').style.display = 'none';
         document.getElementById('viewDonorsButton').style.display = 'none';
         document.getElementById('donateAgainButton').style.display = 'block';
      })
      .catch(error => {
         console.error('Error:', error);
         alert('Failed to submit donation: ' + error.message);
      });
});
document.getElementById('donateAgainButton').addEventListener('click', function () {
   document.getElementById('donateForm').style.display = 'block';
   document.getElementById('donorsTable').style.display = 'none';
   document.getElementById('viewDonorsButton').style.display = 'block';
   document.getElementById('donateAgainButton').style.display = 'none';
});
document.getElementById('viewDonorsButton').addEventListener('click', function () {
   fetch('php/donateform.php')
      .then(response => {
         if (!response.ok) {
            return response.json().then(errorData => {
               throw new Error(errorData.error || 'An error occurred');
            });
         }
         return response.json();
      })
      .then(data => {
         const donorsList = document.getElementById('donorsList');
         donorsList.innerHTML = "";
         currentPage = 1;
         loadDonors();
         data.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${donor.donorName}</td>
                    <td>₱${donor.donationAmount}</td>
                    <td>${donor.location}</td>
                `;
            donorsList.appendChild(row);
         });
         document.getElementById('donorsTable').style.display = 'block';
         document.getElementById('donateForm').style.display = 'none';
         document.getElementById('viewDonorsButton').style.display = 'block';
         document.getElementById('donateAgainButton').style.display = 'block';
      })
      .catch(error => {
         console.error('Error:', error);
         alert('Failed to load donors: ' + error.message);
      });
});

function resetForm() {
   const donateForm = document.getElementById("donateFormContent");
   donateForm.reset();
   document.getElementById("paymentMethod").value = "";
   const inputs = donateForm.querySelectorAll('input, select');
   inputs.forEach(input => {
      input.setCustomValidity('');
   });
   document.getElementById("qrCodeDisplay").style.display = "none";
   document.getElementById("qrCodeImage").src = "";
}
document.getElementById("donateAgainButton").addEventListener("click", resetForm);
document.querySelector(".close-btn").addEventListener("click", resetForm);
document.querySelector(".close-btn-form").addEventListener("click", resetForm);
document.querySelector(".close-btn-all").addEventListener("click", resetForm);
let currentPage = 1;
let donorsPerPage = 10;
let donorsData = [];

function changeDonorsView() {
   currentPage = 1;
   loadDonors();
}

function loadDonors() {
   const filter = document.getElementById("donorsFilter").value;
   const isAdminPage = window.location.pathname.includes('admin.html');
   fetch(`php/getDonors.php?viewType=${filter}&page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
         if (data.error) {
            alert('Error: ' + data.error);
            return;
         }
         donorsData = data.donors;
         const totalDonors = data.totalDonors;
         const donorsList = document.getElementById("donorsList");
         donorsList.innerHTML = "";
         donorsData.forEach(donor => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", donor.id);
            row.innerHTML = `
                    <td>${donor.donorName}</td>
                    <td>₱${donor.donationAmount}</td>
                    <td>${donor.location}</td>
                    ${isAdminPage ? `<td>
                        <button class="edit-btn" onclick="editDonorsRow(this)">Edit</button>
                        <button class="delete-btn" onclick="deleteDonorsRow(this)">Delete</button>
                    </td>` : ''}
                `;
            donorsList.appendChild(row);
         });
         updatePagination(totalDonors);
      })
      .catch(error => {
         console.error('Error fetching donor data:', error);
      });
}

function updatePagination(totalDonors) {
   const totalPages = Math.ceil(totalDonors / donorsPerPage);
   const prevButton = document.getElementById("prevPageButton");
   const nextButton = document.getElementById("nextPageButton");
   if (currentPage === 1) {
      prevButton.style.display = "none";
   } else {
      prevButton.style.display = "inline-block";
   }
   if (currentPage === totalPages) {
      nextButton.style.display = "none";
   } else {
      nextButton.style.display = "inline-block";
   }
}

function changePage(direction) {
   currentPage += direction;
   loadDonors();
}
document.getElementById("viewDonorsButton").addEventListener("click", function () {
   currentPage = 1;
   loadDonors();
});
loadDonors();

function editDonorsRow(button) {
   const row = button.closest("tr");
   const nameCell = row.cells[0];
   const amountCell = row.cells[1];
   const locationCell = row.cells[2];
   const cleanAmount = amountCell.innerText.replace(/[^\d.-]/g, '');
   nameCell.innerHTML = `<input type="text" value="${nameCell.innerText}" />`;
   amountCell.innerHTML = `<input type="number" value="${cleanAmount}" />`;
   locationCell.innerHTML = `<input type="text" value="${locationCell.innerText}" />`;
   button.innerHTML = "Save";
   button.onclick = () => saveDonorsRow(button);
   const cancelButton = document.createElement("button");
   cancelButton.className = "cancel-btn";
   cancelButton.innerHTML = "Cancel";
   cancelButton.onclick = () => cancelEdit(button);
   row.cells[3].appendChild(cancelButton);
}

function saveDonorsRow(button) {
   const row = button.closest("tr");
   const donorId = row.getAttribute("data-id");
   const nameInput = row.cells[0].querySelector("input");
   const amountInput = row.cells[1].querySelector("input");
   const locationInput = row.cells[2].querySelector("input");
   row.cells[0].innerText = nameInput.value;
   row.cells[1].innerText = `₱${amountInput.value}`;
   row.cells[2].innerText = locationInput.value;
   button.innerHTML = "Edit";
   button.onclick = () => editDonorsRow(button);
   const cancelButton = row.cells[3].querySelector(".cancel-btn");
   cancelButton.remove();
   const updatedData = {
      name: nameInput.value,
      amount: amountInput.value,
      location: locationInput.value
   };
   fetch(`crudphp/update-donor.php?id=${donorId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(updatedData)
      })
      .then(response => response.json())
      .then(data => {
         if (data.status === 'success') {
            console.log('Donor updated:', data);
         } else {
            alert('Failed to update donor: ' + data.message);
         }
      })
      .catch(error => {
         console.error('Error updating donor:', error);
      });
}

function cancelEdit(button) {
   const row = button.closest("tr");
   const nameCell = row.cells[0];
   const amountCell = row.cells[1];
   const locationCell = row.cells[2];
   nameCell.innerText = nameCell.querySelector("input").defaultValue;
   amountCell.innerText = `₱${amountCell.querySelector("input").defaultValue}`;
   locationCell.innerText = locationCell.querySelector("input").defaultValue;
   button.innerHTML = "Edit";
   button.onclick = () => editDonorsRow(button);
   const cancelButton = row.cells[3].querySelector(".cancel-btn");
   cancelButton.remove();
}

function deleteDonorsRow(button) {
   const row = button.closest("tr");
   const donorId = row.getAttribute("data-id");
   const name = row.cells[0].innerText;
   if (confirm(`Are you sure you want to delete donor ${name}?`)) {
      row.remove();
      fetch('crudphp/delete-donor.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
               'id': donorId,
               '_method': 'DELETE'
            })
         })
         .then(response => response.json())
         .then(data => {
            if (data.status === 'success') {
               console.log('Donor deleted successfully');
            } else {
               console.error('Failed to delete donor:', data.message);
            }
         })
         .catch(error => {
            console.error('Error deleting donor:', error);
         });
   }
}
document.addEventListener("DOMContentLoaded", function () {
   fetch('php/sponsors_pet.php')
      .then(response => response.json())
      .then(data => {
         const petDropdown = document.getElementById('petId');
         if (data.pets && Array.isArray(data.pets)) {
            data.pets.forEach(pet => {
               const option = document.createElement('option');
               option.value = pet.id;
               option.textContent = pet.name;
               petDropdown.appendChild(option);
            });
         } else {
            console.error('No pets available to sponsor');
         }
      })
      .catch(error => {
         console.error('Error fetching pets:', error);
      });
   document.getElementById('sponsorFormContent').addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      fetch('php/sponsorform.php', {
            method: 'POST',
            body: formData,
         })
         .then(response => {
            if (!response.ok) {
               return response.json().then(errorData => {
                  throw new Error(errorData.error || 'An error occurred');
               });
            }
            return response.json();
         })
         .then(() => {
            fetchSponsors();
            loadSponsors();
            document.getElementById('sponsorForm').style.display = 'none';
            document.getElementById('sponsorsTable').style.display = 'block';
            document.getElementById('sponsorAgainButton').style.display = 'block';
            const petId = formData.get('petId');
            removePetFromDropdown(petId);
         })
         .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit sponsorship: ' + error.message);
         });
   });

   function removePetFromDropdown(petId) {
      const petDropdown = document.getElementById('petId');
      const options = petDropdown.querySelectorAll('option');
      options.forEach(option => {
         if (option.value == petId) {
            option.remove();
         }
      });
   }

   function fetchSponsors() {}
});
document.getElementById('viewSponsorsButton').addEventListener('click', function () {
   fetchSponsors();
   document.getElementById('sponsorForm').style.display = 'none';
   document.getElementById('sponsorsTable').style.display = 'block';
   document.getElementById('sponsorAgainButton').style.display = 'block';
});
document.getElementById('sponsorAgainButton').addEventListener('click', function () {
   document.getElementById('sponsorForm').style.display = 'block';
   document.getElementById('sponsorsTable').style.display = 'none';
   document.getElementById('sponsorAgainButton').style.display = 'none';
   resetSponsorForm();
});

function fetchSponsors() {
   fetch('php/getSponsors.php')
      .then(response => response.json())
      .then(data => {
         const sponsorsList = document.getElementById('sponsorsList');
         sponsorsList.innerHTML = "";
         data.sponsors.forEach(sponsor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${sponsor.name}</td>
                    <td>₱${sponsor.amount}</td>
                    <td>${sponsor.pet_name}</td>
                `;
            sponsorsList.appendChild(row);
         });
         document.getElementById('sponsorsTable').style.display = 'block';
      })
      .catch(error => {
         console.error('Error fetching sponsors:', error);
      });
}

function resetSponsorForm() {
   const sponsorForm = document.getElementById("sponsorFormContent");
   sponsorForm.reset();
   document.getElementById("sponsorPaymentMethod").value = "";
   const inputs = sponsorForm.querySelectorAll('input, select');
   inputs.forEach(input => {
      input.setCustomValidity('');
   });
   document.getElementById("sponsorQRCodeDisplay").style.display = "none";
   document.getElementById("sponsorQRCodeImage").src = "";
}
document.getElementById("sponsorAgainButton").addEventListener("click", resetSponsorForm);
document.querySelector(".close-btn-spon").addEventListener("click", resetSponsorForm);
document.querySelector(".close-btn-form").addEventListener("click", resetSponsorForm);
document.querySelector(".close-btn-all").addEventListener("click", resetSponsorForm);

function updateQRCodeForSponsors() {
   const paymentMethod = document.getElementById("sponsorPaymentMethod").value;
   const qrCodeDisplay = document.getElementById("sponsorQRCodeDisplay");
   const qrCodeImage = document.getElementById("sponsorQRCodeImage");
   if (paymentMethod === "gcash") {
      qrCodeImage.src = "assets/images/gcash-qr.png";
      qrCodeDisplay.style.display = "block";
   } else if (paymentMethod === "paymaya") {
      qrCodeImage.src = "assets/images/paymaya-qr.png";
      qrCodeDisplay.style.display = "block";
   } else {
      qrCodeDisplay.style.display = "none";
   }
}
let sponsorsCurrentPage = 1;
let sponsorsPerPage = 10;
let sponsorsData = [];

function changeSponsorsView() {
   sponsorsCurrentPage = 1;
   loadSponsors();
}

function loadSponsors() {
   const filter = document.getElementById("sponsorsFilter").value;
   const isAdminPage = window.location.pathname.includes('admin.html');
   fetch(`php/getSponsors.php?viewType=${filter}&page=${sponsorsCurrentPage}`)
      .then(response => response.json())
      .then(data => {
         if (data.error) {
            alert('Error: ' + data.error);
            return;
         }
         sponsorsData = data.sponsors;
         const totalSponsors = data.totalSponsors;
         const sponsorsList = document.getElementById("sponsorsList");
         sponsorsList.innerHTML = "";
         sponsorsData.forEach(sponsor => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", sponsor.id);
            row.setAttribute("data-pet-id", sponsor.pet_id);
            row.innerHTML = `
                    <td>${sponsor.name}</td>
                    <td>₱${sponsor.amount}</td>
                    <td>${sponsor.pet_name}</td>
                    ${isAdminPage ? `<td>
                        <button class="edit-btn" onclick="editSponsorRow(this)">Edit</button>
                        <button class="delete-btn" onclick="deleteSponsorRow(this)">Delete</button>
                    </td>` : ''}
                `;
            sponsorsList.appendChild(row);
         });
         updatePaginationForSponsors(totalSponsors);
      })
      .catch(error => {
         console.error('Error fetching sponsor data:', error);
      });
}

function updatePaginationForSponsors(totalSponsors) {
   const totalPages = Math.ceil(totalSponsors / sponsorsPerPage);
   const prevButton = document.getElementById("previousPageButton");
   const nextButton = document.getElementById("nexttPageButton");
   if (sponsorsCurrentPage === 1) {
      prevButton.style.display = "none";
   } else {
      prevButton.style.display = "inline-block";
   }
   if (sponsorsCurrentPage === totalPages) {
      nextButton.style.display = "none";
   } else {
      nextButton.style.display = "inline-block";
   }
}

function changeSponsorsPage(direction) {
   sponsorsCurrentPage += direction;
   loadSponsors();
}
document.getElementById("viewSponsorsButton").addEventListener("click", function () {
   sponsorsCurrentPage = 1;
   loadSponsors();
});
loadSponsors();

function editSponsorRow(button) {
   const row = button.closest("tr");
   const nameCell = row.cells[0];
   const amountCell = row.cells[1];
   const petNameCell = row.cells[2];
   const cleanAmount = amountCell.innerText.replace(/[^\d.-]/g, '');
   nameCell.innerHTML = `<input type="text" value="${nameCell.innerText}" />`;
   amountCell.innerHTML = `<input type="number" value="${cleanAmount}" />`;
   petNameCell.innerHTML = `<span>${petNameCell.innerText}</span>`;
   button.innerHTML = "Save";
   button.onclick = () => saveSponsorRow(button);
   const cancelButton = document.createElement("button");
   cancelButton.className = "cancel-btn";
   cancelButton.innerHTML = "Cancel";
   cancelButton.onclick = () => cancelSponsorEdit(button);
   row.cells[3].appendChild(cancelButton);
}

function saveSponsorRow(button) {
   const row = button.closest("tr");
   const sponsorId = row.getAttribute("data-id");
   const petId = row.getAttribute('data-pet-id');
   const nameInput = row.cells[0].querySelector("input");
   const amountInput = row.cells[1].querySelector("input");
   const petName = row.cells[2].querySelector("span").innerText;
   row.cells[0].innerText = nameInput.value;
   row.cells[1].innerText = `₱${amountInput.value}`;
   row.cells[2].innerText = petName;
   button.innerHTML = "Edit";
   button.onclick = () => editSponsorRow(button);
   const cancelButton = row.cells[3].querySelector(".cancel-btn");
   cancelButton.remove();
   const updatedData = {
      name: nameInput.value,
      amount: amountInput.value,
      pet_id: petId,
   };
   fetch(`crudphp/update-sponsor.php?id=${sponsorId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(updatedData),
      })
      .then(response => response.json())
      .then(data => {
         if (data.status === 'success') {
            console.log('Sponsor updated successfully');
         } else {
            alert('Failed to update sponsor: ' + data.message);
         }
      })
      .catch(error => console.error('Error updating sponsor:', error));
}

function cancelSponsorEdit(editButton) {
   const row = editButton.closest("tr");
   const sponsorId = row.getAttribute("data-id");
   const originalSponsor = sponsorsData.find(sponsor => sponsor.id == sponsorId);
   row.cells[0].innerText = originalSponsor.name;
   row.cells[1].innerText = `₱${originalSponsor.amount}`;
   row.cells[2].innerText = originalSponsor.pet_name;
   const editBtn = row.cells[3].querySelector(".edit-btn");
   editBtn.innerHTML = "Edit";
   editBtn.onclick = () => editSponsorRow(editBtn);
   const cancelBtn = row.cells[3].querySelector(".cancel-btn");
   cancelBtn.remove();
}

function deleteSponsorRow(button) {
   const row = button.closest("tr");
   const sponsorId = row.getAttribute("data-id");
   if (confirm("Are you sure you want to delete this sponsor?")) {
      fetch('crudphp/delete-sponsor.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
               '_method': 'DELETE',
               'id': sponsorId
            })
         })
         .then(response => response.json())
         .then(data => {
            if (data.status === 'success') {
               row.remove();
               alert('Sponsor deleted successfully');
            } else {
               alert('Failed to delete sponsor: ' + data.message);
            }
         })
         .catch(error => {
            console.error('Error deleting sponsor:', error);
         });
   }
}
document.addEventListener("DOMContentLoaded", function () {
   fetch('php/foster_pet.php')
      .then(response => response.json())
      .then(data => {
         const petDropdown = document.getElementById('fosterPetId');
         if (data.pets && Array.isArray(data.pets)) {
            data.pets.forEach(pet => {
               const option = document.createElement('option');
               option.value = pet.id;
               option.textContent = pet.name;
               petDropdown.appendChild(option);
            });
         } else {
            console.error('No pets available to foster');
         }
      })
      .catch(error => {
         console.error('Error fetching pets:', error);
      });
   document.getElementById('fosterFormContent').addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      fetch('php/fosterform.php', {
            method: 'POST',
            body: formData,
         })
         .then(response => {
            if (!response.ok) {
               return response.json().then(errorData => {
                  throw new Error(errorData.error || 'An error occurred');
               });
            }
            return response.json();
         })
         .then(() => {
            fetchFosters();
            loadFosters();
            document.getElementById('fosterForm').style.display = 'none';
            document.getElementById('fostersTable').style.display = 'block';
            document.getElementById('fosterAgainButton').style.display = 'block';
            const petId = formData.get('petId');
            removePetFromDropdown(petId);
         })
         .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit foster request: ' + error.message);
         });
   });

   function removePetFromDropdown(petId) {
      const petDropdown = document.getElementById('fosterPetId');
      const options = petDropdown.querySelectorAll('option');
      options.forEach(option => {
         if (option.value == petId) {
            option.remove();
         }
      });
   }

   function fetchFosters() {}
});
document.getElementById('viewFostersButton').addEventListener('click', function () {
   fetchFosters();
   document.getElementById('fosterForm').style.display = 'none';
   document.getElementById('fostersTable').style.display = 'block';
   document.getElementById('fosterAgainButton').style.display = 'block';
});
document.getElementById('fosterAgainButton').addEventListener('click', function () {
   document.getElementById('fosterForm').style.display = 'block';
   document.getElementById('fostersTable').style.display = 'none';
   document.getElementById('fosterAgainButton').style.display = 'none';
   resetFosterForm();
});

function fetchFosters() {
   fetch('php/getFosters.php')
      .then(response => response.json())
      .then(data => {
         const fostersList = document.getElementById('fostersList');
         fostersList.innerHTML = "";
         data.fosters.forEach(foster => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${foster.name}</td>
                     <td>${foster.duration} weeks</td>
                    <td>${foster.pet_name}</td>
                `;
            fostersList.appendChild(row);
         });
         document.getElementById('fostersTable').style.display = 'block';
      })
      .catch(error => {
         console.error('Error fetching fosters:', error);
      });
}

function resetFosterForm() {
   const fosterForm = document.getElementById("fosterFormContent");
   fosterForm.reset();
   const inputs = fosterForm.querySelectorAll('input, select');
   inputs.forEach(input => {
      input.setCustomValidity('');
   });
}
document.getElementById("fosterAgainButton").addEventListener("click", resetFosterForm);
document.querySelector(".close-btn-foster").addEventListener("click", resetFosterForm);
document.querySelector(".close-btn-form").addEventListener("click", resetFosterForm);
document.querySelector(".close-btn-all").addEventListener("click", resetFosterForm);
let fostersCurrentPage = 1;
let fostersPerPage = 10;
let fostersData = [];

function changeFostersView() {
   fostersCurrentPage = 1;
   loadFosters();
}

function loadFosters() {
   const filter = document.getElementById("fostersFilter").value;
   const isAdminPage = window.location.pathname.includes('admin.html');
   fetch(`php/getFosters.php?viewType=${filter}&page=${fostersCurrentPage}`)
      .then(response => response.json())
      .then(data => {
         if (data.error) {
            alert('Error: ' + data.error);
            return;
         }
         fostersData = data.fosters;
         const totalFosters = data.totalFosters;
         const fostersList = document.getElementById("fostersList");
         fostersList.innerHTML = "";
         fostersData.forEach(foster => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", foster.id);
            row.setAttribute("data-pet-id", foster.pet_id);
            row.innerHTML = `
                    <td>${foster.name}</td>
                    <td>${foster.duration} weeks</td>
                    <td>${foster.pet_name}</td>
                    ${isAdminPage ? `<td>
                        <button class="edit-btn" onclick="editFosterRow(this)">Edit</button>
                        <button class="delete-btn" onclick="deleteFosterRow(this)">Delete</button>
                    </td>` : ''}
                `;
            fostersList.appendChild(row);
         });
         updatePaginationForFosters(totalFosters);
      })
      .catch(error => {
         console.error('Error fetching foster data:', error);
      });
}

function updatePaginationForFosters(totalFosters) {
   const totalPages = Math.ceil(totalFosters / fostersPerPage);
   const prevButton = document.getElementById("previousFosterPageButton");
   const nextButton = document.getElementById("nextFosterPageButton");
   if (fostersCurrentPage === 1) {
      prevButton.style.display = "none";
   } else {
      prevButton.style.display = "inline-block";
   }
   if (fostersCurrentPage === totalPages) {
      nextButton.style.display = "none";
   } else {
      nextButton.style.display = "inline-block";
   }
}

function changeFostersPage(direction) {
   fostersCurrentPage += direction;
   loadFosters();
}
document.getElementById("viewFostersButton").addEventListener("click", function () {
   fostersCurrentPage = 1;
   loadFosters();
});
loadFosters();

function editFosterRow(button) {
   const row = button.closest("tr");
   const nameCell = row.cells[0];
   const durationCell = row.cells[1];
   const petNameCell = row.cells[2];
   const cleanduration = durationCell.innerText.replace(/[^\d.-]/g, '');
   nameCell.innerHTML = `<input type="text" value="${nameCell.innerText}" />`;
   durationCell.innerHTML = `<input type="number" value="${cleanduration}" />`;
   petNameCell.innerHTML = `<span>${petNameCell.innerText}</span>`;
   button.innerHTML = "Save";
   button.onclick = () => saveFosterRow(button);
   const cancelButton = document.createElement("button");
   cancelButton.className = "cancel-btn";
   cancelButton.innerHTML = "Cancel";
   cancelButton.onclick = () => cancelFosterEdit(button);
   row.cells[3].appendChild(cancelButton);
}

function saveFosterRow(button) {
   const row = button.closest("tr");
   const fosterId = row.getAttribute("data-id");
   const petId = row.getAttribute("data-pet-id");
   const nameInput = row.cells[0].querySelector("input");
   const durationInput = row.cells[1].querySelector("input");
   const petName = row.cells[2].querySelector("span").innerText;
   row.cells[0].innerText = nameInput.value;
   row.cells[1].innerText = `${durationInput.value} weeks`;
   row.cells[2].innerText = petName;
   button.innerHTML = "Edit";
   button.onclick = () => editFosterRow(button);
   const cancelButton = row.cells[3].querySelector(".cancel-btn");
   cancelButton.remove();
   const updatedData = {
      name: nameInput.value,
      duration: durationInput.value,
      pet_id: petId
   };
   fetch(`crudphp/update-foster.php?id=${fosterId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(updatedData)
      })
      .then(response => response.json())
      .then(data => {
         if (data.status === 'success') {
            console.log('Foster updated:', data);
         } else {
            alert('Failed to update foster: ' + data.message);
         }
      })
      .catch(error => {
         console.error('Error updating foster:', error);
      });
}

function cancelFosterEdit(button) {
   const row = button.closest("tr");
   const nameCell = row.cells[0];
   const durationCell = row.cells[1];
   const petNameCell = row.cells[2];
   nameCell.innerText = nameCell.querySelector("input").defaultValue;
   durationCell.innerText = `${durationCell.querySelector("input").defaultValue} weeks`;
   petNameCell.innerText = petNameCell.querySelector("span").innerText;
   button.innerHTML = "Edit";
   button.onclick = () => editFosterRow(button);
   const cancelButton = row.cells[3].querySelector(".cancel-btn");
   cancelButton.remove();
}

function deleteFosterRow(button) {
   const row = button.closest("tr");
   const fosterId = row.getAttribute("data-id");
   if (confirm("Are you sure you want to delete this foster?")) {
      fetch('crudphp/delete-foster.php', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
               '_method': 'DELETE',
               'id': fosterId
            })
         })
         .then(response => response.json())
         .then(data => {
            if (data.status === 'success') {
               row.remove();
               alert('Foster deleted successfully');
            } else {
               alert('Failed to delete foster: ' + data.message);
            }
         })
         .catch(error => {
            console.error('Error deleting foster:', error);
         });
   }
}

function openModal(petType) {
   const form = document.getElementById('addPetForm');
   form.reset();
   document.getElementById('petImagePreview').style.display = 'none';
   document.querySelector('#addPetForm button[type="submit"]').innerText = 'Add Pet';
   form.action = 'php/add_pet.php';
   document.getElementById('petImage').setAttribute('required', 'true');
   
   const petIdInput = document.querySelector('#addPetForm input[name="petId"]');
   if (petIdInput) {
      petIdInput.remove();
   }

   document.getElementById('petType').value = petType;
   const activeTab = document.querySelector('.tab-button.active');
   const category = activeTab ? (activeTab.classList.contains('adoptable') ? 'adoptable' : 'fosterable') : 'adoptable';
   const petCategorySelect = document.getElementById('petCategory');
   petCategorySelect.value = category;
   document.getElementById('petCategoryHidden').value = category;
   document.getElementById('add-pet-modal').style.display = 'block';
   document.getElementById('pet-overlay').style.display = 'block';
   if (category === 'fosterable') {
      document.getElementById('petAge').setAttribute('placeholder', 'Age in months');
   } else {
      document.getElementById('petAge').setAttribute('placeholder', 'Age in years');
   }
}


function closeModal() {
   document.getElementById('add-pet-modal').style.display = 'none';
   document.getElementById('pet-overlay').style.display = 'none';
   document.getElementById("addPetForm").reset();
   document.getElementById('petImagePreview').style.display = 'none';
   document.getElementById('imagePreviewLabel').style.display = 'none';
}

function switchTab(category) {
   const adoptableTab = document.querySelector('.tab-button.adoptable');
   const fosterableTab = document.querySelector('.tab-button.fosterable');
   if (category === 'adoptable') {
      adoptableTab.classList.add('active');
      fosterableTab.classList.remove('active');
   } else {
      fosterableTab.classList.add('active');
      adoptableTab.classList.remove('active');
   }
   loadPets(category);
}

function onPetCardClick(petCategory) {
   switchTab(petCategory);
   console.log(`Pet clicked. Category: ${petCategory}`);
}

function closeAdoptForm() {
   document.getElementById('adoptForm').style.display = 'none';
   document.getElementById('pet-overlay').style.display = 'none';
}

function closeFosterForm() {
   document.getElementById('fosterpetForm').style.display = 'none';
   document.getElementById('pet-overlay').style.display = 'none';
}

function populatePetProfile(petId, formType) {
   fetch(`php/get_pet_profile.php?pet_id=${petId}`)
      .then(response => response.json())
      .then(data => {
         const pet = data.pet;
         if (formType === 'adoptForm') {
            document.getElementById('adoptProfileImage').src = `assets/uploads/${pet.image}`;
            document.getElementById('adoptProfileCategory').textContent = pet.category;
            document.getElementById('adoptProfileType').textContent = pet.type;
            document.getElementById('adoptProfileName').textContent = pet.name;
            document.getElementById('adoptProfileBreed').textContent = pet.breed;
            document.getElementById('adoptProfileAge').textContent = pet.age;
            document.getElementById('adoptProfileDescription').textContent = pet.description;
         } else if (formType === 'fosterpetForm') {
            document.getElementById('fosterProfileImage').src = `assets/uploads/${pet.image}`;
            document.getElementById('fosterProfileCategory').textContent = pet.category;
            document.getElementById('fosterProfileType').textContent = pet.type;
            document.getElementById('fosterProfileName').textContent = pet.name;
            document.getElementById('fosterProfileBreed').textContent = pet.breed;
            document.getElementById('fosterProfileAge').textContent = pet.age;
            document.getElementById('fosterProfileDescription').textContent = pet.description;
         }
      })
      .catch(error => console.error('Error fetching pet profile:', error));
}

function openAdoptForm(petId) {
   document.getElementById('adoptionPetId').value = petId;
   document.getElementById('adoptForm').style.display = 'block';
   document.getElementById('pet-overlay').style.display = 'block';
   populatePetProfile(petId, 'adoptForm');
}

function openFosterpetForm(petId) {
   document.getElementById('fostererPetId').value = petId;
   document.getElementById('fosterpetForm').style.display = 'block';
   document.getElementById('pet-overlay').style.display = 'block';
   populatePetProfile(petId, 'fosterpetForm');
}
document.getElementById("adoptFormContent").addEventListener("submit", function (event) {
   event.preventDefault();
   const adoptType = document.getElementById('adoptType').value;
   const petId = document.getElementById('adoptionPetId').value;
   const adopterName = document.getElementById('adopterName').value;
   const adopterEmail = document.getElementById('adopterEmail').value;
   const adopterPhone = document.getElementById('adopterPhone').value;
   const adoptReason = document.getElementById('adoptReason').value;
   if (!adoptType || !adopterName || !adopterEmail || !adopterPhone || !adoptReason) {
      alert("Please fill all fields.");
      return;
   }
   const formData = new FormData();
   formData.append('adoption_pet_id', petId);
   formData.append('adoptType', adoptType);
   formData.append('adopterName', adopterName);
   formData.append('adopterEmail', adopterEmail);
   formData.append('adopterPhone', adopterPhone);
   formData.append('adoptReason', adoptReason);
   fetch('php/adoptform.php', {
         method: 'POST',
         body: formData
      })
      .then(response => response.json())
      .then(data => {
         if (data.status === 'success') {
            alert('Adoption submitted successfully!');
            if (adoptType === 'walk-in') {
               const petCard = document.querySelector(`.animal-card[data-pet-id="${petId}"]`);
               if (petCard) {
                  petCard.remove();
               }
            } else if (adoptType === 'online') {
               const adoptButton = document.querySelector(`.adopt-button[data-pet-id="${petId}"]`);
               if (adoptButton) {
                  adoptButton.textContent = 'On Process';
                  adoptButton.disabled = true;
               }
            }
            loadPets('adoptable');
            document.getElementById("adoptFormContent").reset();
            closeAdoptForm();
         } else {
            alert('Error: ' + data.message);
         }
      })
      .catch(error => {
         console.error('Error during submission:', error);
         alert('An error occurred during submission.');
      });
});
document.getElementById("fosterpetFormContent").addEventListener("submit", function (event) {
   event.preventDefault();
   const fosterType = document.getElementById('fosterType').value;
   const petId = document.getElementById('fostererPetId').value;
   const fosterName = document.getElementById('fosterName').value;
   const fosterEmail = document.getElementById('fosterEmail').value;
   const fosterPhone = document.getElementById('fosterPhone').value;
   const fosterReason = document.getElementById('fosterReason').value;
   if (!fosterType || !fosterName || !fosterEmail || !fosterPhone || !fosterReason) {
      alert("Please fill all fields.");
      return;
   }
   const formData = new FormData();
   formData.append('foster_pet_id', petId);
   formData.append('fosterType', fosterType);
   formData.append('fosterName', fosterName);
   formData.append('fosterEmail', fosterEmail);
   formData.append('fosterPhone', fosterPhone);
   formData.append('fosterReason', fosterReason);
   fetch('php/fosterpetform.php', {
         method: 'POST',
         body: formData
      })
      .then(response => response.json())
      .then(data => {
         if (data.status === 'success') {
            alert('Fostering submitted successfully!');
            if (fosterType === 'walk-in') {
               const petCard = document.querySelector(`.animal-card[data-pet-id="${petId}"]`);
               if (petCard) {
                  petCard.remove();
               }
            } else if (fosterType === 'online') {
               const fosterButton = document.querySelector(`.foster-button[data-pet-id="${petId}"]`);
               if (fosterButton) {
                  fosterButton.textContent = 'On Process';
                  fosterButton.disabled = true;
               }
            }
            loadPets('fosterable');
            document.getElementById("fosterpetFormContent").reset();
            closeFosterForm();
         } else {
            alert('Error: ' + data.message);
         }
      })
      .catch(error => {
         console.error('Error during submission:', error);
         alert('An error occurred during submission.');
      });
});

function loadPets(category) {
   fetch(`php/get_pets.php?category=${category}`)
      .then(response => response.json())
      .then(data => {
         const availablePets = data.filter(pet => pet.status !== 'Adopted');
         displayPets(availablePets);
      })
      .catch(error => console.error("Error loading pets:", error));
}

function displayPets(pets) {
   const catsTrack = document.getElementById('cats-track');
   const dogsTrack = document.getElementById('dogs-track');
   catsTrack.innerHTML = '';
   dogsTrack.innerHTML = '';
   const isAdmin = window.location.pathname.includes('admin.html');
   if (isAdmin) {
      const addNewCatButton = `
            <li class="animal-card add-new-card">
                <button class="add-button" onclick="openModal('Cat')">+</button>
            </li>
        `;
      const addNewDogButton = `
            <li class="animal-card add-new-card">
                <button class="add-button" onclick="openModal('Dog')">+</button>
            </li>
        `;
      catsTrack.innerHTML += addNewCatButton;
      dogsTrack.innerHTML += addNewDogButton;
   }
   pets.forEach(pet => {
      let petCard;
      const activeTab = document.querySelector('.tab-button.active');
      const isFosterableTab = activeTab && activeTab.classList.contains('fosterable');
      if (isAdmin) {
         petCard = `
                  <li class="animal-card" id="pet-card-${pet.id}">  <!-- Add pet id here -->
                    <div class="card-image">
                        <img src="assets/uploads/${pet.image}" alt="${pet.name}" />
                    </div>
                    <div class="card-content">
                        <h3 class="animal-name">${pet.name}</h3>
                        <p class="animal-breed">Breed: ${pet.breed}</p>
                        <p class="animal-age">${pet.category === 'fosterable' ? pet.age + ' months' : pet.age + ' years'}</p>
                        <p class="animal-description">${pet.description}</p>
                       <button class="adopt-button" onclick="openEditModal(${pet.id})">Edit</button>
                    <button class="delete-button" onclick="deletePet(${pet.id})">×</button>  <!-- Delete button -->
                    </div>
                </li>
            `;
      } else {
         const buttonText = pet.category === 'fosterable' || isFosterableTab ? "Foster Me!" : "Adopt Me!";
         const buttonDisabled = pet.status === 'On Process' ? 'disabled' : '';
         const buttonLabel = pet.status === 'On Process' ? 'On Process' : buttonText;
         const formType = pet.category === 'fosterable' ? 'fosterpetForm' : 'adoptForm';
         petCard = `
                <li class="animal-card" data-pet-id="${pet.id}">
                    <div class="card-image">
                        <img src="assets/uploads/${pet.image}" alt="${pet.name}" />
                    </div>
                    <div class="card-content">
                        <h3 class="animal-name">${pet.name}</h3>
                        <p class="animal-breed">Breed: ${pet.breed}</p>
                        <p class="animal-age">${pet.category === 'fosterable' ? pet.age + ' months' : pet.age + ' years'}</p>
                        <p class="animal-description">${pet.description}</p>
                        <!-- Button triggers the corresponding form function -->
                        <button class="adopt-button" data-pet-id="${pet.id}" onclick="open${formType.charAt(0).toUpperCase() + formType.slice(1)}(${pet.id})" ${buttonDisabled}>
                            ${buttonLabel}
                        </button>
                    </div>
                </li>
            `;
      }
      if (pet.type === 'cat') {
         catsTrack.innerHTML += petCard;
      } else if (pet.type === 'dog') {
         dogsTrack.innerHTML += petCard;
      }
   });
}
window.onload = function () {
   switchTab('adoptable');
   loadPets('adoptable');
};

function deletePet(petId) {
   const confirmation = confirm("Are you sure you want to delete this pet?");
   if (!confirmation) {
      return;
   }
   console.log('deletePet called for petId:', petId);
   const formData = new FormData();
   formData.append('petId', petId);
   fetch('crudphp/delete_pet.php', {
         method: 'POST',
         body: formData
      })
      .then(response => response.json())
      .then(data => {
         console.log(data);
         if (data.status === 'success') {
            const petCard = document.querySelector(`#pet-card-${petId}`);
            if (petCard) {
               petCard.remove();
            }
         } else {
            alert('Error deleting pet: ' + data.message);
         }
      })
      .catch(error => {
         console.error('Error:', error);
         alert('Error deleting pet.');
      });
}

if (window.location.pathname.includes('admin.html')) {
   function openEditModal(petId) {
      fetch(`php/get_pet.php?id=${petId}`)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            return response.json();
         })
         .then(data => {
            if (data.status === 'error') {
               throw new Error(data.message);
            }
   
            document.getElementById('petCategory').value = data.category;
            document.getElementById('petType').value = data.type;
            document.getElementById('petName').value = data.name;
            document.getElementById('petBreed').value = data.breed;
            document.getElementById('petAge').value = data.age;
            document.getElementById('petDescription').value = data.description;
            const imagePreview = document.getElementById('petImagePreview');
            imagePreview.src = `assets/uploads/${data.image}`;
            imagePreview.style.display = 'block';

            const activeTab = document.querySelector('.tab-button.active');
            const category = activeTab ? (activeTab.classList.contains('adoptable') ? 'adoptable' : 'fosterable') : 'adoptable';
            const petCategorySelect = document.getElementById('petCategory');
            petCategorySelect.value = category;
            document.getElementById('petCategoryHidden').value = category;
            
            const form = document.getElementById('addPetForm');
            document.querySelector('#addPetForm button[type="submit"]').innerText = 'Save Pet';
            form.action = 'crudphp/update_pet.php'; 
            document.getElementById('petImage').removeAttribute('required');

            console.log("Form action set to: " + form.action); 
   
            let petIdInput = document.querySelector('#addPetForm input[name="petId"]');
            if (!petIdInput) {
               petIdInput = document.createElement('input');
               petIdInput.type = 'hidden';
               petIdInput.name = 'petId';
               form.appendChild(petIdInput);
            }
            petIdInput.value = petId;

            document.getElementById('add-pet-modal').style.display = 'block';
            document.getElementById('pet-overlay').style.display = 'block';
         })
         .catch(error => {
            console.error('Error fetching pet details:', error);
            alert('Failed to load pet details.');
         });   
   }

   document.getElementById("addPetForm").addEventListener("submit", function (event) {
      event.preventDefault();
   
      const formAction = this.action;
      console.log("Form action on submit: " + formAction);
   
      const formData = new FormData(this);
      fetch(formAction, {
         method: "POST",
         body: formData
      })
      .then(response => response.json())
      .then(data => {
         if (data.status === "success") {
            alert(data.message);
            closeModal();
            loadPets(document.getElementById('petCategory').value);
         } else {
            alert("Error: " + data.message);
         }
      })
      .catch(error => {
         console.error("Error:", error);
         alert("Something went wrong. Please try again.");
      });
   });   

   document.getElementById("petImage").addEventListener("change", function (event) {
      const file = event.target.files[0];
      const preview = document.getElementById("petImagePreview");
      const previewLabel = document.getElementById("imagePreviewLabel");
      if (file) {
         const reader = new FileReader();
         reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            previewLabel.style.display = "block";
         };
         reader.readAsDataURL(file);
      } else {
         preview.style.display = "none";
         previewLabel.style.display = "none";
      }
   });
}

document.getElementById('rehomeForm').addEventListener('submit', function (event) {
   event.preventDefault();
   const formData = new FormData(event.target);
   fetch('php/rehomeform.php', {
         method: 'POST',
         body: formData
      })
      .then(response => response.json())
      .then(data => {
         if (data.success) {
            alert(data.success);
            closePopover();
            document.getElementById('rehomeForm').reset();
         } else {
            alert(data.error);
         }
      })
      .catch(error => {
         console.error('Error:', error);
         alert("An error occurred. Please try again.");
      });
});

function closePopover() {
   const popover = document.getElementById('rehomepopover');
   if (popover) {
      popover.style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
   }
};
if (window.location.pathname.includes("admin.html")) {
   function openRehomePopover() {
      fetchRehomeInquiries();
      document.getElementById('rehomePopover').style.display = 'block';
   }

   function closeRehomePopover() {
      document.getElementById('rehomePopover').style.display = 'none';
   }

   function fetchRehomeInquiries() {
      fetch('php/get_rehome_inquiries.php')
         .then(response => response.json())
         .then(data => {
            const tableBody = document.getElementById('rehomeInquiriesTableBody');
            tableBody.innerHTML = '';
            if (data.length === 0) {
               tableBody.innerHTML = `<tr><td colspan="6">No inquiries found.</td></tr>`;
               return;
            }
            data.forEach(inquiry => {
               const urgentStatus = inquiry.isUrgent == 1 ? 'Yes' : 'No';
               const row = document.createElement('tr');
               row.setAttribute('data-id', inquiry.id);
               row.innerHTML = `
                        <td>${inquiry.petName}</td>
                        <td>${inquiry.petType}</td>
                        <td>${inquiry.contactEmail}</td>
                        <td>${urgentStatus}</td>
                        <td>
                            <input type="checkbox" class="responded-checkbox" 
                                   data-id="${inquiry.id}" ${inquiry.responded === 1 ? 'checked' : ''}>
                        </td>
                       <td>
  <div class="email-container">
    <a href="mailto:${inquiry.contactEmail}" class="send-email-link">Send Email</a>
  </div>
</td>
                    `;
               tableBody.appendChild(row);
            });
            document.querySelectorAll('.responded-checkbox').forEach(checkbox => {
               checkbox.addEventListener('change', function () {
                  const inquiryId = this.dataset.id;
                  if (this.checked) {
                     fetch('php/update_responded_status.php', {
                           method: 'POST',
                           headers: {
                              'Content-Type': 'application/json'
                           },
                           body: JSON.stringify({
                              id: inquiryId,
                              responded: 1
                           })
                        })
                        .then(res => res.json())
                        .then(result => {
                           if (result.success) {
                              const rowToRemove = document.querySelector(`tr[data-id="${inquiryId}"]`);
                              if (rowToRemove) rowToRemove.remove();
                              const tableBody = document.getElementById('rehomeInquiriesTableBody');
                              if (!tableBody.querySelector('tr')) {
                                 tableBody.innerHTML = `<tr><td colspan="6">No inquiries found.</td></tr>`;
                              }
                           } else {
                              console.error(result.error || 'Failed to update responded status.');
                           }
                        })
                        .catch(error => console.error('Error updating responded status:', error));
                  }
               });
            });
         })
         .catch(error => console.error('Error fetching inquiries:', error));
   }
   document.addEventListener('DOMContentLoaded', () => {
      const rehomeButton = document.getElementById('rehomeButton');
      if (rehomeButton) {
         rehomeButton.addEventListener('click', openRehomePopover);
      }
      const closeButtons = document.querySelectorAll('.close-btn-all, .close-btn-form');
      closeButtons.forEach(btn => btn.addEventListener('click', closeRehomePopover));
   });
}

function fetchAnalyticsData() {
   if (window.location.pathname.includes('admin.html')) {
      fetch('php/analytics.php')
         .then(response => response.json())
         .then(data => {
            createAdoptedPetsChart(data.adoptedPets, data.fosteredPets, data.onProcessPets);
            createRehomeInquiriesChart(data.rehomeInquiries);
            createDonationsChart(data.totalDonations, data.totalSponsorAmount);
            createPetsByTypeChart(data.petsByType);
            createDonorsSponsorsFostersChart(data.donors, data.sponsors, data.fosters);
         })
         .catch(error => {
            console.error('Error fetching analytics data:', error);
         });
   }
}

function createAdoptedPetsChart(adoptedPets, fosteredPets, onProcessPets) {
   const ctx = document.getElementById('mainPetsChart').getContext('2d');
   new Chart(ctx, {
      type: 'line',
      data: {
         labels: ['Adopted', 'Fostered', 'On Process'],
         datasets: [
            {
               label: 'Adopted Pets',
               data: [adoptedPets, 0, 0],
               backgroundColor: 'rgba(76, 175, 80, 0.2)',
               borderColor: '#4CAF50',
               fill: true,
               borderWidth: 2
            },
            {
               label: 'Fostered Pets',
               data: [0, fosteredPets, 0], 
               backgroundColor: 'rgba(255, 152, 0, 0.2)',
               borderColor: '#FF9800', 
               fill: true, 
               borderWidth: 2
            },
            {
               label: 'On Process Pets',
               data: [0, 0, onProcessPets],
               backgroundColor: 'rgba(255, 87, 34, 0.2)',
               borderColor: '#FF5722', 
               fill: true, 
               borderWidth: 2
            }
         ]
      },
      options: {
         responsive: true,
         plugins: {
            legend: {
               position: 'top',
            },
            tooltip: {
               callbacks: {
                  label: function (tooltipItem) {
                     return tooltipItem.dataset.label + ': ' + tooltipItem.raw + ' pets';
                  }
               }
            }
         },
         scales: {
            y: {
               beginAtZero: true,
               title: {
                  display: true,
                  text: 'Number of Pets'
               }
            },
         }
      }
   });
}


function createRehomeInquiriesChart(rehomeInquiries) {
   const ctx = document.getElementById('rehomeInquiriesChart').getContext('2d');
   const dogInquiries = rehomeInquiries.find(item => item.pettype === 'dog')?.count || 0;
   const catInquiries = rehomeInquiries.find(item => item.pettype === 'cat')?.count || 0;
   new Chart(ctx, {
      type: 'bar',
      data: {
         labels: ['Dogs', 'Cats'],
         datasets: [{
            label: 'Rehome Inquiries',
            data: [dogInquiries, catInquiries],
            backgroundColor: ['#4CAF50', '#FF9800'],
            borderColor: ['#388E3C', '#FF5722'],
            borderWidth: 1
         }]
      },
      options: {
         responsive: true,
         indexAxis: 'y',
         plugins: {
            legend: {
               position: 'top',
            },
            tooltip: {
               callbacks: {
                  label: function (tooltipItem) {
                     return tooltipItem.label + ': ' + tooltipItem.raw + ' inquiries';
                  }
               }
            }
         }
      }
   });
}

function createDonorsSponsorsFostersChart(donors, sponsors, fosters) {
   const ctx = document.getElementById('donorsSponsorsFostersChart').getContext('2d');
   const fixedData = {
      donors: donors || 22,
      sponsors: sponsors || 9,
      fosters: fosters || 3
   };
   if (window.donorsSponsorsFostersChart instanceof Chart) {
      window.donorsSponsorsFostersChart.destroy();
   }
   window.donorsSponsorsFostersChart = new Chart(ctx, {
      type: 'bar',
      data: {
         labels: ['Donors', 'Sponsors', 'Fosters'],
         datasets: [{
               label: 'Donors',
               data: [fixedData.donors, 0, 0],
               backgroundColor: '#4CAF50',
               stack: 'stack1'
            },
            {
               label: 'Sponsors',
               data: [0, fixedData.sponsors, 0],
               backgroundColor: '#FF9800',
               stack: 'stack1'
            },
            {
               label: 'Fosters',
               data: [0, 0, fixedData.fosters],
               backgroundColor: '#2196F3',
               stack: 'stack1'
            }
         ]
      },
      options: {
         responsive: true,
         plugins: {
            legend: {
               position: 'top',
            },
            tooltip: {
               callbacks: {
                  label: function (tooltipItem) {
                     return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                  }
               }
            }
         },
         scales: {
            y: {
               beginAtZero: true
            },
            x: {
               stacked: true
            },
            y: {
               stacked: true
            }
         }
      }
   });
}

function createDonationsChart(totalDonations, totalSponsorAmount) {
   const ctx = document.getElementById('donationsChart').getContext('2d');
   new Chart(ctx, {
      type: 'doughnut',
      data: {
         labels: ['Total Donations', 'Sponsor Amounts'],
         datasets: [{
            data: [totalDonations, totalSponsorAmount],
            backgroundColor: ['#2196F3', '#FFC107'],
            hoverBackgroundColor: ['#1976D2', '#FFB300']
         }]
      },
      options: {
         responsive: true,
         plugins: {
            legend: {
               position: 'top',
            },
            tooltip: {
               callbacks: {
                  label: function (tooltipItem) {
                     let value = parseFloat(tooltipItem.raw);
                     return tooltipItem.label + ': ₱' + (isNaN(value) ? '0.00' : value.toFixed(2));
                  }
               }
            }
         }
      }
   });
}

function createPetsByTypeChart(petsByType) {
   const ctx = document.getElementById('adoptedPetsChart').getContext('2d');
   const adoptableAvailableCounts = petsByType.map(pet => parseInt(pet.adoptable_available_count));
   const fosterableAvailableCounts = petsByType.map(pet => parseInt(pet.fosterable_available_count));
   new Chart(ctx, {
      type: 'pie',
      data: {
         labels: ['Adoptable Pets', 'Fosterable Pets'],
         datasets: [{
            data: [
               adoptableAvailableCounts.reduce((a, b) => a + b, 0),
               fosterableAvailableCounts.reduce((a, b) => a + b, 0)
            ],
            backgroundColor: ['#4CAF50', '#FF9800'],
            hoverBackgroundColor: ['#45a049', '#f57c00']
         }]
      },
      options: {
         responsive: true,
         plugins: {
            legend: {
               position: 'top',
            },
            tooltip: {
               callbacks: {
                  label: function (tooltipItem) {
                     return tooltipItem.label + ': ' + tooltipItem.raw + ' pets';
                  }
               }
            }
         }
      }
   });
}
document.addEventListener('DOMContentLoaded', function () {
   fetchAnalyticsData();
});