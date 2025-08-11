import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { message } from 'antd';

interface ExportOptions {
    filename?: string;
    sheetName?: string;
}

interface ExportData {
    [key: string]: string | number | boolean | Date | null;
}

export const useExport = () => {
    const [loading, setLoading] = useState(false);

    const exportToExcel = async (data: ExportData[], options: ExportOptions = {}) => {
        try {
            setLoading(true);

            const {
                filename = 'export',
                sheetName = 'Données'
            } = options;

            // Créer un nouveau workbook
            const workbook = XLSX.utils.book_new();

            // Convertir les données en worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Ajouter le worksheet au workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Générer le fichier Excel
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Créer un blob et télécharger
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

            // Convertir les données en CSV
            const worksheet = XLSX.utils.json_to_sheet(data);
            const csvContent = XLSX.utils.sheet_to_csv(worksheet);

            // Créer un blob et télécharger
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
