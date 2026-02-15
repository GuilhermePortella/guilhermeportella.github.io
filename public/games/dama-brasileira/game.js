(() => {
'use strict';

const SIZE = 8;
const WHITE = 'white';
const BLACK = 'black';
const DIAGONALS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]
];
const MAX_HISTORY = 300;
const STORAGE_KEY = 'dama_brasileira_wins_v1';
const AI_LEVEL_STORAGE_KEY = 'dama_brasileira_ai_level_v1';
const MACHINE_COLOR = BLACK;
const FILES = 'abcdefgh';
const AI_LEVEL_LABELS = {
  easy: 'facil',
  medium: 'medio',
  hard: 'dificil'
};
const AI_PROFILES = {
  easy: {
    mistakeChance: 0.62,
    topPool: 4,
    captureTopPool: 3,
    noise: 180,
    captureWeight: 80,
    promotionBonus: 38,
    kingBonus: 8,
    edgeBonus: 4,
    opponentCapturePenalty: 75,
    opponentMovePenalty: 2,
    mateBonus: 1200
  },
  medium: {
    mistakeChance: 0.24,
    topPool: 3,
    captureTopPool: 2,
    noise: 95,
    captureWeight: 110,
    promotionBonus: 45,
    kingBonus: 10,
    edgeBonus: 5,
    opponentCapturePenalty: 100,
    opponentMovePenalty: 3,
    mateBonus: 3200
  },
  hard: {
    mistakeChance: 0.05,
    topPool: 1,
    captureTopPool: 1,
    noise: 25,
    captureWeight: 135,
    promotionBonus: 55,
    kingBonus: 12,
    edgeBonus: 6,
    opponentCapturePenalty: 130,
    opponentMovePenalty: 4,
    mateBonus: 10000
  }
};

const elements = {
  board: document.getElementById('board'),
  turnLabel: document.getElementById('turn-label'),
  whiteCount: document.getElementById('white-count'),
  blackCount: document.getElementById('black-count'),
  winsLabel: document.getElementById('wins-label'),
  modeLabel: document.getElementById('mode-label'),
  ruleLabel: document.getElementById('rule-label'),
  winnerLabel: document.getElementById('winner-label'),
  message: document.getElementById('message'),
  aiLevel: document.getElementById('ai-level'),
  toggleAi: document.getElementById('toggle-ai'),
  newGame: document.getElementById('new-game'),
  undo: document.getElementById('undo-move')
};

if (!hasRequiredElements()) {
  return;
}

const state = {
  board: createInitialBoard(),
  turn: WHITE,
  selected: null,
  legal: { capture: false, maxCapture: 0, moves: [], byFrom: {} },
  chain: null,
  winner: null,
  wins: loadWins(),
  aiLevel: loadAILevel(),
  vsMachine: true,
  aiTimerId: null,
  history: [],
  message: 'Brancas iniciam a partida.'
};

function hasRequiredElements() {
  return Boolean(
    elements.board
      && elements.turnLabel
      && elements.whiteCount
      && elements.blackCount
      && elements.winsLabel
      && elements.modeLabel
      && elements.ruleLabel
      && elements.winnerLabel
      && elements.message
      && elements.aiLevel
      && elements.toggleAi
      && elements.newGame
      && elements.undo
  );
}

function createPiece(color, king = false) {
  return { color, king };
}

function createInitialBoard() {
  const board = Array.from({ length: SIZE * SIZE }, () => null);

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (!isDarkSquare(row, col)) {
        continue;
      }
      const index = toIndex(row, col);
      if (row <= 2) {
        board[index] = createPiece(BLACK);
      } else if (row >= 5) {
        board[index] = createPiece(WHITE);
      }
    }
  }

  return board;
}

function toIndex(row, col) {
  return row * SIZE + col;
}

