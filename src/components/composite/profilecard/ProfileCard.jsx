import Card from "../../ui/Card/Card";
import {
  Mail,
  UserRound,
} from "lucide-react";

/*
======================================================
Reusable Profile Card Component

Purpose:
- Displays user profile information in a card layout.
- Supports avatar image or generated initials avatar.
- Shows basic information such as name, role, and email.
- Provides an additional section for extra details.

Common Use Cases:
- Student Profile Card
- Teacher Profile Card
- Parent Profile Card
- Admin Profile Card
- Team Member Cards

Props:
- name       : User's full name
- role       : User's role or designation
- email      : User's email address
- avatar     : Profile image URL
- subtitle   : Additional information or description
- bgColor    : Custom background classes
- meta1      : Additional metadata line
- meta2      : Additional metadata line
- className  : Additional custom classes

Examples:

1. Student Profile
------------------------------------------------------
<ProfileCard
  name="Fazail Nadeem"
  role="Student"
  email="student@school.edu"
  subtitle="Class 10 - Computer Science"
  meta1="Roll Number: 2025-CS-01"
  meta2="Section: A"
/>

------------------------------------------------------

2. Teacher Profile
------------------------------------------------------
<ProfileCard
  name="Ali Hassan"
  role="Teacher"
  email="teacher@school.edu"
  subtitle="Computer Science Department"
  meta1="Experience: 5 Years"
  meta2="Classes Assigned: 10th & 11th"
/>

------------------------------------------------------

3. With Avatar
------------------------------------------------------
<ProfileCard
  name="Sara Ali"
  role="Parent"
  email="parent@school.edu"
  avatar="/images/sara.jpg"
/>

Features:
- Automatic initials avatar
- Profile image support
- Additional information section
- Responsive card design
- Custom background and styling support
======================================================
*/

function ProfileCard({
  name,
  role,
  email,
  avatar,
  subtitle,
  bgColor,
  meta1,
  meta2,
  className = "",
}) {
  return (
    <Card
      hover
      bgColor={bgColor}
      className={`
        bg-gradient-to-br
        from-white
        via-slate-50
        to-blue-50
        ${className}
      `}
    >
      {/* ==================================================
          Profile Header
          Displays avatar and basic user information
      ================================================== */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {avatar ? (
          /*
          ==================================================
          User profile image
          ==================================================
          */
          <img
            src={avatar}
            alt={name}
            className="
              h-16
              w-16
              rounded-full
              object-cover
              ring-4
              ring-brand-primary/20
            "
          />
        ) : (
          /*
          ==================================================
          Fallback avatar using first letter of name
          ==================================================
          */
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-brand-primary
              to-parent-primary
              text-2xl
              font-bold
              text-white
              shadow-lg
            "
          >
            {name?.charAt(0)}
          </div>
        )}

        {/* ==================================================
            User Information
        ================================================== */}
        <div className="flex-1">
          {/* User Name */}
          <h3 className="text-xl font-bold text-text-primary">
            {name}
          </h3>

          {/* User Role */}
          <div className="mt-1 flex items-center gap-2 text-text-secondary">
            <UserRound size={16} />
            <span>{role}</span>
          </div>

          {/* User Email */}
          {email && (
            <div className="mt-2 flex items-center gap-2 text-text-secondary">
              <Mail size={16} />
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          Additional Information Section
          Rendered only if at least one piece of
          extra information is provided
      ================================================== */}
      {(subtitle || meta1 || meta2) && (
        <div className="mt-6 border-t border-slate-200 pt-4">
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-text-primary">
              {subtitle}
            </p>
          )}

          {/* First Metadata Line */}
          {meta1 && (
            <p className="mt-2 text-sm text-text-secondary">
              {meta1}
            </p>
          )}

          {/* Second Metadata Line */}
          {meta2 && (
            <p className="mt-1 text-sm text-text-secondary">
              {meta2}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export default ProfileCard;