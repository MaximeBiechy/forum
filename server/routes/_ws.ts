const clients = new Set<WebSocket>()

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open")
        clients.add(peer)
    },
    message(peer, message) {
        console.log("[ws] message", message.text())
        if (message.text().includes("ping")) {
            peer.send("pong")
        }
    },
    close(peer, event) {
        console.log("[ws] close", event)
        clients.delete(peer)
    },
    error(peer, error) {
        console.log("[ws] error", error)
        clients.delete(peer)
    }
})

export function broadcastToAll(message: any) {
    const data = JSON.stringify(message)
    for (const client of clients) {
        try {
            client.send(data)
        } catch (err) {
            console.error('Erreur lors de l\'envoi du message:', err)
        }
    }
}
