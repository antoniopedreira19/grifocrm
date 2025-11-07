export type Produto = "gbc" | "mentoria_fast";

export type FaturamentoFaixa = 
  | "ate_500mil" 
  | "entre_500mil_e_1milhao" 
  | "entre_1milhao_e_10milhoes" 
  | "entre_10milhoes_e_50milhoes"
  | "acima_50milhoes";

export type ConheceDaniel = "nao_conhece" | "menos_3_meses" | "3_12_meses" | "mais_1_ano";

export type Interesse = 
  | "quero_agora" 
  | "quero_entender" 
  | "nao_mas_posso" 
  | "nao_nao_consigo";

export type Origem = 
  | "lp_gbc" 
  | "lp_fast" 
  | "criativo_x" 
  | "instagram" 
  | "board" 
  | "meta_lead_ads" 
  | "social_seller" 
  | "outro";

export type Status = 
  | "backlog" 
  | "primeiro_contato" 
  | "proximo_contato" 
  | "negociando" 
  | "proposta"
  | "followup"
  | "stand_by" 
  | "pode_fechar" 
  | "pagamento" 
  | "ganho" 
  | "perdido";

export type TipoPagamento = "a_vista" | "parcelado" | "entrada_parcelado";

export type ScoreCor = "verde" | "verde_claro" | "amarelo" | "vermelho" | "cinza";

export type DealFase = "em_pagamento" | "ganho" | "perdido";

export interface Lead {
  lead_id: string;
  produto: Produto;
  nome: string;
  email: string;
  telefone: string;
  rede_social?: string;
  
  faturamento_2024?: FaturamentoFaixa;
  faturamento_2025: FaturamentoFaixa;
  num_funcionarios?: number;
  modelo_negocio?: string;
  regiao?: string;
  conhece_daniel: ConheceDaniel;
  
  interesse: Interesse;
  faixa_investimento?: string;
  
  origem: Origem;
  origem_outro?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  
  score_total: number;
  score_tempo: number;
  score_faturamento: number;
  score_interesse: number;
  score_cor: ScoreCor;
  
  status: Status;
  responsavel?: string;
  primeiro_contato?: Date;
  proximo_contato?: Date;
  ultima_interacao?: Date;
  
  deal_fase?: DealFase;
  deal_valor?: number;
  observacao?: string;
  
  created_at: Date;
  updated_at: Date;
}

export type TipoInteracao = "chamada" | "whatsapp" | "email" | "reuniao" | "comentario";

export interface Interacao {
  interaction_id: string;
  lead_id: string;
  tipo: TipoInteracao;
  conteudo: string;
  autor: string;
  created_at: Date;
}

export type UserRole = "admin" | "closer" | "sdr" | "viewer";

export interface Usuario {
  user_id: string;
  user_nome: string;
  user_email: string;
  user_role: UserRole;
  user_ativo: boolean;
}
