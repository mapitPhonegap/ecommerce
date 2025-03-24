import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { Boundary, ImageLoader } from '@/components/common';
import { Formik } from 'formik';
import {
  useDocumentTitle, useFileHandler, useModal, useScrollTop
} from '@/hooks';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/actions/miscActions';
import { updateProfile } from '@/redux/actions/profileActions';
import * as Yup from 'yup';
import ConfirmModal from './ConfirmModal';
import EditForm from './EditForm';

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(4, 'Full name min 4 characters.')
    .max(60, 'Full name max 60 characters.')
    .required('Full name is required'),
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  address1: Yup.string()
  .required("Address 1 is required"),
  address2: Yup.string(),
  postcode: Yup.number()
  .min(5, 'Postcode min 5 digits.')
  .min(6, 'Postcode max 6 digits.')
        .required('Postcode is required'),
  city: Yup.string()
  .required('City is required'),
  state: Yup.string()
  .required('State is required'),
  facebook: Yup.string(),
  instagram: Yup.string(),
  website: Yup.string(),
  bio: Yup.string()
    .max(500, 'Bio max 500 characters.'),
  video: Yup.string(),
  mobile: Yup.object().nullable().shape({
    country: Yup.string().required("Country is required"),
    countryCode: Yup.string().required("Country code is required"),
    dialCode: Yup.string().required("Dial code is required"),
    value: Yup.string()
      .matches(/^\d+$/, "Only numbers allowed") // Ensure it's numeric
      .min(10, "Must be at least 10 digits")
      .max(15, "Cannot exceed 15 digits")
      .required("Mobile number is required")
  })
});

const EditProfile = () => {
  useDocumentTitle('Edit Account | Taptag');
  useScrollTop();

  const modal = useModal();
  const dispatch = useDispatch();

  useEffect(() => () => {
    dispatch(setLoading(false));
  }, []);

  const { profile, auth, isLoading } = useSelector((state) => ({
    profile: state.profile,
    auth: state.auth,
    isLoading: state.app.loading
  }));

  const initFormikValues = {
    fullname: profile.fullname || '',
    email: profile.email || '',
    address1: profile.address1 || '',
    address2: profile.address2 || '',
    postcode: profile.postcode || '',
    city: profile.city || '',
    state: profile.state || '',
    mobile: profile.mobile?.value || profile.mobile  || '',
    facebook: profile.facebook || '',
    website: profile.website || '',
    instagram: profile.instagram || '',
    bio: profile.bio || '',
    video: profile.video || '',
    title: profile.title || '',
    work: profile.work || '',
    work_address: profile.work_address || '',
    note: profile.note || ''


  };

  const {
    imageFile,
    isFileLoading,
    onFileChange
  } = useFileHandler({ avatar: {}, banner: {} });

  const update = (form, credentials = {}) => {
    dispatch(updateProfile({
      updates: {
        fullname: form.fullname,
        email: form.email,
        address1: form.address1,
        address2: form.address2,
        state: form.state,
        city: form.city,
        postcode: form.postcode,
        mobile: form.mobile?.value || form.mobile,
        avatar: profile.avatar,
        facebook: form.facebook,
        website: form.website,
        instagram: form.instagram,
        bio: form.bio,
        video: form.video,
        title: form.title,
        work: form.work,
        work_address: form.work_address,
        note: form.note
        //banner: profile.banner
      },
      files: {
        // bannerFile: imageFile.banner.file,
        avatarFile: imageFile.avatar.file
      },
      credentials
    }));
  };

  const onConfirmUpdate = (form, password) => {
    if (password) {
      update(form, { email: form.email, password });
    }
  };

  const onSubmitUpdate = (form) => {
    // check if data has changed
    const fieldsChanged = Object.keys(form).some((key) => profile[key] !== form[key]);

    // if (fieldsChanged || (Boolean(imageFile.banner.file || imageFile.avatar.file))) {
    if (fieldsChanged || (Boolean(imageFile.avatar.file))) {
      if (form.email !== profile.email) {
        modal.onOpenModal();
      } else {
        update(form);
      }
    }
  };

  return (
    <Boundary>
      <div className="edit-user">
        <h3 className="text-center">Edit Account Details</h3>
        <Formik
          initialValues={initFormikValues}
          validateOnChange
          validationSchema={FormSchema}
          onSubmit={onSubmitUpdate}
        >
          {() => (
            <>
              <div className="user-profile-banner">
                <div className="user-profile-banner-wrapper">
                  <ImageLoader
                    alt="Banner"
                    className="user-profile-banner-img"
                    src={imageFile.banner.url || profile.banner}
                  />
                  {/* {isFileLoading ? (
                    <div className="loading-wrapper">
                      <LoadingOutlined />
                    </div>
                  ) : (
                    <label
                      className="edit-button edit-banner-button"
                      htmlFor="edit-banner"
                    >
                      <input
                        accept="image/x-png,image/jpeg"
                        disabled={isLoading}
                        hidden
                        id="edit-banner"
                        onChange={(e) => onFileChange(e, { name: 'banner', type: 'single' })}
                        type="file"
                      />
                      <EditOutlined />
                    </label>
                  )} */}
                </div>
                <div className="user-profile-avatar-wrapper">
                  <ImageLoader
                    alt="Avatar"
                    className="user-profile-img"
                    src={imageFile.avatar.url || profile.avatar}
                  />
                  {isFileLoading ? (
                    <div className="loading-wrapper">
                      <LoadingOutlined />
                    </div>
                  ) : (
                    <label
                      className="edit-button edit-avatar-button"
                      htmlFor="edit-avatar"
                    >
                      <input
                        accept="image/x-png,image/jpeg"
                        disabled={isLoading}
                        hidden
                        id="edit-avatar"
                        onChange={(e) => onFileChange(e, { name: 'avatar', type: 'single' })}
                        type="file"
                      />
                      <EditOutlined />
                    </label>
                  )}
                </div>
              </div>
              <EditForm
                authProvider={auth.provider}
                isLoading={isLoading}
              />
              <ConfirmModal
                onConfirmUpdate={onConfirmUpdate}
                modal={modal}
              />
            </>
          )}
        </Formik>
      </div>
    </Boundary>
  );
};

export default EditProfile;
