/**
 * Demo access code for the staff console. It lives in the client bundle, so it is not security:
 * real staff sign-in arrives with the backend (M2). It only keeps casual visitors out of the console.
 */
export const DEMO_ACCESS_CODE = "scentique-staff";

export function isAccessCodeValid(input: string): boolean {
  return input.trim() === DEMO_ACCESS_CODE;
}
