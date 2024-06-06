import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { FormInputError } from '@/app/types';


type FormGroupProps = {
  fieldName: string;
  label: string;
  type: string;
  md: string;
  hasValidation?: boolean;
  register?: any;
  inputError?: FormInputError;
  placeholder?: string;
  classNameGroup?: string;
  classNameInput?: string;
  classNameInputIcon?: string;
  textArea?: boolean;
  textAreaRowNumber?: number;
}

const FormGroup: React.FC<FormGroupProps> = (props) => {
  return (
    <Form.Group as={Col} md={props.md} controlId={props.fieldName}>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup
        className={props.classNameGroup || 'input-group bg-soft-light rounded-3 mb-3'}
        hasValidation={props.hasValidation || false}
      >
        {props.classNameInputIcon && (
          <span className='input-group-text text-muted'>
            <i className={props.classNameInputIcon} />
          </span>
        )}
        <Form.Control
          {...props.register}
          as={props.textArea ? 'textarea' : undefined}
          rows={(props.textArea && props.textAreaRowNumber) ? props.textAreaRowNumber : undefined}
          type={props.type}
          placeholder={props.placeholder}
          isInvalid={props.inputError ? true : false}
          className={props.classNameInput}
        />
        {props.inputError && (
          <Form.Control.Feedback type='invalid'>
            {props.inputError.message}
          </Form.Control.Feedback>
        )}
      </InputGroup>
    </Form.Group>
  )
}

export default FormGroup;