function fromIndex(index) {
  return [Math.floor(index / SIZE), index % SIZE];
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function isDarkSquare(row, col) {
  return (row + col) % 2 === 1;
}

function isPromotionRow(index, color) {
  const [row] = fromIndex(index);
  return (color === WHITE && row === 0) || (color === BLACK && row === SIZE - 1);
}

function cloneBoard(board) {
  return board.map((piece) => (piece ? { color: piece.color, king: piece.king } : null));
}

function otherColor(color) {
  return color === WHITE ? BLACK : WHITE;
}

function groupByFrom(moves) {
  return moves.reduce((acc, move) => {
    const key = String(move.from);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(move);
    return acc;
  }, {});
}

function getManCaptureOptions(board, origin, color) {
  const [row, col] = fromIndex(origin);
  const options = [];

  DIAGONALS.forEach(([dr, dc]) => {
    const midRow = row + dr;
    const midCol = col + dc;
    const landRow = row + (dr * 2);
    const landCol = col + (dc * 2);
    if (!isInside(midRow, midCol) || !isInside(landRow, landCol)) {
      return;
    }

    const middle = toIndex(midRow, midCol);
    const landing = toIndex(landRow, landCol);
    const middlePiece = board[middle];
    if (!middlePiece || middlePiece.color === color || board[landing]) {
      return;
    }

    options.push({ capture: middle, land: landing });
  });

  return options;
}

function getKingCaptureOptions(board, origin, color) {
  const [row, col] = fromIndex(origin);
  const options = [];

  DIAGONALS.forEach(([dr, dc]) => {
    let currentRow = row + dr;
    let currentCol = col + dc;
    let enemyIndex = null;

    while (isInside(currentRow, currentCol)) {
      const index = toIndex(currentRow, currentCol);
      const piece = board[index];

      if (!enemyIndex) {
        if (!piece) {
          currentRow += dr;
          currentCol += dc;
          continue;
        }

        if (piece.color === color) {
          break;
        }

        enemyIndex = index;
        currentRow += dr;
        currentCol += dc;

        while (isInside(currentRow, currentCol) && !board[toIndex(currentRow, currentCol)]) {
          options.push({ capture: enemyIndex, land: toIndex(currentRow, currentCol) });
          currentRow += dr;
          currentCol += dc;
        }
        break;
      }
    }
  });

  return options;
}

function generateManCaptures(board, start, color) {
  const sequences = [];

  function explore(currentBoard, origin, landings, captures) {
    const options = getManCaptureOptions(currentBoard, origin, color);
    const onPromotion = isPromotionRow(origin, color);

    // Brazilian rule: if a man reaches the back rank during capture and there is a man-capture,
    // it must continue as a man. If only king-capture exists, the move stops and crowns next turn.
    if (onPromotion && captures.length > 0 && options.length === 0) {
      sequences.push({ from: start, landings: [...landings], captures: [...captures] });
      return;
    }

    if (options.length === 0) {
      if (captures.length > 0) {
        sequences.push({ from: start, landings: [...landings], captures: [...captures] });
      }
      return;
    }

    options.forEach((option) => {
      const nextBoard = cloneBoard(currentBoard);
      const movingPiece = nextBoard[origin];
      nextBoard[origin] = null;
      nextBoard[option.capture] = null;
      nextBoard[option.land] = movingPiece;
      explore(
        nextBoard,
        option.land,
        [...landings, option.land],
        [...captures, option.capture]
      );
    });
  }

  explore(board, start, [], []);
  return sequences;
}

function generateKingCaptures(board, start, color) {
  const sequences = [];

  function explore(currentBoard, origin, landings, captures) {
    const options = getKingCaptureOptions(currentBoard, origin, color);
    if (!options.length) {
      if (captures.length > 0) {
        sequences.push({ from: start, landings: [...landings], captures: [...captures] });
      }
      return;
    }

    options.forEach((option) => {
      const nextBoard = cloneBoard(currentBoard);
      const movingPiece = nextBoard[origin];
      nextBoard[origin] = null;
      nextBoard[option.capture] = null;
      nextBoard[option.land] = movingPiece;
      explore(
        nextBoard,
        option.land,
        [...landings, option.land],
        [...captures, option.capture]
      );
    });
  }

  explore(board, start, [], []);
  return sequences;
}

function generateQuietMovesForPiece(board, index, piece) {
  const moves = [];
  const [row, col] = fromIndex(index);

  if (!piece.king) {
    const forward = piece.color === WHITE ? -1 : 1;
    [-1, 1].forEach((dc) => {
      const nextRow = row + forward;
      const nextCol = col + dc;
      if (!isInside(nextRow, nextCol)) {
        return;
      }
      const destination = toIndex(nextRow, nextCol);
      if (!board[destination]) {
        moves.push({
          from: index,
          landings: [destination],
          captures: []
        });
      }
    });
    return moves;
  }

  DIAGONALS.forEach(([dr, dc]) => {
    let nextRow = row + dr;
    let nextCol = col + dc;
    while (isInside(nextRow, nextCol)) {
      const destination = toIndex(nextRow, nextCol);
      if (board[destination]) {
        break;
      }
      moves.push({
        from: index,
        landings: [destination],
        captures: []
      });
      nextRow += dr;
      nextCol += dc;
    }
  });

  return moves;
}

function buildLegalState(board, turn) {
  const captureMoves = [];

  board.forEach((piece, index) => {
    if (!piece || piece.color !== turn) {
      return;
    }
    const sequences = piece.king
      ? generateKingCaptures(board, index, piece.color)
      : generateManCaptures(board, index, piece.color);
    captureMoves.push(...sequences);
  });

  if (captureMoves.length > 0) {
    const maxCapture = captureMoves.reduce(
      (max, move) => Math.max(max, move.captures.length),
      0
    );
    const bestMoves = captureMoves.filter((move) => move.captures.length === maxCapture);
    return {
      capture: true,
      maxCapture,
      moves: bestMoves,
      byFrom: groupByFrom(bestMoves)
    };
  }

  const quietMoves = [];
  board.forEach((piece, index) => {
    if (!piece || piece.color !== turn) {
      return;
    }
    quietMoves.push(...generateQuietMovesForPiece(board, index, piece));
  });

  return {
    capture: false,
    maxCapture: 0,
    moves: quietMoves,
    byFrom: groupByFrom(quietMoves)
  };
}

function getSelectableSources() {
  if (state.winner || isMachineTurn()) {
    return [];
  }
  if (state.chain) {
    return [state.chain.pieceIndex];
  }
  return Object.keys(state.legal.byFrom).map((value) => Number(value));
}

function getDestinationSquares() {
  if (state.winner || isMachineTurn()) {
    return [];
  }

  if (state.chain) {
    const destinations = state.chain.variants.map((variant) => variant.landings[0]);
    return [...new Set(destinations)];
  }

  if (state.selected === null) {
    return [];
  }

  const options = state.legal.byFrom[String(state.selected)] || [];
  return [...new Set(options.map((option) => option.landings[0]))];
}

function countPieces(color) {
  return state.board.reduce((sum, piece) => (
    piece && piece.color === color ? sum + 1 : sum
  ), 0);
}

function isMachineTurn() {
  return state.vsMachine && !state.winner && !state.chain && state.turn === MACHINE_COLOR;
}

function clearAiTimer() {
  if (state.aiTimerId) {
    clearTimeout(state.aiTimerId);
    state.aiTimerId = null;
  }
}

function formatSquare(index) {
  const [row, col] = fromIndex(index);
  return `${FILES[col]}${SIZE - row}`;
}

function boardScore(board) {
  return board.reduce((score, piece) => {
    if (!piece) {
      return score;
    }
    const value = piece.king ? 175 : 100;
    return score + (piece.color === MACHINE_COLOR ? value : -value);
  }, 0);
}

function isEdgeSquare(index) {
  const [row, col] = fromIndex(index);
  return row === 0 || row === SIZE - 1 || col === 0 || col === SIZE - 1;
}

function getAIProfile() {
  return AI_PROFILES[state.aiLevel] || AI_PROFILES.easy;
}

function getAILevelLabel() {
  return AI_LEVEL_LABELS[state.aiLevel] || AI_LEVEL_LABELS.easy;
}

function simulateMove(board, move) {
  const nextBoard = cloneBoard(board);
  let current = move.from;
  let movingPiece = nextBoard[current];
  if (!movingPiece) {
    return { board: nextBoard, promoted: false, destination: current };
  }

  nextBoard[current] = null;
  for (let i = 0; i < move.landings.length; i += 1) {
    const destination = move.landings[i];
    if (move.captures[i] !== undefined) {
      nextBoard[move.captures[i]] = null;
    }
    nextBoard[destination] = movingPiece;
    if (current !== destination) {
      nextBoard[current] = null;
    }
    current = destination;
  }

  let promoted = false;
  if (!movingPiece.king && isPromotionRow(current, movingPiece.color)) {
    movingPiece = { ...movingPiece, king: true };
    nextBoard[current] = movingPiece;
    promoted = true;
  }

  return { board: nextBoard, promoted, destination: current };
}

function evaluateAIMove(move) {
  const profile = getAIProfile();
  const sourcePiece = state.board[move.from];
  const simulation = simulateMove(state.board, move);
  const opponentColor = otherColor(MACHINE_COLOR);
  const opponentLegal = buildLegalState(simulation.board, opponentColor);

  let score = 0;
  score += boardScore(simulation.board);
  score += move.captures.length * profile.captureWeight;
  score += simulation.promoted ? profile.promotionBonus : 0;
  score += sourcePiece && sourcePiece.king ? profile.kingBonus : 0;
  score += isEdgeSquare(simulation.destination) ? profile.edgeBonus : 0;

  if (opponentLegal.capture) {
    score -= opponentLegal.maxCapture * profile.opponentCapturePenalty;
    score -= opponentLegal.moves.length * profile.opponentMovePenalty;
  }

  if (!opponentLegal.moves.length) {
    score += profile.mateBonus;
  }

  return score;
}

function pickMachineMove() {
  const profile = getAIProfile();
  const moves = state.legal.moves;
  if (!moves.length) {
    return null;
  }
  if (moves.length === 1) {
    return moves[0];
  }

  if (Math.random() < profile.mistakeChance) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }

  const scoredMoves = moves
    .map((move) => ({
      move,
      score: evaluateAIMove(move) + ((Math.random() * 2 - 1) * profile.noise)
    }))
    .sort((a, b) => b.score - a.score);

  const poolLimit = state.legal.capture
    ? profile.captureTopPool
    : profile.topPool;
  const poolSize = Math.max(1, Math.min(poolLimit, scoredMoves.length));
  const randomTop = Math.floor(Math.random() * poolSize);
  return scoredMoves[randomTop].move;
}

