import {
    BooleanField,
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { BaseRecord, useNotification } from "@refinedev/core";
import { Space, Table, Button, Upload, message, Modal } from "antd";
import { DownloadOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { supabaseClient } from "../../utility";
import { useState } from "react";

const { confirm } = Modal;

export const NewsletterSubscriberListEnhanced = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const { open } = useNotification();
    const [importing, setImporting] = useState(false);

    // Fonction d'export CSV
    const exportToCSV = () => {
        const data = tableProps.dataSource || [];

        // Préparer les données pour l'export
        const csvData = data.map((item: any) => ({
            Email: item.email,
            'Date d\'inscription': new Date(item.subscribed_at).toLocaleDateString('fr-FR'),
            'Statut': item.is_active ? 'Actif' : 'Inactif',
        }));

        // Convertir en CSV
        const csv = Papa.unparse(csvData, {
            delimiter: ';', // Point-virgule pour Excel français
            header: true,
        });

        // Télécharger le fichier
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);

        open?.({
            type: "success",
            message: "Export réussi",
            description: "Les abonnés ont été exportés avec succès.",
        });
    };

    // Fonction d'export Excel (format CSV compatible Excel)
    const exportToExcel = () => {
        const data = tableProps.dataSource || [];

        const excelData = data.map((item: any) => ({
            'Email': item.email,
            'Date d\'inscription': new Date(item.subscribed_at).toLocaleDateString('fr-FR'),
            'Heure d\'inscription': new Date(item.subscribed_at).toLocaleTimeString('fr-FR'),
            'Statut': item.is_active ? 'Actif' : 'Inactif',
            'ID': item.id,
        }));

        const csv = Papa.unparse(excelData, {
            delimiter: ';',
            header: true,
        });

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `newsletter-subscribers-detail-${new Date().toISOString().split('T')[0]}.csv`);

        open?.({
            type: "success",
            message: "Export Excel réussi",
            description: "Les données détaillées ont été exportées au format Excel.",
        });
    };

    // Fonction d'import CSV
    const handleImport = (file: File) => {
        setImporting(true);

        Papa.parse(file, {
            header: true,
            delimiter: ';',
            complete: async (results) => {
                try {
                    const validEmails: string[] = [];
                    const errors: string[] = [];

                    // Valider les emails
                    results.data.forEach((row: any, index: number) => {
                        const email = row.Email || row.email || row.EMAIL;
                        if (email && /\S+@\S+\.\S+/.test(email)) {
                            validEmails.push(email);
                        } else {
                            errors.push(`Ligne ${index + 1}: Email invalide "${email}"`);
                        }
                    });

                    if (errors.length > 0) {
                        Modal.warning({
                            title: 'Erreurs détectées',
                            content: (
                                <div>
                                    <p>Les erreurs suivantes ont été détectées :</p>
                                    <ul>
                                        {errors.slice(0, 5).map((error, i) => (
                                            <li key={i}>{error}</li>
                                        ))}
                                        {errors.length > 5 && <li>... et {errors.length - 5} autres erreurs</li>}
                                    </ul>
                                    <p>Emails valides détectés : {validEmails.length}</p>
                                </div>
                            ),
                        });
                    }

                    if (validEmails.length > 0) {
                        confirm({
                            title: 'Confirmer l\'import',
                            icon: <ExclamationCircleOutlined />,
                            content: `Voulez-vous importer ${validEmails.length} email(s) ?`,
                            onOk: async () => {
                                // Préparer les données pour Supabase
                                const subscribersData = validEmails.map(email => ({
                                    email,
                                    subscribed_at: new Date().toISOString(),
                                    is_active: true,
                                }));

                                // Insérer dans Supabase
                                const { data, error } = await supabaseClient
                                    .from('newsletter_subscribers')
                                    .upsert(subscribersData, {
                                        onConflict: 'email',
                                        ignoreDuplicates: true
                                    });

                                if (error) {
                                    throw error;
                                }

                                open?.({
                                    type: "success",
                                    message: "Import réussi",
                                    description: `${validEmails.length} abonnés ont été importés avec succès.`,
                                });

                                // Rafraîchir la table
                                window.location.reload();
                            },
                        });
                    }
                } catch (error: any) {
                    open?.({
                        type: "error",
                        message: "Erreur d'import",
                        description: error.message,
                    });
                } finally {
                    setImporting(false);
                }
            },
            error: (error) => {
                open?.({
                    type: "error",
                    message: "Erreur de lecture du fichier",
                    description: error.message,
                });
                setImporting(false);
            }
        });

        return false; // Empêcher l'upload automatique
    };

    const uploadProps = {
        accept: '.csv,.xlsx,.xls',
        showUploadList: false,
        beforeUpload: handleImport,
    };

    return (
        <List
            headerButtons={({ defaultButtons }) => (
                <>
                    {defaultButtons}
                    <Space>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={exportToCSV}
                        >
                            Export CSV
                        </Button>
                        <Button
                            type="default"
                            icon={<DownloadOutlined />}
                            onClick={exportToExcel}
                        >
                            Export Excel
                        </Button>
                        <Upload {...uploadProps}>
                            <Button
                                icon={<UploadOutlined />}
                                loading={importing}
                            >
                                {importing ? 'Import...' : 'Import CSV'}
                            </Button>
                        </Upload>
                    </Space>
                </>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" width={80} />
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column
                    dataIndex="is_active"
                    title="Actif"
                    render={(value: boolean) => <BooleanField value={value} />}
                    width={100}
                />
                <Table.Column
                    dataIndex={["subscribed_at"]}
                    title="Inscrit le"
                    render={(value: any) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
                    width={150}
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                    width={120}
                />
            </Table>
        </List>
    );
};
