const suits = [
  { id: 'hearts', symbol: '\u2665', color: 'red', name: 'Copas' },
  { id: 'diamonds', symbol: '\u2666', color: 'red', name: 'Ouros' },
  { id: 'clubs', symbol: '\u2663', color: 'black', name: 'Paus' },
  { id: 'spades', symbol: '\u2660', color: 'black', name: 'Espadas' }
];

const rankLabels = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K'
};
const difficultyLabels = {
  easy: 'F\u00e1cil',
  hard: 'Dif\u00edcil'
};
const MAX_HISTORY = 200;

const elements = {
  stock: document.getElementById('stock'),
  waste: document.getElementById('waste'),
  foundations: Array.from(document.querySelectorAll('.foundation')),
  tableau: Array.from(document.querySelectorAll('.tableau-pile')),
  timer: document.getElementById('timer'),
  moves: document.getElementById('moves'),
  wins: document.getElementById('wins'),
  message: document.getElementById('message'),
  undo: document.getElementById('undo-move'),
  newGame: document.getElementById('new-game'),
  hint: document.getElementById('hint'),
  difficulty: document.getElementById('difficulty'),
  rulesText: document.getElementById('rules-text'),
  overlay: document.getElementById('win-overlay'),
  playAgain: document.getElementById('play-again')
};

const state = {
  stock: [],
  waste: [],
  foundations: {
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: []
  },
  tableau: Array.from({ length: 7 }, () => []),
  selected: null,
  moves: 0,
  timerId: null,
  startTime: null,
  elapsed: 0,
  wins: Number(localStorage.getItem('klondike_wins') || 0),
  difficulty: localStorage.getItem('klondike_difficulty') === 'easy' ? 'easy' : 'hard',
  history: []
};

const dragState = {
  active: false,
  pending: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  sourceInfo: null,
  sourceEl: null,
  dragLayer: null,
  dragStack: null,
  sourceCardEls: [],
  justDragged: false
};

function createDeck() {
  let id = 0;
  const deck = [];
  suits.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank += 1) {
      deck.push({
        id: `${suit.id}-${rank}-${id++}`,
        suit: suit.id,
        suitSymbol: suit.symbol,
        color: suit.color,
        rank,
        label: rankLabels[rank] || String(rank),
        faceUp: false
      });
    }
  });
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function runTimerFromElapsed(elapsed) {
  stopTimer();
  state.elapsed = elapsed;
  state.startTime = Date.now() - state.elapsed;
  state.timerId = setInterval(() => {
    state.elapsed = Date.now() - state.startTime;
    updateTimer();
  }, 1000);
  updateTimer();
}

function resetTimer() {
  runTimerFromElapsed(0);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
  }
  state.timerId = null;
}

function updateTimer() {
  const totalSeconds = Math.floor(state.elapsed / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  elements.timer.textContent = `${minutes}:${seconds}`;
}

function setMessage(text) {
  elements.message.textContent = text;
  if (!text) {
    return;
  }
  clearTimeout(setMessage.timer);
  setMessage.timer = setTimeout(() => {
    elements.message.textContent = '';
  }, 2200);
}

function cloneCard(card) {
  return { ...card };
}

function cloneBoardState() {
  return {
    stock: state.stock.map(cloneCard),
    waste: state.waste.map(cloneCard),
    foundations: {
      hearts: state.foundations.hearts.map(cloneCard),
      diamonds: state.foundations.diamonds.map(cloneCard),
      clubs: state.foundations.clubs.map(cloneCard),
      spades: state.foundations.spades.map(cloneCard)
    },
    tableau: state.tableau.map((pile) => pile.map(cloneCard)),
    moves: state.moves,
    elapsed: state.elapsed,
    wins: state.wins,
    timerRunning: Boolean(state.timerId),
    overlayVisible: elements.overlay.classList.contains('is-visible')
  };
}

function updateUndoButton() {
  if (!elements.undo) {
    return;
  }
  elements.undo.disabled = state.history.length === 0;
}

function pushHistory() {
  state.history.push(cloneBoardState());
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
  }
  updateUndoButton();
}

function clearHistory() {
  state.history = [];
  updateUndoButton();
}

