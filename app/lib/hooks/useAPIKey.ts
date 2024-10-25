import { useState } from 'react';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('');
  return { setApiKey,apiKey };
}
