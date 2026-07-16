import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createSession,
  startChatSocket,
  sendMessageOverSocket,
  closeChatSocket,
  fetchSessions,
  loadSessionMessages,
  deleteSession,
} from '../../services/chatService';

const getToken = (thunkAPI) => {
  const state = thunkAPI.getState();
  return state.auth.token; // or wherever your token lives
};

export const initChat = createAsyncThunk(
  'chat/initChat',
  async ({ bot_type = 'general', title = 'New Chat', activeChild = null }, thunkAPI) => {
    const token = getToken(thunkAPI);
    const session = await createSession({ bot_type, title, active_child: activeChild });
    await startChatSocket(session.id, token);
    return session;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ content }, thunkAPI) => {
    const state = thunkAPI.getState();
    let session = state.chat.currentSession;
    if (!session) {
      session = await thunkAPI.dispatch(initChat({})).unwrap();
    }
    const assistantMessage = await sendMessageOverSocket(content);
    return {
      userMessage: { role: 'user', content, created_at: new Date().toISOString() },
      assistantMessage,
    };
  }
);

export const loadHistory = createAsyncThunk(
  'chat/loadHistory',
  async (_, thunkAPI) => {
    const sessions = await fetchSessions();
    return sessions;
  }
);

export const openSession = createAsyncThunk(
  'chat/openSession',
  async (sessionId, thunkAPI) => {
    const messages = await loadSessionMessages(sessionId);
    const session = thunkAPI.getState().chat.sessions.find(s => s.id === sessionId);
    return { session, messages };
  }
);

export const removeSession = createAsyncThunk(
  'chat/removeSession',
  async (sessionId, thunkAPI) => {
    await deleteSession(sessionId);
    return sessionId;
  }
);

export const disconnectChat = createAsyncThunk('chat/disconnect', async () => {
  closeChatSocket();
});