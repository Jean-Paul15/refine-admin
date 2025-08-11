import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, InputNumber, Card, Row, Col } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function DonsEngagementsCreate() {
    const { formProps, saveButtonProps } = useForm({
        resource: "formulaire_contact",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Card title="Informations Personnelles" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Nom Complet"
                                name={["nom_complet"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Le nom complet est requis",
                                    },
                                ]}
                            >
                                <Input placeholder="Nom complet" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Email"
                                name={["email"]}
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: "Veuillez entrer un email valide",
                                    },
                                ]}
                            >
                                <Input placeholder="email@exemple.com" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Téléphone"
                                name={["telephone"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Le téléphone est requis",
                                    },
                                ]}
                            >
                                <Input placeholder="+33 1 23 45 67 89" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Pays"
                                name={["pays"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Le pays est requis",
                                    },
                                ]}
                            >
                                <Input placeholder="France" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title="Informations de Don" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Montant (XAF)"
                                name={["montant"]}
                            >
                                <InputNumber
                                    placeholder="0"
                                    min={0}
                                    precision={0}
                                    style={{ width: '100%' }}
                                    addonBefore="XAF"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Type de don"
                                name={["est_engagement"]}
                                valuePropName="checked"
                                initialValue={false}
                            >
                                <Switch
                                    checkedChildren="Engagement régulier"
                                    unCheckedChildren="Don ponctuel"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label="Statut"
                                name={["statut"]}
                                initialValue="nouveau"
                                rules={[
                                    {
                                        required: true,
                                        message: "Le statut est requis",
                                    },
                                ]}
                            >
                                <Select placeholder="Sélectionner un statut">
                                    <Option value="nouveau">Nouveau</Option>
                                    <Option value="contacte">Contacté</Option>
                                    <Option value="traite">Traité</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title="Message">
                    <Form.Item
                        label="Message"
                        name={["message"]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Message ou demande spécifique..."
                        />
                    </Form.Item>
                </Card>
            </Form>
        </Create>
    );
}
