import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, message, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../utility";
import MDEditor from "@uiw/react-md-editor";

export const EngagementEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUploading, setImageUploading] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    // Charger l'image existante et initialiser les valeurs du formulaire
    useEffect(() => {
        if (queryResult?.data?.data) {
            const engagementData = queryResult.data.data;

            // Gérer l'image
            if (engagementData.image_url) {
                const imageUrl = engagementData.image_url;
                setImageUrl(imageUrl);

                // Extraire le chemin de l'image pour pouvoir la supprimer plus tard
                const urlParts = imageUrl.split('/uploads/');
                if (urlParts.length > 1) {
                    setCurrentImagePath(`uploads/${urlParts[1]}`);
                }
            }

            // Initialiser les valeurs du formulaire
            formProps.form?.setFieldsValue(engagementData);
        }
    }, [queryResult?.data?.data, formProps.form]);

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
            const filePath = `uploads/engagements/${fileName}`;

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
                    label="Titre de l'engagement"
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                            message: "Le titre est obligatoire",
                        },
                    ]}
                >
                    <Input placeholder="Titre de l'engagement" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name={["description"]}
                    rules={[
                        {
                            required: true,
                            message: "La description est obligatoire",
                        },
                    ]}
                    help="Décrivez en détail cet engagement"
                >
                    <MDEditor
                        data-color-mode="light"
                        preview="edit"
                        hideToolbar={false}
                        visibleDragbar={false}
                    />
                </Form.Item>

                <Form.Item
                    label="Image de l'engagement"
                    name={["image_url"]}
                    rules={[
                        {
                            required: true,
                            message: "Une image est obligatoire",
                        },
                    ]}
                    help="Téléchargez une image pour illustrer cet engagement"
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
                            <Button icon={<UploadOutlined />} loading={imageUploading}>
                                {imageUploading ? 'Téléchargement...' : 'Sélectionner une image'}
                            </Button>
                        </Upload>

                        {imageUrl && (
                            <div style={{ marginTop: 10 }}>
                                <img
                                    src={imageUrl}
                                    alt="Aperçu"
                                    style={{
                                        maxWidth: 200,
                                        maxHeight: 150,
                                        objectFit: 'cover',
                                        borderRadius: 4
                                    }}
                                />
                                <br />
                                <Button
                                    type="link"
                                    danger
                                    onClick={removeCurrentImage}
                                    style={{ padding: 0, marginTop: 5 }}
                                >
                                    Supprimer cette image
                                </Button>
                            </div>
                        )}
                    </div>
                </Form.Item>

                <Form.Item
                    label="Statut d'activation"
                    name={["is_active"]}
                    valuePropName="checked"
                    help="Activez pour rendre cet engagement visible sur le site"
                >
                    <Switch
                        checkedChildren="Actif"
                        unCheckedChildren="Inactif"
                    />
                </Form.Item>

                <Form.Item
                    label="Ordre d'affichage"
                    help="L'ordre est calculé automatiquement en fonction de la date de création. Plus ancien = ordre plus petit = affiché en premier."
                >
                    <Input
                        value={queryResult?.data?.data?.ordre || 'Calculé automatiquement'}
                        disabled
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
