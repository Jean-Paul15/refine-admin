import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Switch, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { supabaseClient } from "../../utility";
import SafeDatePicker from "../../components/SafeDatePicker";

export const ArticleCreate = () => {
    const { formProps, saveButtonProps } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUploading, setImageUploading] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    const { selectProps: profileSelectProps } = useSelect({
        resource: "profiles",
        optionLabel: (item: any) => `${item.first_name} ${item.last_name}`,
        optionValue: (item: any) => item.id,
    });

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

    // Fonction pour générer un slug à partir du titre
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ýÿ]/g, 'y')
            .replace(/[ñ]/g, 'n')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '') // Supprimer caractères spéciaux
            .replace(/\s+/g, '-') // Remplacer espaces par tirets
            .replace(/-+/g, '-'); // Supprimer tirets multiples
    };

    // Fonction pour uploader l'image dans Supabase Storage
    const uploadImage = async (file: File) => {
        try {
            setImageUploading(true);

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
        if (title) {
            const slug = generateSlug(title);
            formProps.form?.setFieldsValue({ slug });
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
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Titre"
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
                    label="Date de publication"
                    name={["published_date"]}
                    help="Laissez vide pour publier immédiatement"
                >
                    <SafeDatePicker
                        placeholder="Sélectionnez une date"
                        style={{ width: "100%" }}
                    />
                </Form.Item>
                <Form.Item
                    label="Description courte"
                    name={["short_description"]}
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
                    label="Contenu de l'article"
                    name={["content"]}
                    rules={[
                        {
                            required: true,
                            message: "Le contenu est obligatoire",
                        },
                    ]}
                    help="Rédigez votre article avec l'éditeur riche"
                >
                    <MDEditor data-color-mode="light" />
                </Form.Item>
                <Form.Item
                    label="Auteur"
                    name={["author_id"]}
                    help="Sélectionnez l'auteur de l'article"
                >
                    <Select
                        {...profileSelectProps}
                        placeholder="Choisissez un auteur"
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    label="Statut de publication"
                    name={["is_published"]}
                    valuePropName="checked"
                    help="Activez pour publier l'article immédiatement"
                >
                    <Switch
                        checkedChildren="Publié"
                        unCheckedChildren="Brouillon"
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};
