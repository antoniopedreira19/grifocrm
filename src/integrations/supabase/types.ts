export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          created_at: string
          id: string
          user_ativo: boolean
          user_email: string | null
          user_nome: string
          user_role: Database["public"]["Enums"]["user_role_t"]
        }
        Insert: {
          created_at?: string
          id?: string
          user_ativo?: boolean
          user_email?: string | null
          user_nome: string
          user_role?: Database["public"]["Enums"]["user_role_t"]
        }
        Update: {
          created_at?: string
          id?: string
          user_ativo?: boolean
          user_email?: string | null
          user_nome?: string
          user_role?: Database["public"]["Enums"]["user_role_t"]
        }
        Relationships: []
      }
      integration_products: {
        Row: {
          created_at: string | null
          description: string | null
          external_id: string
          id: string
          internal_code: Database["public"]["Enums"]["produto_t"]
          platform: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          external_id: string
          id?: string
          internal_code: Database["public"]["Enums"]["produto_t"]
          platform?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          external_id?: string
          id?: string
          internal_code?: Database["public"]["Enums"]["produto_t"]
          platform?: string
        }
        Relationships: []
      }
      interacoes: {
        Row: {
          autor: string
          conteudo: string
          created_at: string
          id: string
          lead_id: string
          tipo: Database["public"]["Enums"]["interaction_t"]
        }
        Insert: {
          autor: string
          conteudo: string
          created_at?: string
          id?: string
          lead_id: string
          tipo: Database["public"]["Enums"]["interaction_t"]
        }
        Update: {
          autor?: string
          conteudo?: string
          created_at?: string
          id?: string
          lead_id?: string
          tipo?: Database["public"]["Enums"]["interaction_t"]
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_autor_fkey"
            columns: ["autor"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_status_history: {
        Row: {
          autor: string | null
          changed_at: string
          de_status: Database["public"]["Enums"]["status_t"] | null
          id: string
          lead_id: string
          nota: string | null
          para_status: Database["public"]["Enums"]["status_t"]
        }
        Insert: {
          autor?: string | null
          changed_at?: string
          de_status?: Database["public"]["Enums"]["status_t"] | null
          id?: string
          lead_id: string
          nota?: string | null
          para_status: Database["public"]["Enums"]["status_t"]
        }
        Update: {
          autor?: string | null
          changed_at?: string
          de_status?: Database["public"]["Enums"]["status_t"] | null
          id?: string
          lead_id?: string
          nota?: string | null
          para_status?: Database["public"]["Enums"]["status_t"]
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_history_autor_fkey"
            columns: ["autor"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          acontecer_prox12m: string | null
          anos_empresa: number | null
          capacidade_investimento_gbc: string | null
          categoria: Database["public"]["Enums"]["produto_categoria_t"] | null
          conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"] | null
          created_at: string
          data_entrada_negociacao: string | null
          data_entrada_qualificacao: string | null
          data_ganho: string | null
          data_saida_negociacao: string | null
          data_saida_qualificacao: string | null
          deal_fase: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor: number | null
          email: string
          faixa_investimento: string | null
          fast_peso_geral: number | null
          faturamento_2024: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid: string | null
          form_answers: Json | null
          gclid: string | null
          id: string
          interesse: Database["public"]["Enums"]["interesse_t"] | null
          interesse_mentoria_fast: boolean | null
          landing_page: string | null
          modelo_negocio: string | null
          motivo_ser_escolhido: string | null
          nao_interesse_motivo: string | null
          nome: string
          num_funcionarios: number | null
          observacao: string | null
          oportunidade_ideal: string | null
          origem: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt: string | null
          primeiro_contato: string | null
          produto: Database["public"]["Enums"]["produto_t"]
          proximo_contato: string | null
          proximo_followup: string | null
          rede_social: string | null
          referrer: string | null
          regiao: string | null
          responsavel: string | null
          score_cor: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento: number | null
          score_interesse: number | null
          score_tempo: number | null
          score_total: number | null
          status: Database["public"]["Enums"]["status_t"]
          tag_form: string | null
          telefone: string | null
          tempo_negociacao_dias: number | null
          tempo_qualificacao_dias: number | null
          tempo_total_conversao_dias: number | null
          tipo_pagamento: Database["public"]["Enums"]["tipo_pagamento_t"] | null
          ultima_interacao: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_id: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          valor_a_vista: number | null
          valor_entrada: number | null
          valor_parcelado: number | null
        }
        Insert: {
          acontecer_prox12m?: string | null
          anos_empresa?: number | null
          capacidade_investimento_gbc?: string | null
          categoria?: Database["public"]["Enums"]["produto_categoria_t"] | null
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string
          data_entrada_negociacao?: string | null
          data_entrada_qualificacao?: string | null
          data_ganho?: string | null
          data_saida_negociacao?: string | null
          data_saida_qualificacao?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email: string
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          interesse_mentoria_fast?: boolean | null
          landing_page?: string | null
          modelo_negocio?: string | null
          motivo_ser_escolhido?: string | null
          nao_interesse_motivo?: string | null
          nome: string
          num_funcionarios?: number | null
          observacao?: string | null
          oportunidade_ideal?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto: Database["public"]["Enums"]["produto_t"]
          proximo_contato?: string | null
          proximo_followup?: string | null
          rede_social?: string | null
          referrer?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"]
          tag_form?: string | null
          telefone?: string | null
          tempo_negociacao_dias?: number | null
          tempo_qualificacao_dias?: number | null
          tempo_total_conversao_dias?: number | null
          tipo_pagamento?:
            | Database["public"]["Enums"]["tipo_pagamento_t"]
            | null
          ultima_interacao?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor_a_vista?: number | null
          valor_entrada?: number | null
          valor_parcelado?: number | null
        }
        Update: {
          acontecer_prox12m?: string | null
          anos_empresa?: number | null
          capacidade_investimento_gbc?: string | null
          categoria?: Database["public"]["Enums"]["produto_categoria_t"] | null
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string
          data_entrada_negociacao?: string | null
          data_entrada_qualificacao?: string | null
          data_ganho?: string | null
          data_saida_negociacao?: string | null
          data_saida_qualificacao?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          interesse_mentoria_fast?: boolean | null
          landing_page?: string | null
          modelo_negocio?: string | null
          motivo_ser_escolhido?: string | null
          nao_interesse_motivo?: string | null
          nome?: string
          num_funcionarios?: number | null
          observacao?: string | null
          oportunidade_ideal?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"]
          proximo_contato?: string | null
          proximo_followup?: string | null
          rede_social?: string | null
          referrer?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"]
          tag_form?: string | null
          telefone?: string | null
          tempo_negociacao_dias?: number | null
          tempo_qualificacao_dias?: number | null
          tempo_total_conversao_dias?: number | null
          tipo_pagamento?:
            | Database["public"]["Enums"]["tipo_pagamento_t"]
            | null
          ultima_interacao?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor_a_vista?: number | null
          valor_entrada?: number | null
          valor_parcelado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      products_config: {
        Row: {
          categoria: Database["public"]["Enums"]["produto_categoria_t"]
          created_at: string | null
          id: string
          links: Json | null
          produto: Database["public"]["Enums"]["produto_t"]
          updated_at: string | null
        }
        Insert: {
          categoria: Database["public"]["Enums"]["produto_categoria_t"]
          created_at?: string | null
          id?: string
          links?: Json | null
          produto: Database["public"]["Enums"]["produto_t"]
          updated_at?: string | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["produto_categoria_t"]
          created_at?: string | null
          id?: string
          links?: Json | null
          produto?: Database["public"]["Enums"]["produto_t"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_events: {
        Row: {
          categoria: Database["public"]["Enums"]["produto_categoria_t"] | null
          created_at: string | null
          email_cliente: string
          evento: Database["public"]["Enums"]["lastlink_event_t"]
          id: string
          lead_id: string | null
          payload_completo: Json | null
          processado: boolean | null
          produto: Database["public"]["Enums"]["produto_t"] | null
          valor: number | null
        }
        Insert: {
          categoria?: Database["public"]["Enums"]["produto_categoria_t"] | null
          created_at?: string | null
          email_cliente: string
          evento: Database["public"]["Enums"]["lastlink_event_t"]
          id?: string
          lead_id?: string | null
          payload_completo?: Json | null
          processado?: boolean | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          valor?: number | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["produto_categoria_t"] | null
          created_at?: string | null
          email_cliente?: string
          evento?: Database["public"]["Enums"]["lastlink_event_t"]
          id?: string
          lead_id?: string | null
          payload_completo?: Json | null
          processado?: boolean | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_dashboard_atividade_responsavel: {
        Row: {
          qtd_ganho: number | null
          qtd_negociando: number | null
          qtd_perdido: number | null
          qtd_primeiro_contato: number | null
          qtd_proximo_contato: number | null
          responsavel: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      capture_lead_public:
        | {
            Args: {
              p_conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"]
              p_email: string
              p_faixa_investimento?: string
              p_faturamento_2024?: Database["public"]["Enums"]["faturamento_t"]
              p_faturamento_2025: Database["public"]["Enums"]["faturamento_t"]
              p_fbclid?: string
              p_gclid?: string
              p_interesse: Database["public"]["Enums"]["interesse_t"]
              p_modelo_negocio?: string
              p_nome: string
              p_num_funcionarios?: number
              p_origem: Database["public"]["Enums"]["origem_t"]
              p_produto: Database["public"]["Enums"]["produto_t"]
              p_rede_social?: string
              p_regiao?: string
              p_tag_form?: string
              p_telefone: string
              p_utm_campaign?: string
              p_utm_content?: string
              p_utm_medium?: string
              p_utm_source?: string
              p_utm_term?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"]
              p_email: string
              p_faixa_investimento?: string
              p_faturamento_2024?: Database["public"]["Enums"]["faturamento_t"]
              p_faturamento_2025: Database["public"]["Enums"]["faturamento_t"]
              p_fbclid?: string
              p_form_answers?: Json
              p_gclid?: string
              p_interesse: Database["public"]["Enums"]["interesse_t"]
              p_modelo_negocio?: string
              p_nome: string
              p_num_funcionarios?: number
              p_origem: Database["public"]["Enums"]["origem_t"]
              p_produto: Database["public"]["Enums"]["produto_t"]
              p_rede_social?: string
              p_regiao?: string
              p_tag_form?: string
              p_telefone: string
              p_utm_campaign?: string
              p_utm_content?: string
              p_utm_medium?: string
              p_utm_source?: string
              p_utm_term?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"]
              p_email: string
              p_faixa_investimento?: string
              p_faturamento_2024?: Database["public"]["Enums"]["faturamento_t"]
              p_faturamento_2025: Database["public"]["Enums"]["faturamento_t"]
              p_fbclid?: string
              p_form_answers?: Json
              p_gclid?: string
              p_interesse: Database["public"]["Enums"]["interesse_t"]
              p_landing_page?: string
              p_modelo_negocio?: string
              p_nome: string
              p_num_funcionarios?: number
              p_origem: Database["public"]["Enums"]["origem_t"]
              p_produto: Database["public"]["Enums"]["produto_t"]
              p_rede_social?: string
              p_referrer?: string
              p_regiao?: string
              p_tag_form?: string
              p_telefone: string
              p_utm_campaign?: string
              p_utm_content?: string
              p_utm_id?: string
              p_utm_medium?: string
              p_utm_source?: string
              p_utm_term?: string
            }
            Returns: string
          }
      get_produto_categoria: {
        Args: { p_produto: Database["public"]["Enums"]["produto_t"] }
        Returns: Database["public"]["Enums"]["produto_categoria_t"]
      }
      me: {
        Args: never
        Returns: {
          id: string
          user_email: string
          user_nome: string
          user_role: Database["public"]["Enums"]["user_role_t"]
        }[]
      }
      safe_origem: {
        Args: { label: string }
        Returns: Database["public"]["Enums"]["origem_t"]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      conhece_daniel_t: "nao_conhece" | "lt_3m" | "m3_12m" | "gt_1a"
      deal_fase_t: "em_pagamento" | "ganho" | "perdido"
      faturamento_t:
        | "ate_500k"
        | "entre_500k_1m"
        | "entre_1m_10m"
        | "entre_10m_50m"
        | "acima_50m"
      interaction_t: "chamada" | "whatsapp" | "email" | "reuniao" | "comentario"
      interesse_t:
        | "quero_agora"
        | "quero_entender"
        | "nao_mas_posso"
        | "nao_nao_consigo"
      lastlink_event_t:
        | "Abandoned_Cart"
        | "Payment_Chargeback"
        | "Payment_Refund"
        | "Purchase_Order_Confirmed"
        | "Purchase_Request_Canceled"
        | "Purchase_Request_Confirmed"
        | "Purchase_Request_Expired"
        | "Recurrent_Payment"
        | "Refund_Period_Over"
        | "Subscription_Canceled"
        | "Subscription_Expired"
        | "Product_Access_Started"
        | "Product_Access_Ended"
        | "Subscription_Product_Access"
        | "Subscription_Renewal_Pending"
        | "Active_Member_Notification"
        | "Refund_Requested"
      origem_t:
        | "lp_gbc"
        | "lp_fast"
        | "criativo_x"
        | "instagram"
        | "board"
        | "meta_lead_ads"
        | "social_seller"
        | "outro"
        | "lastlink"
      perdido_motivo_t:
        | "sem_fit"
        | "preco"
        | "tempo"
        | "sem_resposta"
        | "outros"
        | "concorrente"
      produto_categoria_t: "mentorias" | "produtos"
      produto_t: "gbc" | "mentoria_fast" | "board" | "masterclass" | "planilhas"
      score_cor_t: "verde" | "verde_claro" | "amarelo" | "vermelho" | "cinza"
      status_t:
        | "primeiro_contato"
        | "proximo_contato"
        | "negociando"
        | "ganho"
        | "perdido"
        | "proposta"
        | "followup"
      tipo_pagamento_t: "a_vista" | "parcelado" | "entrada_parcelado"
      user_role_t: "admin" | "closer" | "sdr" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      conhece_daniel_t: ["nao_conhece", "lt_3m", "m3_12m", "gt_1a"],
      deal_fase_t: ["em_pagamento", "ganho", "perdido"],
      faturamento_t: [
        "ate_500k",
        "entre_500k_1m",
        "entre_1m_10m",
        "entre_10m_50m",
        "acima_50m",
      ],
      interaction_t: ["chamada", "whatsapp", "email", "reuniao", "comentario"],
      interesse_t: [
        "quero_agora",
        "quero_entender",
        "nao_mas_posso",
        "nao_nao_consigo",
      ],
      lastlink_event_t: [
        "Abandoned_Cart",
        "Payment_Chargeback",
        "Payment_Refund",
        "Purchase_Order_Confirmed",
        "Purchase_Request_Canceled",
        "Purchase_Request_Confirmed",
        "Purchase_Request_Expired",
        "Recurrent_Payment",
        "Refund_Period_Over",
        "Subscription_Canceled",
        "Subscription_Expired",
        "Product_Access_Started",
        "Product_Access_Ended",
        "Subscription_Product_Access",
        "Subscription_Renewal_Pending",
        "Active_Member_Notification",
        "Refund_Requested",
      ],
      origem_t: [
        "lp_gbc",
        "lp_fast",
        "criativo_x",
        "instagram",
        "board",
        "meta_lead_ads",
        "social_seller",
        "outro",
        "lastlink",
      ],
      perdido_motivo_t: [
        "sem_fit",
        "preco",
        "tempo",
        "sem_resposta",
        "outros",
        "concorrente",
      ],
      produto_categoria_t: ["mentorias", "produtos"],
      produto_t: ["gbc", "mentoria_fast", "board", "masterclass", "planilhas"],
      score_cor_t: ["verde", "verde_claro", "amarelo", "vermelho", "cinza"],
      status_t: [
        "primeiro_contato",
        "proximo_contato",
        "negociando",
        "ganho",
        "perdido",
        "proposta",
        "followup",
      ],
      tipo_pagamento_t: ["a_vista", "parcelado", "entrada_parcelado"],
      user_role_t: ["admin", "closer", "sdr", "viewer"],
    },
  },
} as const
