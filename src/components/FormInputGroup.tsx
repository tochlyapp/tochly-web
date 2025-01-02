import React from 'react';
import { Input, FormFeedback, Label, InputGroup, Col } from 'reactstrap';
import classNames from 'classnames';

type InputType = 'text' | 'number' | 'password' | 'textarea';

type FormInputGroupProps = {
  fieldName: string;
  label: string;
  type: string;
  value: string | number;
  md?: string;
  id?: string;
  hasValidation?: boolean;
  inputError?: string;
  placeholder?: string;
  classNameGroup?: string;
  classNameInput?: string;
  classNameInputIcon?: string;
  textAreaRowNumber?: number;
  invalid?: boolean;
  onChange?: (ev: React.ChangeEvent<any>) => void;
  onBlur?: (ev: any) => void;
};

const FormIputGroup: React.FC<FormInputGroupProps> = ({
  fieldName,
  label,
  type,
  value,
  md = "12",
  id,
  inputError,
  placeholder = "",
  classNameGroup,
  classNameInput,
  classNameInputIcon,
  textAreaRowNumber = 3,
  invalid,
  onChange = () => {},
  onBlur = () => {},
}) => {
  const inputId = id || fieldName;
  const inputClass = classNames('form-control', classNameInput, {
    'is-invalid': invalid,
  });

  return (
    <Col md={md}>
      <Label className="form-label" htmlFor={inputId}>{label}</Label>
      <InputGroup className={classNameGroup}>
        {classNameInputIcon && (
          <span className="input-group-text border-light text-muted">
            <i role="icon" className={classNameInputIcon}></i>
          </span>
        )}
        <Input
          type={type as InputType}
          id={inputId}
          name={fieldName}
          rows={type === "textarea" ? textAreaRowNumber : undefined}
          className={inputClass}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          invalid={invalid}
        />
        {invalid && <FormFeedback>{inputError}</FormFeedback>}
      </InputGroup>
    </Col>
  );
};

export default FormIputGroup;
