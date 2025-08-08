import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Switch, Select, Upload, message, Button, Modal } from "antd";
import { InboxOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import MDEditor from '@uiw/react-md-editor';
import { supabaseClient } from "../../utility";
import SafeDatePicker from "../../components/SafeDatePicker";

const { Dragger } = Upload;
const { TextArea } = Input;

export const ArticleEditEnhanced = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentImagePath, setCurrentImagePath] = useState<string>("");

    const { selectProps: profileSelectProps } = useSelect({
        resource: "profiles",
        optionLabel: (item: any) => `${item.first_name} ${item.last_name}`,
        optionValue: (item: any) => item.id,
    });

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

        if (queryResult?.data?.data?.content) {
            setContent(queryResult.data.data.content);
        }
    }, [queryResult?.data?.data]);

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

    // Fonction pour générer automatiquement le slug
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

    // Fonction d'upload vers Supabase Storage
    const uploadToSupabase = async (file: File) => {
        setUploading(true);
        try {
            // Supprimer l'ancienne image si elle existe
            if (currentImagePath) {
                await deleteOldImage(currentImagePath);
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `uploads/articles/${fileName}`;

            const { data, error } = await supabaseClient.storage
                .from('uploads')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            // Obtenir l'URL publique
            const { data: { publicUrl } } = supabaseClient.storage
                .from('uploads')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
            setCurrentImagePath(filePath);
            formProps.form?.setFieldsValue({ image_url: publicUrl });
            message.success('Image uploadée avec succès !');

        } catch (error: any) {
            message.error(`Erreur d'upload: ${error.message}`);
        } finally {
            setUploading(false);
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

    // Fonction de prévisualisation
    const showPreview = () => {
        const formData = formProps.form?.getFieldsValue();
        setPreviewVisible(true);
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: 'image/*',
        showUploadList: false,
        customRequest: ({ file }: any) => {
            uploadToSupabase(file as File);
        },
        onChange(info: any) {
            // Géré par customRequest
        },
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
                        {
                            min: 3,
                            message: "Le titre doit contenir au moins 3 caractères",
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
                        {
                            pattern: /^[a-z0-9-]+$/,
                            message: "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets",
                        },
                    ]}
                    help="Généré automatiquement à partir du titre. Vous pouvez le modifier."
                >
                    <Input
                        placeholder="slug-de-larticle"
                        addonBefore="/"
                    />
                </Form.Item>

                <Form.Item
                    label="URL de l'image"
                    name={["image_url"]}
                    help="URL directe de l'image ou utilisez l'upload ci-dessous"
                >
                    <Input
                        placeholder="https://exemple.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Télécharger une image">
                    <Dragger {...uploadProps} disabled={uploading}>
                        <p className="ant-upload-drag-icon">
                            {uploading ? <UploadOutlined spin /> : <InboxOutlined />}
                        </p>
                        <p className="ant-upload-text">
                            {uploading ? 'Téléchargement en cours...' : 'Cliquez ou glissez un fichier dans cette zone pour le télécharger'}
                        </p>
                        <p className="ant-upload-hint">
                            Formats supportés: JPG, PNG, GIF (max 5MB)
                        </p>
                    </Dragger>
                    {imageUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={imageUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
                            <br />
                            <Button
                                size="small"
                                danger
                                style={{ marginTop: '8px' }}
                                onClick={removeCurrentImage}
                            >
                                Supprimer l'image
                            </Button>
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    label="Date de publication"
                    name={["published_date"]}
                >
                    <SafeDatePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder="Sélectionnez une date"
                    />
                </Form.Item>

                <Form.Item
                    label="Description courte"
                    name={["short_description"]}
                    rules={[
                        {
                            max: 300,
                            message: "La description ne peut pas dépasser 300 caractères",
                        },
                    ]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Description courte qui apparaîtra dans les aperçus"
                        showCount
                        maxLength={300}
                    />
                </Form.Item>

                <Form.Item
                    label="Contenu de l'article"
                    name={["content"]}
                    rules={[
                        {
                            required: true,
                            message: "Le contenu de l'article est obligatoire",
                        },
                    ]}
                >
                    <MDEditor
                        value={content}
                        onChange={(val) => {
                            setContent(val || "");
                            formProps.form?.setFieldsValue({ content: val });
                        }}
                        preview="edit"
                        height={400}
                        data-color-mode="light"
                    />
                </Form.Item>

                <Form.Item
                    label="Auteur de l'article"
                    name={["author_id"]}
                    rules={[
                        {
                            required: true,
                            message: "Veuillez sélectionner un auteur pour l'article",
                        },
                    ]}
                >
                    <Select
                        {...profileSelectProps}
                        placeholder="Sélectionnez l'auteur de l'article"
                    />
                </Form.Item>

                <Form.Item
                    label="Publier l'article"
                    name={["is_published"]}
                    valuePropName="checked"
                    extra="Activez cette option pour rendre l'article visible au public"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Switch />
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={showPreview}
                        >
                            Prévisualiser
                        </Button>
                    </div>
                </Form.Item>
            </Form>

            {/* Modal de prévisualisation */}
            <Modal
                title="Aperçu de l'article"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                width={800}
                footer={null}
            >
                <div style={{ padding: '20px' }}>
                    <h1>{formProps.form?.getFieldValue('title')}</h1>
                    {formProps.form?.getFieldValue('image_url') && (
                        <img
                            src={formProps.form?.getFieldValue('image_url')}
                            alt="Article"
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }}
                        />
                    )}
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                        {formProps.form?.getFieldValue('short_description')}
                    </p>
                    <MDEditor.Markdown
                        source={formProps.form?.getFieldValue('content')}
                        style={{ whiteSpace: 'pre-wrap' }}
                    />
                </div>
            </Modal>
        </Edit>
    );
};
