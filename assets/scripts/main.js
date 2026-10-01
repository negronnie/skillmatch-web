import {
  Candidate,              // Classe que representa o candidato
  buildResult,            // Função que calcula a compatibilidade entre candidato e todas as vagas
  findBestOpportunity,    // Função que identifica a vaga de maior compatibilidade
  analysisCounter         // Função para contabilizar análises por sessão (closure)
} from "./motor.js";

import {
  loadOpportunities,      // Busca as vagas no arquivo JSON
  saveProfile,            // Guarda o perfil do candidato no localStorage
  loadProfile,            // Recupera o perfil persistido no localStorage
  clearProfile,           // Remove o perfil salvo no localStorage
  saveTheme,              // Salva o tema no localStorage
  loadTheme               // Lê o tema salvo no localStorage
} from "./dados.js";

import {
  elementos,                // Elementos HTML
  showLoading,              // Exibe o carregamento do JSON
  showError,                // Exibe span de erro
  showEmpty,                // Exibe aviso de nenhum resultado encontrado
  clearStatus,              // Esconde e reseta o container de status
  showFieldError,           // Adiciona mensagem de erro em um input
  clearFormErrors,          // Remove o estilo de erro do formulário
  renderOpportunityCards,   // Monta a lista de cards de todas as vagas analisadas
  renderBestMatch,          // Preenche a seção de destaque com a melhor vaga
  fillProfileForm,          // Preenche os campos do formulário a partir de um perfil salvo
  addSkillToGrid,           // Insere uma habilidade na grade do formulário
  getSkillFromGrid,         // Lê as habilidades
  clearSkillGrid,           // Limpa a lista de habilidades do formulário
  updateSessionCounter,     // Atualiza o contador de análises
  updateLogo                // Troca o logo conforme o tema
} from "./ui.js";

let catalogoVagas = [];
let candidatoAtual = null;
let resultadosAnalise = [];
const registerAnalysis = analysisCounter();
 
async function start() {
  setupTheme();
  setupEvents();
  setupLocalization();

  try {
    showLoading("Carregando catálogo de oportunidades...");
    catalogoVagas = await loadOpportunities();

    if (!catalogoVagas || catalogoVagas.length === 0) {
      showEmpty("Nenhuma vaga cadastrada no catálogo no momento.");
      return;
    }

    clearStatus();

    const perfilSalvo = loadProfile();
    if (perfilSalvo) {
      candidatoAtual = perfilSalvo;
      fillProfileForm(candidatoAtual);
      analyze();
    } else {
      renderInitialCatalog();
    }
  } catch (erro) {
    console.log("Erro ao inicializar vagas:", erro);
    showError("Não foi possível conectar ao catálogo de vagas. Verifique sua conexão e tente novamente.");
  }
}

function renderInitialCatalog() {
  resultadosAnalise = catalogoVagas.map((vaga) => ({
    opportunity: vaga,
    score: 0,
    compatibility: "Baixa",
    matchedSkills: [],
    missingSkills: (vaga.skills || []).map((s) => ({
      skillName: s.skillName,
      minExperienceLevel: s.minExperienceLevel,
      reason: "missing"
    }))
  }));

  applyFilter();
}

function analyze() {
  if (!candidatoAtual || catalogoVagas.length === 0) return;

  resultadosAnalise = buildResult(candidatoAtual, catalogoVagas);

  const totalAnalises = registerAnalysis();
  updateSessionCounter(totalAnalises);

  const melhorOportunidade = findBestOpportunity(resultadosAnalise);
  renderBestMatch(melhorOportunidade);

  applyFilter();
}

function applyFilter() {
  if (!resultadosAnalise || resultadosAnalise.length === 0) return;

  const modalidade = elementos.filtroModalidade ? elementos.filtroModalidade.value : "todas";
  const ordenacao = elementos.ordenacaoVagas ? elementos.ordenacaoVagas.value : "score-desc";
  let filtrados = [...resultadosAnalise];

  if (modalidade === "remoto") {
    filtrados = filtrados.filter((item) => item.opportunity.remote === true);
  } else if (modalidade === "presencial") {
    filtrados = filtrados.filter((item) => item.opportunity.remote === false);
  }

  if (ordenacao === "score-desc") {
    filtrados.sort((a, b) => b.score - a.score);
  } else if (ordenacao === "salario-desc") {
    filtrados.sort((a, b) => (b.opportunity.salary || 0) - (a.opportunity.salary || 0));
  } else if (ordenacao === "empresa-asc") {
    filtrados.sort((a, b) => a.opportunity.company.localeCompare(b.opportunity.company));
  }

  renderOpportunityCards(filtrados);
}

