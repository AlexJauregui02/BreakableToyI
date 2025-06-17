
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

interface ApiError {
  message: string;
  status: number;
}

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T | undefined> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Fetching ${url}`);
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(`Error ${errorData.status}: ${errorData.message}`);
    }

    if (response.status === 204) {
        return undefined;
    }

    return response.json();
}