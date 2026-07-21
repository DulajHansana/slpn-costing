export interface MaterialRow {
  id: string;
  material: string;
  category: string;
  categoryColor: string;
}

export const PRINT_MACHINES = [
  'Digital Printer',
  'Offset Printer',
  'Screen Printer',
  'Flexo Printer',
  'Gravure Printer',
  'Letterpress',
  'Large Format Printer',
];

export const CATEGORIES = [
  { id: 'paper', label: 'Paper & Board', color: '#b8860b' },
  { id: 'plates', label: 'Plates', color: '#8b6914' },
  { id: 'impression', label: 'Impression', color: '#1a4a7a' },
  { id: 'lamination', label: 'Lamination & Coating', color: '#1a5c2a' },
  { id: 'finishing', label: 'Finishing', color: '#1a5c2a' },
  { id: 'postpress', label: 'Post-Press', color: '#2a6b1a' },
  { id: 'misc', label: 'Miscellaneous', color: '#3a6b1a' },
];

export const MATERIAL_ROWS: MaterialRow[] = [
  // Paper & Board
  { id: 'artwork', material: 'ART WORK', category: 'paper', categoryColor: '#d4a017' },
  { id: 'paper01a', material: 'PAPER 01', category: 'paper', categoryColor: '#d4a017' },
  { id: 'paper01b', material: 'PAPER 02', category: 'paper', categoryColor: '#d4a017' },
  { id: 'board01', material: 'BOARD 01', category: 'paper', categoryColor: '#d4a017' },
  { id: 'board02', material: 'BOARD 02', category: 'paper', categoryColor: '#d4a017' },
  { id: 'otherpaper', material: 'OTHER PAPER', category: 'paper', categoryColor: '#d4a017' },
  // Plates
  { id: 'platr', material: 'PLATR', category: 'plates', categoryColor: '#c8a000' },
  { id: 'specialplate', material: 'SPECIAL PLATE', category: 'plates', categoryColor: '#c8a000' },
  { id: 'postive', material: 'POSTIVE', category: 'plates', categoryColor: '#c8a000' },
  { id: 'foilblock', material: 'FOIL BLOCK', category: 'plates', categoryColor: '#c8a000' },
  { id: 'embossblock', material: 'EMBOSS BLOCK', category: 'plates', categoryColor: '#c8a000' },
  { id: 'otherblock', material: 'OTHER BLOCK', category: 'plates', categoryColor: '#c8a000' },
  // Impression
  { id: 'immprion', material: 'IMMPRION', category: 'impression', categoryColor: '#1e6091' },
  { id: 'solidimm', material: 'SOLID IMMPRTION', category: 'impression', categoryColor: '#1e6091' },
  { id: 'specimp', material: 'SPECIAM IMP', category: 'impression', categoryColor: '#1e6091' },
  { id: 'extraink', material: 'EXTRA INK', category: 'impression', categoryColor: '#1e6091' },
  { id: 'coating', material: 'COATING', category: 'impression', categoryColor: '#1e6091' },
  // Lamination
  { id: 'glosslam', material: 'GLOSS LAMINATE', category: 'lamination', categoryColor: '#2d6a4f' },
  { id: 'mattlam', material: 'MATT LAMINATE', category: 'lamination', categoryColor: '#2d6a4f' },
  { id: 'otherlam', material: 'OTHER LAMINATE', category: 'lamination', categoryColor: '#2d6a4f' },
  { id: 'varnish', material: 'VARNISH', category: 'lamination', categoryColor: '#2d6a4f' },
  { id: 'spotvarnish', material: 'SPOT VARNISH', category: 'lamination', categoryColor: '#2d6a4f' },
  // Finishing
  { id: 'chanelcreas', material: 'CHANEL CREASING', category: 'finishing', categoryColor: '#40916c' },
  { id: 'dieimm', material: 'DIE IMMPRION', category: 'finishing', categoryColor: '#40916c' },
  { id: 'cutting', material: 'CUTTING', category: 'finishing', categoryColor: '#40916c' },
  { id: 'calenderstip', material: 'CALENDER STIP', category: 'finishing', categoryColor: '#40916c' },
  // Post-Press
  { id: 'gathher', material: 'GATHHER', category: 'postpress', categoryColor: '#52b788' },
  { id: 'folding', material: 'FOLDING', category: 'postpress', categoryColor: '#52b788' },
  { id: 'pasting', material: 'PASTING', category: 'postpress', categoryColor: '#52b788' },
  { id: 'binding', material: 'BINDING', category: 'postpress', categoryColor: '#52b788' },
  { id: 'numbering', material: 'NUMBERING', category: 'postpress', categoryColor: '#52b788' },
  { id: 'packing', material: 'PACKING', category: 'postpress', categoryColor: '#52b788' },
  // Misc
  { id: 'labercharge', material: 'LABER CHARGE', category: 'misc', categoryColor: '#74c69d' },
  { id: 'rubberband', material: 'RUBBER BAND', category: 'misc', categoryColor: '#74c69d' },
  { id: 'trasport', material: 'TRASPORT', category: 'misc', categoryColor: '#74c69d' },
  { id: 'others', material: 'OTHERS', category: 'misc', categoryColor: '#74c69d' },
];

export function createDefaultRows() {
  return MATERIAL_ROWS.map((r) => ({
    material: r.material,
    itemName: '',
    sqInchRate: null as number | null,
    quantity: null as number | null,
    unitPrice: null as number | null,
    total: 0,
  }));
}

export function calculateTotal(
  sqInchRate: number | null,
  quantity: number | null,
  unitPrice: number | null
): number {
  // If sqInchRate is provided, total = sqInchRate * quantity * unitPrice
  // Otherwise total = quantity * unitPrice
  if (sqInchRate !== null && sqInchRate > 0 && quantity !== null && unitPrice !== null) {
    return sqInchRate * quantity * unitPrice;
  }
  if (quantity !== null && unitPrice !== null) {
    return quantity * unitPrice;
  }
  return 0;
}
