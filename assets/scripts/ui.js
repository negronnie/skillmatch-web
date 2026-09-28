import { Skill, studySubjectsSuggestion } from "./motor.js";

export const elementos = {
  form: document.getElementById("form-candidato"),
  inputNome: document.getElementById("candidate-name"),
  selectArea: document.getElementById("candidate-area"),
  inputExp: document.getElementById("candidate-experience"),

  skillNameInput: document.getElementById("skill-name-input"),
  skillYearsInput: document.getElementById("skill-years-input"),
  btnAddSkill: document.getElementById("btn-add-skill"),
  skillsGrid: document.getElementById("skills-grid"),

  btnLimparPerfil: document.getElementById("btn-clear-profile"),
  btnThemeToggle: document.getElementById("btn-theme"),

  statusContainer: document.getElementById("status-container"),
  statusMessage: document.getElementById("status-message"),

  destaqueSection: document.getElementById("destaque"),
  destaqueTitle: document.getElementById("titulo-highlight"),
  destaqueSubtitulo: document.getElementById("highlight-subtitulo"),
  destaqueScore: document.getElementById("highlight-score"),
  destaqueBadge: document.getElementById("highlight-badge"),
  destaqueSugestao: document.getElementById("highlight-sugestao"),

  vagasSection: document.getElementById("vagas"),
  vagasGrid: document.getElementById("opportunities-grid"),

  sessionCounter: document.getElementById("session-counter"),

};

let remoteClass = "";
if (opportunity.remote) {
  remoteClass = "remote";
export function showError(mensagem) {
  if (elementos.statusContainer && elementos.statusMessage) {
    elementos.statusContainer.className = "status-box status-error";
    elementos.statusContainer.classList.remove("hidden");
    elementos.statusMessage.textContent = mensagem;
  }
}

export function showEmpty(mensagem = "Nenhuma vaga encontrada para os critérios selecionados.") {
  if (elementos.statusContainer && elementos.statusMessage) {
    elementos.statusContainer.className = "status-box status-empty";
    elementos.statusContainer.classList.remove("hidden");
    elementos.statusMessage.textContent = mensagem;
  }
}

export function clearStatus() {
  if (elementos.statusContainer && elementos.statusMessage) {
    elementos.statusContainer.className = "status-box hidden";
    elementos.statusMessage.textContent = "";
  }
}

export function showFieldError(campoId, mensagem) {
  const ids = [
    campoId,
    campoId.replace("candidato-", "candidate-"),
    campoId.replace("candidate-", "candidato-")
  ];

  for (const id of ids) {
    const spanErro = document.getElementById(`erro-${id}`);
    if (spanErro) {
      spanErro.textContent = mensagem;
    }
    const input = document.getElementById(id);
    if (input) {
      input.classList.add("input-error");
    }
  }
}

export function clearFormErrors() {
  const spansErro = document.querySelectorAll(".field-error");
  spansErro.forEach((span) => {
    span.textContent = "";
  });

  if (elementos.form) {
    const inputsComErro = elementos.form.querySelectorAll(".input-error");
    inputsComErro.forEach((input) => {
      input.classList.remove("input-error");
    });
  }
}

export function renderOpportunityCards(results) {
  if (!elementos.vagasGrid) return;
  elementos.vagasGrid.innerHTML = "";

  if (!results || results.length === 0) {
    showEmpty();
    return;
  }

  clearStatus();

  results.forEach((item) => {
    const opportunity = item.opportunity;
    const score = item.score;
    const compatibility = item.compatibility;
    const matchedSkills = item.matchedSkills;
    const missingSkills = item.missingSkills;

    const card = document.createElement("article");
    card.className = "opportunity-card";

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

export function renderBestMatch(bestResult) {
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

export function addSkillToGrid(nome, anos) {
  if (!nome || !nome.trim()) return false;

  const cleanName = nome.trim();
  const cleanYears = Number(anos) > 0 
    ? Number(anos)
    : 1;

  const nivel = new Skill(cleanName, cleanYears).experienceLevel();

  const existentes = elementos.skillsGrid.querySelectorAll(".skill-item");

  for (const item of existentes) {
    if (item.skillName.toLowerCase() === cleanName.toLowerCase()) {
      item.skillYears = cleanYears.toString();

      const detail = item.querySelector(".skill-detail");
      if (detail) {
        detail.textContent = `${cleanYears} ano(s) • ${nivel}`;
      }
      return true;
    }
  }
  
  const skillCard = document.createElement("div");
  skillCard.className = "skill-item";
  skillCard.skillName = cleanName;
  skillCard.skillYears = cleanYears.toString();

  skillCard.innerHTML = `
    <div class="skill-info">
      <span class="skill-name">${cleanName}</span>
      <span class="skill-detail">${cleanYears} ano(s) • ${nivel}</span>
    </div>
    <button type="button" class="btn-remove-skill" data-skill="${cleanName}">✕</button>
  `;

  elementos.skillsGrid.appendChild(skillCard);
  return true;
}

export function getSkillFromGrid() {
  const itens = elementos.skillsGrid.querySelectorAll(".skill-item");
  const habilidades = [];

  itens.forEach((item) => {
    const nome = item.skillName;
    const anos = Number(item.skillYears) || 1;
    habilidades.push(new Skill(nome, anos));
  });

  return habilidades;
}

export function clearSkillGrid() {
  elementos.skillsGrid.innerHTML = "";
}

export function fillProfileForm(candidate) {
  if (!candidate) return;

  elementos.inputNome.value = candidate.name || "";
  elementos.selectArea.value = candidate.interestArea || "";
  elementos.inputExp.value = candidate.experience || "";

  clearSkillGrid();

  candidate.skills.forEach((s) => {
    addSkillToGrid(s.name, s.experienceYears);
  });
}

export function updateSessionCounter(count) {
  if (elementos.sessionCounter) {
    elementos.sessionCounter.innerHTML = `Análises realizadas nesta sessão: <strong>${count}</strong>`;
  }
}