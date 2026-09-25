export const elementos = {
  form: document.getElementById("form-candidate"),
  inputNome: document.getElementById("candidate-name"),
  selectArea: document.getElementById("candidate-area"),
  inputExp: document.getElementById("candidate-experience"),

  skillNameInput: document.getElementById("skill-name-input"),
  skillYearsInput: document.getElementById("skill-years-input"),
  btnAddSkill: document.getElementById("btn-add-skill"),
  skillsGrid: document.getElementById("skills-grid"),

  btnLimparPerfil: document.getElementById("btn-clear-profile"),
  btnThemeToggle: document.getElementById("btn-theme"),


  vagasSection: document.getElementById("opportunities-section"),
  vagasGrid: document.getElementById("opportunities-grid"),

  sessionCounter: document.getElementById("session-counter"),
};


export function renderizarCardsVagas(results) {
  elementos.vagasGrid.innerHTML = "";

  results.forEach((item) => {
    const opportunity = item.opportunity;
    const score = item.score;
    const compatibility = item.compatibility;
    const matchedSkills = item.matchedSkills;
    const missingSkills = item.missingSkills;

    const card = document.createElement("article");
    card.className = "vaga-card";

    const badgeClass = compatibility === "Alta" 
      ? "badge-alta" : compatibility === "Média" 
      ? "badge-media" : "badge-baixa";

    const barClass = compatibility === "Alta" 
      ? "alta" : compatibility === "Média" 
      ? "media" : "baixa";

    let matchedPillsHtml = "";
    if (matchedSkills.length > 0) {
      matchedPillsHtml = matchedSkills
        .map((s) => `<span class="skill-pill matched" title="Atendido: ${s.experienceLevel}">${s.skillName} (${s.experienceLevel})</span>`)
        .join("");
    } else {
      matchedPillsHtml = `<span class="skill-pill">Nenhum requisito atendido</span>`;
    }

    let missingPillsHtml = "";
    if (missingSkills.length > 0) {
      missingPillsHtml = missingSkills
        .map((s) => {
          if (s.reason === "missing") {
            return `<span class="skill-pill missing" title="Ausente: Requer ${s.minExperienceLevel}">${s.skillName} (Requer ${s.minExperienceLevel})</span>`;
          }
          return `<span class="skill-pill insufficient" title="Insuficiente: Possui ${s.experienceLevel}, requer ${s.minExperienceLevel}">${s.skillName} (${s.experienceLevel} / ${s.minExperienceLevel})</span>`;
        })
        .join("");
    } else {
      missingPillsHtml = `<span class="skill-pill matched">Todos os requisitos atendidos!</span>`;
    }

    const salaryFormatted = opportunity.salary
      ? `R$ ${Number(opportunity.salary).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "Salário a combinar";

    card.innerHTML = `

    `;

    elementos.vagasGrid.appendChild(card);
  });
}
