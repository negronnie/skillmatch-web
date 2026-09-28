import {
  analysisCounter         // Função para contabilizar análises por sessão (closure)
} from "./motor.js";
let catalogoVagas = [];
let candidatoAtual = null;
let resultadosAnalise = [];
const registerAnalysis = analysisCounter();
