import { Edit, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Switch, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../utility";
import SafeDatePicker from "../../components/SafeDatePicker";

export const ArticleEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm({
        onMutationSuccess: () => {
            message.success('Article mis à jour avec succès !');
        },
        onMutationError: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            message.error('Erreur lors de la mise à jour de l\'article');
        },
        // Transformer les données avant soumission
        redirect: false,
    });
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUploading, setImageUploading] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    const { selectProps: profileSelectProps } = useSelect({
        resource: "profiles",
        optionLabel: (item: any) => `${item.first_name} ${item.last_name}`,
        optionValue: (item: any) => item.id,
    });

    // Charger l'image existante et initialiser les valeurs du formulaire
    useEffect(() => {
        if (queryResult?.data?.data) {
            const articleData = queryResult.data.data;

            // Gérer l'image
            if (articleData.image_url) {
                const imageUrl = articleData.image_url;
                setImageUrl(imageUrl);

                // Extraire le chemin de l'image pour pouvoir la supprimer plus tard
                const urlParts = imageUrl.split('/uploads/');
                if (urlParts.length > 1) {
                    setCurrentImagePath(`uploads/${urlParts[1]}`);
                }
            }

            // Initialiser les valeurs du formulaire avec gestion de la date
            const formValues = {
                ...articleData,
                published_date: articleData.published_date ? new Date(articleData.published_date) : new Date(), // Valeur par défaut si pas de date
            };

            formProps.form?.setFieldsValue(formValues);
        }
    }, [queryResult?.data?.data, formProps.form]);

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

    // Générer un slug automatiquement
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer accents
            .replace(/[^a-z0-9\s-]/g, '') // Supprimer caractères spéciaux
            .trim()
            .replace(/\s+/g, '-') // Remplacer espaces par tirets
            .replace(/-+/g, '-'); // Supprimer tirets multiples
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
            const filePath = `uploads/articles/${fileName}`;

            // Upload vers Supabase Storage
            const { data, error } = await supabaseClient.storage
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

    // Gestion du changement de titre pour générer le slug
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = generateSlug(title);
        formProps.form?.setFieldsValue({ slug });
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
                    label="Titre de l'article"
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                            message: "Le titre est obligatoire",
                        },
                    ]}
                >
                    <Input
                        placeholder="Saisissez le titre de l'article"
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
                    <Input placeholder="slug-de-l-article" />
                </Form.Item>

                <Form.Item
                    label="Image de l'article"
                    name={["image_url"]}
                    help="Téléchargez une image pour illustrer votre article"
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
                    help="Résumé de l'article qui apparaîtra dans les listes"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Brève description de l'article..."
                        maxLength={300}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    label="Contenu complet"
                    name={["content"]}
                    help="Utilisez l'éditeur pour rédiger votre article"
                >
                    <MDEditor
                        data-color-mode="light"
                        preview="edit"
                        hideToolbar={false}
                    />
                </Form.Item>

                <Form.Item
                    label="Auteur"
                    name={["author_id"]}
                    rules={[
                        {
                            required: true,
                            message: "L'auteur est obligatoire",
                        },
                    ]}
                >
                    <Select
                        {...profileSelectProps}
                        placeholder="Sélectionnez un auteur"
                        showSearch
                        filterOption={(input, option) =>
                            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="Date de publication"
                    name={["published_date"]}
                    help="Laissez vide pour utiliser la date actuelle"
                >
                    <SafeDatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="Sélectionnez une date"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Statut de publication"
                    name={["is_published"]}
                    valuePropName="checked"
                    help="Activez pour rendre l'article visible"
                >
                    <Switch
                        checkedChildren="Publié"
                        unCheckedChildren="Brouillon"
                    />
                </Form.Item>

                <Form.Item
                    label="Article épinglé"
                    name={["is_featured"]}
                    valuePropName="checked"
                    help="Activez pour mettre en avant cet article"
                >
                    <Switch
                        checkedChildren="Épinglé"
                        unCheckedChildren="Normal"
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
