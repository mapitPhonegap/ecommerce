import { ArrowLeftOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { CustomInput, CustomMobileInput } from '@/components/formik';
import { ACCOUNT } from '@/constants/routes';
import { Field, useFormikContext } from 'formik';
import PropType from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { MALAYSIA_STATES } from '@/constants/constants';

const EditForm = ({ isLoading, authProvider }) => {
  const history = useHistory();
  const { values, errors, touched, submitForm } = useFormikContext();

  const getBorderClass = (field) => {
    return touched[field] && errors[field] && errors[field].length > 0 ? '!border-red-500' : 'border-gray-300';
  };
  return (
    <div className="user-profile-details">
      <Field
        disabled={isLoading}
        name="fullname"
        type="text"
        className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('fullname')}`}
        label="* Full Name"
        placeholder="Enter your full name"
        component={CustomInput}
        style={{ textTransform: 'capitalize' }}
      />
      <Field
        disabled={authProvider !== 'password' || isLoading}
        name="email"
        type="email"
        className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('email')}`}
        label="* Email Address"
        placeholder="test@example.com"
        component={CustomInput}
      />
      <Field
        disabled={isLoading}
        name="address1"
        type="text"
        className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('address1')}`}
        label="* Address 1 (Will be used for shipping only)"
        maxLength="50"
        placeholder="eg: b123, villa abc,"
        component={CustomInput}
      />
            <Field
        disabled={isLoading}
        name="address2"
        type="text"
        className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('address2')}`}
        label=" Address 2 (Will be used for shipping only)"
        maxLength="50"
        placeholder="eg: Jalan abc,"
        component={CustomInput}
      />
      <Field
        disabled={isLoading}
        name="city"
        type="text"
        className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('city')}`}
        label="* City"
        placeholder="eg: Petaling Jaya"
        component={CustomInput}
      />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="postcode" className="label-input">* Postcode</label>
          <Field
            disabled={isLoading}
            name="postcode"
            type="text"
            id="postcode"
            maxLength="6"
            className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('postcode')}`}
            placeholder="Enter postcode"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="state" className="label-input">* State</label>
          <Field
            disabled={isLoading}
            name="state"
            as="select"
            id="state"
            className={`border rounded-lg p-2 w-full h-15 focus:ring-2 focus:ring-blue-500 ${getBorderClass('state')}`}
          >
            <option value="">Select your state</option>
            {MALAYSIA_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Field>
        </div>
      </div>
      <CustomMobileInput
        defaultValue={values.mobile ? { value: values.mobile+'', dialCode: '', countryCode: '' } : { value: '', dialCode: '', countryCode: '' }}
        className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${getBorderClass('mobile')}`}
        name="mobile"
        disabled={isLoading}
        label="* Mobile Number (Will be used for checkout)"
      />
      <Field
        className='border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500'
        disabled={isLoading}
        name="title"
        type="text"
        maxLength="50" 
        label="Job title"
        placeholder="Job title"
        component={CustomInput}
      />
        <Field
        className='border rounded-lg p-2 w-full h-32 focus:ring-2 focus:ring-blue-500'
        disabled={isLoading}
        name="bio"
        as="textarea"
        maxLength="50" 
        label="Bio"
        placeholder="Your biodata..describe yourself"
        component={CustomInput}
      />
      <Field
        className='border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500'
        disabled={isLoading}
        type="text"
        name="work"
        maxLength="50" 
        label="Company Name"
        placeholder="Company Name"
        component={CustomInput}
      />
           <Field
        className='border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500'
        disabled={isLoading}
        type="text"
        name="work_address"
        maxLength="100" 
        label="Company Address"
        placeholder="Company Address"
        component={CustomInput}
      />
        <Field
        disabled={isLoading}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        name="website"
        type="text"
        label="Website"
        placeholder="Your website"
        component={CustomInput}
      />
       <Field
        disabled={isLoading}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        name="facebook"
        type="text"
        label="Facebook"
        placeholder="Your facebook"
        component={CustomInput}
      />
      <Field
        disabled={isLoading}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        name="instagram"
        type="text"
        label="Instagram"
        placeholder="Your Instagram"
        component={CustomInput}
      />
      <Field
        disabled={isLoading}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        name="video"
        type="text"
        label="Video"
        placeholder="eg: https://www.youtube.com/watch?v=abcd1234"
        component={CustomInput}
      />
       <Field
        disabled={isLoading}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        name="note"
        type="text"
        label="Note"
        placeholder="Special note"
        component={CustomInput}
      />
      <br />
      <div className="edit-user-action">
        <button
          className="button button-muted w-100-mobile"
          disabled={isLoading}
          onClick={() => history.push(ACCOUNT)}
          type="button"
        >
          <ArrowLeftOutlined /> &nbsp; Back to Profile
        </button>
        <button
          className="button w-100-mobile"
          disabled={isLoading}
          onClick={submitForm}
          type="button"
        >
          {isLoading ? <LoadingOutlined /> : <CheckOutlined />} &nbsp;
          {isLoading ? 'Updating Profile' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
};

EditForm.propTypes = {
  isLoading: PropType.bool.isRequired,
  authProvider: PropType.string.isRequired
};

export default EditForm;
