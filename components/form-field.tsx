import React, { useState, FormEvent } from "react";
import { styled } from "styled-components";

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

interface LabelProps {
  hasValue: boolean;
}
const Label = styled.label<LabelProps>`
  position: absolute;
  top: ${(props) => (props.hasValue ? '-12px' : '12px')};
  left: ${(props) => (props.hasValue ? '0px' : '12px')};
  color: ${(props) => (props.hasValue ? '#888' : '#555')};
  transition:  top 0.2s, font-size 0.2s, color 0.2s;
  pointer-events: none;
  font-size: ${(props) => (props.hasValue ? '14px' : '16px')};
`;

const Input = styled.input`
  width: 300px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height:32px;
  margin-top:6px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

const HelpText = styled.p`
  font-size: 13px;
  color: #888;
  margin-top: 8px;
  word-wrap: break-word;
  width: 300px;
`;

interface FormFieldProps {
  value: string;
  label: string;
  help: string;
  onChange: any;
}
const FormField: React.FC<FormFieldProps> = ({ value, label, help, onChange }) => {
  return (
    <InputContainer>
      <Label hasValue={value.length > 0}>{label}</Label>
      <Input type="text" value={value} onChange={onChange} />
      <HelpText>{help}</HelpText>
    </InputContainer>
  )
}

export default FormField;