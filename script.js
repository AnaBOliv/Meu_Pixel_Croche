// ==========================
// ELEMENTOS
// ==========================
const upload = document.getElementById("upload");
const gridContainer = document.getElementById("grid");
const info = document.getElementById("info");
const qualidadeInput = document.getElementById("qualidade");

// ==========================
// CONFIGURAÇÕES
// ==========================
let gridData = [];
let cellSize = 15;

let gridWidth = 50;
let gridHeight = 50;

// controle de qualidade (quanto maior = mais definição)
let qualidade = 50;

// ==========================
// INICIALIZAÇÃO
// ==========================
window.onload = () => {
  carregarImagemDaGaleria();
};

// ==========================
// CONTROLE DE QUALIDADE
// ==========================
if (qualidadeInput) {
  qualidadeInput.addEventListener("input", (e) => {
    qualidade = parseInt(e.target.value);
    carregarImagemDaGaleria(); // recarrega com nova qualidade
  });
}

// ==========================
// UPLOAD
// ==========================
if (upload) {
  upload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) carregarImagemArquivo(file);
  });
}

// ==========================
// CARREGAR IMAGEM
// ==========================
function carregarImagemArquivo(file) {
  const img = new Image();
  const url = URL.createObjectURL(file);

  img.onload = () => {
    processarImagem(img);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

function carregarImagemDaGaleria() {
  const caminho = localStorage.getItem("imagemModelo");
  if (!caminho) return;

  const img = new Image();

  img.onload = () => processarImagem(img);

  img.src = caminho;
}

// ==========================
// FILTRO DE COR (ANTI-LINHAS)
// ==========================
function limparCor(r, g, b) {
  // remove linhas escuras (grade)
  const media = (r + g + b) / 3;

  if (media < 40) return { r: 255, g: 255, b: 255 }; // ignora preto

  return {
    r: Math.round(r / 64) * 64,
    g: Math.round(g / 64) * 64,
    b: Math.round(b / 64) * 64
  };
}

// ==========================
// PROCESSAMENTO INTELIGENTE
// ==========================
function processarImagem(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const proporcao = img.height / img.width;

  gridWidth = qualidade;
  gridHeight = Math.floor(gridWidth * proporcao);

  canvas.width = gridWidth;
  canvas.height = gridHeight;

  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(img, 0, 0, gridWidth, gridHeight);

  const imageData = ctx.getImageData(0, 0, gridWidth, gridHeight).data;

  gridData = [];

  for (let y = 0; y < gridHeight; y++) {
    let row = [];

    for (let x = 0; x < gridWidth; x++) {
      const index = (y * gridWidth + x) * 4;

      let r = imageData[index];
      let g = imageData[index + 1];
      let b = imageData[index + 2];

      const cor = limparCor(r, g, b);

      row.push({
        r: cor.r,
        g: cor.g,
        b: cor.b,
        done: false
      });
    }

    gridData.push(row);
  }

  renderGrid();
}

// ==========================
// RENDER
// ==========================
function renderGrid() {
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  gridContainer.style.gridTemplateColumns =
    `repeat(${gridWidth}, ${cellSize}px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");

      div.classList.add("cell");

      div.style.width = cellSize + "px";
      div.style.height = cellSize + "px";

      div.style.backgroundColor =
        `rgb(${cell.r},${cell.g},${cell.b})`;

      if (cell.done) div.classList.add("done");

      div.onclick = () => {
        cell.done = !cell.done;
        div.classList.toggle("done");

        if (info) {
          info.textContent =
            `Linha: ${y + 1} | Coluna: ${x + 1}`;
        }
      };

      gridContainer.appendChild(div);
    });
  });
}

// ==========================
// ZOOM
// ==========================
function zoomIn() {
  cellSize += 5;
  renderGrid();
}

function zoomOut() {
  if (cellSize > 5) {
    cellSize -= 5;
    renderGrid();
  }
}

// ==========================
// GALERIA
// ==========================
function usarModelo(caminho) {
  localStorage.setItem("imagemModelo", caminho);
  window.location.href = "app.html";
}
