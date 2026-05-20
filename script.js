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

let qualidade = 50;

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
  carregarImagemDaGaleria();
};

// ==========================
// QUALIDADE
// ==========================
if (qualidadeInput) {
  qualidadeInput.addEventListener("input", (e) => {
    qualidade = parseInt(e.target.value);
    carregarImagemDaGaleria();
  });
}

// ==========================
// UPLOAD
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
// DETECTAR LINHAS ESCURAS
// ==========================
function ehLinha(r, g, b) {
  return r < 40 && g < 40 && b < 40;
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

  img.onload = () => {
    processarImagem(img);
  };

  img.src = caminho;
}

// ==========================
// COR MAIS PRÓXIMA
// ==========================
function corMaisProxima(r, g, b) {
  let melhor = PALETA[0];
  let menorDistancia = Infinity;

  PALETA.forEach(cor => {
    const dist =
      (r - cor.r) ** 2 +
      (g - cor.g) ** 2 +
      (b - cor.b) ** 2;

    if (dist < menorDistancia) {
      menorDistancia = dist;
      melhor = cor;
    }
  });

  return melhor;
}

// ==========================
// PROCESSAMENTO
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

  const imageData =
    ctx.getImageData(0, 0, gridWidth, gridHeight).data;

  gridData = [];

  for (let y = 0; y < gridHeight; y++) {
    let row = [];

    for (let x = 0; x < gridWidth; x++) {
      const i = (y * gridWidth + x) * 4;

      let r = imageData[i];
      let g = imageData[i + 1];
      let b = imageData[i + 2];

      if (ehLinha(r, g, b)) {
        row.push({
          r: 0,
          g: 0,
          b: 0,
          done: false
        });

        continue;
      }

      const cor = corMaisProxima(r, g, b);

      row.push({
        ...cor,
        done: false
      });
    }

    gridData.push(row);
  }

  renderGrid();
}
