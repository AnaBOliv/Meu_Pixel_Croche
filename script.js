// ==========================
// ELEMENTOS
// ==========================
const upload = document.getElementById("upload");
const gridContainer = document.getElementById("grid");
const info = document.getElementById("info");

// ==========================
// CONFIGURAÇÕES
// ==========================
let gridData = [];
let gridSize = 30;
let cellSize = 15;

// ==========================
// INICIALIZAÇÃO
// ==========================
window.onload = () => {
  carregarImagemDaGaleria();
};

// ==========================
// UPLOAD DE IMAGEM
// ==========================
if (upload) {
  upload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      carregarImagemArquivo(file);
    }
  });
}

// ==========================
// CARREGAR IMAGEM (UPLOAD)
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

// ==========================
// CARREGAR IMAGEM (GALERIA)
// ==========================
function carregarImagemDaGaleria() {
  const caminho = localStorage.getItem("imagemModelo");

  if (!caminho) return;

  const img = new Image();

  img.onload = () => {
    processarImagem(img);
  };

  img.src = caminho;
}

// ==========================
// PROCESSAR IMAGEM (PADRÃO)
// ==========================
function processarImagem(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = gridSize;
  canvas.height = gridSize;

  ctx.drawImage(img, 0, 0, gridSize, gridSize);

  const imageData = ctx.getImageData(0, 0, gridSize, gridSize).data;

  gridData = [];

  for (let y = 0; y < gridSize; y++) {
    let row = [];

    for (let x = 0; x < gridSize; x++) {
      const index = (y * gridSize + x) * 4;

      row.push({
        r: imageData[index],
        g: imageData[index + 1],
        b: imageData[index + 2],
        done: false
      });
    }

    gridData.push(row);
  }

  renderGrid();
}

// ==========================
// RENDER GRID
// ==========================
function renderGrid() {
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  gridContainer.style.gridTemplateColumns =
    `repeat(${gridSize}, ${cellSize}px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");

      div.classList.add("cell");

      div.style.width = cellSize + "px";
      div.style.height = cellSize + "px";

      div.style.backgroundColor =
        `rgb(${cell.r},${cell.g},${cell.b})`;

      if (cell.done) {
        div.classList.add("done");
      }

      div.onclick = () => {
        cell.done = !cell.done;
        div.classList.toggle("done");

        if (info) {
          info.textContent =
            `Carreira: ${y + 1} | Ponto: ${x + 1}`;
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
// GALERIA → APP
// ==========================
function usarModelo(caminho) {
  localStorage.setItem("imagemModelo", caminho);
  window.location.href = "app.html";
}
