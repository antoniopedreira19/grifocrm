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
          {
            foreignKeyName: "interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_fast_prioridade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_gbc_prioridade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_prioridade_ativas"
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
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_fast_prioridade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_gbc_prioridade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_prioridade_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          anos_empresa: number | null
          conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"]
          created_at: string
          deal_fase: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor: number | null
          email: string
          faixa_investimento: string | null
          fast_peso_geral: number | null
          faturamento_2024: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025: Database["public"]["Enums"]["faturamento_t"]
          fbclid: string | null
          form_answers: Json | null
          gclid: string | null
          id: string
          interesse: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio: string | null
          nome: string
          num_funcionarios: number | null
          observacao: string | null
          origem: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt: string | null
          primeiro_contato: string | null
          produto: Database["public"]["Enums"]["produto_t"]
          proximo_contato: string | null
          rede_social: string | null
          regiao: string | null
          responsavel: string | null
          score_cor: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento: number | null
          score_interesse: number | null
          score_tempo: number | null
          score_total: number | null
          status: Database["public"]["Enums"]["status_t"]
          tag_form: string | null
          telefone: string
          ultima_interacao: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          anos_empresa?: number | null
          conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"]
          created_at?: string
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email: string
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025: Database["public"]["Enums"]["faturamento_t"]
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome: string
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto: Database["public"]["Enums"]["produto_t"]
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"]
          tag_form?: string | null
          telefone: string
          ultima_interacao?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          anos_empresa?: number | null
          conhece_daniel?: Database["public"]["Enums"]["conhece_daniel_t"]
          created_at?: string
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"]
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"]
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"]
          tag_form?: string | null
          telefone?: string
          ultima_interacao?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
    }
    Views: {
      v_dashboard_atividade_responsavel: {
        Row: {
          interacoes: number | null
          user_nome: string | null
        }
        Relationships: []
      }
      v_dashboard_entradas_dia: {
        Row: {
          dia: string | null
          qtde: number | null
        }
        Relationships: []
      }
      v_dashboard_status_counts: {
        Row: {
          qtde: number | null
          status: Database["public"]["Enums"]["status_t"] | null
        }
        Relationships: []
      }
      v_fast_prioridade: {
        Row: {
          anos_empresa: number | null
          conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"] | null
          created_at: string | null
          deal_fase: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor: number | null
          email: string | null
          faixa_investimento: string | null
          fast_peso_geral: number | null
          faturamento_2024: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid: string | null
          form_answers: Json | null
          gclid: string | null
          id: string | null
          interesse: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio: string | null
          nome: string | null
          num_funcionarios: number | null
          observacao: string | null
          origem: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt: string | null
          primeiro_contato: string | null
          produto: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato: string | null
          rede_social: string | null
          regiao: string | null
          responsavel: string | null
          score_cor: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento: number | null
          score_interesse: number | null
          score_tempo: number | null
          score_total: number | null
          status: Database["public"]["Enums"]["status_t"] | null
          tag_form: string | null
          telefone: string | null
          tie_fat25: number | null
          tie_interesse: number | null
          tie_tempo: number | null
          ultima_interacao: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          anos_empresa?: number | null
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string | null
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string | null
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string | null
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"] | null
          tag_form?: string | null
          telefone?: string | null
          tie_fat25?: never
          tie_interesse?: never
          tie_tempo?: never
          ultima_interacao?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          anos_empresa?: number | null
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string | null
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string | null
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string | null
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"] | null
          tag_form?: string | null
          telefone?: string | null
          tie_fat25?: never
          tie_interesse?: never
          tie_tempo?: never
          ultima_interacao?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
      v_gbc_prioridade: {
        Row: {
          anos_empresa: number | null
          conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"] | null
          created_at: string | null
          deal_fase: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor: number | null
          email: string | null
          faixa_investimento: string | null
          fast_peso_geral: number | null
          faturamento_2024: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid: string | null
          form_answers: Json | null
          gclid: string | null
          id: string | null
          interesse: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio: string | null
          nome: string | null
          num_funcionarios: number | null
          observacao: string | null
          origem: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt: string | null
          primeiro_contato: string | null
          produto: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato: string | null
          rede_social: string | null
          regiao: string | null
          responsavel: string | null
          score_cor: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento: number | null
          score_interesse: number | null
          score_tempo: number | null
          score_total: number | null
          status: Database["public"]["Enums"]["status_t"] | null
          tag_form: string | null
          telefone: string | null
          tie_fat25: number | null
          tie_interesse: number | null
          tie_tempo: number | null
          ultima_interacao: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          anos_empresa?: number | null
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string | null
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string | null
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string | null
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"] | null
          tag_form?: string | null
          telefone?: string | null
          tie_fat25?: never
          tie_interesse?: never
          tie_tempo?: never
          ultima_interacao?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          anos_empresa?: number | null
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string | null
          faixa_investimento?: string | null
          fast_peso_geral?: number | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          form_answers?: Json | null
          gclid?: string | null
          id?: string | null
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string | null
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"] | null
          tag_form?: string | null
          telefone?: string | null
          tie_fat25?: never
          tie_interesse?: never
          tie_tempo?: never
          ultima_interacao?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
      v_leads_prioridade_ativas: {
        Row: {
          conhece_daniel: Database["public"]["Enums"]["conhece_daniel_t"] | null
          created_at: string | null
          deal_fase: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor: number | null
          email: string | null
          faixa_investimento: string | null
          faturamento_2024: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid: string | null
          gclid: string | null
          id: string | null
          interesse: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio: string | null
          nome: string | null
          num_funcionarios: number | null
          observacao: string | null
          origem: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt: string | null
          primeiro_contato: string | null
          produto: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato: string | null
          rede_social: string | null
          regiao: string | null
          responsavel: string | null
          score_cor: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento: number | null
          score_interesse: number | null
          score_tempo: number | null
          score_total: number | null
          status: Database["public"]["Enums"]["status_t"] | null
          telefone: string | null
          tie_fat25: number | null
          tie_interesse: number | null
          tie_tempo: number | null
          ultima_interacao: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string | null
          faixa_investimento?: string | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          gclid?: string | null
          id?: string | null
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string | null
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"] | null
          telefone?: string | null
          tie_fat25?: never
          tie_interesse?: never
          tie_tempo?: never
          ultima_interacao?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          conhece_daniel?:
            | Database["public"]["Enums"]["conhece_daniel_t"]
            | null
          created_at?: string | null
          deal_fase?: Database["public"]["Enums"]["deal_fase_t"] | null
          deal_valor?: number | null
          email?: string | null
          faixa_investimento?: string | null
          faturamento_2024?: Database["public"]["Enums"]["faturamento_t"] | null
          faturamento_2025?: Database["public"]["Enums"]["faturamento_t"] | null
          fbclid?: string | null
          gclid?: string | null
          id?: string | null
          interesse?: Database["public"]["Enums"]["interesse_t"] | null
          modelo_negocio?: string | null
          nome?: string | null
          num_funcionarios?: number | null
          observacao?: string | null
          origem?: Database["public"]["Enums"]["origem_t"] | null
          perdido_motivo_cat?:
            | Database["public"]["Enums"]["perdido_motivo_t"]
            | null
          perdido_motivo_txt?: string | null
          primeiro_contato?: string | null
          produto?: Database["public"]["Enums"]["produto_t"] | null
          proximo_contato?: string | null
          rede_social?: string | null
          regiao?: string | null
          responsavel?: string | null
          score_cor?: Database["public"]["Enums"]["score_cor_t"] | null
          score_faturamento?: number | null
          score_interesse?: number | null
          score_tempo?: number | null
          score_total?: number | null
          status?: Database["public"]["Enums"]["status_t"] | null
          telefone?: string | null
          tie_fat25?: never
          tie_interesse?: never
          tie_tempo?: never
          ultima_interacao?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
      me: {
        Args: never
        Returns: {
          id: string
          user_email: string
          user_nome: string
          user_role: Database["public"]["Enums"]["user_role_t"]
        }[]
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
      interaction_t: "chamada" | "whatsapp" | "email" | "reuniao" | "comentario"
      interesse_t:
        | "quero_agora"
        | "quero_entender"
        | "nao_mas_posso"
        | "nao_nao_consigo"
      origem_t:
        | "lp_gbc"
        | "lp_fast"
        | "criativo_x"
        | "instagram"
        | "board"
        | "meta_lead_ads"
        | "social_seller"
        | "outro"
      perdido_motivo_t:
        | "sem_fit"
        | "preco"
        | "tempo"
        | "sem_resposta"
        | "outros"
        | "concorrente"
      produto_t: "gbc" | "mentoria_fast"
      score_cor_t: "verde" | "verde_claro" | "amarelo" | "vermelho" | "cinza"
      status_t:
        | "primeiro_contato"
        | "proximo_contato"
        | "negociando"
        | "ganho"
        | "perdido"
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
      ],
      interaction_t: ["chamada", "whatsapp", "email", "reuniao", "comentario"],
      interesse_t: [
        "quero_agora",
        "quero_entender",
        "nao_mas_posso",
        "nao_nao_consigo",
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
      ],
      perdido_motivo_t: [
        "sem_fit",
        "preco",
        "tempo",
        "sem_resposta",
        "outros",
        "concorrente",
      ],
      produto_t: ["gbc", "mentoria_fast"],
      score_cor_t: ["verde", "verde_claro", "amarelo", "vermelho", "cinza"],
      status_t: [
        "primeiro_contato",
        "proximo_contato",
        "negociando",
        "ganho",
        "perdido",
      ],
      user_role_t: ["admin", "closer", "sdr", "viewer"],
    },
  },
} as const
