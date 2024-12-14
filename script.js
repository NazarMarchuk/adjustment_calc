// Helper function to parse inches and fractional input
function parseInches(input) {
  const parts = input.trim().split(" ");
  let inches = 0;

  if (parts.length === 2) {
      inches += parseInt(parts[0], 10);
      const fraction = parts[1].split("/");
      inches += parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
  } else if (parts.length === 1) {
      const fraction = parts[0].split("/");
      if (fraction.length === 2) {
          inches += parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
      } else {
          inches += parseFloat(parts[0]);
      }
  }

  return inches;
}

function showImage(imageId) {
  const image = document.getElementById(imageId);
  image.style.display = image.style.display === 'block' ? 'none' : 'block';
}

function decimalToInches(decimal) {
    if (decimal < 0) {
        throw new Error("Input must be a non-negative number");
    }

    const inches = Math.floor(decimal); // Get the whole inches
    const fraction = decimal - inches; // Get the fractional part
    const fractionsOfInch = 16; // Precision to 1/16 of an inch
    const fractionRounded = Math.round(fraction * fractionsOfInch); // Round to nearest 1/16

    // Handle special cases where fractionRounded equals fractionsOfInch
    if (fractionRounded === fractionsOfInch) {
        return `${inches + 1}"`;
    }

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b)); // Helper function for greatest common divisor
    const denominator = fractionsOfInch;
    const numerator = fractionRounded;

    // Reduce fraction
    const divisor = gcd(numerator, denominator);
    const simplifiedNumerator = numerator / divisor;
    const simplifiedDenominator = denominator / divisor;

    // Format the result
    if (inches === 0 && simplifiedNumerator > 0) {
        return `${simplifiedNumerator}/${simplifiedDenominator}"`; // Only fraction
    } else if (simplifiedNumerator > 0) {
        return `${inches} ${simplifiedNumerator}/${simplifiedDenominator}"`; // Whole inches and fraction
    } else {
        return `${inches}"`; // Only whole inches
    }
}

document.getElementById("calcForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Parse inputs as inches
  const width = parseInches(document.getElementById("wid").value);
  const length = parseInches(document.getElementById("len").value);
  const diagonal = parseInches(document.getElementById("diagonal").value);
  const railDistance = parseInches(document.getElementById("rails").value);

  // Calculate opposite angle using the law of cosines
  const calculatedAngle = (Math.acos((Math.pow(diagonal, 2) - Math.pow(width, 2) - Math.pow(length, 2)) / -(2 * width * length)) * 180) / Math.PI;
  const angleError = calculatedAngle - 90;

  // Calculate expected diagonal
  const expectedDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(length, 2));

  let adjustmentMessage = "";
  
  const bigger_diagonal = document.getElementById("ur-ll-or-ul-lr").value;

  // Determine adjustments based on angle error and quadrilateral distortion
  if (Math.abs(angleError) > 0.1) { // Non-square threshold
      const shiftDistance = Math.tan(angleError * (Math.PI / 180)) * railDistance;
      if (bigger_diagonal === 'ur-ll') {
        adjustmentMessage = `Move the left wheel forward by ${decimalToInches(Math.abs(shiftDistance).toFixed(2))} or the right wheel backward by ${decimalToInches(Math.abs(shiftDistance).toFixed(2))}.`;
    } else {
        adjustmentMessage = `Move the right wheel forward by ${decimalToInches(Math.abs(shiftDistance).toFixed(2))} or the left wheel backward by ${decimalToInches(Math.abs(shiftDistance).toFixed(2))}.`;
    }
  } else {
      adjustmentMessage = "The machine is properly calibrated.";
  }

  // Display results
  document.getElementById("expected_diagonal").textContent = `Expected Diagonal: ${decimalToInches(expectedDiagonal.toFixed(2))} inches`;
  document.getElementById("adjust_message").textContent = adjustmentMessage;
});
