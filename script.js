const upload = document.getElementById("upload");
const gridContainer = document.getElementById("grid");
const info = document.getElementById("info");

let gridData = [];
let gridSize = 30;

// 📥 Upload de imagem
upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    processImage(file);
  }
});

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
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 15px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      div.style.backgroundColor = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;

      if (cell.done) {
        div.classList.add("done");
      }

      div.addEventListener("click", () => {
        cell.done = !cell.done;
        div.classList.toggle("done");

        destacarLinha(y);

        info.textContent = `Carreira: ${y + 1} | Ponto: ${x + 1}`;
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
