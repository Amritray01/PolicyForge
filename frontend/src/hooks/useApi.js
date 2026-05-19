/**
 * src/hooks/useApi.js
 * Browser-side request caching using the Cache API.
 * Provides a stale-while-revalidate strategy.
 */

export async function cachedFetch(url, options = {}) {
  // Use 'policyforge-api' as the cache name
  const cacheName = 'policyforge-api-v1';
  
  // 1. Add Authorization header
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  const fetchOptions = { ...options, headers };

  // 2. Resolve the correct full URL (matching axios setup)
  const rawApiUrl = import.meta.env.VITE_API_URL || '';
  let fetchUrl = url;
  if (rawApiUrl && url.startsWith('/api')) {
    const baseUrl = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;
    fetchUrl = url.replace('/api', baseUrl);
  }

  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(fetchUrl);

    if (cachedResponse) {
      // Revalidate in background
      fetch(fetchUrl, fetchOptions).then(async (freshResponse) => {
        if (freshResponse.ok) {
          await cache.put(fetchUrl, freshResponse.clone());
        } else if (freshResponse.status === 401 && !fetchUrl.includes('/auth/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }).catch(err => console.warn('Background revalidation failed:', err));

      // Return the cached data immediately
      return await cachedResponse.json();
    }
  } catch (e) {
    console.warn('Cache API not available or failed:', e);
  }

  // If no cache or error, fetch normally
  const response = await fetch(fetchUrl, fetchOptions);
  
  // 3. Handle 401 globally like axios interceptor
  if (response.status === 401 && !fetchUrl.includes('/auth/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  const data = await response.json();

  // Try to store in cache for next time
  try {
    const cache = await caches.open(cacheName);
    const clonedResponse = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(fetchUrl, clonedResponse);
  } catch (e) {
    // Ignore cache storage errors
  }

  return data;
}