function maybeQueueMachineTurn() {
  if (!isMachineTurn()) {
    clearAiTimer();
    return;
  }
  if (state.aiTimerId) {
    return;
  }
  state.aiTimerId = window.setTimeout(() => {
    state.aiTimerId = null;
    machinePlayTurn();
  }, 420);
}

function deepClone(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function pushHistory() {
  state.history.push(deepClone({
    board: state.board,
    turn: state.turn,
    selected: state.selected,
    legal: state.legal,
    chain: state.chain,
    winner: state.winner,
    wins: state.wins,
    message: state.message
  }));

  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
  }
}

function restoreSnapshot(snapshot) {
  state.board = snapshot.board;
  state.turn = snapshot.turn;
  state.selected = snapshot.selected;
  state.legal = snapshot.legal;
  state.chain = snapshot.chain;
  state.winner = snapshot.winner;
  state.wins = snapshot.wins;
  state.message = snapshot.message;
}

function undoMove() {
  clearAiTimer();
  if (!state.history.length) {
    setMessage('Nao ha jogadas para desfazer.');
    render();
    maybeQueueMachineTurn();
    return;
  }
  const snapshot = state.history.pop();
  restoreSnapshot(snapshot);
  saveWins(state.wins);
  setMessage('Ultima jogada desfeita.');
  render();
  maybeQueueMachineTurn();
}

