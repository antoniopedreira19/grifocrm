import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  
  // Se começar com 55 (Brasil), formatar como +55 (XX) XXXXX-XXXX ou +55 (XX) XXXX-XXXX
  if (cleaned.startsWith('55') && cleaned.length >= 12) {
    const countryCode = cleaned.substring(0, 2);
    const areaCode = cleaned.substring(2, 4);
    const rest = cleaned.substring(4);
    
    if (rest.length === 9) {
      // Celular: +55 (XX) XXXXX-XXXX
      return `+${countryCode} (${areaCode}) ${rest.substring(0, 5)}-${rest.substring(5)}`;
    } else if (rest.length === 8) {
      // Fixo: +55 (XX) XXXX-XXXX
      return `+${countryCode} (${areaCode}) ${rest.substring(0, 4)}-${rest.substring(4)}`;
    }
  }
  
  // Se tiver 11 dígitos (celular BR sem código do país)
  if (cleaned.length === 11) {
    return `+55 (${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  
  // Se tiver 10 dígitos (fixo BR sem código do país)
  if (cleaned.length === 10) {
    return `+55 (${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  // Retornar original se não conseguir formatar
  return phone;
}

export function capitalizeName(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      // Não capitalizar preposições e artigos comuns
      const lowercaseWords = ['de', 'da', 'do', 'das', 'dos', 'e'];
      if (lowercaseWords.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
