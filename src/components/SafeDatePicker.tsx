import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerProps } from "antd/es/date-picker";

interface SafeDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
    value?: string | Dayjs | null;
    onChange?: (date: Dayjs | null, dateString: string | string[]) => void;
}

export const SafeDatePicker: React.FC<SafeDatePickerProps> = ({
    value,
    onChange,
    ...props
}) => {
    // Conversion sécurisée de la valeur
    const safeValue = value ?
        (typeof value === 'string' ? dayjs(value) : value)
        : null;

    // Validation que la date est valide
    const validValue = safeValue && safeValue.isValid() ? safeValue : null;

    const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
        if (onChange) {
            onChange(date, dateString);
        }
    };

    return (
        <DatePicker
            {...props}
            value={validValue}
            onChange={handleChange}
        />
    );
};

export default SafeDatePicker;
