
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { detectTablesInText } from '@/utils/tableDetector';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

interface PdfDownloadControlsProps {
  messages: Message[];
  sessionId: string | null;
}

const PdfDownloadControls: React.FC<PdfDownloadControlsProps> = ({ messages, sessionId }) => {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const handleMessageToggle = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const selectAllMessages = () => {
    const nonWelcomeMessages = messages.filter(msg => !msg.id.startsWith('welcome-'));
    setSelectedMessages(new Set(nonWelcomeMessages.map(msg => msg.id)));
  };

  const clearSelection = () => {
    setSelectedMessages(new Set());
  };

  const cleanTextForPdf = (text: string): string => {
    // Remove markdown formatting
    let cleanText = text
      .replace(/[#*`]/g, '')
      .replace(/\|/g, ' | ')
      .replace(/^\s*[-\*\+]\s+/gm, '• ')
      .replace(/^\s*\d+\.\s+/gm, (match, offset, string) => {
        const number = match.match(/\d+/)?.[0] || '1';
        return `${number}. `;
      });
    
    return cleanText;
  };

  const addTableToPdf = (pdf: jsPDF, table: any, startY: number, margin: number, maxWidth: number): number => {
    let yPosition = startY;
    const cellHeight = 8;
    const headerHeight = 10;
    
    // Calculate column widths
    const numCols = table.headers.length;
    const colWidth = (maxWidth - 10) / numCols;
    
    // Draw table header
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(margin, yPosition, maxWidth, headerHeight, 'F');
    
    // Header text
    pdf.setTextColor(255, 255, 255); // White text
    table.headers.forEach((header: string, colIndex: number) => {
      const xPos = margin + (colIndex * colWidth) + 2;
      const cleanHeader = cleanTextForPdf(header);
      pdf.text(cleanHeader, xPos, yPosition + 7);
    });
    
    yPosition += headerHeight;
    
    // Draw table rows
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0); // Black text
    
    table.rows.forEach((row: string[], rowIndex: number) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(248, 250, 252); // Light gray
        pdf.rect(margin, yPosition, maxWidth, cellHeight, 'F');
      }
      
      // Draw cell borders and content
      row.forEach((cell: string, colIndex: number) => {
        const xPos = margin + (colIndex * colWidth);
        const cleanCell = cleanTextForPdf(cell);
        
        // Draw cell border
        pdf.setDrawColor(209, 213, 219); // Gray border
        pdf.rect(xPos, yPosition, colWidth, cellHeight);
        
        // Add cell text
        const lines = pdf.splitTextToSize(cleanCell, colWidth - 4);
        pdf.text(lines[0] || '', xPos + 2, yPosition + 6);
      });
      
      yPosition += cellHeight;
    });
    
    return yPosition + 10;
  };

  const generatePDF = () => {
    if (selectedMessages.size === 0) {
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 25;

    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text('Chat Conversation Export', margin, yPosition);
    yPosition += 20;

    // Filter and sort selected messages
    const selectedMessagesList = messages
      .filter(msg => selectedMessages.has(msg.id))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    selectedMessagesList.forEach((message, index) => {
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - 50) {
        pdf.addPage();
        yPosition = 25;
      }

      // Message sender styling
      const isUser = message.sender === 'user';
      
      // Add sender label with colored background
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      
      if (isUser) {
        pdf.setFillColor(59, 130, 246); // Blue for user
        pdf.setTextColor(255, 255, 255); // White text
      } else {
        pdf.setFillColor(147, 51, 234); // Purple for AI
        pdf.setTextColor(255, 255, 255); // White text
      }
      
      const senderLabel = isUser ? 'You' : 'AI Assistant';
      const labelWidth = pdf.getTextWidth(senderLabel) + 10;
      
      pdf.roundedRect(margin, yPosition - 8, labelWidth, 12, 3, 3, 'F');
      pdf.text(senderLabel, margin + 5, yPosition - 1);
      yPosition += 15;

      // Message content
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.setFontSize(10);
      
      // Check for tables in the message
      const tables = detectTablesInText(message.content);
      
      if (tables.length > 0) {
        // Split content to handle text and tables separately
        const contentLines = message.content.split('\n');
        let textContent = '';
        let inTable = false;
        
        contentLines.forEach(line => {
          const hasTableMarkers = line.includes('|') || /\s{3,}/.test(line);
          if (!hasTableMarkers) {
            textContent += line + '\n';
          }
        });
        
        // Add text content first
        if (textContent.trim()) {
          const cleanText = cleanTextForPdf(textContent);
          const lines = pdf.splitTextToSize(cleanText, maxWidth);
          
          lines.forEach((line: string) => {
            if (yPosition > pdf.internal.pageSize.getHeight() - 25) {
              pdf.addPage();
              yPosition = 25;
            }
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
          
          yPosition += 5;
        }
        
        // Add tables
        tables.forEach((table) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 60) {
            pdf.addPage();
            yPosition = 25;
          }
          yPosition = addTableToPdf(pdf, table, yPosition, margin, maxWidth);
        });
      } else {
        // No tables, just add text content
        const cleanContent = cleanTextForPdf(message.content);
        const lines = pdf.splitTextToSize(cleanContent, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 25) {
            pdf.addPage();
            yPosition = 25;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 6;
        });
      }

      yPosition += 15; // Add space between messages
    });

    // Save the PDF
    const fileName = `chat-export-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    // Reset state
    setShowCheckboxes(false);
    setSelectedMessages(new Set());
  };

  const nonWelcomeMessages = messages.filter(msg => !msg.id.startsWith('welcome-'));

  if (nonWelcomeMessages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCheckboxes(!showCheckboxes)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {showCheckboxes ? 'Cancel Selection' : 'Select for PDF'}
      </Button>

      {showCheckboxes && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAllMessages}
            className="text-blue-600 hover:text-blue-700"
          >
            Select All
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-gray-600 hover:text-gray-700"
          >
            Clear Selection
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              {selectedMessages.size} selected
            </span>
            <Button
              onClick={generatePDF}
              disabled={selectedMessages.size === 0}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfDownloadControls;
