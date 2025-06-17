import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'https://petfinderapp.duckdns.org/ws';
let stompClient = null;

export const connectWebSocket = (roomId, onMessageReceived) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(BASE_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('WebSocket 연결 성공');
      stompClient.subscribe(`/topic/chatrooms/${roomId}`, (message) => {
        try {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        } catch (e) {
          console.error("메시지 파싱 실패:", message.body);
        }
      });
    },
    onStompError: (frame) => {
      console.error('STOMP 오류', frame);
    },
  });

  stompClient.activate();
};

export const sendMessage = (roomId, senderId, text, post = null) => {
  if (!stompClient || !stompClient.connected) return;

  const payload = {
    senderId,
    message: text,
    post,
  };

  stompClient.publish({
    destination: `/app/chatrooms/${roomId}`,
    body: JSON.stringify(payload),
    headers: { 'content-type': 'application/json' },
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) stompClient.deactivate();
};
