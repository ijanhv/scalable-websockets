import http from "http"
import SocketService from "./services/socket"

async function init() {
    const socketService = new SocketService()
    const httpServer = http.createServer()
    const PORT = process.env.PORT ? process.env.PORT : 8001

    socketService.io.attach(httpServer)

    httpServer.listen(PORT, () => {
        console.log(`HTTP Server listening on PORT: ${PORT}`)
    })

    socketService.initListeners()

    
}

init()