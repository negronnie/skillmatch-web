import { Opportunity, RemoteOpportunity } from "./motor";

const urlVagas = "./assets/data/vagas.json";

export async function loadOpportunities() {
    const response = await fetch(urlVagas);

    if (!response.ok) {
        return "Falha ao obter vagas"
    }
    const data = await response.json();

    return data.map((item) => {
        if (item.remote) {
            return new RemoteOpportunity(
                item.id,
                item.company,
                item.role,
                item.skills,
                item.level,
                item.salary,
                item.timezone
            )
        }
        return new Opportunity(
            item.id,
            item.company,
            item.role,
            item.skills,
            item.level,
            item.salary,
            item.modality
        )
    })
}

export function saveProfile(candidate) {
    try {
        const parsedData = JSON.stringify({
            name: candidate.name,
            interestArea: candidate.interestArea,
            skills: candidate.skills.map(
                (sk) => ({
                name: sk.name,
                experienceYears: sk.experienceYears
            }))
        })
        localStorage.setItem("skillmatch.profile", parsedData);
    } catch (error) {
        console.log("Não foi possivel salvar os dados: ", error)
    }
    
}

export function loadProfile() {
    
}

export function clearProfile() {
    
}

export function saveTheme(theme) {
    
}

export function loadTheme() {
    
}