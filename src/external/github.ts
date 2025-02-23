export async function getTokenomicsDoc() {
  const response = await fetch(
    "https://raw.githubusercontent.com/Cubie-AI/cubie_backend/refs/heads/main/TOKENOMICS.md"
  );

  return response.text();
}
