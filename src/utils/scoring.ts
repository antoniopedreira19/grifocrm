import type { ConheceDaniel, FaturamentoFaixa, Interesse, ScoreCor } from "@/types/lead";

export function calculateScoreTempo(conhece_daniel: ConheceDaniel): number {
  const scores = {
    nao_conhece: 0,
    menos_3_meses: 1,
    "3_12_meses": 2,
    mais_1_ano: 3,
  };
  return scores[conhece_daniel] || 0;
}

export function calculateScoreFaturamento(faturamento_2025: FaturamentoFaixa): number {
  const scores = {
    ate_500mil: 1,
    entre_500mil_e_1milhao: 2,
    entre_1milhao_e_10milhoes: 3,
    entre_10milhoes_e_50milhoes: 4,
    acima_50milhoes: 7,
  };
  return scores[faturamento_2025] || 0;
}

export function calculateScoreInteresse(interesse: Interesse): number {
  const scores = {
    nao_nao_consigo: 0,
    nao_mas_posso: 1,
    quero_entender: 2,
    quero_agora: 3,
  };
  return scores[interesse] || 0;
}

export function calculateScoreTotal(
  conhece_daniel: ConheceDaniel,
  faturamento_2025: FaturamentoFaixa,
  interesse: Interesse
): number {
  return (
    calculateScoreTempo(conhece_daniel) +
    calculateScoreFaturamento(faturamento_2025) +
    calculateScoreInteresse(interesse)
  );
}

export function getScoreCor(
  score_total: number,
  hasAllRequiredData: boolean
): ScoreCor {
  if (!hasAllRequiredData) return "cinza";
  if (score_total >= 8) return "verde";
  if (score_total >= 6) return "verde_claro";
  if (score_total >= 4) return "amarelo";
  return "vermelho";
}

export function getScoreColor(cor: ScoreCor): string {
  const colors = {
    verde: "hsl(var(--score-green))",
    verde_claro: "hsl(var(--score-green-light))",
    amarelo: "hsl(var(--score-yellow))",
    vermelho: "hsl(var(--score-red))",
    cinza: "hsl(var(--score-gray))",
  };
  return colors[cor];
}
