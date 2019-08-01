async function fetchData(url) {
	const res = await fetch(url);
  return await res.json();
}

//Variables to display 12 users, dom element for the gallery
const usersDisplay = 12;
const gallery = document.querySelector('#gallery');
let users = [];

function fetchUsers() {
	fetchData(`https://randomuser.me/api/?results=${usersDisplay}&nat=us`)
		.then((data) => (users = data.results))
		.then((users) => displayGallery(users));
}
fetchUsers();

//Sets event listener to display card modal when clicked
function setCardListeners() {
	const cards = document.querySelectorAll('.card');
	cards.forEach((card) => {
		card.addEventListener('click', function(event) {
      displayModal(card)
		});
	});
}
//Sets event listeners to change when prev or next button is clicked, adds small close button
function setModalListeners() {
	const cards = document.querySelectorAll('.card');
	const modal = document.querySelector('.modal-container');
	const modalName = modal.querySelector('#name').textContent;
	const closeButton = document.querySelector('.modal-close-btn');
	const prevButton = document.querySelector('#modal-prev');
	const nextButton = document.querySelector('#modal-next');
	closeButton.addEventListener('click', function() {
		modal.parentElement.removeChild(modal);
	});
	prevButton.addEventListener('click', function() {
		for (let i = 0; i < cards.length; i++) {
			let cardName = cards[i].querySelector('#name').textContent;
			if (cards[i - 1] !== undefined) {
				if (cardName === modalName) {
					modal.parentElement.removeChild(modal);
					displayModal(cards[i - 1]);
				}
			}
		}
	});

	nextButton.addEventListener('click', function() {
		for (let i = 0; i < cards.length; i++) {
			let cardName = cards[i].querySelector('#name').textContent;
			if (cards[i + 1] !== undefined) {
				if (cardName === modalName) {
					modal.parentElement.removeChild(modal);
					displayModal(cards[i + 1]);
				}
			}
		}
	});
}

//Displays users on the webpage and im adding event listeners for the cards
function displayGallery(users) {
	let galleryHTML = '';

	users.map((user) => {
		galleryHTML += `<div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src=${user.picture.large} alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                                <p class="card-text">${user.email}</p>
                                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                            </div>
                        </div>`;
	});

	gallery.innerHTML = galleryHTML;
	setCardListeners();
}
//Displays modal with additional info. on the user
function displayModal(card) {
	const cardName = card.querySelector('#name').textContent;
	let modalDIV = document.createElement('div');
	modalDIV.className = 'modal-container';
	modalDIV.innerHTML = '';
	users.forEach((user) => {
		if (`${user.name.first} ${user.name.last}` === cardName) {
			modalDIV.innerHTML = generateModalHTML(user);
		}
	});
	document.body.appendChild(modalDIV);
	setModalListeners();
}
//Generates HTML to be displayed in modal
function generateModalHTML(user) {
	const dateOfBirth = new Date(user.dob.date);

	return `<div class="modal">
  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
  <div class="modal-info-container">
      <img class="modal-img" src="${user.picture.large}" alt="profile picture">
      <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
      <p class="modal-text">${user.email}</p>
      <p class="modal-text cap">${user.location.city}</p>
      <hr>
      <p class="modal-text">${user.phone}</p>
      <p class="modal-text cap">${user.location.street}, ${user.location.city}, ${user.location
.state} ${user.location.postcode}</p>
      <p class="modal-text">DOB: ${dateOfBirth.getMonth()}/${dateOfBirth.getDay()}/${dateOfBirth.getFullYear()}</p>
</div>
<div class="modal-btn-container">
  <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
  <button type="button" id="modal-next" class="modal-next btn">Next</button>
</div>
`;
}
// generating the search button that will match real time
function generateSearch() {
	let searchContainer = document.querySelector('.search-container');
	let searchHTML = '';
	searchHTML += "<input type='search' id='search-input' class='search-input' placeholder='Search...'>";
	searchHTML += "<input type='submit' value='&#x1F50D;' id='search-submit' class='search-submit'>";

	let searchForm = document.createElement('form');
	searchForm.innerHTML = searchHTML;
	searchContainer.appendChild(searchForm);

	searchForm.addEventListener('input', function() {
		let searchInput = document.querySelector('#search-input').value;
		let filteredUsers = [];
		users.forEach((user) => {
			if (`${user.name.first} ${user.name.last}`.includes(searchInput)) {
				filteredUsers.push(user);
			}
		});
		displayGallery(filteredUsers);
	});
}
generateSearch();