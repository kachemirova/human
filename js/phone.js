import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

const db = getDatabase();
const phoneFormEl = document.querySelector('.cta__form');
const phoneInputEl = document.querySelector('.cta__input');
const phoneNumberEl = document.querySelector('.cta__number');
const phoneSuccessEl = document.querySelector('.cta__form_success');
const phoneSuccessButtonEl = document.querySelector('.cta__button_add');
const countEl = document.getElementById('people-count');
const countWrapEl = document.getElementById('people-count-wrap');
const formHiddenClassName = 'cta__form--hidden';
const inputErrorClassName = 'cta__input--error';
let peopleCount = 0;

getPeopleCount();

function getPeopleCount() {
  get(ref(db, 'phone_numbers_count/total')).then((snapshot) => {
    if (snapshot.exists()) {
      updatePeopleCount(snapshot.val());
      countWrapEl.classList.add('cta__user--loaded');
    } else {
      countWrapEl.classList.add('cta__user--error');
    }
  }).catch((error) => {
    countWrapEl.classList.add('cta__user--error');
  });
}

function updatePeopleCount(count) {
  peopleCount = count;
  countEl.innerText = formatNumber(count);

  if (countWrapEl.classList.contains('cta__user--error')) {
    countWrapEl.classList.remove('cta__user--error');
    countWrapEl.classList.add('cta__user--loaded');
  }
}

function formatNumber(number, separator = ' ') {
  const numberString = number.toString();
  const result = [];

  for (let i = numberString.length - 3; i > -3; i -= 3) {
    result.unshift(numberString.slice(i > 0 ? i : 0, i + 3));
  }

  return result.join(separator);
}

phoneInputEl.addEventListener('focus', function() {
  if (!phoneInputEl.value) {
    phoneInputEl.value = '+'
  }
})

phoneInputEl.addEventListener('blur', function() {
  if (phoneInputEl.value === '+') {
    phoneInputEl.value = ''
  }
});

phoneInputEl.addEventListener('input', function(event) {
  phoneInputEl.classList.remove(inputErrorClassName);
  const phoneNumber = validatePhoneNumber(phoneInputEl.value);

  phoneInputEl.value = phoneNumber;
  phoneNumberEl.innerText = phoneNumber;
})

phoneFormEl.addEventListener('submit', function(event) {
  event.preventDefault();
  const phoneNumber = phoneInputEl.value;

  if (phoneNumber.replace(/[^\d]/gi, '').length < 8) {
    phoneInputEl.classList.add(inputErrorClassName);
    setTimeout(() => {
      phoneInputEl.classList.remove(inputErrorClassName);
    }, 650);

    return;
  }

  sendPhoneNumber(phoneNumber);
  resetPhoneInput();
})

phoneSuccessButtonEl.addEventListener('click', function() {
  phoneSuccessEl.classList.add(formHiddenClassName);
  phoneFormEl.classList.remove(formHiddenClassName);
});

function validatePhoneNumber(value) {
  let phoneNumber = value
    .replace(/[^\d+]/gi, '')
    .replace(/[+]/gi, function(match, offset, all) {
      return match === "+"
        ? (all.indexOf("+") === offset ? '+' : '')
        : '';
    });

  if (phoneNumber.indexOf('+') !== 0) {
    phoneNumber = '+' + phoneNumber.replace('+', '');
  }

  if (phoneNumber.replace(/[^\d]/gi, '').length > 15) {
    return phoneNumberEl.innerText;
  }

  return phoneNumber;
}

function sendPhoneNumber(phoneNumber) {
  const id = `f${Date.now().toString(16)}`;

  updatePeopleCount(++peopleCount);

  set(ref(db, 'phone_numbers/' + id), phoneNumber);
  set(ref(db, 'phone_numbers_count/total'), peopleCount);
}

function resetPhoneInput() {
  phoneFormEl.classList.add(formHiddenClassName);
  phoneSuccessEl.classList.remove(formHiddenClassName);
  phoneInputEl.value = '';
  phoneNumberEl.innerText = '';
}
