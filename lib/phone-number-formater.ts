function formatPhoneNumber(input: string) {
  // Assume input is already sanitized and contains only digits

  if (input.length === 10) {
    // Format US numbers as (XXX) XXX-XXXX
    return `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6)}`;
  } else if (input.length === 11) {
    // Format Haiti numbers as (+509) XXXX XXXX
    return `(+${input.slice(0, 3)}) ${input.slice(3, 7)}-${input.slice(7)}`;
  }

  // This shouldn't happen if the input is always valid
  throw new Error('Invalid phone number length. Expected 10 or 11 digits.');
}

export default formatPhoneNumber;
