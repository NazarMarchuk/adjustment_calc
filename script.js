// Helper function to parse feet and fractional input
function parseFeet(input) {
  const parts = input.trim().split(" ");
  let feet = 0;

  if (parts.length === 2) {
      feet += parseInt(parts[0], 10);
      const fraction = parts[1].split("/");
      feet += parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
  } else if (parts.length === 1) {
      const fraction = parts[0].split("/");
      if (fraction.length === 2) {
          feet += parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
      } else {
          feet += parseFloat(parts[0]);
      }
  }

  return feet;
}

function showImage(imageId) {
  const image = document.getElementById(imageId);
  image.style.display = image.style.display === 'block' ? 'none' : 'block';
}

document.getElementById("calcForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Parse inputs as feet
  const width = parseFeet(document.getElementById("wid").value);
  const length = parseFeet(document.getElementById("len").value);
  const diagonal = parseFeet(document.getElementById("diagonal").value);
  const railDistance = parseFeet(document.getElementById("rails").value);

  // Calculate opposite angle using the law of cosines
  const calculatedAngle = (Math.acos((Math.pow(diagonal, 2) - Math.pow(width, 2) - Math.pow(length, 2)) / -(2 * width * length)) * 180) / Math.PI;
  const angleError = calculatedAngle - 90;

  // Calculate expected diagonal
  const expectedDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(length, 2));

  let adjustmentMessage = "";

  // Determine adjustments based on angle error and quadrilateral distortion
  if (Math.abs(angleError) > 0.01) { // Non-square threshold
      const shiftDistance = Math.tan(angleError * (Math.PI / 180)) * railDistance;

      if (shiftDistance > 0) {
          adjustmentMessage = `Shift the left wheel forward by ${shiftDistance.toFixed(2)} feet or the right wheel backward by ${shiftDistance.toFixed(2)} feet.`;
      } else {
          adjustmentMessage = `Shift the right wheel forward by ${Math.abs(shiftDistance).toFixed(2)} feet or the left wheel backward by ${Math.abs(shiftDistance).toFixed(2)} feet.`;
      }
  } else {
      adjustmentMessage = "The rig is properly calibrated.";
  }

  // Display results
  document.getElementById("op_angle").textContent = `Angle Opposite Long Diagonal: ${calculatedAngle.toFixed(2)}°`;
  document.getElementById("deg_out_of_square").textContent = `Angle Error: ${angleError.toFixed(2)}°`;
  document.getElementById("expected_diagonal").textContent = `Expected Diagonal: ${expectedDiagonal.toFixed(2)} feet`;
  document.getElementById("adjust_message").textContent = adjustmentMessage;
});
