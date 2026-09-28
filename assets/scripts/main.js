import {
  analysisCounter         // Função para contabilizar análises por sessão (closure)
} from "./motor.js";

import {
  elementos,                // Elementos HTML
  addSkillToGrid,           // Insere uma habilidade na grade do formulário
} from "./ui.js";

let catalogoVagas = [];
let candidatoAtual = null;
let resultadosAnalise = [];
const registerAnalysis = analysisCounter();
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
