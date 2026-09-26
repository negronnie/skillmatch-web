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

let remoteClass = "";
if (opportunity.remote) {
  remoteClass = "remote";
}

let timezoneHtml = "";
if (opportunity.timezone) {
  timezoneHtml = `<span class="meta-pill">Fuso: ${opportunity.timezone}</span>`;
}

let descriptionHtml = "";
if (opportunity.description) {
  descriptionHtml = `<p class="card-description">${opportunity.description}</p>`;
}

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
      <div class="card-top">
        <div>
          <span class="card-company">${opportunity.company}</span>
          <h3 id="vaga-titulo-${opportunity.id}" class="card-role">${opportunity.role}</h3>
        </div>
        <span class="badge ${badgeClass}" title="Classificação de compatibilidade">${compatibility}</span>
      </div>

      <div class="card-meta-list">
        <span class="meta-pill ${opportunity.remote ? 'remote' : ''}">${opportunity.modality}</span>
        <span class="meta-pill">Nível: ${opportunity.level}</span>
        ${opportunity.timezone 
          ? `<span class="meta-pill">Fuso: ${opportunity.timezone}</span>` 
          : ""
        }
      </div>

      ${opportunity.description 
        ? `<p class="card-description">${opportunity.description}</p>` 
        : ""
      }

      <div class="progress-container">
        <div class="progress-header">
          <span>Índice de Match</span>
          <span>${score.toFixed(0)}%</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${score.toFixed(1)}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar ${barClass}" style="width: ${Math.max(score, 5)}%;"></div>
        </div>
      </div>

      <div class="card-skills-block">
        <span class="skills-subheading">Habilidades Atendidas (${matchedSkills.length})</span>
        <div class="skills-pills">${matchedPillsHtml}</div>
      </div>

      <div class="card-skills-block">
        <span class="skills-subheading">Habilidades Faltantes / Aprimorar (${missingSkills.length})</span>
        <div class="skills-pills">${missingPillsHtml}</div>
      </div>

      <div class="card-footer">
        <span class="card-salary">${salaryFormatted}</span>
        <span class="meta-pill">${opportunity.skills.length} requisitos</span>
      </div>
    `;

    elementos.vagasGrid.appendChild(card);
  });
}

export function renderizarDestaqueMelhorVaga(bestResult) {
  if (!bestResult) {
    elementos.destaqueSection.classList.add("hidden");
    return;
  }

  const opportunity = bestResult.opportunity;
  const score = bestResult.score;
  const compatibility = bestResult.compatibility;

  elementos.destaqueTitle.textContent = `${opportunity.role} — ${opportunity.company}`;
  elementos.destaqueSubtitulo.textContent = opportunity.getFormattedSummary();
  elementos.destaqueScore.textContent = `${score.toFixed(1)}%`;
  
  elementos.destaqueBadge.textContent = compatibility;
  elementos.destaqueBadge.className = `badge ${compatibility === "Alta" ? "badge-alta" : compatibility === "Média" ? "badge-media" : "badge-baixa"}`;

  elementos.destaqueSugestao.textContent = studySubjectsSuggestion(bestResult);
  elementos.destaqueSection.classList.remove("hidden");
}
