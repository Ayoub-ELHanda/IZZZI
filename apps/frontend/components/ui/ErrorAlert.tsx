'use client';

interface ErrorAlertProps {
  title?: string;
  message?: string | null;
  errors?: Record<string, string[]> | null;
}

export function ErrorAlert({ title, message, errors }: ErrorAlertProps) {
  if (!message && (!errors || Object.keys(errors).length === 0)) {
    return null;
  }

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#FFF4E0',
        border: '1px solid #FF6B35',
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      {title && (
        <h4
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            color: '#FF6B35',
            marginBottom: '8px',
          }}
        >
          {title}
        </h4>
      )}
      {message && (
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#FF6B35',
            marginBottom: errors && Object.keys(errors).length > 0 ? '8px' : '0',
          }}
        >
          {message}
        </p>
      )}
      {errors && Object.keys(errors).length > 0 && (
        <ul
          style={{
            listStyle: 'disc',
            paddingLeft: '20px',
            margin: 0,
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#FF6B35',
          }}
        >
          {Object.entries(errors).map(([key, value]) => (
            <li key={key}>
              {Array.isArray(value) ? value.join(', ') : value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