function restoreBoardState(snapshot) {
  if (!snapshot) {
    return;
  }
  state.stock = snapshot.stock.map(cloneCard);
  state.waste = snapshot.waste.map(cloneCard);
  state.foundations = {
    hearts: snapshot.foundations.hearts.map(cloneCard),
    diamonds: snapshot.foundations.diamonds.map(cloneCard),
    clubs: snapshot.foundations.clubs.map(cloneCard),
    spades: snapshot.foundations.spades.map(cloneCard)
  };
  state.tableau = snapshot.tableau.map((pile) => pile.map(cloneCard));
  state.moves = snapshot.moves;
  state.elapsed = snapshot.elapsed;
  state.wins = snapshot.wins;
  state.selected = null;

  if (snapshot.timerRunning) {
    runTimerFromElapsed(snapshot.elapsed);
  } else {
    stopTimer();
    state.startTime = null;
    updateTimer();
  }

  if (snapshot.overlayVisible) {
    showOverlay();
  } else {
    hideOverlay();
  }

  localStorage.setItem('klondike_wins', String(state.wins));
  render();
}

function undoMove() {
  if (!state.history.length) {
    setMessage('N\u00e3o h\u00e1 jogadas para desfazer.');
    return;
  }
  const previous = state.history.pop();
  updateUndoButton();
  restoreBoardState(previous);
  setMessage('Jogada desfeita.');
}

function getDifficultyLabel() {
  return difficultyLabels[state.difficulty] || difficultyLabels.hard;
}

function syncDifficultyUI() {
  if (elements.difficulty) {
    elements.difficulty.value = state.difficulty;
  }
  if (!elements.rulesText) {
    return;
  }
  elements.rulesText.textContent = state.difficulty === 'easy'
    ? 'No tableau (f\u00e1cil): des\u00e7a na mesma cor. Funda\u00e7\u00f5es sobem no mesmo naipe, come\u00e7ando no \u00c1s.'
    : 'No tableau (dif\u00edcil): des\u00e7a alternando cores. Funda\u00e7\u00f5es sobem no mesmo naipe, come\u00e7ando no \u00c1s.';
}

function startNewGame() {
  const deck = shuffle(createDeck());
  state.stock = [];
  state.waste = [];
  state.foundations = {
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: []
  };
  state.tableau = Array.from({ length: 7 }, () => []);
  state.selected = null;
  state.moves = 0;
  clearHistory();

  for (let col = 0; col < 7; col += 1) {
    for (let row = 0; row <= col; row += 1) {
      const card = deck.pop();
      card.faceUp = row === col;
      state.tableau[col].push(card);
    }
  }

  state.stock = deck;
  resetTimer();
  updateStats();
  render();
  hideOverlay();
  setMessage(`Novo jogo iniciado (${getDifficultyLabel()}).`);
}

let layoutMetrics = null;

function updateStats() {
  elements.moves.textContent = state.moves;
  elements.wins.textContent = state.wins;
}

function computeLayoutMetrics() {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.width = 'var(--card-width)';
  probe.style.height = 'var(--card-height)';
  probe.style.marginTop = 'var(--card-offset-up)';
  probe.style.marginBottom = 'var(--card-offset-down)';
  document.body.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  const styles = getComputedStyle(probe);
  const cardHeight = rect.height || 120;
  const offsetUp = parseFloat(styles.marginTop) || 26;
  const offsetDown = parseFloat(styles.marginBottom) || 14;
  document.body.removeChild(probe);
  return { cardHeight, offsetUp, offsetDown };
}

function getLayoutMetrics() {
  if (!layoutMetrics) {
    layoutMetrics = computeLayoutMetrics();
  }
  return layoutMetrics;
}

function refreshLayoutMetrics() {
  layoutMetrics = computeLayoutMetrics();
}

function getPileHeight(pile) {
  const { cardHeight, offsetUp, offsetDown } = getLayoutMetrics();
  let height = cardHeight;
  pile.forEach((card, index) => {
    if (index === 0) {
      return;
    }
    height += card.faceUp ? offsetUp : offsetDown;
  });
  return Math.max(height, cardHeight);
}

function renderStock() {
  elements.stock.innerHTML = '';
  elements.stock.dataset.count = state.stock.length;
  if (!state.stock.length) {
    return;
  }
  const back = document.createElement('div');
  back.className = 'card face-down';
  back.style.position = 'absolute';
  back.style.top = '0';
  back.style.left = '0';
  elements.stock.appendChild(back);
}

