const upload = document.getElementById("upload");
const gridContainer = document.getElementById("grid");
const info = document.getElementById("info");

let gridData = [];
let gridSize = 30; // tamanho do grid (30x30)

// 📥 Quando o usuário envia uma imagem
upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    processImage(file);
  }
});

// 🖼️ Converte imagem em grid de cores
function processImage(file) {
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img.onload = () => {
    canvas.width = gridSize;
    canvas.height = gridSize;

    // desenha imagem reduzida no canvas
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

        // salva cor do pixel
        row.push({
          r: r,
          g: g,
          b: b,
          done: false // controle de progresso
        });
      }

      gridData.push(row);
    }

    renderGrid();
  };

  img.src = URL.createObjectURL(file);
}

// 🎨 Renderiza o grid na tela
function renderGrid() {
  gridContainer.innerHTML = "";

  // define quantidade de colunas
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 15px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      // 🎨 cor original da imagem
      div.style.backgroundColor = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;

      // se já estiver marcado
      if (cell.done) {
        div.classList.add("done");
      }

      // clique no quadrado
      div.addEventListener("click", () => {
        cell.done = !cell.done;
        div.classList.toggle("done");

        // atualiza info
        const carreira = y + 1;
        const ponto = x + 1;

        info.textContent = `Carreira: ${carreira} | Ponto: ${ponto}`;
      });

      gridContainer.appendChild(div);
    });
  });
}