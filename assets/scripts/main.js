import {
  Candidate,              // Classe que representa o candidato
  buildResult,            // Função que calcula a compatibilidade entre candidato e todas as vagas
  findBestOpportunity,    // Função que identifica a vaga de maior compatibilidade
  analysisCounter         // Função para contabilizar análises por sessão (closure)
} from "./motor.js";

import {
  elementos,                // Elementos HTML
  renderBestMatch,          // Preenche a seção de destaque com a melhor vaga
  addSkillToGrid,           // Insere uma habilidade na grade do formulário
  updateSessionCounter      // Atualiza o contador de análises
} from "./ui.js";

let catalogoVagas = [];
let candidatoAtual = null;
let resultadosAnalise = [];
const registerAnalysis = analysisCounter();
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
