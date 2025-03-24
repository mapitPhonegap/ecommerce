/* eslint-disable react/forbid-prop-types */
import { useField } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import PhoneInput from 'react-phone-input-2';

const CustomMobileInput = ({ label, placeholder, defaultValue, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { touched, error } = meta;
  const { setValue } = helpers;

  const handleChange = (value, data) => {
    const mob = {
      dialCode: data?.dialCode || "",
      countryCode: data?.countryCode || "",
      country: data?.name || "",
      value: value || "",
    };

    setValue(mob); // Ensuring Formik gets an object
  };
  // Ensure `defaultValue` is always an object
  const safeDefaultValue = typeof defaultValue === "object" && defaultValue !== null
    ? defaultValue
    : { dialCode: "", countryCode: "", country: "", value: defaultValue || "" };

  return (
    <div className="input-group">
      {touched && error ? (
        <span className="label-input label-error">{error?.value || error?.dialCode}</span>
      ) : (
        <label className="label-input" htmlFor={field.name}>{label}</label>
      )}
      <PhoneInput
        name={field.name}
        country="my"
        inputClass="input-form d-block"
        style={{
          border: touched && error ? '1px solid red' : '1px solid #cacaca'
        }}
        inputExtraProps={{ required: true }}
        onChange={handleChange}
        placeholder={placeholder}
        value={safeDefaultValue.value}
      />
    </div>
  );
};

CustomMobileInput.defaultProps = {
  label: 'Mobile Number',
  placeholder: '0171234567',
  defaultValue: { dialCode: "", countryCode: "", country: "", value: "" }, // Ensuring a valid object
};

CustomMobileInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default CustomMobileInput;