function renderWaste() {
  elements.waste.innerHTML = '';
  elements.waste.dataset.count = state.waste.length;
  if (!state.waste.length) {
    return;
  }
  const card = state.waste[state.waste.length - 1];
  const cardEl = createCardElement(card, {
    source: 'waste'
  });
  elements.waste.appendChild(cardEl);
}

function renderFoundations() {
  elements.foundations.forEach((foundationEl) => {
    const suit = foundationEl.dataset.suit;
    foundationEl.innerHTML = '';
    const pile = state.foundations[suit];
    foundationEl.dataset.count = pile.length;
    if (!pile.length) {
      return;
    }
    const card = pile[pile.length - 1];
    const cardEl = createCardElement(card, {
      source: 'foundation',
      suit
    });
    foundationEl.appendChild(cardEl);
  });
}

function renderTableau() {
  elements.tableau.forEach((pileEl, pileIndex) => {
    pileEl.innerHTML = '';
    const pile = state.tableau[pileIndex];
    let offset = 0;
    pile.forEach((card, cardIndex) => {
      const cardEl = createCardElement(card, {
        source: 'tableau',
        pile: pileIndex,
        index: cardIndex
      });
      cardEl.style.top = `${offset}px`;
      cardEl.style.zIndex = cardIndex + 1;
      if (card.faceUp) {
        offset += getOffsetUp();
      } else {
        offset += getOffsetDown();
      }
      if (isCardSelected(pileIndex, cardIndex)) {
        cardEl.classList.add('is-selected');
      }
      pileEl.appendChild(cardEl);
    });
    pileEl.style.height = `${getPileHeight(pile)}px`;
  });
}

function getOffsetUp() {
  return getLayoutMetrics().offsetUp;
}

function getOffsetDown() {
  return getLayoutMetrics().offsetDown;
}

function render() {
  renderStock();
  renderWaste();
  renderFoundations();
  renderTableau();
  updateStats();
}

function createCardElement(card, meta) {
  const cardEl = document.createElement('button');
  cardEl.type = 'button';
  cardEl.className = `card ${card.faceUp ? 'face-up' : 'face-down'} ${card.color}`;
  cardEl.dataset.source = meta.source;
  if (meta.pile !== undefined) {
    cardEl.dataset.pile = meta.pile;
  }
  if (meta.index !== undefined) {
    cardEl.dataset.index = meta.index;
  }
  if (meta.suit) {
    cardEl.dataset.suit = meta.suit;
  }
  if (card.faceUp) {
    cardEl.innerHTML = `
      <span class="corner top"><span class="rank">${card.label}</span><span class="suit">${card.suitSymbol}</span></span>
      <span class="suit center">${card.suitSymbol}</span>
      <span class="corner bottom"><span class="rank">${card.label}</span><span class="suit">${card.suitSymbol}</span></span>
    `;
    cardEl.setAttribute('aria-label', `${card.label} de ${getSuitName(card.suit)}`);
  } else {
    cardEl.setAttribute('aria-label', 'Carta virada');
  }
  return cardEl;
}

function getSuitName(suitId) {
  const suit = suits.find((item) => item.id === suitId);
  return suit ? suit.name : suitId;
}

function isCardSelected(pileIndex, cardIndex) {
  if (!state.selected || state.selected.source !== 'tableau') {
    return false;
  }
  return state.selected.pileIndex === pileIndex && cardIndex >= state.selected.cardIndex;
}

function getSelectedCards() {
  if (!state.selected) {
    return [];
  }
  if (state.selected.source === 'tableau') {
    return state.tableau[state.selected.pileIndex].slice(state.selected.cardIndex);
  }
  if (state.selected.source === 'waste') {
    return state.waste.length ? [state.waste[state.waste.length - 1]] : [];
  }
  if (state.selected.source === 'foundation') {
    const pile = state.foundations[state.selected.suit];
    return pile.length ? [pile[pile.length - 1]] : [];
  }
  return [];
}

function removeSelectedCards() {
  if (!state.selected) {
    return [];
  }
  if (state.selected.source === 'tableau') {
    return state.tableau[state.selected.pileIndex].splice(state.selected.cardIndex);
  }
  if (state.selected.source === 'waste') {
    return state.waste.length ? [state.waste.pop()] : [];
  }
  if (state.selected.source === 'foundation') {
    const pile = state.foundations[state.selected.suit];
    return pile.length ? [pile.pop()] : [];
  }
  return [];
}

function clearSelection() {
  state.selected = null;
}