function maybePromote(index) {
  const piece = state.board[index];
  if (!piece || piece.king || !isPromotionRow(index, piece.color)) {
    return false;
  }
  piece.king = true;
  return true;
}

function applyCaptureStep(from, to, capturedIndex) {
  const movingPiece = state.board[from];
  state.board[from] = null;
  state.board[capturedIndex] = null;
  state.board[to] = movingPiece;
}

function completeTurn(promoted, actor = 'human', actorNote = '') {
  state.selected = null;
  state.chain = null;
  state.turn = otherColor(state.turn);
  state.legal = buildLegalState(state.board, state.turn);

  const whiteLeft = countPieces(WHITE);
  const blackLeft = countPieces(BLACK);

  if (whiteLeft === 0) {
    state.winner = BLACK;
  } else if (blackLeft === 0) {
    state.winner = WHITE;
  } else if (!state.legal.moves.length) {
    state.winner = otherColor(state.turn);
  } else {
    state.winner = null;
  }

  if (state.winner) {
    state.wins[state.winner] += 1;
    saveWins(state.wins);
    const winnerLabel = state.winner === WHITE ? 'Brancas' : 'Pretas';
    const prefix = actorNote ? `${actorNote} ` : '';
    setMessage(`${prefix}Fim de jogo: ${winnerLabel} venceram.`);
  } else if (state.legal.capture) {
    const pieceWord = state.legal.maxCapture === 1 ? 'peca' : 'pecas';
    let prefix = '';
    if (actorNote) {
      prefix += `${actorNote} `;
    }
    if (actor === 'machine') {
      prefix += 'Agora e a vez das brancas. ';
    }
    if (promoted) {
      prefix += 'Dama formada. ';
    }
    setMessage(`${prefix}Captura obrigatoria: escolha sequencia de ${state.legal.maxCapture} ${pieceWord}.`);
  } else {
    let text = '';
    if (actorNote) {
      text += `${actorNote} `;
    }
    if (actor === 'machine') {
      text += 'Agora e a vez das brancas. ';
    }
    text += promoted ? 'Dama formada. Turno trocado.' : 'Turno trocado.';
    setMessage(text);
  }

  render();
  maybeQueueMachineTurn();
}

