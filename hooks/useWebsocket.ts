import { useEffect, useState } from "react"

const useWebsocket = (url:string) => {
    const [message, setMesssages] = useState<string>("")
    const [ws, setWs] = useState<WebSocket | null>(null)

    useEffect(() => {
        const socket = new WebSocket(url)
        setWs(socket)

        socket.onopen = () => {
            console.log(`Connected to ${url}`)
        }

        socket.onmessage = (event) => {
            setMesssages((prev) => event.data)
        }

        return () => {
            socket.close()
        }
    }, [url])

    const sendMessage = (message:string) => {
        if (ws) {
            ws.send(message)
        }
    }

    return { message, sendMessage }
}

export default useWebsocket