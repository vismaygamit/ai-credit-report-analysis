export const getCreditScoreColor = (score) => {
  // border-green-200 bg-green-50
  if (score >= 300 && score <= 559) {
    return "border-red-200 bg-red-50 text-red-400"; // Poor
  } else if (score >= 560 && score <= 659) {
    return "border-orange-200 bg-orange-50 text-orange-400"; // Fair
  } else if (score >= 660 && score <= 724) {
    return "border-yellow-200 bg-yellow-50 text-yellow-400"; // Good
  } else if (score >= 725 && score <= 759) {
    return "border-lime-200 bg-lime-50 text-lime-400"; // Very Good
  } else if (score >= 760 && score <= 900) {
    return "border-green-200 bg-green-50 text-green-400"; // Excellent
  } else {
    return "border-gray-200 bg-gray-50 text-gray-400"; // Default / Invalid
  }
};
