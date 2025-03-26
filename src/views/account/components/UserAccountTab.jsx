/* eslint-disable indent */
import { ImageLoader } from '@/components/common';
import { ACCOUNT_EDIT, CONTACT_EDIT} from '@/constants/routes';
import { displayDate } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const UserProfile = (props) => {
  const profile = useSelector((state) => state.profile);

  return (
    <div className="user-profile">
      <div className="user-profile-block">
        {/* Banner & Avatar Section */}
        <div className="user-profile-banner">
          <div className="user-profile-banner-wrapper">
            <ImageLoader alt="Banner" className="user-profile-banner-img" src={profile.banner} />
          </div>
          <div className="user-profile-avatar-wrapper">
            <ImageLoader alt="Avatar" className="user-profile-img" src={profile.avatar} />
          </div>
          <div className="user-profile-edit flex gap-4">
            <button
              className="button button-small"
              onClick={() => props.history.push(CONTACT_EDIT)}
              type="button"
            >
              Edit Mobile Theme
            </button>
            <button
              className="button button-small"
              onClick={() => props.history.push(ACCOUNT_EDIT)}
              type="button"
            >
              Edit Account
            </button>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="user-profile-details">
          <h2 className="user-profile-name">{profile.fullname || "Full name not set"}</h2>

          {/* Contact Information */}
          <div className="profile-section">
            <h3>Contact Information</h3>
            <div className="profile-row">
              <span>Email:</span>
              <h5>{profile.email || "Email not set"}</h5>
            </div>
            <div className="profile-row">
              <span>Address:</span>
              {profile.address1 ? (
                <h5>{`${profile.address1}, ${profile.address2 ? profile.address2 + "," : ""} ${profile.postcode} ${profile.city}, ${profile.state}`}</h5>
              ) : (
                <h5 className="text-subtle text-italic">Address not set</h5>
              )}
            </div>
            <div className="profile-row">
              <span>Mobile:</span>
              <h5>{profile.mobile || "Mobile not set"}</h5>
            </div>
          </div>

          {/* Work Details */}
          <div className="profile-section">
            <h3>Work Details</h3>
            <div className="profile-row">
              <span>Company:</span>
              <h5>{profile.work || "Company not set"}</h5>
            </div>
            <div className="profile-row">
              <span>Company Address:</span>
              <h5>{profile.work_address || "Company address not set"}</h5>
            </div>
            <div className="profile-row">
              <span>Job Title:</span>
              <h5>{profile.title || "Title not set"}</h5>
            </div>
          </div>

          {/* Social Links */}
          <div className="profile-section">
            <h3>Social Links</h3>
            <div className="profile-row">
              <span>Facebook:</span>
              {profile.facebook ? (
                <h5><a href={profile.facebook} target="_blank" rel="noopener noreferrer">{profile.facebook}</a></h5>
              ) : (
                <h5 className="text-subtle text-italic">Facebook not set</h5>
              )}
            </div>
            <div className="profile-row">
              <span>Instagram:</span>
              {profile.instagram ? (
                <h5><a href={profile.instagram} target="_blank" rel="noopener noreferrer">{profile.instagram}</a></h5>
              ) : (
                <h5 className="text-subtle text-italic">Instagram not set</h5>
              )}
            </div>
            <div className="profile-row">
              <span>Website:</span>
              {profile.website ? (
                <h5><a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></h5>
              ) : (
                <h5 className="text-subtle text-italic">Website not set</h5>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="profile-section">
            <h3>Additional Information</h3>
            <div className="profile-row">
              <span>Note:</span>
              <h5>{profile.note || "No notes available"}</h5>
            </div>
            <div className="profile-row">
              <span>Date Joined:</span>
              <h5>{profile.dateJoined ? displayDate(profile.dateJoined) : "Not available"}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

UserProfile.propTypes = {
  history: PropType.shape({
    push: PropType.func
  }).isRequired
};

export default withRouter(UserProfile);