function revealTopCard(pileIndex) {
  const pile = state.tableau[pileIndex];
  if (!pile.length) {
    return;
  }
  const top = pile[pile.length - 1];
  if (!top.faceUp) {
    top.faceUp = true;
  }
}

function canMoveToTableau(cards, destPile) {
  const first = cards[0];
  if (!first) {
    return false;
  }
  if (!destPile.length) {
    return first.rank === 13;
  }
  const top = destPile[destPile.length - 1];
  if (!top.faceUp) {
    return false;
  }
  const colorMatch = state.difficulty === 'easy'
    ? top.color === first.color
    : top.color !== first.color;
  return top.rank === first.rank + 1 && colorMatch;
}

function canMoveToFoundation(card, suitId) {
  const pile = state.foundations[suitId];
  if (!pile.length) {
    return card.rank === 1;
  }
  const top = pile[pile.length - 1];
  return top.suit === card.suit && card.rank === top.rank + 1;
}
function tryMoveToTableau(destIndex) {
  const cards = getSelectedCards();
  if (!cards.length) {
    return false;
  }
  if (state.selected.source === 'tableau' && state.selected.pileIndex === destIndex) {
    clearSelection();
    return false;
  }
  if (!canMoveToTableau(cards, state.tableau[destIndex])) {
    setMessage('Movimento inv\u00e1lido.');
    return false;
  }
  pushHistory();
  const moved = removeSelectedCards();
  state.tableau[destIndex].push(...moved);
  if (state.selected.source === 'tableau') {
    revealTopCard(state.selected.pileIndex);
  }
  state.moves += 1;
  clearSelection();
  checkWin();
  return true;
}

function tryMoveToFoundation(suitId) {
  const cards = getSelectedCards();
  if (cards.length !== 1) {
    setMessage('Somente uma carta pode ir \u00e0 funda\u00e7\u00e3o.');
    return false;
  }
  const card = cards[0];
  if (!canMoveToFoundation(card, suitId)) {
    setMessage('Movimento inv\u00e1lido.');
    return false;
  }
  pushHistory();
  removeSelectedCards();
  state.foundations[suitId].push(card);
  if (state.selected.source === 'tableau') {
    revealTopCard(state.selected.pileIndex);
  }
  state.moves += 1;
  clearSelection();
  checkWin();
  return true;
}

function drawFromStock() {
  if (state.stock.length) {
    pushHistory();
    const card = state.stock.pop();
    card.faceUp = true;
    state.waste.push(card);
    state.moves += 1;
    clearSelection();
    return;
  }
  if (!state.waste.length) {
    setMessage('Sem cartas para comprar.');
    return;
  }
  pushHistory();
  state.stock = state.waste.reverse().map((card) => ({
    ...card,
    faceUp: false
  }));
  state.waste = [];
  state.moves += 1;
  clearSelection();
}

function handleCardClick(cardEl) {
  const source = cardEl.dataset.source;
  if (source === 'tableau') {
    const pileIndex = Number(cardEl.dataset.pile);
    const cardIndex = Number(cardEl.dataset.index);
    const card = state.tableau[pileIndex][cardIndex];

    if (!card.faceUp && cardIndex === state.tableau[pileIndex].length - 1) {
      pushHistory();
      card.faceUp = true;
      state.moves += 1;
      clearSelection();
      setMessage('Carta revelada.');
      return;
    }

    if (state.selected) {
      if (tryMoveToTableau(pileIndex)) {
        return;
      }
    }
    state.selected = { source: 'tableau', pileIndex, cardIndex };
    return;
  }

  if (source === 'waste') {
    if (state.selected && state.selected.source !== 'waste') {
      setMessage('O descarte s\u00f3 pode mover cartas para o tableau ou funda\u00e7\u00f5es.');
    }
    state.selected = { source: 'waste' };
    return;
  }

  if (source === 'foundation') {
    const suitId = cardEl.dataset.suit;
    if (state.selected) {
      tryMoveToFoundation(suitId);
      return;
    }
    state.selected = { source: 'foundation', suit: suitId };
  }
}

function handlePileClick(pileEl) {
  const pileType = pileEl.dataset.pile;
  if (pileType === 'stock') {
    drawFromStock();
    return;
  }
  if (pileType === 'tableau') {
    if (state.selected) {
      tryMoveToTableau(Number(pileEl.dataset.index));
    } else {
      setMessage('Apenas Reis podem ocupar espa\u00e7os vazios.');
    }
    return;
  }
  if (pileType === 'foundation') {
    if (state.selected) {
      tryMoveToFoundation(pileEl.dataset.suit);
    }
  }
}

