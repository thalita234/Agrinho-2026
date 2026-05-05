// Seleção dos elementos da interface
const inputTemp = document.getElementById('temp');
const inputSolo = document.getElementById('solo');
const inputAr = document.getElementById('ar');

const displayTemp = document.getElementById('valTemp');
const displaySolo = document.getElementById('valSolo');
const displayAr = document.getElementById('valAr');

const displayBrix = document.getElementById('valBrix');
const displaySaude = document.getElementById('statusSaude');
const feedbackTexto = document.getElementById('feedback');

const barraSaude = document.getElementById('barSaude');
const barraBrix = document.getElementById('barBrix');

/**
 * Função principal de simulação
 * Calcula o equilíbrio entre as variáveis ambientais
 */
function processarDados() {
    // 1. Captura os valores atuais
    const t = parseInt(inputTemp.value);
    const s = parseInt(inputSolo.value);
    const a = parseInt(inputAr.value);

    // 2. Atualiza os números no painel
    displayTemp.innerText = t;
    displaySolo.innerText = s;
    displayAr.innerText = a;

    // 3. Lógica de Saúde da Videira (0 a 100%)
    let saude = 100;
    let avisos = [];

    // Avaliação de Temperatura (Ideal: 18°C a 28°C)
    if (t < 15) {
        saude -= (15 - t) * 3;
        avisos.push("Frio excessivo reduz o metabolismo.");
    } else if (t > 30) {
        saude -= (t - 30) * 5;
        avisos.push("Calor excessivo causa estresse térmico.");
    }

    // Avaliação de Umidade do Solo (Ideal: 50% a 70%)
    if (s < 40) {
        saude -= (40 - s) * 2;
        avisos.push("Solo muito seco: falta de nutrientes.");
    } else if (s > 80) {
        saude -= (s - 80) * 4;
        avisos.push("Solo encharcado: risco de fungos radiculares.");
    }

    // Avaliação de Umidade do Ar (Ideal: 40% a 60%)
    if (a > 70) {
        saude -= (a - 70) * 2;
        avisos.push("Umidade alta: alto risco de Míldio e Oídio.");
    }

    // Garantir que a saúde não seja negativa
    saude = Math.max(0, saude);

    // 4. Cálculo do Grau Brix (Qualidade do Açúcar)
    // A uva acumula mais açúcar com sol (temp estável) e sem excesso de água
    let brixBase = (t >= 20 && t <= 28) ? 18 : 14;
    if (s > 75) brixBase -= 3; // Muita água "dilui" o açúcar
    
    // O Brix final é influenciado pela saúde geral da planta
    let brixFinal = brixBase * (saude / 100);
    if (brixFinal < 5) brixFinal = 5; 

    // 5. Atualização Visual da Interface
    atualizarInterface(saude, brixFinal, avisos);
}

/**
 * Atualiza cores, barras e mensagens de feedback
 */
function atualizarInterface(saude, brix, avisos) {
    // Atualiza Texto de Status
    displaySaude.innerText = saude > 80 ? "Excelente" : (saude > 50 ? "Boa" : (saude > 20 ? "Regular" : "Crítica"));
    displayBrix.innerText = brix.toFixed(1);

    // Atualiza Barras de Progresso
    barraSaude.style.width = saude + "%";
    barraBrix.style.width = (brix * 4) + "%"; // Multiplicado por 4 para escala visual

    // Define cores das barras
    const definirClasse = (valor) => valor > 70 ? "quality-high" : (valor > 40 ? "quality-med" : "quality-low");
    
    barraSaude.className = "fill " + definirClasse(saude);
    barraBrix.className = "fill " + (brix > 16 ? "quality-high" : (brix > 12 ? "quality-med" : "quality-low"));

    // Exibe o primeiro aviso da lista ou mensagem de sucesso
    feedbackTexto.innerText = avisos.length > 0 ? "⚠️ " + avisos[0] : "✅ Condições ideais para uvas sustentáveis!";
}

// Ouvintes de eventos para mudanças nos sliders
inputTemp.addEventListener('input', processarDados);
inputSolo.addEventListener('input', processarDados);
inputAr.addEventListener('input', processarDados);

// Inicialização ao carregar a página
window.onload = processarDados;