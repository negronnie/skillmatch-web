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
} from "./dados.js";

import {
  elementos,                // Elementos HTML
  showError,                // Exibe span de erro
  showEmpty,                // Exibe aviso de nenhum resultado encontrado
  clearStatus,              // Esconde e reseta o container de status
  showFieldError,           // Adiciona mensagem de erro em um input
  clearFormErrors,          // Remove o estilo de erro do formulário
  renderOpportunityCards,   // Monta a lista de cards de todas as vagas analisadas
  renderBestMatch,          // Preenche a seção de destaque com a melhor vaga
  addSkillToGrid,           // Insere uma habilidade na grade do formulário
  getSkillFromGrid,         // Lê as habilidades
  updateSessionCounter      // Atualiza o contador de análises
} from "./ui.js";

let catalogoVagas = [];
let candidatoAtual = null;
let resultadosAnalise = [];
const registerAnalysis = analysisCounter();

function renderInitialCatalog() {
  const vagasIniciais = catalogoVagas.map((vaga) => ({
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

  renderOpportunityCards(vagasIniciais);
}

function analyze() {
  if (!candidatoAtual || catalogoVagas.length === 0) return;

  resultadosAnalise = buildResult(candidatoAtual, catalogoVagas);

  const totalAnalises = registerAnalysis();
  updateSessionCounter(totalAnalises);

  const melhorOportunidade = findBestOpportunity(resultadosAnalise);
  renderBestMatch(melhorOportunidade);

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

    });
  }