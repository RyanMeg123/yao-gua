import { DivinationData } from "../types";

export async function getDivinationInterpretation(data: DivinationData) {
  const response = await fetch('/api/divine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get interpretation');
  }

  const result = await response.json();
  return result.interpretation;
}
