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
    // Conversion sécurisée de la valeur: string | Date | Dayjs -> Dayjs | null
    let tmp: Dayjs | null = null;
    if (value) {
        if (typeof value === "string") {
            tmp = dayjs(value);
        } else if (dayjs.isDayjs(value)) {
            tmp = value as Dayjs;
        } else if (typeof value === 'object' && value !== null && 'getTime' in (value as unknown as { getTime: () => number })) {
            tmp = dayjs(value as unknown as Date);
        }
    }

    const validValue = tmp && tmp.isValid() ? tmp : null;

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
