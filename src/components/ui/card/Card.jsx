// /*
// ======================================================
// Reusable Card Component

// Purpose:
// - A generic card component used throughout the application.
// - Supports titles, subtitles, icons, footers, custom colors,
//   hover effects, and click actions.
// - Can be used for dashboard statistics, profile cards,
//   analytics cards, information panels, etc.

// Props:
// - children      : Main content inside the card
// - title         : Card heading
// - subtitle      : Small text below the title
// - footer        : Optional footer section
// - icon          : Icon displayed in the top-right corner
// - accentColor   : Top border color
// - iconBg        : Background color of icon container
// - iconColor     : Icon color
// - hover         : Enables hover animation
// - floatIcon     : Adds floating animation to icon
// - onClick       : Function executed when card is clicked
// - bgColor       : Tailwind background classes
// - className     : Additional custom classes
// - padding       : Tailwind padding classes

// Examples:

// 1. Simple Card
// <Card title="Students">
//   <p>Total Students: 300</p>
// </Card>

// ------------------------------------------------------

// 2. Dashboard Stat Card
// <Card
//   title="Total Students"
//   subtitle="This Month"
//   icon={<Users size={20} />}
//   accentColor="#3B82F6"
// >
//   <h2 className="text-3xl font-bold">300</h2>
// </Card>

// ------------------------------------------------------

// 3. Clickable Card
// <Card
//   title="Attendance"
//   onClick={() => navigate("/attendance")}
// >
//   <p>View attendance details</p>
// </Card>

// ------------------------------------------------------

// 4. Floating Icon Card
// <Card
//   title="Assignments"
//   icon={<NotebookPen size={20} />}
//   floatIcon
// >
//   <p>12 Pending Assignments</p>
// </Card>
// ======================================================
// */

// function Card({
//   children,
//   title,
//   subtitle,
//   footer,
//   icon,
//   accentColor = "#7F77DD",
//   iconBg = "#EEEDFE",
//   iconColor = "#534AB7",
//   hover = true,
//   floatIcon = false,
//   onClick,
//   bgColor = "bg-white",
//   className = "",
//   padding = "p-5",
// }) {
//   return (
//     <div
//       // Executes when the card is clicked
//       onClick={onClick}
//       className={`
//         group relative overflow-hidden rounded-xl
//         ${bgColor} dark:bg-neutral-900
//         border border-neutral-200/70 dark:border-neutral-700/60
//         ${padding}
//         transition-all duration-200
//         ${
//           hover
//             ? `
//               cursor-pointer
//               hover:-translate-y-0.5
//               hover:border-neutral-300
//               dark:hover:border-neutral-600
//               hover:shadow-sm
//             `
//             : ""
//         }
//         ${className}
//       `}
//     >
//       {/* ==================================================
//           Floating animation for icons
//       ================================================== */}
//       <style>{`
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }

//         .icon-float {
//           animation: float 3s ease-in-out infinite;
//         }
//       `}</style>

//       {/* ==================================================
//           Top Accent Line
//       ================================================== */}
//       <div
//         className="absolute left-0 top-0 h-0.5 w-full"
//         style={{
//           background: accentColor,
//         }}
//       />

//       {/* ==================================================
//           Card Header
//           Displays title, subtitle, and icon
//       ================================================== */}
//       {(title ||
//         subtitle ||
//         icon) && (
//         <div className="mb-4 flex items-start justify-between gap-3">
//           <div className="min-w-0">
//             {/* Card Title */}
//             {title && (
//               <h3 className="truncate text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
//                 {title}
//               </h3>
//             )}

//             {/* Card Subtitle */}
//             {subtitle && (
//               <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-400">
//                 {subtitle}
//               </p>
//             )}
//           </div>

