/**
 * Standard reducing-balance EMI calculation:
 * EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 */
export function calculateReducingBalanceEmi(principal, annualRatePercent, tenureMonths) {
  const safePrincipal = Math.max(0, Number(principal) || 0);
  const safeMonths = Math.max(1, Math.round(Number(tenureMonths) || 1));
  const safeRate = Math.max(0, Number(annualRatePercent) || 0);

  if (safePrincipal === 0) {
    return { monthlyEmi: 0, totalPayable: 0, totalInterest: 0, principal: 0 };
  }

  if (safeRate === 0) {
    return {
      monthlyEmi: Math.round(safePrincipal / safeMonths),
      totalPayable: Math.round(safePrincipal),
      totalInterest: 0,
      principal: Math.round(safePrincipal),
    };
  }

  const monthlyRate = safeRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, safeMonths);
  const rawEmi = (safePrincipal * monthlyRate * factor) / (factor - 1);
  const monthlyEmi = Math.round(rawEmi);
  const totalPayable = Math.round(rawEmi * safeMonths);
  const totalInterest = Math.max(0, totalPayable - Math.round(safePrincipal));

  return {
    monthlyEmi,
    totalPayable,
    totalInterest,
    principal: Math.round(safePrincipal),
  };
}

export function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(Number(amount) || 0));
}
