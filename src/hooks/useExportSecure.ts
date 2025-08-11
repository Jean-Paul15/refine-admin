import { useState } from 'react';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { message } from 'antd';

interface ExportOptions {
    filename?: string;
    sheetName?: string;
}

interface ExportData {
    [key: string]: string | number | boolean | Date | null;
}

export const useExportSecure = () => {
    const [loading, setLoading] = useState(false);

    const exportToExcel = async (data: ExportData[], options: ExportOptions = {}) => {
        try {
            setLoading(true);

            const {
                filename = 'export',
                sheetName = 'Données'
            } = options;

            // Créer un nouveau workbook avec exceljs
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(sheetName);

            if (data.length > 0) {
                // Ajouter les en-têtes de colonnes
                const headers = Object.keys(data[0]);
                worksheet.addRow(headers);

                // Styliser la ligne d'en-tête
                const headerRow = worksheet.getRow(1);
                headerRow.font = { bold: true };
                headerRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };

                // Ajouter les données
                data.forEach(row => {
                    const values = headers.map(header => row[header]);
                    worksheet.addRow(values);
                });

                // Auto-ajuster la largeur des colonnes
                headers.forEach((header, index) => {
                    const column = worksheet.getColumn(index + 1);
                    let maxLength = header.length;

                    data.forEach(row => {
                        const value = String(row[header] || '');
                        if (value.length > maxLength) {
                            maxLength = value.length;
                        }
                    });

                    column.width = Math.min(maxLength + 2, 50);
                });
            }

            // Générer le fichier Excel
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            saveAs(blob, `${filename}.xlsx`);
            message.success('Export Excel réussi !');
        } catch (error) {
            console.error('Erreur lors de l\'export Excel:', error);
            message.error('Erreur lors de l\'export Excel');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = async (data: ExportData[], options: ExportOptions = {}) => {
        try {
            setLoading(true);

            const { filename = 'export' } = options;

            if (data.length === 0) {
                message.warning('Aucune donnée à exporter');
                return;
            }

            // Créer les en-têtes
            const headers = Object.keys(data[0]);

            // Convertir les données en CSV
            const csvData = [
                headers.join(';'), // En-têtes
                ...data.map(row =>
                    headers.map(header => {
                        const value = row[header];
                        // Échapper les valeurs qui contiennent des virgules ou des guillemets
                        if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return String(value || '');
                    }).join(';')
                )
            ].join('\n');

            // Ajouter BOM pour Excel français
            const csvContent = '\ufeff' + csvData;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${filename}.csv`);

            message.success('Export CSV réussi !');
        } catch (error) {
            console.error('Erreur lors de l\'export CSV:', error);
            message.error('Erreur lors de l\'export CSV');
        } finally {
            setLoading(false);
        }
    };

    return {
        exportToExcel,
        exportToCSV,
        loading
    };
};