function setupEvents() {
  if (elementos.btnAddSkill) {
    elementos.btnAddSkill.addEventListener("click", () => {
      const nome = elementos.skillNameInput ? elementos.skillNameInput.value.trim() : "";
      const anosVal = elementos.skillYearsInput ? elementos.skillYearsInput.value.trim() : "";
      const anos = Number(anosVal);

      const spanErroSkills = document.getElementById("erro-candidato-habilidades");

      if (!nome) {
        if (spanErroSkills) {
          spanErroSkills.textContent = "Digite o nome da tecnologia/habilidade antes de adicionar.";
        }
        if (elementos.skillNameInput) elementos.skillNameInput.focus();
        return;
      }

      if (!anosVal || isNaN(anos) || anos <= 0) {
        if (spanErroSkills) {
          spanErroSkills.textContent = "Informe um tempo de experiência em anos maior que zero.";
        }
        if (elementos.skillYearsInput) elementos.skillYearsInput.focus();
        return;
      }

      if (spanErroSkills) {
        spanErroSkills.textContent = "";
      }

      addSkillToGrid(nome, anos);

      if (elementos.skillNameInput) elementos.skillNameInput.value = "";
      if (elementos.skillYearsInput) elementos.skillYearsInput.value = "";
      if (elementos.skillNameInput) elementos.skillNameInput.focus();
    });
  }

  const adicionarPeloEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (elementos.btnAddSkill) elementos.btnAddSkill.click();
    }
  };

  if (elementos.skillNameInput) elementos.skillNameInput.addEventListener("keydown", adicionarPeloEnter);
  if (elementos.skillYearsInput) elementos.skillYearsInput.addEventListener("keydown", adicionarPeloEnter);

  if (elementos.skillsGrid) {
    elementos.skillsGrid.addEventListener("click", (e) => {
      const btnRemover = e.target.closest(".btn-remove-skill");
      if (btnRemover) {
        const card = btnRemover.closest(".skill-item");
        if (card) {
          card.remove();
        }
      }
    });
  }

  if (elementos.form) {
    elementos.form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      clearFormErrors();

      let formularioValido = true;
      let primeiroInvalido = null;

      const nome = elementos.inputNome ? elementos.inputNome.value.trim() : "";
      if (!nome || nome.length < 2) {
        showFieldError("candidate-name", "Informe um nome válido com pelo menos 2 caracteres.");
        formularioValido = false;
        if (!primeiroInvalido) primeiroInvalido = elementos.inputNome;
      }

      const area = elementos.selectArea ? elementos.selectArea.value : "";
      if (!area) {
        showFieldError("candidate-area", "Selecione uma área de interesse profissional.");
        formularioValido = false;
        if (!primeiroInvalido) primeiroInvalido = elementos.selectArea;
      }

      const expVal = elementos.inputExp ? elementos.inputExp.value.trim() : "";
      const expTotal = Number(expVal);
      if (isNaN(expTotal) || expTotal < 0 || expVal === "") {
        showFieldError("candidate-experience", "Informe um tempo de experiência total válido (>= 0).");
        formularioValido = false;
        if (!primeiroInvalido) primeiroInvalido = elementos.inputExp;
      }

      const habilidades = getSkillFromGrid();
      if (habilidades.length === 0) {
        const erroSkills = document.getElementById("erro-candidato-habilidades");
        if (erroSkills) {
          erroSkills.textContent = "Adicione pelo menos uma habilidade para que o cálculo de compatibilidade seja realizado.";
        }
        formularioValido = false;
        if (!primeiroInvalido) primeiroInvalido = elementos.skillNameInput;
      }

      if (!formularioValido) {
        if (primeiroInvalido && typeof primeiroInvalido.focus === "function") {
          primeiroInvalido.focus();
        }
        return;
      }

      candidatoAtual = new Candidate(nome, area, habilidades, expTotal);

      saveProfile(candidatoAtual);
      analyze();

      if (elementos.destaqueSection) {
        elementos.destaqueSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (elementos.btnLimparPerfil) {
    elementos.btnLimparPerfil.addEventListener("click", () => {
      clearProfile();

      if (elementos.form) elementos.form.reset();
      clearFormErrors();
      clearSkillGrid();

      candidatoAtual = null;

      if (elementos.destaqueSection) {
        elementos.destaqueSection.classList.add("hidden");
      }
      renderInitialCatalog();
    });
  }

  if (elementos.filtroModalidade) {
    elementos.filtroModalidade.addEventListener("change", applyFilter);
  }
  if (elementos.ordenacaoVagas) {
    elementos.ordenacaoVagas.addEventListener("change", applyFilter);
  }

  if (elementos.btnThemeToggle) {
    elementos.btnThemeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      const novoTema = isDark ? "escuro" : "claro";
      saveTheme(novoTema);
      updateLogo(isDark);

      const themeText = elementos.btnThemeToggle.querySelector(".theme-text") || elementos.btnThemeToggle;
      if (themeText) {
        themeText.textContent = isDark ? "Modo Claro" : "Modo Escuro";
      }
    });
  }
}