//           {/* Optional Icon */}
//           {icon && (
//             <div
//               className={`
//                 flex h-[38px] w-[38px]
//                 flex-shrink-0 items-center justify-center
//                 rounded-lg text-[18px]
//                 ${
//                   floatIcon
//                     ? "icon-float"
//                     : `
//                       transition-transform duration-200
//                       group-hover:scale-105
//                     `
//                 }
//               `}
//               style={{
//                 background: iconBg,
//                 color: iconColor,
//               }}
//             >
//               {icon}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ==================================================
//           Card Body
//           Main content area
//       ================================================== */}
//       <div className="relative">
//         {children}
//       </div>

//       {/* ==================================================
//           Card Footer
//           Optional bottom section
//       ================================================== */}
//       {footer && (
//         <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
//           {footer}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Card;
/*
======================================================
Reusable Card Component with Role‑Based Theming

- Automatically colors the top accent line, icon background,
  and icon color based on the `tone` prop.
- tone can be: 'admin', 'teacher', 'student', 'parent', 'brand'
- Explicit overrides still work: accentColor, iconBg, iconColor
- Default fallback: brand (purple)

======================================================
*/

// ── Role → Color Mappings ────────────────────────────────
const TONE_ACCENT = {
  admin: 'var(--color-admin-primary)',
  teacher: 'var(--color-teacher-primary)',
  student: 'var(--color-student-primary)',
  parent: 'var(--color-parent-primary)',
  brand: 'var(--color-brand-primary)',
};

const TONE_ICON_BG = {
  admin: 'var(--color-admin-light)',
  teacher: 'var(--color-teacher-light)',
  student: 'var(--color-student-light)',
  parent: 'var(--color-parent-light)',
  brand: 'var(--color-brand-light)',
};

const TONE_ICON_COLOR = {
  admin: 'var(--color-admin-primary)',
  teacher: 'var(--color-teacher-primary)',
  student: 'var(--color-student-primary)',
  parent: 'var(--color-parent-primary)',
  brand: 'var(--color-brand-primary)',
};

function Card({
  children,
  title,
  subtitle,
  footer,
  icon,
  tone,                  // ← NEW: auto‑theme based on role
  accentColor,          // optional override
  iconBg,               // optional override
  iconColor,            // optional override
  accentLeft = false, 
  hover = true,
  floatIcon = false,
  onClick,
  bgColor = 'bg-white',
  className = '',
  padding = 'p-5',
}) {
  // Resolve final colors:
  // explicit override → tone mapping → fallback defaults
  const finalAccent =accentColor || (tone && TONE_ACCENT[tone.toLowerCase()]) || '#7F77DD';
  const finalIconBg =iconBg || (tone && TONE_ICON_BG[tone.toLowerCase()]) || '#EEEDFE';
  const finalIconColor =iconColor || (tone && TONE_ICON_COLOR[tone.toLowerCase()]) || '#534AB7';

  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-xl
        ${bgColor} dark:bg-neutral-900
        border border-neutral-200/70 dark:border-neutral-700/60
        ${padding}
        transition-all duration-200
        ${accentLeft ? 'border-l-4' : ''}
        ${
          hover
            ? `
              cursor-pointer
              hover:-translate-y-0.5
              hover:border-neutral-300
              dark:hover:border-neutral-600
              hover:shadow-sm
            `
            : ''
        }
        ${className}
      `}
      style={{
        borderLeftColor: accentLeft ? finalAccent : undefined,
      }}
    >
      {/* Floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .icon-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Top Accent Line (role‑based) */}
      <div
        className="absolute left-0 top-0 h-0.5 w-full"
        style={{ background: finalAccent }}
      />

      {/* Header: Title + Icon */}
      {(title || subtitle || icon) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3 className="truncate text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div
              className={`
                flex h-[38px] w-[38px]
                flex-shrink-0 items-center justify-center
                rounded-lg text-[18px]
                ${
                  floatIcon
                    ? 'icon-float'
                    : 'transition-transform duration-200 group-hover:scale-105'
                }
              `}
              style={{
                background: finalIconBg,
                color: finalIconColor,
              }}
            >
              {icon}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="relative">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;