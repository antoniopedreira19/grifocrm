-- Adicionar novo valor ao enum faturamento_t
ALTER TYPE faturamento_t ADD VALUE IF NOT EXISTS 'acima_50m';

-- Atualizar função de cálculo de score para incluir a nova faixa
CREATE OR REPLACE FUNCTION public.trg_compute_lead_score()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare ok boolean;
begin
  new.score_tempo :=
    case new.conhece_daniel
      when 'nao_conhece' then 0
      when 'lt_3m'        then 1
      when 'm3_12m'       then 2
      when 'gt_1a'        then 3
      else null
    end;

  new.score_faturamento :=
    case new.faturamento_2025
      when 'ate_500k'      then 1
      when 'entre_500k_1m' then 2
      when 'entre_1m_10m'  then 3
      when 'entre_10m_50m' then 4
      when 'acima_50m'     then 7
      else null
    end;

  new.score_interesse :=
    case new.interesse
      when 'nao_nao_consigo' then 0
      when 'nao_mas_posso'   then 1
      when 'quero_entender'  then 2
      when 'quero_agora'     then 3
      else null
    end;

  ok := new.score_tempo is not null
    and new.score_faturamento is not null
    and new.score_interesse is not null;

  if ok then
    new.score_total := new.score_tempo + new.score_faturamento + new.score_interesse;
    new.score_cor :=
      case
        when new.score_total >= 8 then 'verde'
        when new.score_total >= 6 then 'verde_claro'
        when new.score_total >= 4 then 'amarelo'
        else 'vermelho'
      end;
  else
    new.score_total := null;
    new.score_cor   := 'cinza';
  end if;

  return new;
end$function$;