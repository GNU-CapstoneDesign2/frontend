import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchMessages = async (roomId, page = 0, size = 20) => {
  const token = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(
      `https://petfinderapp.duckdns.org/chatrooms/${roomId}/messages`,
      {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data.content;
  } catch (error) {
    console.error('메시지 조회 실패:', error);
    return [];
  }
};
