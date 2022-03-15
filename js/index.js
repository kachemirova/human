createAdvantagesColumns();

showMore('advantages-show-more', '.advantages__mobile_hidden');

function showMore(buttonId, hiddenSelector) {
  var buttonEl = document.getElementById(buttonId);

  if (!buttonEl) {
    return;
  }

  buttonEl.addEventListener('click', function() {
    const hiddenPart = document.querySelector(hiddenSelector);

    if (!hiddenPart) {
      return;
    }

    hiddenPart.style.display = 'block';
    buttonEl.remove();
  });
}

function createAdvantagesColumns() {
  var advantagesEls = Array.from(document.querySelectorAll('.advantages__item'));
  var columnsL = [[], [], []];
  var columnsM = [[], []];

  for (var i = 0; i < Math.ceil(advantagesEls.length / columnsL.length); i++) {
    if (advantagesEls[3 * i]) columnsL[0].push(advantagesEls[3 * i]);
    if (advantagesEls[3 * i + 1]) columnsL[1].push(advantagesEls[3 * i + 1]);
    if (advantagesEls[3 * i + 2]) columnsL[2].push(advantagesEls[3 * i + 2]);
  }

  for (var i = 0; i < Math.ceil(advantagesEls.length / columnsM.length); i++) {
    if (advantagesEls[2 * i]) columnsM[0].push(advantagesEls[2 * i]);
    if (advantagesEls[2 * i + 1]) columnsM[1].push(advantagesEls[2 * i + 1]);
  }

  fillAdvantagesList(columnsL, '.advantages__list--l');
  fillAdvantagesList(columnsM, '.advantages__list--m');
}

function fillAdvantagesList(columns, parentSelector) {
  for (var i = 0; i < columns.length; i++) {
    var div = document.createElement('div');

    div.className = 'advantages__list_col';
    columns[i].forEach((item) => {
      div.appendChild(item.cloneNode(true));
    });

    document.querySelector(parentSelector).appendChild(div);
  }
}