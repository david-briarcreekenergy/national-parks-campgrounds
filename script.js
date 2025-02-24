import { getParks } from "./parksApi.js";
import { getStates } from "./statesApi.js";

const parksElement = document.getElementById("parks");

const popUpElement = document.getElementById("pop-up");

const selectStateElement = document.getElementById("state-select");

// used to set the start parameter for the getParks function
let start = 0;

// used to set the LIMIT parameter for the getParks function
const LIMIT = 20;

let stateSelected = "";

// used to keep track of the number of parks total in order to display/hide the Last button
let numberOfParksTotal = 0;

// used to keep track of the number of parks displayed in order to disable the next button when there are no more parks to display
let numberOfParksDisplayed = 0;

// used to keep track of the number of parks remaining in order to disable the next button when there are no more parks to display
let numberOfParksRemaining = 0;

// when the user changes the state select element, retrieve the parks for that state
selectStateElement.addEventListener("change", (event) => {
  selectStateElement.blur();

  stateSelected = event.target.value;

  getParks({ state: stateSelected }).then((parks) => {
    numberOfParksTotal = parks.data.total;
    numberOfParksRemaining = parks.data.total - parks.data.data.length;
    numberOfParksDisplayed = parks.data.data.length;
    buildDisplay(parks.data.data);
  });
});

const buildCards = (parks) => {
  for (const park of parks) {
    const card = buildParkCard(park);
    parksElement.appendChild(card);
  }
};

const buildParkCard = (park) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
        <h3>${park.fullName}</h3>
        <img src="${park.images[0].url}" alt="${park.images[0].altText}" />`;

  card.addEventListener("click", () => {
    buildPopUp(park);
    openPopUp();
  });

  return card;
};

const buildPopUp = (park) => {
  document.getElementById("pop-up-info").innerHTML = `
          <h3>${park.fullName}</h3>
          <p>${park.description}</p>
          `;

  const imageUrl =
    park.images.length > 1 ? park.images[1].url : park.images[0].url;
  const imageAlt =
    park.images.length > 1 ? park.images[1].altText : park.images[0].altText;

  document.getElementById("pop-up-img-container").innerHTML = `
          <img src="${imageUrl}" alt="${imageAlt}" />`;

  document.getElementById("park-url").href = park.url || "";
};

// open the pop-up when the user clicks on a park card
const openPopUp = () => {
  popUpElement.style.display = "block";
  document.body.classList.add("no-scroll"); // Disable scrolling
};

// close the pop-up when the user clicks on the close button
document.getElementById("close-pop-up-button").addEventListener("click", () => {
  popUpElement.style.display = "none";
  document.body.classList.remove("no-scroll"); // Re-enable scrolling
});

// retrieve the next 20 parks from the parksApi.js file
document.getElementById("next").addEventListener("click", () => {
  start += LIMIT;
  getParks({ start: start, state: stateSelected }).then((parks) => {
    numberOfParksDisplayed = parks.data.data.length;
    numberOfParksRemaining -= parks.data.data.length;
    buildDisplay(parks.data.data);
  });
});

// retrieve the previous 20 parks from the parksApi.js file if start is greater than 0
document.getElementById("previous").addEventListener("click", () => {
  if (start > 0) {
    start -= LIMIT;
    getParks({ start: start }).then((parks) => {
      numberOfParksDisplayed = parks.data.data.length;
      numberOfParksRemaining += parks.data.data.length;
      buildDisplay(parks.data.data);
    });
  }
});

// retrieve the first 20 parks from the parksApi.js file
document.getElementById("first").addEventListener("click", () => {
  start = 0;
  getParks({ start: start }).then((parks) => {
    numberOfParksDisplayed = parks.data.data.length;
    numberOfParksRemaining += parks.data.data.length;
    buildDisplay(parks.data.data);
  });
});

// retrieve the last 20 parks from the parksApi.js file
document.getElementById("last").addEventListener("click", () => {
  start = numberOfParksTotal - LIMIT;
  getParks({ start: start }).then((parks) => {
    numberOfParksDisplayed = parks.data.data.length;
    numberOfParksRemaining = 0;
    buildDisplay(parks.data.data);
  });
});

const buildDisplay = (parks) => {
  parksElement.innerHTML = "";
  hidePaginationButtons();
  buildCards(parks);
  showPaginationButtons();
  disableFirstButton();
  disablePrevButton();
  disableNextButton();
  disableLastButton();
};

const disableFirstButton = () => {
  const el = document.getElementById("first");
  el.disabled = start === 0;
};

const disablePrevButton = () => {
  const el = document.getElementById("previous");
  el.disabled = start === 0;
};

const disableNextButton = () => {
  const el = document.getElementById("next");
  el.disabled = numberOfParksDisplayed < LIMIT || numberOfParksRemaining <= 0;
};

const disableLastButton = () => {
  const el = document.getElementById("last");
  el.disabled = numberOfParksDisplayed < LIMIT || numberOfParksRemaining <= 0;
};

const hidePaginationButtons = () => {
  const el = document.getElementById("pagination");
  el.style.display = "none";
};

const showPaginationButtons = () => {
  const el = document.getElementById("pagination");
  el.style.display = "flex";
};

//  hide the pagination initially until the parks are loaded
hidePaginationButtons();

//  retrieve the states from the states.json file
//  populate the state select element with the states from the states.json file
getStates().then((states) => {
  for (let key in states) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = states[key];
    selectStateElement.appendChild(option);
  }
});

//  retrieve the first 20 parks from the parksApi.js file
//  populate the parks element with the parks from the parksApi.js file
getParks().then((parks) => {
  numberOfParksTotal = parks.data.total;
  numberOfParksRemaining = parks.data.total;
  numberOfParksDisplayed = parks.data.data.length;
  buildDisplay(parks.data.data);
});
