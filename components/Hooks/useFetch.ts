import { useState } from "react"

export const useFetch = () => {
    const [data, setData] = useState<unknown>(null)
    const [error, setError] = useState<unknown>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const get = async <T>(url: string, data?: unknown,callback?: (data: unknown) => void) => {
        let response
        let json
        try {
            setError(null)
            setLoading(true)
            response = await fetch(url, {headers: {'Content-Type': 'application/json'}, method: 'GET', body: JSON.stringify(data)})
            json = await response.json() as T
            if (!(response.status==200)) throw new Error((json as Error).message)
        } catch (e) {
            json = null
            setError(e);
        } finally {
            callback ? callback(json) : setData(json)
            setLoading(false)
        }
    }

    const post = async (url: string, data: unknown, callback?: (data: unknown) => void) => {
        let response
        let json
        try {
            setError(null)
            setLoading(true)
            response = await fetch(url, 
                {
                    body: JSON.stringify(data), 
                    headers: {'Content-Type': 'application/json'}, 
                    method: 'POST',
                })
            if (response.status!=200) throw new Error('Error posting data')
            json = response.status
        } catch (e) {
            json = null
            setError(e);
        } finally {
            callback ? callback(json) : setData(json)
            setLoading(false)
        }
    }

    return {data, error, loading, get, post}
}