import { Input, FormFeedback, Label, InputGroup, Col } from 'reactstrap';

type InputType = 'text' | 'number' | 'password' | 'textarea';

type FormInputGroupProps = {
  fieldName: string;
  label: string;
  type: InputType;
  value: string;
  md?: string;
  id?: string;
  hasValidation?: boolean;
  inputError?: string;
  placeholder?: string;
  classNameGroup?: string;
  classNameInput?: string;
  classNameInputIcon?: string;
  textArea?: boolean;
  textAreaRowNumber?: number;
  invalid?: boolean;
  onChange?: (ev: React.ChangeEvent<any>) => void;
  onBlur?: (ev: any) => void;
}

const FormGroup: React.FC<FormInputGroupProps> = (props) => {
  return (
    <Col md={props.md || "12"}>
      <Label className="form-label">{props.label}</Label>
      <InputGroup className={props.classNameGroup}>
        {props.classNameInputIcon && (
          <span className="input-group-text border-light text-muted">
            <i className={props.classNameInputIcon}></i>
          </span>
        )}
        <Input
          type={props.type}
          id={props.id}
          name={props.fieldName}
          rows={(props.textArea && props.textAreaRowNumber) ? props.textAreaRowNumber : undefined}
          className={props.classNameInput}
          placeholder={props.placeholder || ""}
          onChange={props.onChange}
          onBlur={props.onBlur}
          value={props.value}
          invalid={props.invalid}
        />
        {props.invalid && (
          <FormFeedback>{props.inputError as any}</FormFeedback>
        )}
      </InputGroup>
    </Col>
  )
}

export default FormGroup;