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
let qualidade = qualidadeInput ? parseInt(qualidadeInput.value) : 50;

// ==========================
// PALETA
// ==========================
const PALETA = [
  { r: 255, g: 255, b: 255 },
  { r: 230, g: 230, b: 230 },
  { r: 200, g: 200, b: 200 },
  { r: 170, g: 170, b: 170 },
  { r: 140, g: 140, b: 140 },
  { r: 110, g: 110, b: 110 },
  { r: 80, g: 80, b: 80 },
  { r: 50, g: 50, b: 50 },
  { r: 20, g: 20, b: 20 },
  { r: 0, g: 0, b: 0 }
];

// ==========================
// INICIALIZAÇÃO
// ==========================
window.onload = () => {
  const progressoSalvo = localStorage.getItem("progressoGrid");
  const imagemSalva = localStorage.getItem("imagemModelo");

  if (progressoSalvo) {
    const dados = JSON.parse(progressoSalvo);
    gridData = dados.gridData;
    gridWidth = dados.gridWidth;
    gridHeight = dados.gridHeight;
    renderGrid();
  } else if (imagemSalva) {
    carregarImagemDaOrigem(imagemSalva);
  }
};

// ==========================
// EVENTOS
// ==========================
if (qualidadeInput) {
  qualidadeInput.addEventListener("change", (e) => {
    qualidade = parseInt(e.target.value);
    const imagemSalva = localStorage.getItem("imagemModelo");
    if (imagemSalva) {
      localStorage.removeItem("progressoGrid"); // Força reprocessar a imagem com a nova qualidade
      carregarImagemDaOrigem(imagemSalva);
    }
  });
}

if (upload) {
  upload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        localStorage.setItem("imagemModelo", base64Image); 
        localStorage.removeItem("progressoGrid"); // Reseta o desenho antigo
        carregarImagemDaOrigem(base64Image);
      };
      reader.readAsDataURL(file);
    }
  });
}

// ==========================
// CARREGAMENTO DA IMAGEM
// ==========================
function carregarImagemDaOrigem(caminho) {
  if (!caminho) return;

  const img = new Image();
  
  // Evita problemas de segurança com Canvas ao rodar localmente
  if (!caminho.startsWith('data:')) {
    img.crossOrigin = "Anonymous";
  }

  img.onload = () => {
    processarImagem(img);
  };

  img.onerror = () => {
    console.error("Erro ao carregar a imagem: " + caminho);
  };

  // Adiciona um timestamp para evitar que o navegador use uma imagem do cache antigo
  if (!caminho.startsWith('data:')) {
    img.src = caminho + "?t=" + new Date().getTime();
  } else {
    img.src = caminho;
  }
}

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
      const i = (y * gridWidth + x) * 4;
      let r = imageData[i];
      let g = imageData[i + 1];
      let b = imageData[i + 2];

      if (r < 40 && g < 40 && b < 40) {
        row.push({ r: 0, g: 0, b: 0, done: false });
        continue;
      }

      const cor = corMaisProxima(r, g, b);
      row.push({ ...cor, done: false });
    }
    gridData.push(row);
  }

  salvarProgresso();
  renderGrid();
}

function corMaisProxima(r, g, b) {
  let melhor = PALETA[0];
  let menorDistancia = Infinity;

  PALETA.forEach(cor => {
    const dist = (r - core.r || r - cor.r) ** 2 + (g - cor.g) ** 2 + (b - cor.b) ** 2;
    if (dist < menorDistancia) {
      menorDistancia = dist;
      melhor = cor;
    }
  });
  return melhor;
}

// ==========================
// RENDERIZAÇÃO DO GRID
// ==========================
function renderGrid() {
  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, ${cellSize}px)`;

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.style.width = `${cellSize}px`;
      div.style.height = `${cellSize}px`;
      div.style.backgroundColor = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;
      
      if (cell.done) {
        div.classList.add("done");
      }

      div.onclick = () => {
        gridData[y][x].done = !gridData[y][x].done;
        if (gridData[y][x].done) {
          div.classList.add("done");
        } else {
          div.classList.remove("done");
        }
        salvarProgresso();
      };

      div.onmouseenter = () => {
        if (info) info.textContent = `Linha: ${y + 1} | Coluna: ${x + 1}`;
      };

      gridContainer.appendChild(div);
    });
  });
}

// ==========================
// CONTROLES
// ==========================
function salvarProgresso() {
  localStorage.setItem("progressoGrid", JSON.stringify({ gridData, gridWidth, gridHeight }));
}

function limparProgresso() {
  gridData.forEach(row => row.forEach(cell => cell.done = false));
  salvarProgresso();
  renderGrid();
}

function apagarImagem() {
  localStorage.removeItem("imagemModelo");
  localStorage.removeItem("progressoGrid");
  gridData = [];
  if (gridContainer) gridContainer.innerHTML = "";
  if (info) info.textContent = "Linha: - | Coluna: -";
}

function zoomIn() {
  cellSize = Math.min(cellSize + 2, 40);
  renderGrid();
}

function zoomOut() {
  cellSize = Math.max(cellSize - 2, 5);
  renderGrid();
}
