export function createRandomMeshGradients() {
    // Generate random color values
    function randomColor() {
        let hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // Minimum saturation of 50%
        const lightness = Math.floor(Math.random() * 50) + 50; // Minimum lightness of 50%
    
        // Adjust hue if it falls in the gray range
        if (hue >= 180 && hue <= 240) {
          hue = (hue + 120) % 360;
        }
    
        return `hsla(${hue},${saturation}%,${lightness}%,1)`;
      }
    
      // Generate random gradient positions
      function randomPosition() {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        return `at ${x}% ${y}%`;
      }
    
      // Generate random mesh gradients
      function generateRandomMeshGradients() {
        const gradients = [];
        for (let i = 0; i < 7; i++) {
          const position = randomPosition();
          const color = randomColor();
          const gradient = `radial-gradient(${position}, ${color} 0px, transparent 50%)`;
          gradients.push(gradient);
        }
        return gradients;
      }
    
      // Construct the output as JSON
      function constructOutput(gradients) {
        const backgroundColor = randomColor();
        const backgroundImage = gradients.join(',\n');
        return {
          bgColor: backgroundColor,
          bgImage: backgroundImage
        };
      }
    
      // Generate and return the random mesh gradients as JSON
      const gradients = generateRandomMeshGradients();
      const output = constructOutput(gradients);
      return output;
}
