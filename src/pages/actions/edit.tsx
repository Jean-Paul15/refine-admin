import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../utility/supabaseClient";

export const ActionEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    // Charger l'image existante
    useEffect(() => {
        if (queryResult?.data?.data?.image_url) {
            const imageUrl = queryResult.data.data.image_url;
            setImageUrl(imageUrl);

            // Extraire le chemin de l'image pour pouvoir la supprimer plus tard
            const urlParts = imageUrl.split('/uploads/');
            if (urlParts.length > 1) {
                setCurrentImagePath(`uploads/${urlParts[1]}`);
            }
        }
    }, [queryResult?.data?.data?.image_url]);

    // Fonction pour supprimer l'ancienne image
    const deleteOldImage = async (imagePath: string) => {
        if (!imagePath) return;

        try {
            const { error } = await supabaseClient.storage
                .from('uploads')
                .remove([imagePath]);

            if (error) {
                console.warn('Erreur lors de la suppression de l\'ancienne image:', error);
            }
        } catch (error) {
            console.warn('Erreur lors de la suppression de l\'ancienne image:', error);
        }
    };

    // Générer automatiquement le slug à partir du titre
    const generateSlug = (title: string): string => {
        if (!title) return "";

        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
            .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
            .trim()
            .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
            .replace(/-+/g, "-") // Éviter les tirets multiples
            .slice(0, 50); // Limiter à 50 caractères
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = generateSlug(title);
        formProps.form?.setFieldsValue({ slug });
    };

    // Fonction pour uploader une image vers Supabase Storage
    const uploadImage = async (file: File) => {
        setImageUploading(true);
        try {
            // Supprimer l'ancienne image si elle existe
            if (currentImagePath) {
                await deleteOldImage(currentImagePath);
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/actions/${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('uploads')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabaseClient.storage
                .from('uploads')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
            setCurrentImagePath(filePath);
            formProps.form?.setFieldsValue({ image_url: publicUrl });
            message.success("Image téléchargée avec succès !");
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            message.error("Erreur lors du téléchargement de l'image");
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
        formProps.form?.setFieldsValue({ image_url: "" });
        message.success("Image supprimée avec succès !");
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Titre de l'action"
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                            message: "Le titre est obligatoire",
                        },
                    ]}
                >
                    <Input
                        placeholder="Saisissez le titre de l'action"
                        onChange={handleTitleChange}
                    />
                </Form.Item>
                <Form.Item
                    label="Slug (URL)"
                    name={["slug"]}
                    rules={[
                        {
                            required: true,
                            message: "Le slug est obligatoire",
                        },
                    ]}
                    help="Généré automatiquement à partir du titre. Vous pouvez le modifier."
                >
                    <Input placeholder="slug-de-l-action" />
                </Form.Item>
                <Form.Item
                    label="Image de l'action"
                    name={["image_url"]}
                    help="Téléchargez une image pour illustrer votre action"
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
                    label="Description courte"
                    name={["description"]}
                    help="Résumé de l'action qui apparaîtra dans les listes"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Brève description de l'action..."
                        maxLength={300}
                        showCount
                    />
                </Form.Item>
                <Form.Item
                    label="Contenu complet"
                    name={["full_content"]}
                    help="Description détaillée de l'action"
                >
                    <Input.TextArea
                        rows={10}
                        placeholder="Description complète de l'action..."
                        maxLength={2000}
                        showCount
                    />
                </Form.Item>
                <Form.Item
                    label="Type d'action"
                    name={["type"]}
                    help="Catégorisez votre action selon son statut"
                >
                    <Select
                        placeholder="Sélectionnez un type"
                        allowClear
                        options={[
                            { value: "carrousel", label: "Carrousel (mise en avant)" },
                            { value: "principale", label: "Principale (en cours)" },
                            { value: "passée", label: "Passée (archive)" },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Statut de l'action"
                    name={["is_active"]}
                    valuePropName="checked"
                    help="Activez pour rendre l'action visible"
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
