export class Skill {
    constructor(name, experienceYears) {
        this.name = name;
        this.experienceYears = experienceYears;
    }

    experienceLevel() {
        const years = Number(this.experienceYears);
        if (years > 0 && years <= 1) {
            return "Iniciante";
        } else if (years > 1 && years <= 2.5) {
            return "Intermediário";
        } else if (years > 2.5 && years <= 5) {
            return "Avançado";
        } else if (years > 5) {
            return "Expert";
        }
    }
}

export class Candidate {
    constructor(name, interestArea, skills, experience) {
        this.name = name;
        this.interestArea = interestArea;
        this.skills = skills;
        this.experience = experience;
    }

    getSkill(skillName) {
        return this.skills.find(skill => skill.name === skillName);
    }

    matchRequirement(requirement) {
        const skill = this.getSkill(requirement.skillName);
        if (!skill) {
            return false;
        }
        return compareLevels(skill.experienceLevel(), requirement.minExperienceLevel) >= 0;
    }
}

export function compareLevels(levelA, levelB) {
    const levels = ["Iniciante", "Intermediário", "Avançado", "Expert"];
    return levels.indexOf(levelA) - levels.indexOf(levelB);
}

class Opportunity {
    constructor(id, company, role, skills, level, salary, modality) {
        this.id = Number(id)
        this.company = company;
        this.role = role;
        this.skills = skills;
        this.level = level;
        this.salary = salary;
        this.modality = modality;
    }
}

export class RemoteOpportunity extends Opportunity {
    constructor(company, role, skills, level, timezone) {
        super(company, role, skills, level);
        this.remote = true;
        this.timezone = timezone;
    }
}

export function calculateMatchScore(candidate, opportunity) {
    const matched = opportunity.skills.filter((requirement) => candidate.matchRequirement(requirement));
    const score = (matched.length / opportunity.skills.length) * 100;
    return score;
}

export function classifyCompatibility(score) {
    if (score >= 80) {
        return "Alta";
    } else if (score >= 50) {
        return "Média";
    } else {
        return "Baixa";
    }
}

export function listMissingSkills(candidate, opportunity) {
    return opportunity.skills
        .filter((requirement) => !candidate.matchRequirement(requirement))
        .map((requirement) => {
            const skill = candidate.getSkill(requirement.skillName);
            if(!skill) {
                return { 
                    skillName: requirement.skillName, 
                    minExperienceLevel: requirement.minExperienceLevel,
                    reason: 'missing'
                };
            } else {
                return { 
                    skillName: requirement.skillName, 
                    experienceLevel: skill.experienceLevel(), 
                    minExperienceLevel: requirement.minExperienceLevel,
                    reason: 'insufficient'
                };
            }
        });
}

export function listMatchedSkills(candidate, opportunity) {
  return opportunity.skills
    .filter((requirement) => candidate.matchRequirement(requirement))
    .map((requirement) => {
      const skill = candidate.getSkill(requirement.skillName);
      return {
        skillName: requirement.skillName,
        experienceLevel: skill.experienceLevel(),
        minExperienceLevel: requirement.minExperienceLevel
      };
    });
}

function showMissingSkill(item) {
    if(item.reason === 'missing') {
        return `• ${item.skillName.padEnd(25)} Habilidade Ausente`;
    } else {
        return `• ${item.skillName.padEnd(25)} Nível Insuficiente (Possui: ${item.experienceLevel}, Exige: ${item.minExperienceLevel})`;
    }
}

function buildResult(candidate, opportunities) {
    return opportunities.map((opportunity) => {
        const score = calculateMatchScore(candidate, opportunity);
        return {
            opportunity: opportunity,
            score: score,
            compatibility: classifyCompatibility(score),
            missingSkills: listMissingSkills(candidate, opportunity)
        }
    })
}

function findBestOpportunity(results){
    return results.reduce((best, current) => {
        if(current.score > best.score) {
            return current;
        }
        return best;
    });
}

function studySubjectsSuggestion(bestResult) {
    const missingSkills = bestResult.missingSkills;
    if(missingSkills.length === 0) {
        return "O candidato já atende a todos os requisitos da vaga mais adequada.";
    }

    let prioritySubject = missingSkills[0];

    for(const item of missingSkills) {
        if(item.reason === 'missing') {
            prioritySubject = item;
            break;
        }
    }

    if (prioritySubject.reason === 'missing') {
        return `Estude: ${prioritySubject.skillName}, que você ainda não conhece.`;
    }
    return `Aprofunde-se em: ${prioritySubject.skillName}, que está em nível insuficiente (Possui: ${prioritySubject.experienceLevel}, Exige: ${prioritySubject.minExperienceLevel}).`;
}

function processOpportunities(results, callback) {
    for (const result of results) {
        callback(result);
    }
}

function analysisCounter(){
    let counter = 0;
    return function contar() {
        counter += 1;
        return counter;
    }
}

function retrieveOpportunities(opportunities) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(!opportunities || opportunities.length === 0) {
                reject("Nenhuma vaga encontrada.");
            } else {
                resolve(opportunities);
            }
        }, 3000);
    });
}

async function main() {
    console.log("Conectando com o banco de dados de vagas...\n\n");

    try {
        const opportunitiesData = await retrieveOpportunities(opportunities);
        const results = buildResult(candidate, opportunitiesData);
        const counter = analysisCounter();

        console.log(`Relatório de compatibilidade do candidato: ${candidate.name}`);
        console.log("======================================================================");
        console.log(`Área de interesse: ${candidate.interestArea}`);
        console.log(`Experiência total: ${candidate.experience} anos`);
        console.log("---------------------------------------------------------- Habilidades");
        candidate.skills.forEach((skill) => {
            console.log(`${skill.name.padEnd(25)} ${skill.experienceLevel().padEnd(15)} ${skill.experienceYears.toString().padStart(4)} ano(s) de experiência`);
        });
        console.log("======================================================================\n\n\n");

        processOpportunities(results, (result) => {
            const count = counter();
            console.log(`Análise nº ${count}`);
            console.log("=================================");
            console.log(`Vaga: ${result.opportunity.role}`);
            console.log(`Empresa: ${result.opportunity.company}`);
            console.log(`Compatibilidade: ${result.compatibility} (${result.score.toFixed(2)}%)\n`);
            console.log("-------------------------------------------------- Habilidades Faltantes/Insuficientes");
            
            if(result.missingSkills.length === 0) {
                console.log("O candidato atende a todos os requisitos da vaga.\n");
            } else {
                result.missingSkills.forEach((item) => {
                    console.log(showMissingSkill(item));
                });
            }
            console.log("\n\n\n\n");
        });

        const bestResult = findBestOpportunity(results);
        console.log("======================================================================\n");
        console.log(`A vaga mais adequada para o candidato é: \n${bestResult.opportunity.role} na empresa ${bestResult.opportunity.company}\n`);
        console.log(`Compatibilidade: ${bestResult.compatibility} (${bestResult.score.toFixed(2)}%)\n\n`);
        console.log("---------------------------------------------------- Sugestão de estudo");
        console.log(studySubjectsSuggestion(bestResult));
               
    } catch(error) {
        console.error("Erro ao processar vagas:", error);
    }
}

main();