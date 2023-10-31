export function getNextBillingStartDate(signUpDate: Date): string {
  console.log("getting next date");
  console.log(signUpDate);
  const currentDate = new Date(); // Use the current date

  // Calculate the number of milliseconds in 30 days
  const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;

  // Calculate the difference between the current date and the sign-up date
  const timeDiff = currentDate.getTime() - signUpDate.getTime();

  // Calculate the number of completed 30-day cycles
  const completedCycles = Math.floor(timeDiff / thirtyDaysInMilliseconds);

  // Calculate the start of the next 30-day billing cycle
  const nextBillingCycleStart = new Date(
    signUpDate.getTime() + (completedCycles + 1) * thirtyDaysInMilliseconds
  );

  return nextBillingCycleStart.toLocaleDateString();
}
