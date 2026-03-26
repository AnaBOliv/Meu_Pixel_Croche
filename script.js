// ELEMENTOS
const upload = document.getElementById("upload");
const gridContainer = document.getElementById("grid");
const info = document.getElementById("info");

// GRID
let gridData = [];
let gridSize = 30;
let cellSize = 15;

// PERFIL LOCAL
let perfil = JSON.parse(localStorage.getItem("perfil")) || {
  projetos: []
};

// UPLOAD
if (upload) {
  upload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) processImage(file);
  });
}

// PROCESSAR IMAGEM
function processImage(file) {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img.onload = () => {
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
  };

  img.src = URL.createObjectURL(file);
}

// RENDER
function renderGrid() {
  if (!gridContainer) return;

  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");

      div.classList.add("cell");
      div.style.width = cellSize + "px";
      div.style.height = cellSize + "px";
      div.style.backgroundColor = `rgb(${cell.r},${cell.g},${cell.b})`;

      if (cell.done) div.classList.add("done");

      div.onclick = () => {
        cell.done = !cell.done;
        div.classList.toggle("done");

        if (info) {
          info.textContent = `Carreira: ${y + 1} | Ponto: ${x + 1}`;
        }
      };

      gridContainer.appendChild(div);
    });
  });
}

// ZOOM
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

// SALVAR PROJETO
function salvarProjeto() {
  perfil.projetos.push(gridData);
  localStorage.setItem("perfil", JSON.stringify(perfil));
  alert("Projeto salvo!");
}

// GALERIA → APP
function usarModelo(src) {
  localStorage.setItem("modeloSelecionado", src);
  window.location.href = "app.html";
  function usarModelo(caminho) {
  localStorage.setItem("imagemModelo", caminho);
  window.location.href = "app.html";
}
}