function playQuietMove(move) {
  pushHistory();
  const from = move.from;
  const to = move.landings[0];
  const movingPiece = state.board[from];
  state.board[from] = null;
  state.board[to] = movingPiece;
  const promoted = maybePromote(to);
  completeTurn(promoted);
}

function machinePlayTurn() {
  if (!isMachineTurn()) {
    return;
  }

  const move = pickMachineMove();
  if (!move) {
    return;
  }

  pushHistory();
  let current = move.from;
  const movingPiece = state.board[current];
  state.board[current] = null;

  for (let i = 0; i < move.landings.length; i += 1) {
    const destination = move.landings[i];
    if (move.captures[i] !== undefined) {
      state.board[move.captures[i]] = null;
    }
    state.board[destination] = movingPiece;
    if (current !== destination) {
      state.board[current] = null;
    }
    current = destination;
  }

  const promoted = maybePromote(current);
  const moveText = move.captures.length
    ? `Maquina capturou ${move.captures.length} ${move.captures.length === 1 ? 'peca' : 'pecas'} (${formatSquare(move.from)} -> ${formatSquare(current)}).`
    : `Maquina moveu ${formatSquare(move.from)} -> ${formatSquare(current)}.`;
  completeTurn(promoted, 'machine', moveText);
}

function startCaptureChain(variants, destination) {
  pushHistory();
  const source = state.selected;
  const capturedIndex = variants[0].captures[0];
  applyCaptureStep(source, destination, capturedIndex);

  const remaining = variants.map((variant) => ({
    from: destination,
    landings: variant.landings.slice(1),
    captures: variant.captures.slice(1)
  }));
  const pending = remaining.filter((variant) => variant.landings.length > 0);

  if (!pending.length) {
    const promoted = maybePromote(destination);
    completeTurn(promoted);
    return;
  }

  state.chain = {
    pieceIndex: destination,
    variants: pending
  };
  state.selected = destination;
  setMessage('Captura multipla: continue com a mesma peca.');
  render();
}

