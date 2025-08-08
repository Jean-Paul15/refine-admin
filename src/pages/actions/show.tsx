import { BooleanField, DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag } from "antd";

const { Title } = Typography;

export const ActionShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

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
            <Title level={5}>Type</Title>
            <Tag color={
                record?.type === "principale" ? "red" :
                    record?.type === "carrousel" ? "blue" :
                        record?.type === "passée" ? "gray" : "default"
            }>
                {record?.type}
            </Tag>
            <Title level={5}>Description</Title>
            <TextField value={record?.description} />
            <Title level={5}>Contenu complet</Title>
            <div dangerouslySetInnerHTML={{ __html: record?.full_content || "" }} />
            <Title level={5}>Active</Title>
            <BooleanField value={record?.is_active} />
            <Title level={5}>Créé le</Title>
            <DateField value={record?.created_at} />
            <Title level={5}>Mis à jour le</Title>
            <DateField value={record?.updated_at} />
        </Show>
    );
};
