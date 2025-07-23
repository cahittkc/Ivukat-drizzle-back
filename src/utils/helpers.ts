

export class UtilFunctions {
    
    static normalizeStr(str: string): string {
        return str
            .toLocaleLowerCase('tr-TR')
            .normalize('NFKD')
            .replace(/\s/g, '')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ı/g, 'i')
            .replace(/ş/g, 's')
            .replace(/ğ/g, 'g')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/ü/g, 'u')
            .replace(/Ü/g, 'u');
      }
}