function continueCaptureChain(destination) {
  const variants = state.chain.variants.filter((variant) => variant.landings[0] === destination);
  if (!variants.length) {
    return;
  }

  pushHistory();
  const source = state.chain.pieceIndex;
  const capturedIndex = variants[0].captures[0];
  applyCaptureStep(source, destination, capturedIndex);

  const remaining = variants.map((variant) => ({
    from: destination,
    landings: variant.landings.slice(1),
    captures: variant.captures.slice(1)
  }));
  const pending = remaining.filter((variant) => variant.landings.length > 0);

  if (!pending.length) {
    const promoted = maybePromote(destination);
    completeTurn(promoted);
    return;
  }

  state.chain = {
    pieceIndex: destination,
    variants: pending
  };
  state.selected = destination;
  setMessage('Continue a sequencia de captura.');
  render();
}

function setMessage(text) {
  state.message = text;
  elements.message.textContent = text;
}

function newGame() {
  clearAiTimer();
  state.board = createInitialBoard();
  state.turn = WHITE;
  state.selected = null;
  state.chain = null;
  state.winner = null;
  state.history = [];
  state.legal = buildLegalState(state.board, state.turn);
  setMessage('Novo jogo iniciado. Brancas jogam primeiro.');
  render();
  maybeQueueMachineTurn();
}

function updateModeUI() {
  const levelLabel = getAILevelLabel();
  elements.toggleAi.textContent = state.vsMachine ? 'Vs maquina: ON' : 'Vs maquina: OFF';
  elements.aiLevel.value = state.aiLevel;
  elements.aiLevel.disabled = !state.vsMachine;
  elements.modeLabel.textContent = state.vsMachine
    ? `Modo: 1 jogador (maquina ${levelLabel} nas pretas).`
    : 'Modo: 2 jogadores locais.';
}

function handleAILevelChange(event) {
  const nextLevel = String(event.target.value || '');
  if (!AI_PROFILES[nextLevel]) {
    event.target.value = state.aiLevel;
    return;
  }

  state.aiLevel = nextLevel;
  saveAILevel(state.aiLevel);
  clearAiTimer();

  if (state.vsMachine) {
    setMessage(`Dificuldade da maquina ajustada para ${getAILevelLabel()}.`);
  } else {
    setMessage(`Dificuldade ${getAILevelLabel()} salva. Ative o modo maquina para aplicar.`);
  }

  render();
  maybeQueueMachineTurn();
}

function toggleMachineMode() {
  state.vsMachine = !state.vsMachine;
  clearAiTimer();
  state.selected = null;
  state.chain = null;
  updateModeUI();

  if (state.vsMachine) {
    setMessage(`Modo maquina ativado (pretas automaticas, dificuldade ${getAILevelLabel()}).`);
  } else {
    setMessage('Modo maquina desativado. Jogo local para 2 jogadores.');
  }

  render();
  maybeQueueMachineTurn();
}

function describePiece(piece) {
  if (!piece) {
    return 'vazia';
  }
  const color = piece.color === WHITE ? 'branca' : 'preta';
  return piece.king ? `dama ${color}` : `peca ${color}`;
}

function handleBoardClick(event) {
  const square = event.target.closest('.square');
  if (!square || !elements.board.contains(square)) {
    return;
  }
  if (isMachineTurn()) {
    setMessage('Aguarde a jogada da maquina.');
    render();
    return;
  }
  const index = Number(square.dataset.index);
  if (!Number.isInteger(index)) {
    return;
  }
  const [row, col] = fromIndex(index);
  if (!isDarkSquare(row, col) || state.winner) {
    return;
  }

  const selectable = new Set(getSelectableSources());
  const destinations = new Set(getDestinationSquares());

  if (state.chain) {
    if (destinations.has(index)) {
      continueCaptureChain(index);
      return;
    }
    setMessage('Captura em andamento: use a mesma peca.');
    render();
    return;
  }

  if (state.selected !== null && destinations.has(index)) {
    const options = state.legal.byFrom[String(state.selected)] || [];
    const matching = options.filter((option) => option.landings[0] === index);
    if (!matching.length) {
      return;
    }
    if (state.legal.capture) {
      startCaptureChain(matching, index);
    } else {
      playQuietMove(matching[0]);
    }
    return;
  }

  if (selectable.has(index)) {
    state.selected = index;
    setMessage(state.legal.capture ? 'Escolha o proximo salto da captura.' : 'Escolha o destino da peca.');
    render();
    return;
  }

  state.selected = null;
  render();
}

