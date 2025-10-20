import html2pdf from 'html2pdf.js';

export const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Downloads a PDF from an HTML string using html2pdf.js, with landscape orientation.
 *
 * @param htmlContent The string containing the HTML to convert.
 * @param filename The desired name for the downloaded PDF file.
 */
export const downloadPDF = async (htmlContent: string, filename: string): Promise<void> => {
    // Create a temporary container for the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const options = {
        margin: 5,
        filename: filename,
        image: {
            type: 'svg+xml',
            quality: 0.98,
        },
        html2canvas: {
            scale: 2, // Adjusts resolution for clearer text
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape',
        },
        pagebreak: {
            mode: ['css', 'legacy'], // Recognizes CSS page-break rules
        },
    };

    try {
        // @ts-ignore
        await html2pdf().set(options).from(tempDiv).save();
    } catch (error) {
        console.error('Failed to generate PDF:', error);
    } finally {
        // Clean up the temporary element from the DOM if necessary, though html2pdf.js does it internally
    }
};