function findAutoFoundationMove(card) {
  if (!card) {
    return null;
  }
  if (!canMoveToFoundation(card, card.suit)) {
    return null;
  }
  return card.suit;
}

function handleDoubleClick(cardEl) {
  const source = cardEl.dataset.source;
  if (source === 'waste') {
    const card = state.waste[state.waste.length - 1];
    const suitId = findAutoFoundationMove(card);
    if (suitId) {
      state.selected = { source: 'waste' };
      tryMoveToFoundation(suitId);
    }
    return;
  }
  if (source === 'tableau') {
    const pileIndex = Number(cardEl.dataset.pile);
    const cardIndex = Number(cardEl.dataset.index);
    const pile = state.tableau[pileIndex];
    if (cardIndex !== pile.length - 1) {
      return;
    }
    const card = pile[pile.length - 1];
    const suitId = findAutoFoundationMove(card);
    if (suitId) {
      state.selected = { source: 'tableau', pileIndex, cardIndex };
      tryMoveToFoundation(suitId);
    }
  }
}

function checkWin() {
  const won = suits.every((suit) => state.foundations[suit.id].length === 13);
  if (!won) {
    return;
  }
  stopTimer();
  state.wins += 1;
  localStorage.setItem('klondike_wins', String(state.wins));
  updateStats();
  showOverlay();
}

function showOverlay() {
  elements.overlay.classList.add('is-visible');
  elements.overlay.setAttribute('aria-hidden', 'false');
}

function hideOverlay() {
  elements.overlay.classList.remove('is-visible');
  elements.overlay.setAttribute('aria-hidden', 'true');
}

function showHint() {
  if (state.stock.length) {
    setMessage('Dica: compre uma carta no monte.');
    return;
  }

  const faceDownIndex = state.tableau.findIndex((pile) => pile.length && !pile[pile.length - 1].faceUp);
  if (faceDownIndex !== -1) {
    setMessage(`Dica: vire a carta da coluna ${faceDownIndex + 1}.`);
    return;
  }

  if (state.waste.length) {
    const card = state.waste[state.waste.length - 1];
    if (canMoveToFoundation(card, card.suit)) {
      setMessage(`Dica: envie ${card.label} de ${getSuitName(card.suit)} para a funda\u00e7\u00e3o.`);
      return;
    }
    for (let i = 0; i < state.tableau.length; i += 1) {
      if (canMoveToTableau([card], state.tableau[i])) {
        setMessage(`Dica: mova ${card.label} de ${getSuitName(card.suit)} para a coluna ${i + 1}.`);
        return;
      }
    }
  }

  for (let i = 0; i < state.tableau.length; i += 1) {
    const pile = state.tableau[i];
    for (let j = 0; j < pile.length; j += 1) {
      const card = pile[j];
      if (!card.faceUp) {
        continue;
      }
      if (j === pile.length - 1 && canMoveToFoundation(card, card.suit)) {
        setMessage(`Dica: envie ${card.label} de ${getSuitName(card.suit)} para a funda\u00e7\u00e3o.`);
        return;
      }
      for (let k = 0; k < state.tableau.length; k += 1) {
        if (k === i) {
          continue;
        }
        if (canMoveToTableau(pile.slice(j), state.tableau[k])) {
          setMessage(`Dica: mova a sequ\u00eancia come\u00e7ando em ${card.label}.`);
          return;
        }
      }
    }
  }

  setMessage('Sem movimentos evidentes.');
}

function getCardInfoFromElement(cardEl) {
  const source = cardEl.dataset.source;
  if (!source) {
    return null;
  }
  if (source === 'tableau') {
    const pileIndex = Number(cardEl.dataset.pile);
    const cardIndex = Number(cardEl.dataset.index);
    const card = state.tableau[pileIndex] && state.tableau[pileIndex][cardIndex];
    return card ? { source, pileIndex, cardIndex, card } : null;
  }
  if (source === 'waste') {
    const card = state.waste[state.waste.length - 1];
    return card ? { source, card } : null;
  }
  if (source === 'foundation') {
    const suit = cardEl.dataset.suit;
    const pile = state.foundations[suit];
    const card = pile && pile[pile.length - 1];
    return card ? { source, suit, card } : null;
  }
  return null;
}

