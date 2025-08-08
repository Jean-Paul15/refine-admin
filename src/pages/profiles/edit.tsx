import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const ProfileEdit = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Email"
                    name={["email"]}
                    rules={[
                        {
                            required: true,
                            type: "email",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Prénom"
                    name={["first_name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Nom"
                    name={["last_name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Rôle"
                    name={["role"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={[
                            { value: "user", label: "Utilisateur" },
                            { value: "admin", label: "Administrateur" },
                            { value: "editor", label: "Éditeur" },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
