import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useQueryParameter = (key: string) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const query = searchParams.get(key);

  const handleQuery = (value: string) => {
    const params = new URLSearchParams(searchParams);
    // If the new value is the same as the current one, remove the key
    if (value === query) {
      params.delete(key);
    } else if (!value) {
      // If value is empty, remove the key
      params.delete(key);
    } else {
      // Otherwise, update the key with the new value
      params.set(key, value);
    }

    // Update the URL with the new search parameters
    replace(`${pathname}?${params.toString()}`);
  };

  return { query, handleQuery };
};

export default useQueryParameter;
