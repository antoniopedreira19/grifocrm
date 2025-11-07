import type {
  Produto,
  FaturamentoFaixa,
  ConheceDaniel,
  Interesse,
  Origem,
  Status,
  TipoInteracao,
  UserRole,
} from "@/types/lead";

export const produtoLabels: Record<Produto, string> = {
  gbc: "GBC",
  mentoria_fast: "Mentoria Fast",
};

export const faturamentoLabels: Record<FaturamentoFaixa, string> = {
  ate_500mil: "Até R$ 500 mil",
  entre_500mil_e_1milhao: "Entre R$ 500 mil e R$ 1 milhão",
  entre_1milhao_e_10milhoes: "Entre R$ 1 milhão e R$ 10 milhões",
  entre_10milhoes_e_50milhoes: "Entre R$ 10 milhões e R$ 50 milhões",
  acima_50milhoes: "Acima de R$ 50 milhões",
};

export const conheceDanielLabels: Record<ConheceDaniel, string> = {
  nao_conhece: "Não conhece",
  menos_3_meses: "Menos de 3 meses",
  "3_12_meses": "Entre 3 e 12 meses",
  mais_1_ano: "Mais de 1 ano",
};

export const interesseLabels: Record<Interesse, string> = {
  quero_agora: "Quero agora",
  quero_entender: "Quero entender com o time",
  nao_mas_posso: "Não, mas posso conseguir",
  nao_nao_consigo: "Não, não consigo",
};

export const origemLabels: Record<Origem, string> = {
  lp_gbc: "LP GBC",
  lp_fast: "LP Fast",
  criativo_x: "Criativo X",
  instagram: "Instagram",
  board: "Board",
  meta_lead_ads: "Meta Lead Ads",
  social_seller: "Social Seller",
  outro: "Outro",
};

export const statusLabels: Record<Status, string> = {
  backlog: "Backlog",
  primeiro_contato: "Primeiro Contato",
  proximo_contato: "Qualificação",
  negociando: "Negociando",
  proposta: "Proposta",
  followup: "Follow-Up",
  stand_by: "Stand-by",
  pode_fechar: "Pode Fechar / Contrato",
  pagamento: "Pagamento",
  ganho: "Ganho",
  perdido: "Perdido",
};

export const tipoInteracaoLabels: Record<TipoInteracao, string> = {
  chamada: "Chamada",
  whatsapp: "WhatsApp",
  email: "E-mail",
  reuniao: "Reunião",
  comentario: "Comentário",
};

export const userRoleLabels: Record<UserRole, string> = {
  admin: "Admin",
  closer: "Closer",
  sdr: "SDR",
  viewer: "Viewer",
};
