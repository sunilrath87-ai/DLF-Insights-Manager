
import React, { RefObject, useState } from 'react';

declare const htmlToImage: any;
declare const jspdf: any;

interface ExportControlsProps {
    elementRef: RefObject<HTMLElement>;
}

const ExportControls: React.FC<ExportControlsProps> = ({ elementRef }) => {
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const handleExport = async (format: 'pdf' | 'jpeg' | 'png') => {
        if (!elementRef.current || isExporting) return;
        setIsExporting(format);
        const element = elementRef.current;
        
        // Temporarily change styles for export
        const originalClasses = element.className;
        element.className = originalClasses.replace('bg-slate-800/50', 'bg-slate-900').replace('backdrop-blur-sm', '');

        try {
            const options = { 
                quality: 1.0, 
                pixelRatio: 2, // Increase resolution for better quality
                backgroundColor: '#0f172a' // slate-900
            };

            if (format === 'pdf') {
                const dataUrl = await htmlToImage.toPng(element, options);
                const { jsPDF } = jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps= pdf.getImageProperties(dataUrl);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                const pageHeight = pdf.internal.pageSize.getHeight();
                let heightLeft = pdfHeight;
                let position = 0;

                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                  position = heightLeft - pdfHeight;
                  pdf.addPage();
                  pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
                  heightLeft -= pageHeight;
                }

                pdf.save('dlf-insights-report.pdf');

            } else if (format === 'jpeg') {
                 const dataUrl = await htmlToImage.toJpeg(element, options);
                 const link = document.createElement('a');
                 link.download = `dlf-insights-capture.jpeg`;
                 link.href = dataUrl;
                 link.click();
            } else if (format === 'png') {
                const dataUrl = await htmlToImage.toPng(element, options);
                const link = document.createElement('a');
                link.download = `dlf-insights-capture.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error('Export failed', error);
            alert('Could not export the view. Please try again.');
        } finally {
            element.className = originalClasses; // Restore original styles
            setIsExporting(null);
        }
    };
    
    const getButtonClass = (format: 'pdf' | 'jpeg' | 'png') => {
        const baseClass = `flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-wait`;
        const colorClasses = {
            pdf: 'bg-red-900/50 text-red-300 hover:bg-red-900/80 focus:ring-red-500',
            jpeg: 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/80 focus:ring-blue-500',
            png: 'bg-green-900/50 text-green-300 hover:bg-green-900/80 focus:ring-green-500',
        };
        const busyClass = isExporting === format ? 'animate-pulse' : '';
        return `${baseClass} ${colorClasses[format]} ${busyClass}`;
    }

    return (
        <div className="flex items-center space-x-3">
            <button
                onClick={() => handleExport('pdf')}
                disabled={!!isExporting}
                className={getButtonClass('pdf')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>{isExporting === 'pdf' ? 'Exporting...' : 'PDF'}</span>
            </button>
            <button
                onClick={() => handleExport('jpeg')}
                disabled={!!isExporting}
                className={getButtonClass('jpeg')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                <span>{isExporting === 'jpeg' ? 'Exporting...' : 'JPEG'}</span>
            </button>
             <button
                onClick={() => handleExport('png')}
                disabled={!!isExporting}
                className={getButtonClass('png')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{isExporting === 'png' ? 'Capturing...' : 'Capture'}</span>
            </button>
        </div>
    );
};

export default ExportControls;
