export function parseCSV<T>(csv: string): T[] {
  // Handle CRLF or LF
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  // Parse headers and trim them
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    // Skip empty lines
    if (!line.trim()) return null;
    
    const values = line.split(',');
    const obj: any = {};
    
    headers.forEach((header, index) => {
      // Get value by index, default to empty string
      let value = values[index] || "";
      
      // Trim the value
      value = value.trim();
      
      // Assign to object using the header key
      obj[header] = value;
    });
    
    return obj as T;
  }).filter(Boolean) as T[];
}
