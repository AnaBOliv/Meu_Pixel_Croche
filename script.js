// principais
const upload = document.getElementById("upload");
const gridContainer = document.getElementById("grid");
const info = document.getElementById("info");

// dados do grid
let gridData = [];
let gridSize = 30;
let cellSize = 15;

// 📥 Upload de imagem
if (upload) {
  upload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  });
}

// 🖼️ Processar imagem
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

        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];

        row.push({
          r,
          g,
          b,
          done: false
        });
      }

      gridData.push(row);
    }

    renderGrid();
  };

  img.src = URL.createObjectURL(file);
}

// 🎨 Renderizar grid
function renderGrid() {
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      // tamanho dinâmico (zoom)
      div.style.width = cellSize + "px";
      div.style.height = cellSize + "px";

      // cor do pixel
      div.style.backgroundColor = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;

      // se já marcado
      if (cell.done) {
        div.classList.add("done");
      }

      // clique
      div.addEventListener("click", () => {
        cell.done = !cell.done;
        div.classList.toggle("done");

        destacarLinha(y);

        if (info) {
          info.textContent = `Carreira: ${y + 1} | Ponto: ${x + 1}`;
        }
      });

      gridContainer.appendChild(div);
    });
  });
}

// 🔦 Destacar linha atual
function destacarLinha(linhaSelecionada) {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    const linha = Math.floor(index / gridSize);

    cell.classList.remove("highlight-row", "dimmed");

    if (linha === linhaSelecionada) {
      cell.classList.add("highlight-row");
    } else {
      cell.classList.add("dimmed");
    }
  });
}

// 🔍 Zoom
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
