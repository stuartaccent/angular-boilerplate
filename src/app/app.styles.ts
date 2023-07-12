export const baseStyles = {
  elements: {
    alert: [
      'border-l-4',
      'px-4',
      'py-3',
    ],
    anchor: ['hover:underline'],
    button: [
      'border',
      'inline-block',
      'px-4',
      'py-3',
      'rounded',
      'shadow-md',
      'text-center',
      'disabled:opacity-75',
      'disabled:cursor-not-allowed',
    ],
    container: [
      'container',
      'mx-auto',
      'px-6',
    ],
    h: ['font-light'],
    input: [
      'bg-white',
      'border',
      'px-4',
      'py-3',
      'rounded',
    ],
    textarea: [
      'bg-white',
      'border',
      'px-4',
      'py-3',
      'rounded',
    ],
  },
  space: {
    sm: {
      y: ['space-y-2'],
    },
  },
  typography: {
    size: {
      '3xl': ['text-3xl'],
      '2xl': ['text-2xl'],
    },
  },
  width: {
    full: ['w-full'],
  },
};

export const styles = {
  alert: {
    default: [...baseStyles.elements.alert],
    error: [
      'bg-red-100',
      'border-l-red-500',
      'text-red-800',
    ],
    success: [
      'bg-green-100',
      'border-l-green-500',
      'text-green-800',
    ],
    white: [
      'bg-gray-50/50',
      'border-l-gray-200',
      'text-gray-600',
    ],
  },
  anchor: {
    default: [...baseStyles.elements.anchor],
    primary: ['text-blue-500'],
  },
  button: {
    default: [...baseStyles.elements.button],
    primary: [
      'bg-blue-500',
      'border-blue-500',
      'hover:bg-blue-600',
      'text-white',
    ],
    white: [
      'bg-white',
      'border-gray-300',
      'text-gray-800',
      'hover:bg-gray-50/50',
    ],
  },
  container: {
    default: [...baseStyles.elements.container],
    topScaling: [
      'mt-10',
      'sm:mt-16',
      'md:mt-24',
      'lg:mt-32',
      'xl:mt-40',
    ],
  },
  hgroup: {
    default: [...baseStyles.space.sm.y],
  },
  h1: {
    default: [
      ...baseStyles.elements.h,
      ...baseStyles.typography.size['3xl'],
    ],
  },
  h2: {
    default: [
      ...baseStyles.elements.h,
      ...baseStyles.typography.size['2xl'],
    ],
  },
  input: {
    default: [
      ...baseStyles.elements.input,
      ...baseStyles.width.full,
    ],
  },
  textarea: {
    default: [
      ...baseStyles.elements.textarea,
      ...baseStyles.width.full,
    ],
  }
};
