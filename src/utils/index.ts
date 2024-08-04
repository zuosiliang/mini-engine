function flattenFloat32Array(arrayOfFloat32Arrays: Float32Array[]) {
  // Step 1: Calculate total length
  const totalLength = arrayOfFloat32Arrays.reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  // Step 2: Create a new Float32Array with total length
  const flattenedArray = new Float32Array(totalLength);

  // Step 3: Copy elements into the new array
  let offset = 0;
  for (const float32Arr of arrayOfFloat32Arrays) {
    flattenedArray.set(float32Arr, offset);
    offset += float32Arr.length;
  }

  return flattenedArray;
}

export { flattenFloat32Array };