function buildSelectionFromInfo(info) {
  if (!info) {
    return null;
  }
  if (info.source === 'tableau') {
    return { source: 'tableau', pileIndex: info.pileIndex, cardIndex: info.cardIndex };
  }
  if (info.source === 'waste') {
    return { source: 'waste' };
  }
  if (info.source === 'foundation') {
    return { source: 'foundation', suit: info.suit };
  }
  return null;
}

function getDragCards(info) {
  if (!info) {
    return [];
  }
  if (info.source === 'tableau') {
    return state.tableau[info.pileIndex].slice(info.cardIndex);
  }
  if (info.source === 'waste') {
    return state.waste.length ? [state.waste[state.waste.length - 1]] : [];
  }
  if (info.source === 'foundation') {
    const pile = state.foundations[info.suit];
    return pile.length ? [pile[pile.length - 1]] : [];
  }
  return [];
}

function ensureDragLayer() {
  if (!dragState.dragLayer) {
    dragState.dragLayer = document.createElement('div');
    dragState.dragLayer.className = 'drag-layer';
  }
  if (!dragState.dragLayer.parentNode) {
    document.body.appendChild(dragState.dragLayer);
  }
}

function buildDragCard(card) {
  const cardEl = document.createElement('div');
  cardEl.className = `card ${card.color}`;
  cardEl.setAttribute('aria-hidden', 'true');
  cardEl.innerHTML = `
    <span class="corner top"><span class="rank">${card.label}</span><span class="suit">${card.suitSymbol}</span></span>
    <span class="suit center">${card.suitSymbol}</span>
    <span class="corner bottom"><span class="rank">${card.label}</span><span class="suit">${card.suitSymbol}</span></span>
  `;
  return cardEl;
}

function markSourceCardsHidden(info) {
  dragState.sourceCardEls = [];
  if (!info) {
    return;
  }
  if (info.source === 'tableau') {
    const pileEl = elements.tableau[info.pileIndex];
    if (!pileEl) {
      return;
    }
    dragState.sourceCardEls = Array.from(pileEl.querySelectorAll('.card')).filter(
      (el) => Number(el.dataset.index) >= info.cardIndex
    );
  } else if (info.source === 'waste') {
    const cardEl = elements.waste.querySelector('.card');
    if (cardEl) {
      dragState.sourceCardEls = [cardEl];
    }
  } else if (info.source === 'foundation') {
    const foundationEl = elements.foundations.find((el) => el.dataset.suit === info.suit);
    if (foundationEl) {
      const cardEl = foundationEl.querySelector('.card');
      if (cardEl) {
        dragState.sourceCardEls = [cardEl];
      }
    }
  }
  dragState.sourceCardEls.forEach((el) => el.classList.add('is-drag-hidden'));
}

function clearDragArtifacts() {
  dragState.sourceCardEls.forEach((el) => el.classList.remove('is-drag-hidden'));
  dragState.sourceCardEls = [];
  if (dragState.dragStack && dragState.dragLayer) {
    dragState.dragLayer.removeChild(dragState.dragStack);
  }
  dragState.dragStack = null;
}

function beginDrag(event) {
  const info = dragState.sourceInfo;
  const cards = getDragCards(info);
  if (!cards.length) {
    dragState.pending = false;
    return;
  }
  dragState.active = true;
  dragState.pending = false;
  ensureDragLayer();
  dragState.dragStack = document.createElement('div');
  dragState.dragStack.className = 'drag-stack';
  const offset = getOffsetUp();
  cards.forEach((card, index) => {
    const cardEl = buildDragCard(card);
    cardEl.style.top = `${index * offset}px`;
    cardEl.style.left = '0px';
    cardEl.style.zIndex = index + 1;
    dragState.dragStack.appendChild(cardEl);
  });
  dragState.dragLayer.appendChild(dragState.dragStack);
  const rect = dragState.sourceEl.getBoundingClientRect();
  dragState.offsetX = event.clientX - rect.left;
  dragState.offsetY = event.clientY - rect.top;
  document.querySelectorAll('.card.is-selected').forEach((el) => el.classList.remove('is-selected'));
  clearSelection();
  markSourceCardsHidden(info);
  updateDragPosition(event.clientX, event.clientY);
}

