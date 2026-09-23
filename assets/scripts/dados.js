import { Candidate, Opportunity, RemoteOpportunity, Skill } from "./motor";

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
    try {
        const rawData = localStorage.getItem("skillmatch.profile");
        if (!rawData) return null;

        const parsedData = JSON.parse(rawData);
        if (!parsedData) return null;

        const listSkills = parsedData.skills.map((sk) => {
            new Skill(sk.name, sk.experienceYears)
        })

        return new Candidate(
            parsedData.name,
            parsedData.interestArea,
            listSkills,
            parsedData.experienceYears
        )

    } catch (error) {
       console.log("Não foi possivel ler os dados: ", error) 
    }
}

export function clearProfile() {
    
}

export function saveTheme(theme) {
    
}

export function loadTheme() {
    
}