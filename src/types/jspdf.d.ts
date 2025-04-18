import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    setLineDashPattern(pattern: number[], phase: number): jsPDF;
    getNumberOfPages(): number;
  }
} 