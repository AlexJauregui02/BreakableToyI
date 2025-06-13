
const API_BASE_URL = import.meta.env.BACKEND_API_URL;

interface ApiError {
  message: string;
  status: number;
}

export async function fetchApi<T>(
    endpoint: string,
): Promise<T> {
    const url = `${URL}${endpoint}`;
    console.log(`Fetching ${url}`);
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(`Error ${errorData.status}: ${errorData.message}`);
    }

    return response.json();
}