function updateDragPosition(x, y) {
  if (!dragState.dragStack) {
    return;
  }
  dragState.dragStack.style.left = `${x - dragState.offsetX}px`;
  dragState.dragStack.style.top = `${y - dragState.offsetY}px`;
}

function attemptDrop(pileEl) {
  if (!pileEl || !dragState.sourceInfo) {
    return false;
  }
  const pileType = pileEl.dataset.pile;
  const selection = buildSelectionFromInfo(dragState.sourceInfo);
  if (!selection) {
    return false;
  }
  state.selected = selection;
  let moved = false;
  if (pileType === 'tableau') {
    moved = tryMoveToTableau(Number(pileEl.dataset.index));
  } else if (pileType === 'foundation') {
    moved = tryMoveToFoundation(pileEl.dataset.suit);
  }
  if (!moved) {
    clearSelection();
  }
  return moved;
}

function endDrag() {
  clearDragArtifacts();
  dragState.active = false;
  dragState.pending = false;
  dragState.pointerId = null;
  dragState.sourceInfo = null;
  dragState.sourceEl = null;
}

document.addEventListener('pointerdown', (event) => {
  const cardEl = event.target.closest('.card');
  if (!cardEl || event.button !== 0) {
    return;
  }
  const info = getCardInfoFromElement(cardEl);
  if (!info || !info.card || !info.card.faceUp) {
    return;
  }
  dragState.pending = true;
  dragState.pointerId = event.pointerId;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.sourceInfo = info;
  dragState.sourceEl = cardEl;
  dragState.justDragged = false;
});

document.addEventListener('pointermove', (event) => {
  if ((!dragState.pending && !dragState.active) || event.pointerId !== dragState.pointerId) {
    return;
  }
  const dx = event.clientX - dragState.startX;
  const dy = event.clientY - dragState.startY;
  const distance = Math.hypot(dx, dy);
  if (dragState.pending && distance > 6) {
    beginDrag(event);
  }
  if (dragState.active) {
    event.preventDefault();
    updateDragPosition(event.clientX, event.clientY);
  }
}, { passive: false });

document.addEventListener('pointerup', (event) => {
  if (event.pointerId !== dragState.pointerId) {
    return;
  }
  if (dragState.pending) {
    dragState.pending = false;
    dragState.pointerId = null;
    return;
  }
  if (!dragState.active) {
    return;
  }
  event.preventDefault();
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const pileEl = target ? target.closest('.pile') : null;
  attemptDrop(pileEl);
  endDrag();
  render();
  dragState.justDragged = true;
  setTimeout(() => {
    dragState.justDragged = false;
  }, 0);
});

document.addEventListener('pointercancel', (event) => {
  if (event.pointerId !== dragState.pointerId) {
    return;
  }
  if (dragState.active) {
    endDrag();
    render();
  }
  dragState.pending = false;
  dragState.pointerId = null;
});
document.addEventListener('click', (event) => {
  if (dragState.justDragged) {
    dragState.justDragged = false;
    return;
  }
  const cardEl = event.target.closest('.card');
  const pileEl = event.target.closest('.pile');

  if (!pileEl) {
    clearSelection();
    render();
    return;
  }

  if (pileEl.dataset.pile === 'stock') {
    drawFromStock();
    render();
    return;
  }

  if (cardEl) {
    handleCardClick(cardEl);
    render();
    return;
  }

  handlePileClick(pileEl);
  render();
});

document.addEventListener('dblclick', (event) => {
  if (dragState.justDragged) {
    dragState.justDragged = false;
    return;
  }
  const cardEl = event.target.closest('.card');
  if (!cardEl) {
    return;
  }
  handleDoubleClick(cardEl);
  render();
});

elements.undo.addEventListener('click', undoMove);
elements.newGame.addEventListener('click', startNewGame);
elements.hint.addEventListener('click', showHint);
elements.playAgain.addEventListener('click', startNewGame);
elements.difficulty.addEventListener('change', (event) => {
  state.difficulty = event.target.value === 'easy' ? 'easy' : 'hard';
  localStorage.setItem('klondike_difficulty', state.difficulty);
  syncDifficultyUI();
  startNewGame();
  setMessage(`Dificuldade ${getDifficultyLabel()} ativada.`);
});

window.addEventListener('resize', () => {
  refreshLayoutMetrics();
  render();
});

syncDifficultyUI();
updateUndoButton();
updateStats();
startNewGame();
