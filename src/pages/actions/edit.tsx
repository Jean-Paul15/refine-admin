import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, message, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../utility";
import SafeDatePicker from "../../components/SafeDatePicker";
import MDEditor from "@uiw/react-md-editor";
import dayjs from "dayjs";

export const ActionEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUploading, setImageUploading] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    // Charger l'image existante et initialiser les valeurs du formulaire
    useEffect(() => {
        if (queryResult?.data?.data) {
            const actionData = queryResult.data.data;

            // Gérer l'image
            if (actionData.image_url) {
                const imageUrl = actionData.image_url;
                setImageUrl(imageUrl);

                // Extraire le chemin de l'image pour pouvoir la supprimer plus tard
                const urlParts = imageUrl.split('/uploads/');
                if (urlParts.length > 1) {
                    setCurrentImagePath(`uploads/${urlParts[1]}`);
                }
            }

            // Initialiser les valeurs du formulaire avec gestion de la date
            const formValues = {
                ...actionData,
                created_at: actionData.created_at ? new Date(actionData.created_at) : new Date(),
            };

            formProps.form?.setFieldsValue(formValues);
        }
    }, [queryResult?.data?.data, formProps.form]);

    // Fonction pour générer un titre basé sur la date
    const generateTitle = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long'
        };
        return date.toLocaleDateString('fr-FR', options).toUpperCase();
    };

    // Regénérer le titre dès que created_at change
    const createdAt = Form.useWatch(["created_at"], formProps.form);
    useEffect(() => {
        if (!createdAt) return;
        let d: Date | null = null;
        if (dayjs.isDayjs(createdAt)) d = createdAt.toDate();
        else if (createdAt instanceof Date) d = createdAt;
        else if (typeof createdAt === "string") d = new Date(createdAt);
        if (d && !isNaN(d.getTime())) {
            formProps.form?.setFieldsValue({ title: generateTitle(d) });
        }
    }, [createdAt, formProps.form]);

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
        <Edit saveButtonProps={saveButtonProps}>
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
                                {imageUploading ? "Téléchargement..." : "Changer l'image"}
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

                <Form.Item
                    label="Statut d'activité"
                    name={["is_active"]}
                    valuePropName="checked"
                    help="Activez pour rendre l'activité visible"
                >
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
