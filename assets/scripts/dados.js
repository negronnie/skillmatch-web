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