function renderBoard() {
  const selectable = new Set(getSelectableSources());
  const destinations = new Set(getDestinationSquares());
  const forced = state.chain ? state.chain.pieceIndex : null;

  let html = '';
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const index = toIndex(row, col);
      const piece = state.board[index];
      const dark = isDarkSquare(row, col);
      const classes = ['square', dark ? 'dark' : 'light'];

      if (dark && selectable.has(index)) {
        classes.push('is-selectable');
      }
      if (dark && state.selected === index) {
        classes.push('is-selected');
      }
      if (dark && destinations.has(index)) {
        classes.push('is-destination');
      }
      if (dark && forced === index) {
        classes.push('is-forced');
      }

      const pieceMarkup = piece
        ? `<span class="piece ${piece.color}${piece.king ? ' king' : ''}" aria-hidden="true"></span>`
        : '';
      const dotMarkup = dark && destinations.has(index) && !piece
        ? '<span class="target-dot" aria-hidden="true"></span>'
        : '';

      html += `
        <button
          type="button"
          class="${classes.join(' ')}"
          data-index="${index}"
          aria-label="Casa ${row + 1},${col + 1} ${describePiece(piece)}"
        >
          ${pieceMarkup}
          ${dotMarkup}
        </button>
      `;
    }
  }
  elements.board.innerHTML = html;
}

function renderInfo() {
  updateModeUI();
  const whitePieces = countPieces(WHITE);
  const blackPieces = countPieces(BLACK);
  const turnText = state.turn === WHITE ? 'Brancas' : 'Pretas';
  const winnerText = state.winner
    ? `${state.winner === WHITE ? 'Brancas' : 'Pretas'} venceram.`
    : 'Partida em andamento.';

  elements.turnLabel.textContent = state.winner ? '-' : turnText;
  elements.whiteCount.textContent = String(whitePieces);
  elements.blackCount.textContent = String(blackPieces);
  elements.winsLabel.textContent = `${state.wins[WHITE]} / ${state.wins[BLACK]}`;
  elements.winnerLabel.textContent = winnerText;
  elements.winnerLabel.classList.toggle('is-final', Boolean(state.winner));

  if (state.winner) {
    elements.ruleLabel.textContent = 'Partida finalizada.';
  } else if (state.chain) {
    elements.ruleLabel.textContent = 'Captura multipla obrigatoria em andamento.';
  } else if (state.legal.capture) {
    const pieceWord = state.legal.maxCapture === 1 ? 'peca' : 'pecas';
    elements.ruleLabel.textContent = `Regra da maioria ativa: capturar ${state.legal.maxCapture} ${pieceWord}.`;
  } else {
    elements.ruleLabel.textContent = 'Sem captura obrigatoria neste turno.';
  }

  elements.message.textContent = state.message;
  elements.undo.disabled = state.history.length === 0;
}

function render() {
  renderBoard();
  renderInfo();
}

function loadWins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { [WHITE]: 0, [BLACK]: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      [WHITE]: Number(parsed[WHITE]) || 0,
      [BLACK]: Number(parsed[BLACK]) || 0
    };
  } catch (error) {
    return { [WHITE]: 0, [BLACK]: 0 };
  }
}

function saveWins(wins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
}

function loadAILevel() {
  try {
    const raw = localStorage.getItem(AI_LEVEL_STORAGE_KEY);
    if (!raw || !AI_PROFILES[raw]) {
      return 'easy';
    }
    return raw;
  } catch (error) {
    return 'easy';
  }
}

function saveAILevel(level) {
  localStorage.setItem(AI_LEVEL_STORAGE_KEY, level);
}

elements.board.addEventListener('click', handleBoardClick);
elements.aiLevel.addEventListener('change', handleAILevelChange);
elements.toggleAi.addEventListener('click', toggleMachineMode);
elements.newGame.addEventListener('click', newGame);
elements.undo.addEventListener('click', undoMove);

state.legal = buildLegalState(state.board, state.turn);
render();
maybeQueueMachineTurn();
})();
