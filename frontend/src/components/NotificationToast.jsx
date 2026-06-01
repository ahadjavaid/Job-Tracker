import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const NotificationToast = () => {
    const [notifications, setNotifications] = useState([]);
    const username = localStorage.getItem("username");

    useEffect(() => {
        // Only connect if the user is logged in
        if (!username) return;

        const client = new Client({
            // We use SockJS fallback because typical STOMP JS expects a native WebSocket URL (ws://)
            // Using webSocketFactory allows us to use http:// url with SockJS
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSockets!");
            // Subscribe to the user's specific notification topic
            client.subscribe(`/topic/notifications/${username}`, (message) => {
                const newNotification = {
                    id: Date.now(),
                    text: message.body,
                };
                
                // Add to state so it renders
                setNotifications((prev) => [...prev, newNotification]);

                // Auto-remove notification after 5 seconds
                setTimeout(() => {
                    setNotifications((prev) => 
                        prev.filter((n) => n.id !== newNotification.id)
                    );
                }, 5000);
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        // Start connection
        client.activate();

        // Cleanup on unmount
        return () => {
            client.deactivate();
        };
    }, [username]);

    // If there are no notifications, render nothing
    if (notifications.length === 0) return null;

    return (
        <div style={styles.container}>
            {notifications.map((n) => (
                <div key={n.id} style={styles.toast}>
                    <span style={styles.icon}>🔔</span>
                    <span style={styles.text}>{n.text}</span>
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    toast: {
        backgroundColor: "#22c55e",
        color: "white",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(34,197,94,0.3)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        animation: "slideIn 0.3s ease-out",
        fontWeight: "600",
        fontSize: "15px",
    },
    icon: {
        fontSize: "20px",
    },
    text: {
        lineHeight: "1.4",
    }
};

export default NotificationToast;
