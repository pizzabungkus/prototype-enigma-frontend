
export function parseCSV<T>(csv: string): T[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].trim().split(',');
  
  return lines.slice(1).map(line => {
    const values = line.trim().split(',');
    const obj: any = {};
    headers.forEach((header, index) => {
      let value = values[index];
      // Basic type inference
      if (value && !isNaN(Number(value)) && !value.includes('-') && !value.startsWith('0')) { // Avoid dates or booking codes being numbers
         // actually let's keep strings for safety unless we know
      }
      obj[header.trim()] = value ? value.trim() : "";
    });
    return obj as T;
  });
}
