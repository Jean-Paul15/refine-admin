import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../utility";
import SafeDatePicker from "../../components/SafeDatePicker";
import MDEditor from "@uiw/react-md-editor";
import type { Dayjs } from "dayjs";

export const ActionCreate = () => {
    const { formProps, saveButtonProps } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUploading, setImageUploading] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    // Initialiser la date de création par défaut
    useEffect(() => {
        const now = new Date();
        formProps.form?.setFieldsValue({
            created_at: now,
            title: generateTitle(now), // Titre généré automatiquement
        });
    }, [formProps.form]);

    // Fonction pour générer un titre basé sur la date
    const generateTitle = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return `Activité du ${date.toLocaleDateString('fr-FR', options)}`;
    };

    // Fonction pour gérer le changement de date
    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            const title = generateTitle(date.toDate());
            formProps.form?.setFieldsValue({ title });
        }
    };

    // Fonction pour supprimer l'image uploadée
    const deleteOldImage = async (imagePath: string) => {
        if (!imagePath) return;

        try {
            const { error } = await supabaseClient.storage
                .from('uploads')
                .remove([imagePath]);

            if (error) {
                console.warn('Erreur lors de la suppression de l\'image:', error);
            }
        } catch (error) {
            console.warn('Erreur lors de la suppression de l\'image:', error);
        }
    };

    // Fonction pour uploader l'image dans Supabase Storage
    const uploadImage = async (file: File) => {
        try {
            setImageUploading(true);

            // Supprimer l'ancienne image si elle existe
            if (currentImagePath) {
                await deleteOldImage(currentImagePath);
            }

            // Générer un nom de fichier unique
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `uploads/actions/${fileName}`;

            // Upload vers Supabase Storage
            const { error } = await supabaseClient.storage
                .from('uploads')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            // Récupérer l'URL publique
            const { data: { publicUrl } } = supabaseClient.storage
                .from('uploads')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
            setCurrentImagePath(filePath);
            formProps.form?.setFieldsValue({ image_url: publicUrl });
            message.success('Image téléchargée avec succès !');

            return publicUrl;
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            message.error('Erreur lors du téléchargement de l\'image');
            throw error;
        } finally {
            setImageUploading(false);
        }
    };

    // Fonction pour supprimer l'image actuelle
    const removeCurrentImage = async () => {
        if (currentImagePath) {
            await deleteOldImage(currentImagePath);
        }
        setImageUrl("");
        setCurrentImagePath("");
        formProps.form?.setFieldsValue({ image_url: null });
        message.success('Image supprimée');
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Date de création"
                    name={["created_at"]}
                    rules={[
                        {
                            required: true,
                            message: "La date de création est obligatoire",
                        },
                    ]}
                    help="Le titre sera généré automatiquement en fonction de cette date"
                >
                    <SafeDatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="Sélectionnez une date"
                        style={{ width: "100%" }}
                        onChange={handleDateChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Titre de l'activité"
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                            message: "Le titre est obligatoire",
                        },
                    ]}
                    help="Généré automatiquement à partir de la date, mais vous pouvez le modifier"
                >
                    <Input placeholder="Titre de l'activité" />
                </Form.Item>

                <Form.Item
                    label="Image de l'activité"
                    name={["image_url"]}
                    help="Téléchargez une image pour illustrer votre activité (optionnel)"
                >
                    <div>
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            accept="image/*"
                            customRequest={async ({ file, onSuccess, onError }) => {
                                try {
                                    await uploadImage(file as File);
                                    onSuccess && onSuccess("ok");
                                } catch (error) {
                                    onError && onError(error as Error);
                                }
                            }}
                            onRemove={removeCurrentImage}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={imageUploading}
                                disabled={imageUploading}
                            >
                                {imageUploading ? "Téléchargement..." : "Choisir une image"}
                            </Button>
                        </Upload>
                        {imageUrl && (
                            <div style={{ marginTop: "8px" }}>
                                <img
                                    src={imageUrl}
                                    alt="Aperçu"
                                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                                />
                                <br />
                                <Button
                                    size="small"
                                    danger
                                    style={{ marginTop: "8px" }}
                                    onClick={removeCurrentImage}
                                >
                                    Supprimer l'image
                                </Button>
                            </div>
                        )}
                    </div>
                </Form.Item>

                <Form.Item
                    label="Contenu de l'activité"
                    name={["full_content"]}
                    help="Décrivez l'activité en détail"
                >
                    <MDEditor
                        data-color-mode="light"
                        preview="edit"
                        hideToolbar={false}
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};