function setupTheme() {
  const temaSalvo = loadTheme();
  const themeText = elementos.btnThemeToggle 
    ? (elementos.btnThemeToggle.querySelector(".theme-text") || elementos.btnThemeToggle) 
    : null;

  if (temaSalvo === "escuro") {
    document.body.classList.add("dark");
    if (themeText) themeText.textContent = "Modo Claro";
  } else {
    document.body.classList.remove("dark");
    if (themeText) themeText.textContent = "Modo Escuro";
  }
  updateLogo(temaSalvo === "escuro");
}

function setupLocalization() {
  if (!navigator.geolocation) {
    console.error("Geolocalização não é suportada pelo seu navegador.");
    return;
  }

  async function haveGeolocation(posicao) {
    const latitude = posicao.coords.latitude;
    const longitude = posicao.coords.longitude;

    try {
      const localizacao = await transformCoordinates(latitude, longitude);
      const temperatura = await getWeather(latitude, longitude);
      const descricoesClima = {
        0: "Céu limpo",
        1: "Predominantemente limpo",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Neblina",
        48: "Neblina com geada",
        51: "Garoa fraca",
        53: "Garoa moderada",
        55: "Garoa forte",
        61: "Chuva fraca",
        63: "Chuva moderada",
        65: "Chuva forte",
        71: "Neve fraca",
        73: "Neve moderada",
        75: "Neve forte",
        80: "Pancadas de chuva fracas",
        81: "Pancadas de chuva moderadas",
        82: "Pancadas de chuva fortes",
        95: "Trovoada",
        96: "Trovoada com granizo fraco",
        99: "Trovoada com granizo forte",
      };

      const cidade = localizacao.address.city;
      const estado = localizacao.address.state;
      const clima = descricoesClima[temperatura.current.weather_code] ?? "Desconhecido";
      const tempAtual = `${temperatura.current.temperature_2m}°C`;
      const geolocalizacao = `${cidade}, ${estado} - ${clima} (${tempAtual})`;

      elementos.tempWrapper.textContent = geolocalizacao;
    } catch (e) {
      console.warn("Falha ao buscar endereço:", e);
    }
  }

  async function transformCoordinates(lat, long) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`;
    const response = await fetch(url);
    return await response.json();
  }

  async function getWeather(lat, long) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const response = await fetch(url);
    return await response.json();
  }

  function erro(err) {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        console.warn("Usuário recusou a solicitação de geolocalização.");
        break;
      case err.POSITION_UNAVAILABLE:
        console.warn("Informações de localização indisponíveis.");
        break;
      case err.TIMEOUT:
        console.warn("Tempo limite expirado ao buscar localização.");
        break;
      default:
        console.warn("Erro desconhecido:", err.message);
    }
  }

  navigator.geolocation.getCurrentPosition(haveGeolocation, erro);
}


document.addEventListener("DOMContentLoaded", start);