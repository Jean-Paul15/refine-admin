import { BooleanField, DateField, Show, TextField } from "@refinedev/antd";
import { useShow, useOne } from "@refinedev/core";
import { Typography, Image } from "antd";

const { Title } = Typography;

export const ArticleShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    const { data: authorData, isLoading: authorIsLoading } = useOne({
        resource: "profiles",
        id: record?.author_id || "",
        queryOptions: {
            enabled: !!record?.author_id,
        },
    });

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Titre</Title>
            <TextField value={record?.title} />
            <Title level={5}>Slug</Title>
            <TextField value={record?.slug} />
            {record?.image_url && (
                <>
                    <Title level={5}>Image</Title>
                    <Image src={record?.image_url} alt={record?.title} width={200} />
                </>
            )}
            <Title level={5}>Date de publication</Title>
            {record?.published_date ? (
                <DateField value={record?.published_date} />
            ) : (
                <TextField value="Non définie" />
            )}
            <Title level={5}>Description courte</Title>
            <TextField value={record?.short_description} />
            <Title level={5}>Contenu</Title>
            <div dangerouslySetInnerHTML={{ __html: record?.content || "" }} />
            <Title level={5}>Auteur</Title>
            {authorIsLoading ? (
                <TextField value="Chargement..." />
            ) : (
                <TextField
                    value={
                        authorData?.data
                            ? `${authorData.data.first_name} ${authorData.data.last_name}`
                            : "Aucun auteur"
                    }
                />
            )}
            <Title level={5}>Publié</Title>
            <BooleanField value={record?.is_published} />
            <Title level={5}>Créé le</Title>
            <DateField value={record?.created_at} />
            <Title level={5}>Mis à jour le</Title>
            <DateField value={record?.updated_at} />
        </Show>
    );
};
